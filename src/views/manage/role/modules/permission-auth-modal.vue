<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import { fetchGetPermissions, fetchUpdatePermissions } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'PermissionAuthModal' });

interface Props {
  /** 角色名称，作为 providerKey 传给后端 */
  roleName: string;
}

const props = defineProps<Props>();
const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const submitting = ref(false);
const activeTab = ref('');
const entityDisplayName = ref('');

interface PermissionItem {
  name: string;
  displayName: string;
  parentName: string | null;
  isGranted: boolean;
  allowedProviders: string[];
  grantedProviders: Array<{ providerName: string; providerKey: string }>;
}

interface GroupState {
  name: string;
  displayName: string;
  permissions: PermissionItem[];
  treeData: TreeOption[];
  checkedKeys: string[];
  disabledKeys: Set<string>;
  parentMap: Map<string, string>; // child → parent
  childrenMap: Map<string, string[]>; // parent → children
}

interface TreeCheckParams {
  group: GroupState;
  keys: Array<string | number>;
  options: Array<TreeOption | null>;
  meta: {
    node: TreeOption | null;
    action: 'check' | 'uncheck';
  };
}

const groups = ref<GroupState[]>([]);

const title = computed(() => `${$t('page.manage.role.roleAuth')} - ${entityDisplayName.value || props.roleName}`);

// ---------- 构建辅助 ----------

/** 判断权限是否不可编辑（被其它 provider 授予，非当前 R） */
function isPermissionDisabled(p: PermissionItem): boolean {
  return p.isGranted && p.grantedProviders.length > 0 && p.grantedProviders.every(gp => gp.providerName !== 'R');
}

