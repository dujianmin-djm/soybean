<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DataTableColumn } from 'naive-ui';
import { fetchLookupPosition } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'PositionSelectModal'
});

interface Props {
  departmentId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  departmentId: ''
});

interface Emits {
  (e: 'select', position: { id: string; name: string; departmentId?: string; departmentName?: string }): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const allData = ref<Api.BaseData.PositionLookup[]>([]);
const checkedRowKeys = ref<string[]>([]);
const filterText = ref('');

const columns: DataTableColumn<Api.BaseData.Position>[] = [
  {
    type: 'selection',
    multiple: false,
    align: 'center',
    width: 48
  },
  {
    key: 'number',
    title: () => $t('page.basedata.position.number'),
    align: 'center',
    width: 100
  },
  {
    key: 'name',
    title: () => $t('page.basedata.position.name'),
    align: 'center',
    width: 150
  },
  {
    key: 'departmentName',
    title: () => $t('page.basedata.position.departmentName'),
    align: 'center',
    minWidth: 150
  },
  {
    key: 'isLeader',
    title: () => $t('page.basedata.position.isLeader'),
    align: 'center',
    width: 120,
    render: row => $t(row.isLeader ? 'common.yesOrNo.yes' : 'common.yesOrNo.no')
  }
];

const filteredData = computed(() => {
  let list = allData.value;

  if (filterText.value) {
    const keyword = filterText.value.toLowerCase();
    list = list.filter(
      item => item.number?.toLowerCase().includes(keyword) || item.name?.toLowerCase().includes(keyword)
    );
  }

  return list;
});

async function fetchData() {
  loading.value = true;
  const { error, data } = await fetchLookupPosition(props.departmentId);
  if (!error) {
    allData.value = data;
  }
  loading.value = false;
}

function emitSelect(row: Api.BaseData.PositionLookup) {
  emit('select', {
    id: row.id,
    name: row.name,
    departmentId: row.departmentId ?? '',
    departmentName: row.departmentName ?? ''
  });
  visible.value = false;
}

function getRowProps(row: Api.BaseData.PositionLookup) {
  return {
    style: 'cursor: pointer;',
    onclick: () => {
      if (!checkedRowKeys.value.includes(row.id)) {
        checkedRowKeys.value = [row.id];
      }
    },
    ondblclick: () => {
      emitSelect(row);
      visible.value = false;
    }
  };
}

function handleConfirm() {
  const selectedId = checkedRowKeys.value[0];
  if (!selectedId) {
    window.$message?.warning($t('common.selectRequired'));
    return;
  }
  const selectedRow = allData.value.find(item => item.id === selectedId);
  if (selectedRow) {
    emitSelect(selectedRow);
    visible.value = false;
  }
}

function handleCancel() {
  visible.value = false;
}

watch(visible, val => {
  if (val) {
    filterText.value = '';
    checkedRowKeys.value = [];
    fetchData();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="$t('page.basedata.position.title')"
    preset="card"
    class="w-700px"
    :mask-closable="false"
  >
    <div class="mb-12px flex items-center gap-8px">
      <NInput v-model:value="filterText" clearable :placeholder="$t('common.keywordSearch')" class="flex-1">
        <template #prefix>
          <SvgIcon icon="ic:round-search" class="text-icon" />
        </template>
      </NInput>
    </div>

    <NDataTable
      v-model:checked-row-keys="checkedRowKeys"
      size="small"
      :columns="columns"
      :data="filteredData"
      :loading="loading"
      :row-key="row => row.id"
      :row-props="getRowProps"
      :min-height="200"
      :max-height="400"
      :scroll-x="520"
    />

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="handleCancel">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" @click="handleConfirm">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
