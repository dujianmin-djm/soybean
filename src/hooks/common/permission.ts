import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 页面按钮权限 hook
 * @param permissions 权限对象，如 { PERMISSIONS.BaseData.Departments: 'xxx', PERMISSIONS.BaseData.Departments.Create: 'xxx', ... }
 */
export function usePermission(modulePermissions: Record<string, string>) {
  const authStore = useAuthStore();

  /** 生成每个操作的权限布尔值 */
  const permissions = computed(() => {
    const result: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(modulePermissions)) {
      result[key] = authStore.hasPermission(value);
    }
    return result;
  });

  return {
    /** 原始判断方法 */
    hasPermission: authStore.hasPermission,
    /** 模块级便捷权限对象 */
    permissions
  };
}
