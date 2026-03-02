import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui';
import type { NDateLocale, NLocale } from 'naive-ui';

export const naiveLocales: Record<App.I18n.LangType, NLocale> = {
  'zh-Hans': zhCN,
  en: enUS
};

export const naiveDateLocales: Record<App.I18n.LangType, NDateLocale> = {
  'zh-Hans': dateZhCN,
  en: dateEnUS
};
