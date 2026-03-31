<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { genderRecord } from '@/constants/common';
import { PERMISSIONS } from '@/constants/permissions';
import { fetchDeleteEmployee, fetchGetEmployeeList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useTableStyle } from '@/hooks/common/table-style';
import { usePermission } from '@/hooks/common/permission';
import { $t } from '@/locales';
import EmployeeSearch from './modules/employee-search.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();
const { permissions } = usePermission(PERMISSIONS.BaseData.Employees);

const searchParams: Api.BaseData.EmployeeSearchParams = reactive({
  current: 1,
  size: 20,
  number: null,
  name: null
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetEmployeeList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => index + 1
    },
    {
      key: 'number',
      title: $t('page.basedata.employee.number'),
      align: 'center',
      width: 80
    },
    {
      key: 'name',
      title: $t('page.basedata.employee.name'),
      align: 'center',
      width: 100
    },
    {
      key: 'gender',
      title: $t('page.basedata.employee.gender'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.gender === null) {
          return null;
        }
        const tagMap: Record<Api.Common.Gender, NaiveUI.ThemeColor> = {
          0: 'default',
          1: 'primary',
          2: 'error'
        };
        const label = $t(genderRecord[row.gender]);
        return <NTag type={tagMap[row.gender]}>{label}</NTag>;
      }
    },
    {
      key: 'description',
      title: $t('page.basedata.employee.description'),
      align: 'center',
      width: 100,
      visible: false
    },
    {
      key: 'hireDate',
      title: $t('page.basedata.employee.hireDate'),
      align: 'center',
      width: 100,
      render: row => (row.hireDate ? new Date(row.hireDate).toLocaleDateString() : null)
    },
    {
      key: 'phone',
      title: $t('page.basedata.employee.phone'),
      align: 'center',
      width: 100
    },
    {
      key: 'email',
      title: $t('page.basedata.employee.email'),
      align: 'center',
      width: 100,
      visible: false
    },
    {
      key: 'address',
      title: $t('page.basedata.employee.address'),
      align: 'center',
      width: 100,
      visible: false
    },
    {
      key: 'primaryPositionName',
      title: $t('page.basedata.employee.primaryPositionName'),
      align: 'center',
      width: 100,
      visible: true
    },
    {
      key: 'primaryDepartmentName',
      title: $t('page.basedata.employee.primaryDepartmentName'),
      align: 'center',
      width: 100,
      visible: true
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, 'id', getData);

const { tableStyleProps } = useTableStyle();

async function handleBatchDelete() {
  if (!permissions.value.Delete) {
    window.$message?.error($t('common.noPermission'));
    return;
  }
  const ids = checkedRowKeys.value;
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmDelete', { count: ids.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    maskClosable: true,
    onPositiveClick: async () => {
      const results = await Promise.all(ids.map(id => fetchDeleteEmployee(id)));
      const hasError = results.some(result => result.error);
      if (!hasError) {
        window.$message?.success($t('common.deleteSuccess'));
      } else {
        window.$message?.warning($t('common.partialDeleteWarning'));
      }
      onBatchDeleted();
    }
  });
}

async function handleDelete(id: string) {
  if (!permissions.value.Delete) {
    window.$message?.error($t('common.noPermission'));
    return;
  }
  const { error } = await fetchDeleteEmployee(id);
  if (!error) {
    onDeleted();
  }
}

function handleAdd() {
  if (!permissions.value.Create) {
    window.$message?.error($t('common.noPermission'));
    return;
  }
  routerPushByKey('basedata_employee-detail', { params: { id: 'add' } });
}

function handleEdit(id: string) {
  if (!permissions.value.Update) {
    window.$message?.error($t('common.noPermission'));
    return;
  }
  routerPushByKey('basedata_employee-detail', { params: { id } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <EmployeeSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.basedata.employee.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>

      <NDataTable
        v-bind="tableStyleProps"
        v-model:checked-row-keys="checkedRowKeys"
        size="small"
        :columns="columns"
        :data="data"
        :flex-height="!appStore.isMobile"
        :scroll-x="1062"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
