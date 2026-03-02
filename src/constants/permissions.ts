/** 权限常量
 *  与Abp后端 PmsPermissions 对应
 */
export const PERMISSIONS = {
  BaseData: {
    Departments: {
      Default: 'Pms.BaseData.Departments',
      Create: 'Pms.BaseData.Departments.Create',
      Update: 'Pms.BaseData.Departments.Update',
      Delete: 'Pms.BaseData.Departments.Delete',
      Submit: 'Pms.BaseData.Departments.Submit',
      Cancel: 'Pms.BaseData.Departments.Cancel',
      Audit: 'Pms.BaseData.Departments.Audit',
      UnAudit: 'Pms.BaseData.Departments.UnAudit'
    },
    Employees: {
      Default: 'Pms.BaseData.Employees',
      Create: 'Pms.BaseData.Employees.Create',
      Update: 'Pms.BaseData.Employees.Update',
      Delete: 'Pms.BaseData.Employees.Delete',
      Submit: 'Pms.BaseData.Employees.Submit',
      Cancel: 'Pms.BaseData.Employees.Cancel',
      Audit: 'Pms.BaseData.Employees.Audit',
      UnAudit: 'Pms.BaseData.Employees.UnAudit'
    },
    Positions: {
      Default: 'Pms.BaseData.Positions',
      Create: 'Pms.BaseData.Positions.Create',
      Update: 'Pms.BaseData.Positions.Update',
      Delete: 'Pms.BaseData.Positions.Delete',
      Submit: 'Pms.BaseData.Positions.Submit',
      Cancel: 'Pms.BaseData.Positions.Cancel',
      Audit: 'Pms.BaseData.Positions.Audit',
      UnAudit: 'Pms.BaseData.Positions.UnAudit'
    }
  },
  SystemManage: {
    Users: {
      Default: 'Pms.System.Users',
      Create: 'Pms.System.Users.Create',
      Update: 'Pms.System.Users.Update',
      Delete: 'Pms.System.Users.Delete',
      ManageRoles: 'Pms.System.Users.ManageRoles',
      ResetPassword: 'Pms.System.Users.ResetPassword'
    },
    Roles: {
      Default: 'Pms.System.Roles',
      Create: 'Pms.System.Roles.Create',
      Update: 'Pms.System.Roles.Update',
      Delete: 'Pms.System.Roles.Delete',
      ManagePermissions: 'Pms.System.Roles.ManagePermissions'
    },
    ApiKeys: {
      Default: 'Pms.System.ApiKeys',
      Create: 'Pms.System.ApiKeys.Create',
      Update: 'Pms.System.ApiKeys.Update',
      Delete: 'Pms.System.ApiKeys.Delete'
    }
  },
  Business: {}
} as const;
