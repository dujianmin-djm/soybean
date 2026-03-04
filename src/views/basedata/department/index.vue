<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { PERMISSIONS } from '@/constants/permissions';
import { fetchDeleteDepartment, fetchGetDepartmentList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { usePermission } from '@/hooks/common/permission';
import { $t } from '@/locales';
import DepartmentSearch from './modules/department-search.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();
const { permissions } = usePermission(PERMISSIONS.BaseData.Departments);

const searchParams: Api.BaseData.DepartmentSearchParams = reactive({
  current: 1,
  size: 20,
  number: null,
  name: null
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetDepartmentList(searchParams),
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
      title: $t('page.basedata.department.number'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'name',
      title: $t('page.basedata.department.name'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'description',
      title: $t('page.basedata.department.description'),
      align: 'center',
      width: 100
    },
    {
      key: 'parentName',
      title: $t('page.basedata.department.parentName'),
      align: 'center',
      width: 120
    },
    {
      key: 'fullName',
      title: $t('page.basedata.department.fullName'),
      align: 'center',
      width: 200,
      resizable: true
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
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

async function handleBatchDelete() {
  const ids = checkedRowKeys.value;
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmDelete', { count: ids.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    maskClosable: true,
    onPositiveClick: async () => {
      const results = await Promise.all(ids.map(id => fetchDeleteDepartment(id)));
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
  const { error } = await fetchDeleteDepartment(id);
  if (!error) {
    onDeleted();
  }
}

function handleAdd() {
  routerPushByKey('basedata_department-detail', { params: { id: 'add' } });
}

function handleEdit(id: string) {
  routerPushByKey('basedata_department-detail', { params: { id } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DepartmentSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.basedata.department.title')"
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
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
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
