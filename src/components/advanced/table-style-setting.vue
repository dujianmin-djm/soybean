<script setup lang="ts">
import { useTableStyleStore } from '@/store/modules/table-style';
import { $t } from '@/locales';

defineOptions({ name: 'TableStyleSetting' });

const tableStyleStore = useTableStyleStore();
</script>

<template>
  <NPopover trigger="click" placement="bottom-end">
    <template #trigger>
      <NButton size="small">
        <template #icon>
          <icon-ant-design-setting-outlined class="text-icon" />
        </template>
      </NButton>
    </template>

    <div class="w-180px">
      <div class="mb-8px flex items-center justify-between">
        <span class="font-bold">{{ $t('common.tableStyle.title') }}</span>
        <NButton size="tiny" quaternary type="primary" @click="tableStyleStore.reset">
          {{ $t('common.reset') }}
        </NButton>
      </div>

      <div class="flex-col-stretch gap-8px">
        <div class="flex items-center justify-between">
          <span>{{ $t('common.tableStyle.striped') }}</span>
          <NSwitch v-model:value="tableStyleStore.striped" size="small" />
        </div>

        <div class="flex items-center justify-between">
          <span>{{ $t('common.tableStyle.bordered') }}</span>
          <NSwitch v-model:value="tableStyleStore.bordered" size="small" />
        </div>

        <div class="flex items-center justify-between">
          <span>{{ $t('common.tableStyle.singleLine') }}</span>
          <NSwitch v-model:value="tableStyleStore.singleLine" size="small" />
        </div>

        <div class="flex items-center justify-between">
          <span>{{ $t('common.tableStyle.singleColumn') }}</span>
          <NSwitch v-model:value="tableStyleStore.singleColumn" size="small" />
        </div>

        <div class="flex items-center justify-between">
          <span>{{ $t('common.tableStyle.bottomBordered') }}</span>
          <NSwitch v-model:value="tableStyleStore.bottomBordered" size="small" />
        </div>
      </div>
    </div>
  </NPopover>
</template>
