<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { fetchCreateRole, fetchUpdateRole } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'RoleOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Api.SystemManage.RoleCreate;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    number: '',
    description: '',
    isActive: true,
    isDefault: false,
    isPublic: true
  };
}

// type RuleKey = Exclude<keyof Model, 'description'>;
type RuleKey = Extract<keyof Model, 'name' | 'number' | 'isActive'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  number: defaultRequiredRule,
  isActive: defaultRequiredRule
};

// const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (props.operateType === 'add') {
    const { error } = await fetchCreateRole(model.value);
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  } else {
    const { error } = await fetchUpdateRole(props.rowData!.id, {
      ...model.value,
      concurrencyStamp: props.rowData!.concurrencyStamp
    });
    if (error) return;
    window.$message?.success($t('common.updateSuccess'));
  }

  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-400px flex-col" :mask-closable="false">
    <NScrollbar class="mb-2 max-h-420px flex-1 pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.role.roleCode')" path="number">
          <NInput v-model:value="model.number" :placeholder="$t('page.manage.role.form.roleCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleName')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleDesc')" path="description">
          <NInput v-model:value="model.description" :placeholder="$t('page.manage.role.form.roleDesc')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleStatus')" path="isActive">
          <NRadioGroup v-model:value="model.isActive">
            <NRadio
              v-for="item in enableStatusOptions"
              :key="item.value"
              :value="item.value === '1'"
              :label="$t(item.label)"
            />
          </NRadioGroup>
        </NFormItem>
        <NSpace align="center" :size="24">
          <NSpace align="center">
            <span>{{ $t('page.manage.role.roleDefault') }}</span>
            <NSwitch v-model:value="model.isDefault" />
          </NSpace>
          <NSpace align="center">
            <span>{{ $t('page.manage.role.rolePublic') }}</span>
            <NSwitch v-model:value="model.isPublic" />
          </NSpace>
        </NSpace>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
