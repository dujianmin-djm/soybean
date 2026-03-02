import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { fetchGetUserInfo, fetchLogin, fetchPublicKey } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { encryptWithRSA, getCachedPublicKey, setPublicKey } from '@/utils/crypto';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive({
    id: '',
    userName: '',
    email: '',
    phoneNumber: '',
    roles: [],
    permissions: [],
    buttons: []
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    recordUserId();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.id) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.id);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.id) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.id) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * 获取公钥
   */
  async function getPublicKey(): Promise<string> {
    // 检查缓存
    const cached = getCachedPublicKey();
    if (cached) {
      return cached;
    }

    // 请求新公钥
    const { data, error } = await fetchPublicKey();
    if (error || !data) {
      throw new Error('获取公钥失败');
    }

    // 缓存公钥
    setPublicKey(data.publicKey, data.expiresAt);
    return data.publicKey;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userNameOrEmail: string, password: string, redirect = true) {
    startLoading();

    try {
      // 1. 获取公钥
      const publicKey = await getPublicKey();

      // 2. 加密密码
      const encryptedPassword = encryptWithRSA(publicKey, password);

      // 3. 发送登录请求
      const { data: loginToken, error } = await fetchLogin(userNameOrEmail, encryptedPassword, true);

      if (!error) {
        const pass = await loginByToken(loginToken);

        if (pass) {
          // Check if the tab needs to be cleared
          const isClear = checkTabClear();
          let needRedirect = redirect;

          if (isClear) {
            // If the tab needs to be cleared,it means we don't need to redirect.
            needRedirect = false;
          }
          await redirectFromLogin(needRedirect);

          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
            duration: 4500
          });
        }
      } else {
        resetStore();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('登录失败:', err);
      window.$message?.error('登录失败，请重试');
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('accessToken', loginToken.accessToken);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. getUserInfo
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.accessToken;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, info);
      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  /** 权限集合（高效查找） */
  const permissionSet = computed(() => new Set(userInfo.permissions));

  /** 判断是否拥有某个权限 */
  function hasPermission(permission: string): boolean {
    return permissionSet.value.has(permission);
  }

  /** 判断是否拥有任一权限 */
  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => permissionSet.value.has(p));
  }

  /** 判断路由是否有权访问（兼容 roles + permissions） */
  function hasRoutePermission(meta: { roles?: string[]; permissions?: string[] }): boolean {
    const routeRoles = meta.roles || [];
    const routePermissions = meta.permissions || [];

    // 既没设 roles 也没设 permissions → 默认可访问
    if (!routeRoles.length && !routePermissions.length) return true;

    // 检查角色
    if (routeRoles.length) {
      const hasRole = userInfo.roles.some(role => routeRoles.includes(role));
      if (hasRole) return true;
    }

    // 检查权限
    if (routePermissions.length) {
      const hasPerm = routePermissions.some(p => permissionSet.value.has(p));
      if (hasPerm) return true;
    }

    return false;
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,
    hasPermission,
    hasAnyPermission,
    hasRoutePermission
  };
});
