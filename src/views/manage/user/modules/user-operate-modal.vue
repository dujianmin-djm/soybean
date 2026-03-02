<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { emailSuffixOptions, enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchCreateUser, fetchGetEnabledRoles, fetchGetUserRoles, fetchUpdateUser } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateModal'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
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
const { defaultRequiredRule, formRules } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Omit<Api.SystemManage.UserCreate, 'password'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    userName: '',
    gender: null,
    description: '',
    phoneNumber: '',
    email: '',
    roleNames: [],
    isActive: true,
    lockoutEnabled: false
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'isActive' | 'email' | 'phoneNumber'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  return {
    userName: formRules.userName,
    isActive: [defaultRequiredRule],
    email: formRules.email,
    phoneNumber: formRules.phone
  };
});

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetEnabledRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.name,
      value: item.name
    }));

    roleOptions.value = [...options];
  }
}

async function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
    const { error, data } = await fetchGetUserRoles(props.rowData.id);
    if (error) return;
    model.value.roleNames = data.map(item => item.name);
  }
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (props.operateType === 'add') {
    const { error } = await fetchCreateUser({
      ...model.value,
      password: import.meta.env.VITE_USER_DEFAULT_PASSWORD
    });
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  } else {
    const { error } = await fetchUpdateUser(props.rowData!.id, {
      ...model.value,
      concurrencyStamp: props.rowData!.concurrencyStamp
    });
    if (error) return;
    window.$message?.success($t('common.updateSuccess'));
  }

  closeModal();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});

const filteredGenderOptions = computed(() => userGenderOptions.filter(item => Number(item.value) !== 0));

const emailOptions = computed(() => {
  const prefix = model.value.email.split('@')[0];
  return emailSuffixOptions.map(suffix => {
    return {
      label: prefix + suffix,
      value: prefix + suffix
    };
  });
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-400px flex-col" :mask-closable="false">
    <NScrollbar class="mb-2 max-h-500px flex-1 pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.userName')" path="userName">
          <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userPhone')" path="phoneNumber">
          <NInput v-model:value="model.phoneNumber" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItem>

        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
          <NAutoComplete
            v-model:value="model.email"
            :input-props="{ autocomplete: 'disabled' }"
            :options="emailOptions"
            :placeholder="$t('page.manage.user.form.userEmail')"
            clearable
          />
        </NFormItem>
        <NGrid :cols="2" :x-gap="18">
          <NFormItemGi :label="$t('page.manage.user.userGender')" path="gender">
            <NRadioGroup v-model:value="model.gender">
              <NRadio
                v-for="item in filteredGenderOptions"
                :key="item.value"
                :value="Number(item.value)"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi :label="$t('page.manage.user.userStatus')" path="isActive">
            <NRadioGroup v-model:value="model.isActive">
              <NRadio
                v-for="item in enableStatusOptions"
                :key="item.value"
                :value="item.value === '1'"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
        </NGrid>
        <NFormItem :label="$t('page.manage.user.userRole')" path="roleNames">
          <NSelect
            v-model:value="model.roleNames"
            :options="roleOptions"
            :placeholder="$t('page.manage.user.form.userRole')"
            multiple
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.description')" path="description">
          <NInput v-model:value="model.description" :placeholder="$t('page.manage.user.form.description')" />
        </NFormItem>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
