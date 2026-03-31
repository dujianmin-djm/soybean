declare namespace Api {
  namespace BaseData {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size' | 'sorts'>;

    // ========== 部门 ==========

    type Department = Common.CommonRecord<{
      name: string;
      number: string;
      description: string;
      parentId: string | null;
      parentName: string | null;
      fullName: string | null;
    }>;

    type DepartmentSearchParams = CommonType.RecordNullable<Pick<Department, 'name' | 'number'> & CommonSearchParams>;
    type DepartmentList = Common.PaginatingQueryRecord<Department>;
    type DepartmentCreate = Pick<
      Department,
      'name' | 'number' | 'description' | 'parentId' | 'parentName' | 'fullName'
    >;
    type DepartmentUpdate = Pick<
      Department,
      'name' | 'number' | 'description' | 'parentId' | 'parentName' | 'fullName' | 'concurrencyStamp'
    >;
    type DepartmentLookup = Pick<Department, 'id' | 'name' | 'number' | 'parentName' | 'fullName'>;

    // ========== 岗位 ==========

    type Position = Common.CommonRecord<{
      name: string;
      number: string;
      description: string;
      departmentId: string | null;
      departmentName: string | null;
      departmentFullName: string | null;
      isLeader: boolean;
    }>;

    type PositionSearchParams = CommonType.RecordNullable<Pick<Position, 'name' | 'number'> & CommonSearchParams>;
    type PositionList = Common.PaginatingQueryRecord<Position>;
    type PositionDetail = Pick<
      Position,
      'name' | 'number' | 'description' | 'departmentId' | 'departmentName' | 'departmentFullName' | 'isLeader'
    >;
    type PositionCreate = Pick<Position, 'name' | 'number' | 'description' | 'departmentId' | 'isLeader'>;
    type PositionUpdate = PositionCreate & Pick<Position, 'concurrencyStamp'>;
    type PositionLookup = Pick<
      Position,
      'id' | 'name' | 'number' | 'description' | 'departmentId' | 'departmentName' | 'departmentFullName' | 'isLeader'
    >;

    // ========== 员工 ==========

    type Employee = Common.CommonRecord<{
      name: string;
      number: string;
      description: string;
      hireDate: string | null;
      gender: Common.Gender | null;
      phone: string | null;
      email: string | null;
      address: string | null;
      positions: EmployeePosition[] | null;
      primaryDepartmentName?: string | null;
      primaryPositionName?: string | null;
    }>;

    type EmployeePosition = {
      id?: string;
      departmentId: string;
      departmentName?: string | null;
      positionId: string;
      positionName?: string | null;
      startDate: string;
      isPrimary: boolean;
    };
    type EmployeePositionEdit = Pick<
      EmployeePosition,
      'id' | 'departmentId' | 'positionId' | 'startDate' | 'isPrimary'
    >;

    type EmployeeSearchParams = CommonType.RecordNullable<
      Pick<Employee, 'name' | 'number' | 'gender' | 'phone'> & CommonSearchParams
    >;

    type EmployeeList = Common.PaginatingQueryRecord<Employee>;
    type EmployeeCreate = Pick<
      Employee,
      'name' | 'gender' | 'number' | 'description' | 'hireDate' | 'phone' | 'email' | 'address' | 'positions'
    >;
    type EmployeeUpdate = EmployeeCreate & Pick<Employee, 'concurrencyStamp'>;
  }
}
