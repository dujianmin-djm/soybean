<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { enableStatusRecord, userGenderRecord } from '@/constants/common';
import { fetchGetUser, fetchGetUserRoles } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const appStore = useAppStore();

const loading = ref(false);
const userData = ref<Api.SystemManage.User | null>(null);

async function fetchUserDetail() {
  loading.value = true;
  const [userResponse, rolesResponse] = await Promise.all([fetchGetUser(props.id), fetchGetUserRoles(props.id)]);
  if (!userResponse.error) {
    userData.value = userResponse.data;
    if (!rolesResponse.error) {
      userData.value.roleNames = rolesResponse.data.map(item => item.name);
    }
  }
  loading.value = false;
}

function goBack() {
  router.back();
}

onMounted(() => {
  fetchUserDetail();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center gap-8px">
          <NButton text @click="goBack">
            <SvgIcon icon="ic:round-arrow-back" class="text-18px" />
          </NButton>
          <span>{{ $t('page.manage.user.title') }}</span>
        </div>
      </template>

      <NSpin :show="loading">
        <NEmpty v-if="!loading && !userData" :description="$t('common.noData')" class="py-36px" />

        <NDescriptions v-if="userData" label-placement="left" bordered :column="appStore.isMobile ? 1 : 2">
          <NDescriptionsItem :label="$t('page.manage.user.userName')">
            {{ userData.userName }}
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.userGender')">
            <template v-if="userData.gender !== null">
              <NTag
                size="small"
                :type="userData.gender === '1' ? 'primary' : userData.gender === '2' ? 'error' : 'default'"
              >
                {{ $t(userGenderRecord[userData.gender]) }}
              </NTag>
            </template>
            <span v-else>-</span>
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.userPhone')">
            {{ userData.phoneNumber || '-' }}
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.userEmail')">
            {{ userData.email || '-' }}
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.userStatus')">
            <NTag size="small" :type="userData.isActive ? 'success' : 'warning'">
              {{ $t(enableStatusRecord[userData.isActive ? 1 : 0]) }}
            </NTag>
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.description')" :span="appStore.isMobile ? 1 : 2">
            {{ userData.description || '-' }}
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('page.manage.user.userRole')" :span="appStore.isMobile ? 1 : 2">
            <NSpace v-if="userData.roleNames && userData.roleNames.length > 0" :size="4">
              <NTag v-for="role in userData.roleNames" :key="role" size="small" type="info">
                {{ role }}
              </NTag>
            </NSpace>
            <span v-else>-</span>
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('common.creatorName')">
            {{ userData.creatorName || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('common.creationTime')">
            {{ dayjs(userData.creationTime).format('YYYY-MM-DD HH:mm:ss') || '-' }}
          </NDescriptionsItem>

          <NDescriptionsItem :label="$t('common.lastModifierName')">
            {{ userData.lastModifierName || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('common.lastModificationTime')">
            {{ dayjs(userData.lastModificationTime).format('YYYY-MM-DD HH:mm:ss') || '-' }}
          </NDescriptionsItem>
        </NDescriptions>
      </NSpin>
    </NCard>
  </div>
</template>

<style scoped></style>
