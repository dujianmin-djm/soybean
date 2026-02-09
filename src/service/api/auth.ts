import { request } from '../request';

/**
 * 获取 RSA 公钥
 */
export function fetchPublicKey() {
  return request<Api.Auth.PublicKey>({
    url: '/papi/auth/public-key',
    method: 'get'
  });
}

/**
 * Login
 *
 * @param userName User name or email
 * @param password Password
 * @param isEncrypted Whether the password is encrypted
 */
export function fetchLogin(userNameOrEmail: string, password: string, isEncrypted = true) {
  return request<Api.Auth.LoginToken>({
    url: '/papi/auth/login',
    method: 'post',
    data: {
      userNameOrEmail,
      password,
      isEncrypted
      // clientId: 'Pms_Spa'
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/papi/auth/user-info' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/papi/auth/refresh-token',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * Logout
 */
export function fetchLogout() {
  return request({
    url: '/papi/auth/logout',
    method: 'post'
  });
}

/**
 * Revoke token
 *
 * @param accessToken Access token
 */
export function fetchRevokeToken(accessToken: string) {
  return request({
    url: '/papi/auth/revoke-token',
    method: 'post',
    data: {
      accessToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/papi/auth/error', params: { code, msg } });
}