/** 从权限列表构建树 */
function buildTree(permissions: PermissionItem[], disabledKeys: Set<string>): TreeOption[] {
  const map = new Map<string, TreeOption>();
  const roots: TreeOption[] = [];

  for (const p of permissions) {
    const disabled = disabledKeys.has(p.name);
    let label = p.displayName;
    if (disabled) {
      const providers = p.grantedProviders.filter(gp => gp.providerName !== 'R').map(gp => gp.providerName);
      label = `${p.displayName} (${providers.join(', ')})`;
    }
    map.set(p.name, { key: p.name, label, children: [], disabled });
  }

  for (const p of permissions) {
    const node = map.get(p.name)!;
    if (p.parentName && map.has(p.parentName)) {
      map.get(p.parentName)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  // 清除空 children
  function clean(nodes: TreeOption[]) {
    for (const node of nodes) {
      if (node.children?.length === 0) delete node.children;
      else if (node.children) clean(node.children);
    }
  }
  clean(roots);
  return roots;
}

function buildParentMap(permissions: PermissionItem[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const p of permissions) {
    if (p.parentName) m.set(p.name, p.parentName);
  }
  return m;
}

function buildChildrenMap(permissions: PermissionItem[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const p of permissions) {
    if (p.parentName) {
      if (!m.has(p.parentName)) m.set(p.parentName, []);
      m.get(p.parentName)!.push(p.name);
    }
  }
  return m;
}

// ---------- 级联辅助 ----------

/** 获取所有后代 key */
function getAllDescendants(group: GroupState, name: string): string[] {
  const children = group.childrenMap.get(name) || [];
  const result: string[] = [...children];
  for (const child of children) {
    result.push(...getAllDescendants(group, child));
  }
  return result;
}

/** 获取所有祖先 key */
function getAllAncestors(group: GroupState, name: string): string[] {
  const result: string[] = [];
  let current = group.parentMap.get(name);
  while (current) {
    result.push(current);
    current = group.parentMap.get(current);
  }
  return result;
}

// ---------- 全选逻辑 ----------

function getEnabledKeys(group: GroupState): string[] {
  return group.permissions.filter(p => !group.disabledKeys.has(p.name)).map(p => p.name);
}

function isGroupAllChecked(group: GroupState): boolean {
  const enabled = getEnabledKeys(group);
  return enabled.length > 0 && enabled.every(k => group.checkedKeys.includes(k));
}

function isGroupIndeterminate(group: GroupState): boolean {
  const enabled = getEnabledKeys(group);
  const checkedCount = enabled.filter(k => group.checkedKeys.includes(k)).length;
  return checkedCount > 0 && checkedCount < enabled.length;
}

const isAllTabsChecked = computed(() => groups.value.length > 0 && groups.value.every(g => isGroupAllChecked(g)));

const isAllTabsIndeterminate = computed(() => {
  if (isAllTabsChecked.value) return false;
  return groups.value.some(g => {
    const enabled = getEnabledKeys(g);
    return enabled.some(k => g.checkedKeys.includes(k));
  });
});

// ---------- 事件处理 ----------

function handleSelectAllInGroup(group: GroupState, checked: boolean) {
  if (checked) {
    group.checkedKeys = group.permissions.map(p => p.name);
  } else {
    // 保留 disabled 的（不可取消）
    group.checkedKeys = Array.from(group.disabledKeys);
  }
}

function handleSelectAllInAllTabs(checked: boolean) {
  for (const group of groups.value) {
    handleSelectAllInGroup(group, checked);
  }
}

/**
 * 自定义级联逻辑（NTree cascade = false）
 * - 勾选节点 → 同时勾选所有后代 + 所有祖先
 * - 取消节点 → 同时取消所有后代（保留 disabled）
 */
function handleTreeCheck({ group, keys, options: _options, meta }: TreeCheckParams) {
  if (!meta.node) return;
  const nodeKey = meta.node.key as string;
  const stringKeys = keys.map(k => String(k));

  if (meta.action === 'check') {
    const descendants = getAllDescendants(group, nodeKey);
    const ancestors = getAllAncestors(group, nodeKey);
    const newKeys = new Set([...stringKeys, ...descendants, ...ancestors]);
    group.checkedKeys = Array.from(newKeys);
  } else {
    const descendants = getAllDescendants(group, nodeKey);
    const keysToRemove = new Set([nodeKey, ...descendants]);
    // 保留 disabled 节点
    group.checkedKeys = stringKeys.filter(k => !keysToRemove.has(k) || group.disabledKeys.has(k));
  }
}

async function loadPermissions() {
  loading.value = true;
  groups.value = [];
  try {
    const { data, error } = await fetchGetPermissions('R', props.roleName);
    if (error || !data) return;

    entityDisplayName.value = data.entityDisplayName;

    groups.value = data.groups
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map(g => {
        const disabledKeys = new Set<string>();
        for (const p of g.permissions) {
          if (isPermissionDisabled(p)) disabledKeys.add(p.name);
        }
        const checkedKeys = g.permissions.filter(p => p.isGranted).map(p => p.name);
        return {
          name: g.name,
          displayName: g.displayName,
          permissions: g.permissions,
          treeData: buildTree(g.permissions, disabledKeys),
          checkedKeys,
          disabledKeys,
          parentMap: buildParentMap(g.permissions),
          childrenMap: buildChildrenMap(g.permissions)
        };
      });

    if (groups.value.length > 0) {
      activeTab.value = groups.value[0].name;
    }
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  submitting.value = true;
  try {
    const permissions: Api.SystemManage.UpdatePermissionItem[] = [];
    for (const group of groups.value) {
      const checkedSet = new Set(group.checkedKeys);
      for (const p of group.permissions) {
        permissions.push({ name: p.name, isGranted: checkedSet.has(p.name) });
      }
    }
    const { error } = await fetchUpdatePermissions('R', props.roleName, { permissions });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      visible.value = false;
    }
  } finally {
    submitting.value = false;
  }
}

function closeModal() {
  visible.value = false;
}

watch(visible, val => {
  if (val) loadPermissions();
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-600px" :mask-closable="false">
    <NSpin :show="loading">
      <!-- 全局全选 -->
      <div class="mb-12px">
        <NCheckbox
          :checked="isAllTabsChecked"
          :indeterminate="isAllTabsIndeterminate"
          @update:checked="handleSelectAllInAllTabs"
        >
          {{ $t('page.manage.role.selectAllPermission') }}
        </NCheckbox>
      </div>
      <NDivider class="!my-8px" />

      <!-- 分组 Tab -->
      <div v-if="groups.length > 0" class="h-480px">
        <NTabs v-model:value="activeTab" type="line" placement="left" animated tab-style="min-width: 140px">
          <NTabPane v-for="group in groups" :key="group.name" :name="group.name" :tab="group.displayName">
            <!-- 组内全选 -->
            <div class="mb-8px">
              <NCheckbox
                :checked="isGroupAllChecked(group)"
                :indeterminate="isGroupIndeterminate(group)"
                @update:checked="(val: boolean) => handleSelectAllInGroup(group, val)"
              >
                {{ $t('common.selectAll') }}
              </NCheckbox>
            </div>
            <NDivider class="!my-8px" />
            <!-- 权限树 -->
            <NScrollbar class="h-380px">
              <NTree
                :data="group.treeData"
                :checked-keys="group.checkedKeys"
                :cascade="false"
                checkable
                :selectable="false"
                block-line
                @update:checked-keys="
                  (keys: any[], options: any, meta: any) => handleTreeCheck({ group, keys, options, meta })
                "
              />
            </NScrollbar>
          </NTabPane>
        </NTabs>
      </div>
      <NEmpty v-else-if="!loading" description="{{ $t('page.manage.role.noPermissionData') }}" />
    </NSpin>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
