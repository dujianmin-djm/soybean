<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NCard, NDataTable, NSpace, useDialog, useMessage, useNotification } from 'naive-ui';

// import { fetchOrgDataList, type OrgData } from '@/service/api/org-data';

defineOptions({
  name: 'TestOrgData'
});

interface OrgItem {
  FID: number;
  FNUMBER: string;
  FNAME: string;
}

interface OrgDataResponse {
  isSuccess: boolean;
  items: OrgItem[];
  message: string | null;
}

// 客户数据响应类型
interface CustomerDataResponse {
  data: {
    filter: string;
    lastPage: boolean;
    pageNo: number;
    pageSize: number;
    rows: any[];
    totalCount: number;
  };
  errorCode: string;
  message: string | null;
  status: boolean;
}

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();
const loading = ref(false);
const orgDataList = ref<OrgItem[]>([]);

// 定义表格列
const columns: DataTableColumns<OrgItem> = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    render: (_, index) => index + 1
  },
  {
    title: 'ID',
    key: 'FID',
    width: 100
  },
  {
    title: '组织编号',
    key: 'FNUMBER',
    width: 120
  },
  {
    title: '组织名称',
    key: 'FNAME',
    minWidth: 200
  }
];

// 获取组织数据
async function getOrgData() {
  loading.value = true;
  try {
    // const { data, error } = await fetchOrgDataList();
    const response = await fetch('/proxy-mes/api/basedata/org-data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: OrgDataResponse = await response.json();

    if (result?.isSuccess) {
      orgDataList.value = result.items;
      message.success(`成功加载 ${result.items.length} 条组织数据`);
    } else {
      message.error(`获取组织数据失败${result.message}`);
    }
  } catch {
    message.error('网络请求出错');
  } finally {
    loading.value = false;
  }
}

// 获取客户数据
async function getCustomerData() {
  try {
    const response = await fetch(
      '/proxy-cosmic/kapi/v2/basedata/bd_customer/query?number=NWnsR&createorg_number=p02om&pageSize=10&pageNo=1',
      {
        method: 'GET',
        headers: {
          openApiSign: 'Qlo2QmwtTEFxQzE0TTlzTXZPSG1pdTl0T19kTWtselNtdjRjZ0psSWRoaz06MjAzNzgwMzUxODAxNzkzNjM4NA=='
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: CustomerDataResponse = await response.json();
    if (result?.status) {
      const resultString = JSON.stringify(result, null, 2);
      dialog.success({
        title: '成功',
        content: resultString,
        positiveText: '确定',
        onPositiveClick: () => {
          // message.success('耶！')
        }
      });
    } else {
      message.error(`获取客户数据失败: ${result.message}`);
    }
  } catch {
    message.error('网络请求出错');
  }
}

// 获取数据中心列表
async function getDatacenterList() {
  try {
    const response = await fetch(
      '/proxy-k3cloud/Kingdee.BOS.ServiceFacade.ServicesStub.Account.AccountService.GetDataCenterList.common.kdsvc'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    notification.success({
      title: '数据中心列表',
      content: JSON.stringify(result, null, 2),
      duration: 0
    });
  } catch (error) {
    message.error('网络请求出错');
    // eslint-disable-next-line
    console.error(error);
  }
}

onMounted(() => {
  getOrgData();
  getCustomerData();
  getDatacenterList();
});
</script>

<template>
  <div class="h-50 p-16px">
    <div class="p-16px">
      <NButton type="primary" class="me-3 mt-3 fs-13" @click="getDatacenterList">加载数据中心数据</NButton>
      <NButton type="primary" @click="getCustomerData">加载客户数据</NButton>
    </div>
    <NCard title="组织数据管理" :bordered="false" class="h-full rounded-8px shadow-sm">
      <template #header-extra>
        <NSpace>
          <NButton type="primary" :loading="loading" @click="getOrgData">
            <template #icon>
              <IconIcRoundRefresh />
            </template>
            {{ orgDataList.length > 0 ? '刷新数据' : '加载数据' }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable
        :columns="columns"
        :data="orgDataList"
        :loading="loading"
        :pagination="{
          pageSize: 10,
          showSizePicker: true,
          pageSizes: [10, 20, 50]
        }"
        :bordered="false"
        :single-line="false"
        striped
        class="h-full"
      />
    </NCard>
  </div>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
