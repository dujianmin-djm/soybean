<script setup lang="ts">
import { type Component, computed, h, nextTick, onMounted, ref, resolveComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type DataTableColumn, NButton, NDatePicker, NInput, NInputGroup, NPopconfirm, NSwitch } from 'naive-ui';
import dayjs from 'dayjs';
import { documentStatusRecord, emailSuffixOptions, genderOptions } from '@/constants/common';
import { PERMISSIONS } from '@/constants/permissions';
import { fetchCreateEmployee, fetchGetEmployee, fetchUpdateEmployee } from '@/service/api';
import { useTabStore } from '@/store/modules/tab';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import { usePermission } from '@/hooks/common/permission';
import { $t } from '@/locales';
import DepartmentSelectModal from '@/views/basedata/department/modules/department-select-modal.vue';
import PositionSelectModal from '@/views/basedata/position/modules/position-select-modal.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const { routerPushByKey } = useRouterPush();
const { permissions } = usePermission(PERMISSIONS.BaseData.Positions);

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule, patternRules } = useFormRules();

// ✅ 解析 SvgIcon 供 h() 渲染函数使用
const SvgIconComp = resolveComponent('SvgIcon') as Component;

const isEdit = computed(() => props.id !== 'add');
const loading = ref(false);
const saving = ref(false);
const activeTab = ref('basic');

const departmentModalVisible = ref(false);
const positionModalVisible = ref(false);
const editingRowIndex = ref(-1);
const positionModalDeptId = ref('');

const rawData = ref<Api.BaseData.Employee | null>(null);

type Model = Api.BaseData.EmployeeCreate;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    number: '',
    name: '',
    description: '',
    hireDate: null,
    gender: 0,
    phone: '',
    email: '',
    address: '',
    positions: []
  };
}

type RuleKey = Extract<keyof Model, 'number' | 'name' | 'phone' | 'email'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => ({
  number: defaultRequiredRule,
  name: defaultRequiredRule,
  phone: patternRules.phone,
  email: patternRules.email
}));

// ============================================================
// 入职日期 - NDatePicker 使用 timestamp，model 存 string
// ============================================================
const hireDateTimestamp = computed<number | null>({
  get: () => (model.value.hireDate ? dayjs(model.value.hireDate).valueOf() : null),
  set: (val: number | null) => {
    model.value.hireDate = val ? dayjs(val).format('YYYY-MM-DD') : null;
  }
});

// ============================================================
// 任岗表体 - 行稳定 key（WeakMap 避免改动类型定义）
// ============================================================
const rowKeyMap = new WeakMap<object, string>();
let rowKeySeq = 0;

function positionRowKey(row: Api.BaseData.EmployeePosition): string {
  if (!rowKeyMap.has(row)) {
    rowKeySeq += 1;
    rowKeyMap.set(row, `pos_${rowKeySeq}`);
  }
  return rowKeyMap.get(row)!;
}

// ============================================================
// 任岗表体 - 增删改
// ============================================================
function addPositionRow() {
  if (!model.value.positions) {
    model.value.positions = [];
  }
  model.value.positions.push({
    departmentId: '',
    departmentName: '',
    positionId: '',
    positionName: '',
    startDate: '',
    isPrimary: model.value.positions.length === 0
  });
}

function removePositionRow(index: number) {
  model.value.positions!.splice(index, 1);
}

function handleSetPrimary(index: number, val: boolean) {
  const list = model.value.positions!;
  if (val) {
    list.forEach((pos, i) => {
      pos.isPrimary = i === index;
    });
  } else {
    list[index].isPrimary = false;
  }
}

function openRowDeptModal(index: number) {
  editingRowIndex.value = index;
  departmentModalVisible.value = true;
}

function openRowPositionModal(index: number) {
  editingRowIndex.value = index;
  positionModalDeptId.value = model.value.positions![index].departmentId;
  positionModalVisible.value = true;
}

