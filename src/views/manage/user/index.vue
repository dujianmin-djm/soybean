<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/common';
import { fetchDeleteUser, fetchGetUserList, fetchResetUserPassword } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserOperateModal from './modules/user-operate-modal.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();

const searchParams: Api.SystemManage.UserSearchParams = reactive({
  current: 1,
  size: 20,
  userName: null,
  gender: null,
  phoneNumber: null,
  email: null,
  isActive: null
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetUserList(searchParams),
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
      key: 'userName',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100,
      fixed: 'left'
    },
    {
      key: 'gender',
      title: $t('page.manage.user.userGender'),
      align: 'center',
      width: 60,
      render: row => {
        if (row.gender === null) {
          return null;
        }

        const tagMap: Record<Api.Common.Gender, NaiveUI.ThemeColor> = {
          0: 'default',
          1: 'primary',
          2: 'error'
        };

        const label = $t(userGenderRecord[row.gender]);

        return <NTag type={tagMap[row.gender]}>{label}</NTag>;
      }
    },
    {
      key: 'description',
      title: $t('page.manage.user.description'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'phoneNumber',
      title: $t('page.manage.user.userPhone'),
      align: 'center',
      width: 120
    },
    {
      key: 'email',
      title: $t('page.manage.user.userEmail'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'isActive',
      title: $t('page.manage.user.userStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.isActive === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          0: 'warning'
        };

        const label = $t(enableStatusRecord[row.isActive ? 1 : 0]);

        return <NTag type={tagMap[row.isActive ? 1 : 0]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="info" ghost size="small" onClick={() => handleViewDetail(row.id)}>
            {$t('common.detail')}
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
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

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  const ids = checkedRowKeys.value;
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmDelete', { count: ids.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      const results = await Promise.all(ids.map(id => fetchDeleteUser(id)));
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
  const { error } = await fetchDeleteUser(id);
  if (!error) {
    onDeleted();
  }
}

function edit(id: string) {
  handleEdit(id);
}

async function handleResetPassword() {
  const ids = checkedRowKeys.value;
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmResetPassword', { count: ids.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      const results = await Promise.all(ids.map(id => fetchResetUserPassword(id)));
      const hasError = results.some(result => result.error);
      if (!hasError) {
        window.$message?.success($t('common.resetPasswordSuccess'));
      } else {
        window.$message?.warning(
          $t('common.partialFailure', {
            details: results
              .filter(result => result.error)
              .map(result => result.error?.message)
              .join(', ')
          })
        );
      }
    }
  });
}

function handleViewDetail(id: string) {
  routerPushByKey('manage_user-detail', { params: { id } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        >
          <template #suffix>
            <NButton
              size="small"
              ghost
              type="warning"
              :disabled="checkedRowKeys.length === 0"
              @click="handleResetPassword"
            >
              <template #icon>
                <icon-mdi-lock-reset class="text-icon" />
              </template>
              {{ $t('common.resetPassword') }}
            </NButton>
          </template>
        </TableHeaderOperation>
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
      <UserOperateModal
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
