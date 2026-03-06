<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { documentStatusRecord, yesOrNoOptions } from '@/constants/common';
import { PERMISSIONS } from '@/constants/permissions';
import { fetchCreatePosition, fetchGetPosition, fetchUpdatePosition } from '@/service/api';
import { useTabStore } from '@/store/modules/tab';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import { usePermission } from '@/hooks/common/permission';
import { $t } from '@/locales';
import DepartmentSelectModal from '@/views/basedata/department/modules/department-select-modal.vue';

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
const { defaultRequiredRule } = useFormRules();

const isEdit = computed(() => props.id !== 'add');
const loading = ref(false);
const saving = ref(false);
const departmentModalVisible = ref(false);
const activeTab = ref('basic');

const rawData = ref<Api.BaseData.Position | null>(null);

type Model = Api.BaseData.PositionDetail;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    number: '',
    name: '',
    description: '',
    departmentId: '',
    departmentName: '',
    departmentFullName: '',
    isLeader: false
  };
}

type RuleKey = Extract<keyof Model, 'number' | 'name'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => ({
  number: [defaultRequiredRule],
  name: [defaultRequiredRule],
  departmentId: [defaultRequiredRule]
}));

function updateTabTitle() {
  const i18nKey = isEdit.value ? 'page.basedata.position.editPosition' : 'page.basedata.position.addPosition';
  tabStore.setTabLabelByI18nKey(i18nKey, route.fullPath);
}

async function fetchDetail() {
  if (!isEdit.value) return;

  loading.value = true;
  const { data, error } = await fetchGetPosition(props.id);
  if (!error && data) {
    rawData.value = data;
    model.value = {
      number: data.number ?? '',
      name: data.name ?? '',
      description: data.description ?? '',
      departmentId: data.departmentId ?? '',
      departmentName: data.departmentName ?? '',
      departmentFullName: data.departmentFullName ?? '',
      isLeader: data.isLeader ?? false
    };
  }
  loading.value = false;
}

function handleDepartmentSelected(dept: { id: string; name: string; fullName?: string }) {
  model.value.departmentId = dept.id;
  model.value.departmentName = dept.name;
  model.value.departmentFullName = dept.fullName ?? '';
}

function handleClearDepartment() {
  model.value.departmentId = '';
  model.value.departmentName = '';
  model.value.departmentFullName = '';
}

async function handleSave() {
  await validate();
  saving.value = true;

  if (isEdit.value) {
    const { error, data } = await fetchUpdatePosition(props.id, {
      ...model.value,
      concurrencyStamp: rawData.value!.concurrencyStamp
    });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      rawData.value = data;
    }
  } else {
    const { error, data } = await fetchCreatePosition(model.value);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      const oldFullPath = route.fullPath;
      await router.push(`/basedata/position-detail/${data.id}`);
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
  routerPushByKey('basedata_position');
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
              class="max-w-650px py-8px"
            >
              <NGrid :cols="24" :x-gap="18">
                <NFormItemGi :span="12" :label="$t('page.basedata.position.number')" path="number">
                  <NInput v-model:value="model.number" :placeholder="$t('page.basedata.position.form.number')" />
                </NFormItemGi>

                <NFormItemGi :span="12" :label="$t('page.basedata.position.isLeader')" path="isLeader">
                  <NRadioGroup v-model:value="model.isLeader">
                    <NRadio
                      v-for="item in yesOrNoOptions"
                      :key="item.value"
                      :value="item.value === 'Y'"
                      :label="$t(item.label)"
                    />
                  </NRadioGroup>
                </NFormItemGi>

                <NFormItemGi :span="24" :label="$t('page.basedata.position.name')" path="name">
                  <NInput v-model:value="model.name" :placeholder="$t('page.basedata.position.form.name')" />
                </NFormItemGi>

                <NFormItemGi :span="24" :label="$t('page.basedata.position.departmentName')" path="departmentId">
                  <NInputGroup>
                    <NInput
                      :value="model.departmentName"
                      :placeholder="$t('page.basedata.position.form.departmentId')"
                      readonly
                    />
                    <NButton type="primary" ghost @click="departmentModalVisible = true">
                      <template #icon>
                        <SvgIcon icon="ic:round-search" />
                      </template>
                    </NButton>
                    <NButton type="warning" ghost @click="handleClearDepartment">
                      <template #icon>
                        <SvgIcon icon="ic:round-close" />
                      </template>
                    </NButton>
                  </NInputGroup>
                </NFormItemGi>

                <NFormItemGi :span="24" :label="$t('page.basedata.position.description')" path="description">
                  <NInput
                    v-model:value="model.description"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('page.basedata.position.form.description')"
                  />
                </NFormItemGi>

                <NFormItemGi
                  :span="24"
                  :label="$t('page.basedata.position.departmentFullName')"
                  path="departmentFullName"
                >
                  <NInput :value="model.departmentFullName" placeholder="" readonly />
                </NFormItemGi>
              </NGrid>
            </NForm>
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
    </NCard>
  </div>
</template>

<style scoped>
:deep(.n-tabs-pane-wrapper) {
  overflow-y: auto;
}

:deep(.n-tabs-tab-pad) {
  width: 0 !important;
}
</style>