function clearRowDept(index: number) {
  const row = model.value.positions![index];
  row.departmentId = '';
  row.departmentName = '';
  row.positionId = '';
  row.positionName = '';
}

function clearRowPosition(index: number) {
  const row = model.value.positions![index];
  row.positionId = '';
  row.positionName = '';
}

function handleDepartmentSelected(dept: { id: string; name: string }) {
  const index = editingRowIndex.value;
  if (index < 0 || !model.value.positions) return;
  const row = model.value.positions[index];
  row.departmentId = dept.id;
  row.departmentName = dept.name;
  row.positionId = '';
  row.positionName = '';
}

function handlePositionSelected(position: {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
}) {
  const index = editingRowIndex.value;
  if (index < 0 || !model.value.positions) return;
  const row = model.value.positions[index];
  row.positionId = position.id;
  row.positionName = position.name;
  row.departmentId = position.departmentId!;
  row.departmentName = position.departmentName;
}

const positionColumns = computed<DataTableColumn<Api.BaseData.EmployeePosition>[]>(() => [
  {
    key: 'index',
    title: $t('common.index'),
    width: 60,
    align: 'center',
    render: (_row, index) => index + 1
  },
  {
    key: 'departmentName',
    title: $t('page.basedata.employee.employeePosition.departmentName'),
    minWidth: 180,
    render: (_row, index) => {
      const row = model.value.positions![index];
      return h(NInputGroup, null, {
        default: () => [
          h(NInput, {
            value: row.departmentName ?? '',
            readonly: true,
            size: 'small',
            placeholder: $t('page.basedata.employee.employeePosition.form.departmentId')
          }),
          h(
            NButton,
            { size: 'small', type: 'primary', ghost: true, onClick: () => openRowDeptModal(index) },
            { icon: () => h(SvgIconComp, { icon: 'ic:round-search' }) }
          ),
          h(
            NButton,
            { size: 'small', type: 'warning', ghost: true, onClick: () => clearRowDept(index) },
            { icon: () => h(SvgIconComp, { icon: 'ic:round-close' }) }
          )
        ]
      });
    }
  },
  {
    key: 'positionName',
    title: $t('page.basedata.employee.employeePosition.positionName'),
    minWidth: 180,
    render: (_row, index) => {
      const row = model.value.positions![index];
      return h(NInputGroup, null, {
        default: () => [
          h(NInput, {
            value: row.positionName ?? '',
            readonly: true,
            size: 'small',
            placeholder: $t('page.basedata.employee.employeePosition.form.positionId')
          }),
          h(
            NButton,
            { size: 'small', type: 'primary', ghost: true, onClick: () => openRowPositionModal(index) },
            { icon: () => h(SvgIconComp, { icon: 'ic:round-search' }) }
          ),
          h(
            NButton,
            { size: 'small', type: 'warning', ghost: true, onClick: () => clearRowPosition(index) },
            { icon: () => h(SvgIconComp, { icon: 'ic:round-close' }) }
          )
        ]
      });
    }
  },
  {
    key: 'startDate',
    title: $t('page.basedata.employee.employeePosition.startDate'),
    width: 180,
    render: (_row, index) => {
      const row = model.value.positions![index];
      return h(NDatePicker, {
        value: row.startDate ? dayjs(row.startDate).valueOf() : null,
        onUpdateValue: (val: number | null) => {
          row.startDate = val ? dayjs(val).format('YYYY-MM-DD') : '';
        },
        type: 'date',
        size: 'small',
        clearable: true,
        style: 'width: 100%'
      });
    }
  },
  {
    key: 'isPrimary',
    title: () => $t('page.basedata.employee.employeePosition.isPrimary'),
    width: 80,
    align: 'center',
    render: (_row, index) => {
      const row = model.value.positions![index];
      return h(NSwitch, {
        value: row.isPrimary,
        onUpdateValue: (val: boolean) => handleSetPrimary(index, val),
        size: 'small'
      });
    }
  },
  {
    key: 'action',
    title: () => $t('common.action'),
    width: 100,
    align: 'center',
    render: (_row, index) => {
      return h(
        NPopconfirm,
        { onPositiveClick: () => removePositionRow(index) },
        {
          trigger: () =>
            h(NButton, { size: 'small', type: 'error', quaternary: true }, { default: () => $t('common.delete') }),
          default: () => $t('common.confirmDelete')
        }
      );
    }
  }
]);

