import type { SelectProps } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type TrueAdminRemoteSelectValue = string | number;

export type TrueAdminRemoteSelectOption<
  TValue extends TrueAdminRemoteSelectValue = TrueAdminRemoteSelectValue,
  TRecord = unknown,
> = {
  label: ReactNode;
  value: TValue;
  disabled?: boolean;
  record: TRecord;
};

export type TrueAdminRemoteSelectSearchParams = {
  keyword: string;
  page?: number;
  pageSize?: number;
};

export type TrueAdminRemoteSelectNotFoundContentRenderContext = {
  emptyText?: ReactNode;
  loading: boolean;
  loadingText?: ReactNode;
};

export type TrueAdminRemoteSelectProps<
  TRecord,
  TValue extends TrueAdminRemoteSelectValue = TrueAdminRemoteSelectValue,
  TMultiple extends boolean = false,
> = Omit<
  SelectProps<TMultiple extends true ? TValue[] : TValue, DefaultOptionType>,
  | 'filterOption'
  | 'labelInValue'
  | 'loading'
  | 'mode'
  | 'notFoundContent'
  | 'onChange'
  | 'onSearch'
  | 'optionRender'
  | 'options'
  | 'showSearch'
> & {
  value?: TMultiple extends true ? TValue[] : TValue;
  defaultValue?: TMultiple extends true ? TValue[] : TValue;
  multiple?: TMultiple;
  fetchOptions: (params: TrueAdminRemoteSelectSearchParams) => Promise<TRecord[]>;
  fetchByValues?: (values: TValue[]) => Promise<TRecord[]>;
  getValue: (record: TRecord) => TValue;
  getLabel: (record: TRecord) => ReactNode;
  getDisabled?: (record: TRecord) => boolean;
  optionRender?: (record: TRecord) => ReactNode;
  autoLoad?: boolean;
  searchDelay?: number;
  defaultKeyword?: string;
  defaultOptions?: TRecord[];
  selectedOptions?: TRecord[];
  pageSize?: number;
  searchOnFocus?: boolean;
  loadingText?: ReactNode;
  emptyText?: ReactNode;
  notFoundContentClassName?: string;
  notFoundContentStyle?: CSSProperties;
  notFoundContentRender?: (
    context: TrueAdminRemoteSelectNotFoundContentRenderContext,
  ) => ReactNode;
  onChange?: (
    value: TMultiple extends true ? TValue[] : TValue | undefined,
    records: TMultiple extends true ? TRecord[] : TRecord | undefined,
  ) => void;
  onLoadOptionsSuccess?: (records: TRecord[]) => void;
  onLoadOptionsError?: (error: unknown) => false | undefined;
};

export declare const DEFAULT_SEARCH_DELAY: 300;

export declare const DEFAULT_PAGE_SIZE: 20;

export declare const toRemoteSelectValueArray: <TValue extends TrueAdminRemoteSelectValue>(
  value: TValue | TValue[] | undefined,
) => TValue[];

export declare const toRemoteSelectValueKey: (value: TrueAdminRemoteSelectValue) => string;

export declare function TrueAdminRemoteSelect<
  TRecord,
  TValue extends TrueAdminRemoteSelectValue = TrueAdminRemoteSelectValue,
  TMultiple extends boolean = false,
>(props: TrueAdminRemoteSelectProps<TRecord, TValue, TMultiple>): ReactElement | null;
