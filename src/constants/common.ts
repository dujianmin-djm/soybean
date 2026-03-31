import { transformRecordToTranslatedOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  1: 'common.status.enable',
  0: 'common.status.disable'
};

export const enableStatusOptions = transformRecordToTranslatedOption(enableStatusRecord);

export const genderRecord: Record<Api.Common.Gender, App.I18n.I18nKey> = {
  0: 'common.gender.unknown',
  1: 'common.gender.male',
  2: 'common.gender.female'
};

export const genderOptions = transformRecordToTranslatedOption(genderRecord);

export const documentStatusRecord: Record<Api.Common.DocumentStatus, App.I18n.I18nKey> = {
  0: 'common.documentStatus.created',
  1: 'common.documentStatus.submitted',
  2: 'common.documentStatus.approved'
};

export const documentStatusOptions = transformRecordToTranslatedOption(documentStatusRecord);

export const emailSuffixOptions = ['@qq.com', '@163.com', '@alibaba.com', '@gmail.com', '@outlook.com'];