async function fetchDetail() {
  if (!isEdit.value) return;

  loading.value = true;
  const { data, error } = await fetchGetEmployee(props.id);
  if (!error && data) {
    rawData.value = data;
    model.value = {
      number: data.number,
      name: data.name,
      description: data.description ?? '',
      hireDate: data.hireDate ?? null,
      gender: data.gender ?? 0,
      phone: data.phone ?? '',
      email: data.email ?? '',
      address: data.address ?? '',
      positions: (data.positions ?? []).map(pos => ({
        id: pos.id,
        departmentId: pos.departmentId,
        departmentName: pos.departmentName ?? '',
        positionId: pos.positionId,
        positionName: pos.positionName ?? '',
        startDate: pos.startDate ?? null,
        isPrimary: pos.isPrimary
      }))
    };
  }
  loading.value = false;
}

async function handleSave() {
  await validate();
  saving.value = true;

  if (isEdit.value) {
    const { error, data } = await fetchUpdateEmployee(props.id, {
      ...model.value,
      concurrencyStamp: rawData.value!.concurrencyStamp
    });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      rawData.value = data;
    }
  } else {
    const { error, data } = await fetchCreateEmployee(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      const oldFullPath = route.fullPath;
      await router.push(`/basedata/employee-detail/${data.id}`);
      await nextTick();
      tabStore.removeTab(oldFullPath);
    }
  }
  saving.value = false;
}

async function handleSubmit() {
  window.$message?.info('提交功能待实现');
}

async function handleApprove() {
  window.$message?.info('审核功能待实现');
}

function handleGoList() {
  routerPushByKey('basedata_employee');
}

const emailOptions = computed(() => {
  const prefix = model.value.email?.split('@')[0];
  return emailSuffixOptions.map(suffix => {
    return {
      label: prefix + suffix,
      value: prefix + suffix
    };
  });
});

function updateTabTitle() {
  const i18nKey = isEdit.value ? 'page.basedata.employee.editEmployee' : 'page.basedata.employee.addEmployee';
  tabStore.setTabLabelByI18nKey(i18nKey, route.fullPath);
}

