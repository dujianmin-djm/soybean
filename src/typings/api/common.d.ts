/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
      /** sorts */
      sorts: string;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      items: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "0": disabled
     */
    type EnableStatus = '1' | '0';

    /**
     * document status
     *
     * - 0: 创建
     * - 1: 审核中
     * - 2: 已审核
     */
    type DocumentStatus = '0' | '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: string;
      /** record creator id */
      creatorId?: string;
      /** record creator name */
      creatorName?: string;
      /** record create time */
      creationTime?: string;
      /** record updater id */
      lastModifierId?: string;
      /** record updater name */
      lastModifierName: string;
      /** record update time */
      lastModificationTime?: string;
      /** record approver */
      approverId?: string;
      /** record approver name */
      approverName: string;
      /** record approval time */
      approvalTime?: string;
      /** record document status */
      documentStatus?: DocumentStatus;
      /** record concurrency stamp */
      concurrencyStamp: string;
    } & T;
  }
}
