import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';

const defaults: App.Global.TableStyle = {
  striped: false,
  bordered: true,
  singleLine: false,
  singleColumn: true,
  bottomBordered: true
};

function loadStyles(): App.Global.TableStyle {
  return localStg.get('tableStyle') ?? defaults;
}

function saveStyles(style: App.Global.TableStyle) {
  localStg.set('tableStyle', style);
}

export const useTableStyleStore = defineStore(SetupStoreId.TableStyle, () => {
  const saved = loadStyles();
  const striped = ref(saved.striped);
  const bordered = ref(saved.bordered);
  const singleLine = ref(saved.singleLine);
  const singleColumn = ref(saved.singleColumn);
  const bottomBordered = ref(saved.bottomBordered);

  watch(
    [striped, bordered, singleLine, singleColumn, bottomBordered],
    () => {
      saveStyles({
        striped: striped.value,
        bordered: bordered.value,
        singleLine: singleLine.value,
        singleColumn: singleColumn.value,
        bottomBordered: bottomBordered.value
      });
    },
    { deep: false }
  );

  function reset() {
    striped.value = defaults.striped;
    bordered.value = defaults.bordered;
    singleLine.value = defaults.singleLine;
    singleColumn.value = defaults.singleColumn;
    bottomBordered.value = defaults.bottomBordered;
  }

  return {
    striped,
    bordered,
    singleLine,
    singleColumn,
    bottomBordered,
    reset
  };
});
