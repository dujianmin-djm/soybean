import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/papi/role/query',
    method: 'get',
    params
  });
}

/**
 * get all roles, these roles are all enabled
 */
export function fetchGetEnabledRoles() {
  return request<Api.SystemManage.AllEnabledRole[]>({
    url: '/papi/role/assignable-roles',
    method: 'get'
  });
}

/** get role detail */
export function fetchGetRole(id: string) {
  return request<Api.SystemManage.Role>({
    url: `/papi/role/${id}`,
    method: 'get'
  });
}

/** create role */
export function fetchCreateRole(data: Api.SystemManage.RoleCreate) {
  return request<Api.SystemManage.Role>({
    url: '/papi/role/add',
    method: 'post',
    data
  });
}

/** update role */
export function fetchUpdateRole(id: string, data: Api.SystemManage.RoleUpdate) {
  return request<Api.SystemManage.Role>({
    url: `/papi/role/edit/${id}`,
    method: 'put',
    data
  });
}

/** delete role */
export function fetchDeleteRole(id: string) {
  return request({
    url: `/papi/role/delete/${id}`,
    method: 'delete'
  });
}

/** delete roles */
export function fetchDeleteRoles(ids: string[]) {
  return request({
    url: '/papi/role/batch-delete',
    method: 'delete',
    params: {
      ids
    }
  });
}

/** get permissions for a provider (Multilanguage ) */
export function fetchGetPermissions(providerName: string, providerKey: string, culture: string) {
  return request<Api.SystemManage.PermissionListResult>({
    url: '/api/permission-management/permissions',
    method: 'get',
    params: { providerName, providerKey, culture }
  });
}

/** update permissions for a provider */
export function fetchUpdatePermissions(
  providerName: string,
  providerKey: string,
  data: Api.SystemManage.UpdatePermissions
) {
  return request({
    url: '/api/permission-management/permissions',
    method: 'put',
    params: { providerName, providerKey },
    data
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/papi/user/query',
    method: 'get',
    params
  });
}

/** get user detail */
export function fetchGetUser(id: string) {
  return request<Api.SystemManage.User>({
    url: `/papi/user/${id}`,
    method: 'get'
  });
}

/** create user */
export function fetchCreateUser(data: Api.SystemManage.UserCreate) {
  return request<Api.SystemManage.User>({
    url: '/papi/user/add',
    method: 'post',
    data
  });
}

/** update user */
export function fetchUpdateUser(id: string, data: Api.SystemManage.UserUpdate) {
  return request<Api.SystemManage.User>({
    url: `/papi/user/edit/${id}`,
    method: 'put',
    data
  });
}

/** delete user */
export function fetchDeleteUser(id: string) {
  return request({
    url: `/papi/user/delete/${id}`,
    method: 'delete'
  });
}

/** get user roles */
export function fetchGetUserRoles(id: string) {
  return request<Api.SystemManage.Role[]>({
    url: `/papi/user/${id}/roles`,
    method: 'get'
  });
}

/** update user roles */
export function fetchUpdateUserRoles(id: string, roleNames: string[]) {
  return request({
    url: `/papi/user/${id}/roles`,
    method: 'put',
    data: {
      roleNames
    }
  });
}

/** reset user password */
export function fetchResetUserPassword(id: string) {
  return request({
    url: `/papi/user/reset-password/${id}`,
    method: 'put',
    data: {
      password: import.meta.env.VITE_USER_DEFAULT_PASSWORD
    }
  });
}

/** change current user password */
export function fetchChangePassword(data: { currentPassword: string; newPassword: string }) {
  return request({
    url: '/papi/user/change-password',
    method: 'put',
    data
  });
}
