import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.common.status.enable',
  '0': 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '0': 'page.manage.user.gender.unknown',
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const documentStatusRecord: Record<Api.Common.DocumentStatus, App.I18n.I18nKey> = {
  '0': 'common.documentStatus.created',
  '1': 'common.documentStatus.submitted',
  '2': 'common.documentStatus.approved'
};

export const documentStatusOptions = transformRecordToOption(documentStatusRecord);

export const emailSuffixOptions = ['@qq.com', '@163.com', '@alibaba.com', '@gmail.com', '@outlook.com'];
