import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('accessToken');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

export function getCulture() {
  const culture = localStg.get('lang') || 'zh-Hans';
  return culture;
}

/** refresh token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = localStg.get('refreshToken') || '';
  const { error, data } = await fetchRefreshToken(rToken);
  if (!error) {
    localStg.set('accessToken', data.accessToken);
    localStg.set('refreshToken', data.refreshToken);
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken();
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      // 设置持续时间为 0，表示不自动消失
      duration: 0,
      // 添加关闭按钮，让用户手动关闭
      closable: true,
      onClose: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
      },
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        // setTimeout(() => {
        //   state.errMsgStack = [];
        // }, 5000);
      }
    });
  }
}
