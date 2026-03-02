<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });
const isActiveValue = computed({
  get: () => {
    if (model.value.isActive === null) return null;
    return model.value.isActive ? '1' : '0';
  },
  set: (val: string | null) => {
    if (val === null) {
      model.value.isActive = null;
    } else {
      model.value.isActive = val === '1';
    }
  }
});

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'email' | 'phoneNumber'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    email: patternRules.email,
    phoneNumber: patternRules.phone
  };
});

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  await restoreValidation();
  resetModel();
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userName')" path="userName" class="pr-24px">
              <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userGender')" path="gender" class="pr-24px">
              <NSelect
                v-model:value="model.gender"
                :placeholder="$t('page.manage.user.form.userGender')"
                :options="translateOptions(userGenderOptions)"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.userPhone')"
              path="phoneNumber"
              class="pr-24px"
            >
              <NInput v-model:value="model.phoneNumber" :placeholder="$t('page.manage.user.form.userPhone')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userEmail')" path="email" class="pr-24px">
              <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userStatus')" path="isActive" class="pr-24px">
              <NSelect
                v-model:value="isActiveValue"
                :placeholder="$t('page.manage.user.form.userStatus')"
                :options="translateOptions(enableStatusOptions)"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
