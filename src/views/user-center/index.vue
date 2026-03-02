<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRef } from 'vue';
import { userGenderRecord } from '@/constants/business';
import { fetchChangePassword, fetchGetUser, fetchUpdateUser } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

const profileForm = reactive({
  userName: '',
  gender: null as Api.SystemManage.UserGender | null,
  description: '',
  phoneNumber: '',
  email: '',
  concurrencyStamp: ''
} as Api.SystemManage.UserUpdate);

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const genderOptions = computed(() =>
  Object.entries(userGenderRecord).map(([key, label]) => ({
    label: $t(label),
    value: Number(key)
  }))
);

const { formRules, createRequiredRule, createConfirmPwdRule } = useFormRules();
const { formRef: profileFormRef, validate: validateProfile } = useNaiveForm();
const { formRef: passwordFormRef, validate: validatePassword } = useNaiveForm();

type RuleKey = Extract<keyof Api.SystemManage.User, 'userName' | 'email' | 'phoneNumber'>;
const profileRules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  return {
    userName: formRules.userName,
    email: formRules.email,
    phoneNumber: formRules.phone
  };
});

const passwordRules = computed<Record<string, App.Global.FormRule[]>>(() => {
  return {
    currentPassword: [createRequiredRule($t('page.userCenter.form.currentPasswordRequired'))],
    newPassword: formRules.pwd,
    confirmPassword: createConfirmPwdRule(toRef(passwordForm, 'newPassword'))
  };
});

async function fetchUserInfo() {
  loading.value = true;
  const { data, error } = await fetchGetUser(authStore.userInfo.id);
  if (!error && data) {
    profileForm.userName = data.userName;
    profileForm.gender = data.gender;
    profileForm.description = data.description;
    profileForm.phoneNumber = data.phoneNumber;
    profileForm.email = data.email;
    profileForm.concurrencyStamp = data.concurrencyStamp;
  }
  loading.value = false;
}

async function handleSaveProfile() {
  await validateProfile();

  saving.value = true;
  const { error, data } = await fetchUpdateUser(authStore.userInfo.id, profileForm);

  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    profileForm.concurrencyStamp = data.concurrencyStamp;
    // 刷新全局 auth store 中的用户信息
    await authStore.initUserInfo();
  }
  saving.value = false;
}

async function handleChangePassword() {
  await validatePassword();

  changingPassword.value = true;
  const { error } = await fetchChangePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  });

  changingPassword.value = false;
  if (!error) {
    // prevent the user from refreshing the page or closing the tab without logging out
    window.addEventListener('beforeunload', handleLogout);

    window.$dialog?.success({
      title: $t('common.success'),
      content: $t('page.userCenter.changePasswordSuccessLogoutTip'),
      positiveText: $t('common.confirm'),
      maskClosable: false,
      closeOnEsc: false,
      onPositiveClick() {
        logoutAndCleanup();
      },
      onClose() {
        logoutAndCleanup();
      }
    });
  }
}

function handleLogout() {
  authStore.resetStore();
}

function logoutAndCleanup() {
  handleLogout();
  window.removeEventListener('beforeunload', handleLogout);
}

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px lt-sm:overflow-auto">
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
      <NGridItem span="24 m:12">
        <NCard :title="$t('page.userCenter.profileTitle')" :bordered="false" size="small" class="h-full card-wrapper">
          <NSpin :show="loading">
            <NForm
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
              class="max-w-600px"
            >
              <NFormItem :label="$t('page.manage.user.userName')" path="userName">
                <NInput v-model:value="profileForm.userName" :placeholder="$t('page.manage.user.form.userName')" />
              </NFormItem>

              <NFormItem :label="$t('page.manage.user.userGender')" path="gender">
                <NSelect
                  v-model:value="profileForm.gender"
                  :options="genderOptions"
                  :placeholder="$t('page.manage.user.form.userGender')"
                  clearable
                />
              </NFormItem>

              <NFormItem :label="$t('page.manage.user.userPhone')" path="phoneNumber">
                <NInput v-model:value="profileForm.phoneNumber" :placeholder="$t('page.manage.user.form.userPhone')" />
              </NFormItem>

              <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
                <NInput v-model:value="profileForm.email" :placeholder="$t('page.manage.user.form.userEmail')" />
              </NFormItem>

              <NFormItem :label="$t('page.manage.user.description')" path="description">
                <NInput
                  v-model:value="profileForm.description"
                  type="textarea"
                  :placeholder="$t('page.manage.user.form.description')"
                  :rows="3"
                />
              </NFormItem>

              <NFormItem label=" ">
                <NButton type="primary" :loading="saving" @click="handleSaveProfile">
                  {{ $t('common.save') }}
                </NButton>
              </NFormItem>
            </NForm>
          </NSpin>
        </NCard>
      </NGridItem>

      <!-- ========== 右侧：修改密码 ========== -->
      <NGridItem span="24 m:12">
        <NCard
          :title="$t('page.userCenter.changePasswordTitle')"
          :bordered="false"
          size="small"
          class="h-full card-wrapper"
        >
          <NForm
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
          >
            <NFormItem :label="$t('page.userCenter.currentPassword')" path="currentPassword">
              <NInput
                v-model:value="passwordForm.currentPassword"
                type="password"
                show-password-on="click"
                :placeholder="$t('page.userCenter.currentPassword')"
              />
            </NFormItem>

            <NFormItem :label="$t('page.userCenter.newPassword')" path="newPassword">
              <NInput
                v-model:value="passwordForm.newPassword"
                type="password"
                show-password-on="click"
                :placeholder="$t('page.userCenter.newPassword')"
              />
            </NFormItem>

            <NFormItem :label="$t('page.userCenter.confirmPassword')" path="confirmPassword">
              <NInput
                v-model:value="passwordForm.confirmPassword"
                type="password"
                show-password-on="click"
                :placeholder="$t('page.userCenter.confirmPassword')"
              />
            </NFormItem>

            <NFormItem label=" ">
              <NButton type="primary" :loading="changingPassword" @click="handleChangePassword">
                {{ $t('page.userCenter.changePassword') }}
              </NButton>
            </NFormItem>
          </NForm>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
:deep(.n-card > .n-card__content) {
  padding: 0 50px 12px 30px;
}
</style>
