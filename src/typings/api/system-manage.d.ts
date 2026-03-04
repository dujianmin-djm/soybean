declare namespace Api {
  /**
   * namespace SystemManage
   *
   * backend api module: "identity"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size' | 'sorts'>;

    /** role */
    type Role = Common.CommonRecord<{
      name: string;
      number: string;
      description: string;
      isActive: boolean;
      isDefault: boolean;
      isPublic: boolean;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'name' | 'number' | 'isActive'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all enabled role */
    type AllEnabledRole = Pick<Role, 'id' | 'name'>;

    /** role create */
    type RoleCreate = Pick<Role, 'name' | 'number' | 'description' | 'isActive' | 'isDefault' | 'isPublic'>;

    /** role update */
    type RoleUpdate = Pick<
      Role,
      'name' | 'number' | 'description' | 'isActive' | 'isDefault' | 'isPublic' | 'concurrencyStamp'
    >;

    // ========== 权限管理 ==========
    /** permission provider info */
    type PermissionProvider = {
      providerName: string;
      providerKey: string;
    };

    /** permission grant info */
    type PermissionGrantInfo = {
      name: string;
      displayName: string;
      parentName: string | null;
      isGranted: boolean;
      allowedProviders: string[];
      grantedProviders: PermissionProvider[];
    };

    /** permission group */
    type PermissionGroup = {
      name: string;
      displayName: string;
      displayNameKey: string;
      displayNameResource: string;
      permissions: PermissionGrantInfo[];
    };

    /** get permissions response */
    type PermissionListResult = {
      entityDisplayName: string;
      groups: PermissionGroup[];
    };

    /** update single permission */
    type UpdatePermissionItem = {
      name: string;
      isGranted: boolean;
    };

    /** update permissions request body */
    type UpdatePermissions = {
      permissions: UpdatePermissionItem[];
    };

    /** user */
    type User = Common.CommonRecord<{
      userName: string;
      gender: Common.Gender | null;
      description: string;
      phoneNumber: string;
      email: string;
      isActive?: boolean;
      lockoutEnabled?: boolean | null;
      roleNames?: string[] | null;
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'gender' | 'phoneNumber' | 'email' | 'isActive'> & CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** user create */
    type UserCreate = Pick<
      User,
      'userName' | 'gender' | 'phoneNumber' | 'email' | 'description' | 'isActive' | 'lockoutEnabled' | 'roleNames'
    > & { password: string };

    /** user update */
    type UserUpdate = Pick<
      User,
      | 'userName'
      | 'gender'
      | 'phoneNumber'
      | 'email'
      | 'description'
      | 'isActive'
      | 'lockoutEnabled'
      | 'roleNames'
      | 'concurrencyStamp'
    > & { password?: string | null };
  }
}