onMounted(() => {
  updateTabTitle();
  fetchDetail();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-8px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center justify-between">
        <NSpace :size="12">
          <NButton v-if="permissions.Create || permissions.Update" type="primary" :loading="saving" @click="handleSave">
            <template #icon>
              <SvgIcon icon="ic:round-save" />
            </template>
            {{ $t('common.save') }}
          </NButton>
          <NButton v-if="permissions.Submit" type="primary" :disabled="!isEdit" @click="handleSubmit">
            <template #icon>
              <SvgIcon icon="ic:round-send" />
            </template>
            {{ $t('common.submit') }}
          </NButton>
          <NButton v-if="permissions.Audit" type="primary" :disabled="!isEdit" @click="handleApprove">
            <template #icon>
              <SvgIcon icon="ic:round-check-circle" />
            </template>
            {{ $t('common.approve') }}
          </NButton>
        </NSpace>
        <NButton quaternary @click="handleGoList">
          <template #icon>
            <SvgIcon icon="ic:round-format-list-bulleted" />
          </template>
          {{ $t('common.list') }}
        </NButton>
      </div>
    </NCard>

    <NCard :bordered="false" size="small" class="flex-1 card-wrapper sm:flex-1-hidden">
      <NSpin :show="loading" class="h-full">
        <NTabs v-model:value="activeTab" type="line" placement="left" animated class="h-full">
          <NTabPane name="basic" :tab="$t('common.tabs.basic')">
            <NForm
              ref="formRef"
              :model="model"
              :rules="rules"
              label-placement="left"
              label-width="120px"
              require-mark-placement="right-hanging"
              class="w-full py-8px pe-20px"
            >
              <NGrid responsive="screen" item-responsive cols="24">
                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.number')" path="number">
                  <NInput v-model:value="model.number" :placeholder="$t('page.basedata.employee.form.number')" />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.name')" path="name">
                  <NInput v-model:value="model.name" :placeholder="$t('page.basedata.employee.form.name')" />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.gender')" path="gender">
                  <NSelect
                    v-model:value="model.gender"
                    :options="genderOptions"
                    :placeholder="$t('page.basedata.employee.form.gender')"
                    clearable
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.hireDate')" path="hireDate">
                  <NDatePicker
                    v-model:value="hireDateTimestamp"
                    type="date"
                    :placeholder="$t('page.basedata.employee.form.hireDate')"
                    class="w-full"
                    clearable
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.phone')" path="phone">
                  <NInput v-model:value="model.phone" :placeholder="$t('page.basedata.employee.form.phone')" />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.email')" path="email">
                  <NAutoComplete
                    v-model:value="model.email!"
                    :input-props="{ autocomplete: 'disabled' }"
                    :options="emailOptions"
                    :placeholder="$t('page.basedata.employee.form.email')"
                    clearable
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.address')" path="address">
                  <NInput
                    v-model:value="model.address"
                    type="textarea"
                    :rows="2"
                    :placeholder="$t('page.basedata.employee.form.address')"
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:12 m:8" :label="$t('page.basedata.employee.description')" path="description">
                  <NInput
                    v-model:value="model.description"
                    type="textarea"
                    :rows="2"
                    :placeholder="$t('page.basedata.employee.form.description')"
                  />
                </NFormItemGi>
              </NGrid>
            </NForm>
          </NTabPane>

          <NTabPane name="positions" :tab="$t('page.basedata.employee.employeePosition.title')">
            <div class="p-8px">
              <div class="mb-8px">
                <NButton size="small" type="primary" ghost @click="addPositionRow">
                  <template #icon>
                    <SvgIcon icon="ic:round-add" />
                  </template>
                  {{ $t('common.add') }}
                </NButton>
              </div>

              <NDataTable
                :columns="positionColumns"
                :data="model.positions ?? []"
                :row-key="positionRowKey"
                size="small"
                :max-height="400"
                :scroll-x="780"
              />
            </div>
          </NTabPane>

          <NTabPane name="other" :tab="$t('common.tabs.other')">
            <NDescriptions label-placement="left" bordered :column="2" class="ms-50px max-w-600px py-8px">
              <NDescriptionsItem :label="$t('common.documentStatus.title')">
                {{ $t(documentStatusRecord[rawData?.documentStatus ?? 0]) }}
              </NDescriptionsItem>

              <NDescriptionsItem :span="1" label="">
                <!-- 占位 -->
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.creatorName')">
                {{ rawData?.creatorName ?? '-' }}
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.creationTime')">
                {{ rawData?.creationTime != null ? dayjs(rawData?.creationTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.lastModifierName')">
                {{ rawData?.lastModifierName ?? '-' }}
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.lastModificationTime')">
                {{
                  rawData?.lastModificationTime != null
                    ? dayjs(rawData?.lastModificationTime).format('YYYY-MM-DD HH:mm:ss')
                    : '-'
                }}
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.approverName')">
                {{ rawData?.approverName ?? '-' }}
              </NDescriptionsItem>

              <NDescriptionsItem :label="$t('common.approvalTime')">
                {{ rawData?.approvalTime != null ? dayjs(rawData?.approvalTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
              </NDescriptionsItem>
            </NDescriptions>
          </NTabPane>
        </NTabs>
      </NSpin>

      <DepartmentSelectModal v-model:visible="departmentModalVisible" @select="handleDepartmentSelected" />
      <PositionSelectModal
        v-model:visible="positionModalVisible"
        :department-id="positionModalDeptId"
        @select="handlePositionSelected"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
