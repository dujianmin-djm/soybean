import { request } from '../request';

// ========== 部门 ==========

export function fetchGetDepartmentList(params?: Api.BaseData.DepartmentSearchParams) {
  return request<Api.BaseData.DepartmentList>({
    url: '/papi/department/query',
    method: 'get',
    params
  });
}

export function fetchLookupDepartment() {
  return request<Api.BaseData.DepartmentLookup[]>({
    url: '/papi/department/lookup',
    method: 'get'
  });
}

export function fetchGetDepartment(id: string) {
  return request<Api.BaseData.Department>({
    url: `/papi/department/${id}`,
    method: 'get'
  });
}

export function fetchCreateDepartment(data: Api.BaseData.DepartmentCreate) {
  return request<Api.BaseData.Department>({
    url: '/papi/department/add',
    method: 'post',
    data
  });
}

export function fetchUpdateDepartment(id: string, data: Api.BaseData.DepartmentUpdate) {
  return request<Api.BaseData.Department>({
    url: `/papi/department/edit/${id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteDepartment(id: string) {
  return request({
    url: `/papi/department/delete/${id}`,
    method: 'delete'
  });
}

export function fetchSubmitDepartment(id: string) {
  return request({
    url: `/papi/department/submit/${id}`,
    method: 'post'
  });
}

export function fetchCancelDepartment(id: string) {
  return request({
    url: `/papi/department/cancel/${id}`,
    method: 'post'
  });
}

export function fetchAuditDepartment(id: string) {
  return request({
    url: `/papi/department/audit/${id}`,
    method: 'post'
  });
}

export function fetchUnauditDepartment(id: string) {
  return request({
    url: `/papi/department/unaudit/${id}`,
    method: 'post'
  });
}

// ========== 岗位 ==========

export function fetchGetPositionList(params?: Api.BaseData.PositionSearchParams) {
  return request<Api.BaseData.PositionList>({
    url: '/papi/position/query',
    method: 'get',
    params
  });
}

export function fetchLookupPosition(departmentId?: string) {
  return request<Api.BaseData.PositionLookup[]>({
    url: '/papi/position/lookup',
    method: 'get',
    params: { departmentId }
  });
}

export function fetchGetPosition(id: string) {
  return request<Api.BaseData.Position>({
    url: `/papi/position/${id}`,
    method: 'get'
  });
}

export function fetchCreatePosition(data: Api.BaseData.PositionCreate) {
  return request<Api.BaseData.Position>({
    url: '/papi/position/add',
    method: 'post',
    data
  });
}

export function fetchUpdatePosition(id: string, data: Api.BaseData.PositionUpdate) {
  return request<Api.BaseData.Position>({
    url: `/papi/position/edit/${id}`,
    method: 'put',
    data
  });
}

export function fetchDeletePosition(id: string) {
  return request({
    url: `/papi/position/delete/${id}`,
    method: 'delete'
  });
}

// ========== 员工 ==========

export function fetchGetEmployeeList(params?: Api.BaseData.EmployeeSearchParams) {
  return request<Api.BaseData.EmployeeList>({
    url: '/papi/employee/query',
    method: 'get',
    params
  });
}

export function fetchGetEmployee(id: string) {
  return request<Api.BaseData.Employee>({
    url: `/papi/employee/${id}`,
    method: 'get'
  });
}

export function fetchCreateEmployee(data: Api.BaseData.EmployeeCreate) {
  return request<Api.BaseData.Employee>({
    url: '/papi/employee/add',
    method: 'post',
    data
  });
}

export function fetchUpdateEmployee(id: string, data: Api.BaseData.EmployeeUpdate) {
  return request<Api.BaseData.Employee>({
    url: `/papi/employee/edit/${id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteEmployee(id: string) {
  return request({
    url: `/papi/employee/delete/${id}`,
    method: 'delete'
  });
}
