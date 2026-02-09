declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    /** 公钥 - 对应后端 PublicKeyDto */
    interface PublicKey {
      /** 公钥字符串 */
      publicKey: string;
      /** 公钥过期时间点 */
      expiresAt: number;
    }

    /** 登录响应 - 对应后端 LoginResponseDto */
    interface LoginToken {
      /** 访问令牌 */
      accessToken: string;
      /** 刷新令牌 */
      refreshToken: string;
      /** 令牌类型 */
      tokenType: string;
      /** 访问令牌过期时间（秒） */
      expiresIn: number;
      /** 访问令牌过期时间点 */
      accessTokenExpiration: string;
      /** 刷新令牌过期时间点 */
      refreshTokenExpiration: string;
      /** 语言标识 */
      language?: string;
    }

    /** 用户信息 - 对应后端 UserInfoDto */
    interface UserInfo {
      /** 用户ID */
      id: string;
      /** 用户名 */
      userName: string;
      /** 邮箱 */
      email?: string;
      /** 电话号码 */
      phoneNumber?: string;
      /** 用户角色列表 */
      roles: string[];
      /** 按钮权限列表 */
      buttons: string[];
    }
  }
}
