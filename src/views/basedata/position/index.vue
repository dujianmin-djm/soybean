<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { PERMISSIONS } from '@/constants/permissions';
import { yesOrNoRecord } from '@/constants/common';
import { fetchDeletePosition, fetchGetPositionList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useTableStyle } from '@/hooks/common/table-style';
import { usePermission } from '@/hooks/common/permission';
import { $t } from '@/locales';
import PositionSearch from './modules/position-search.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();
const { permissions } = usePermission(PERMISSIONS.BaseData.Positions);

const searchParams: Api.BaseData.PositionSearchParams = reactive({
  current: 1,
  size: 20,
  number: null,
  name: null
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetPositionList(searchParams),
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
      title: $t('page.basedata.position.number'),
      align: 'center',
      minWidth: 80
    },
    {
      key: 'name',
      title: $t('page.basedata.position.name'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'description',
      title: $t('page.basedata.position.description'),
      align: 'center',
      width: 100
    },
    {
      key: 'isLeader',
      title: $t('page.basedata.position.isLeader'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.isLeader === null) {
          return null;
        }
        const label = $t(yesOrNoRecord[row.isLeader ? 'Y' : 'N']);
        return <NTag type={row.isLeader ? 'success' : 'default'}>{label}</NTag>;
      }
    },
    {
      key: 'departmentName',
      title: $t('page.basedata.position.departmentName'),
      align: 'center',
      width: 120
    },
    {
      key: 'departmentFullName',
      title: $t('page.basedata.position.departmentFullName'),
      align: 'center',
      width: 200
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

const { tableStyleProps } = useTableStyle();

async function handleBatchDelete() {
  const ids = checkedRowKeys.value;
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmDelete', { count: ids.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    maskClosable: true,
    onPositiveClick: async () => {
      const results = await Promise.all(ids.map(id => fetchDeletePosition(id)));
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
  const { error } = await fetchDeletePosition(id);
  if (!error) {
    onDeleted();
  }
}

function handleAdd() {
  routerPushByKey('basedata_position-detail', { params: { id: 'add' } });
}

function handleEdit(id: string) {
  routerPushByKey('basedata_position-detail', { params: { id } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <PositionSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.basedata.position.title')"
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
