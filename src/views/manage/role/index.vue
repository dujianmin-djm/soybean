<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord } from '@/constants/common';
import { fetchDeleteRole, fetchDeleteRoles, fetchGetRoleList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import RoleSearch from './modules/role-search.vue';
import RoleOperateModal from './modules/role-operate-modal.vue';
import PermissionAuthModal from './modules/permission-auth-modal.vue';

const appStore = useAppStore();

const searchParams: Api.SystemManage.RoleSearchParams = reactive({
  current: 1,
  size: 20,
  name: null,
  number: null,
  isActive: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetRoleList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
      fixed: 'left'
    },
    {
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center',
      render: (_, index) => index + 1,
      fixed: 'left',
      resizable: true
    },
    {
      key: 'number',
      title: $t('page.manage.role.roleCode'),
      align: 'center',
      minWidth: 80,
      resizable: true
    },
    {
      key: 'name',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 100,
      resizable: true
    },
    {
      key: 'description',
      title: $t('page.manage.role.roleDesc'),
      align: 'center',
      minWidth: 120,
      ellipsis: { tooltip: true },
      resizable: true
    },
    {
      key: 'isActive',
      title: $t('page.manage.role.roleStatus'),
      align: 'center',
      width: 100,
      resizable: true,
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
      width: 240,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NButton type="warning" ghost size="small" onClick={() => handlePermission(row.name)}>
            {$t('page.manage.role.permissionAuth')}
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
  const { error } = await fetchDeleteRoles(checkedRowKeys.value);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    onBatchDeleted();
  }
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteRole(id);
  if (!error) {
    onDeleted();
  }
}

function edit(id: string) {
  handleEdit(id);
}

// async function handleEdit2(id: string) {
//   operateType.value = 'edit';
//   //const findItem = data.value.find(item => item.id === id) || null;
//   //editingData.value = jsonClone(findItem);
//   editingData.value = (await fetchGetRole(id)).data || null;
//   drawerVisible.value = true;
// }

const permissionModalVisible = ref(false);
const permissionRoleName = ref('');

function handlePermission(roleName: string) {
  permissionRoleName.value = roleName;
  permissionModalVisible.value = true;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateModal
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
      <PermissionAuthModal v-model:visible="permissionModalVisible" :role-name="permissionRoleName" />
    </NCard>
  </div>
</template>

<style scoped></style>
