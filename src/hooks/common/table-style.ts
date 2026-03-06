import { computed } from 'vue';
import { useTableStyleStore } from '@/store/modules/table-style';

export function useTableStyle() {
  const tableStyleStore = useTableStyleStore();

  const tableStyleProps = computed(() => ({
    striped: tableStyleStore.striped,
    bordered: tableStyleStore.bordered,
    singleLine: !tableStyleStore.singleLine,
    singleColumn: !tableStyleStore.singleColumn,
    bottomBordered: tableStyleStore.bottomBordered
  }));

  return {
    tableStyleStore,
    tableStyleProps
  };
}
