import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('accessToken') || '';
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('accessToken');
  localStg.remove('refreshToken');
}
