import type {
  ButtonProps,
  EmptyProps,
  InputProps,
  SegmentedProps,
  SpaceProps,
  TreeProps,
} from 'antd';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type TrueAdminQuickFilterValue = string | number;

export type TrueAdminQuickFilterItem<TValue extends TrueAdminQuickFilterValue> = {
  label: ReactNode;
  value: TValue;
  count?: number;
  disabled?: boolean;
  icon?: ReactNode;
};

export type TrueAdminQuickFilterMode = 'inline' | 'block';

export type TrueAdminQuickFilterClassNames = {
  root?: string;
  header?: string;
  extra?: string;
  segmented?: string;
  option?: string;
  optionIcon?: string;
  optionLabel?: string;
  optionCount?: string;
};

export type TrueAdminQuickFilterStyles = {
  root?: CSSProperties;
  header?: CSSProperties;
  extra?: CSSProperties;
  segmented?: CSSProperties;
  option?: CSSProperties;
  optionIcon?: CSSProperties;
  optionLabel?: CSSProperties;
  optionCount?: CSSProperties;
};

export type TrueAdminQuickFilterProps<TValue extends TrueAdminQuickFilterValue> = {
  className?: string;
  style?: CSSProperties;
  classNames?: TrueAdminQuickFilterClassNames;
  styles?: TrueAdminQuickFilterStyles;
  title?: ReactNode;
  mode?: TrueAdminQuickFilterMode;
  value?: TValue;
  items: Array<TrueAdminQuickFilterItem<TValue>>;
  loading?: boolean;
  disabled?: boolean;
  extra?: ReactNode;
  segmentedProps?: Omit<SegmentedProps<TValue>, 'options' | 'value' | 'onChange'>;
  onChange?: (value: TValue) => void;
};

export declare function TrueAdminQuickFilter<TValue extends TrueAdminQuickFilterValue>(
  props: TrueAdminQuickFilterProps<TValue>,
): ReactElement | null;

export type TrueAdminTreeFilterValue = string | number;

export type TrueAdminTreeFilterItem<TValue extends TrueAdminTreeFilterValue> = {
  label: ReactNode;
  value: TValue;
  count?: number;
  disabled?: boolean;
  selectable?: boolean;
  icon?: ReactNode;
  searchText?: string;
  children?: Array<TrueAdminTreeFilterItem<TValue>>;
};

export type TrueAdminTreeFilterClassNames = {
  root?: string;
  header?: string;
  extra?: string;
  search?: string;
  tree?: string;
  empty?: string;
  node?: string;
  nodeIcon?: string;
  nodeLabel?: string;
};

export type TrueAdminTreeFilterStyles = {
  root?: CSSProperties;
  header?: CSSProperties;
  extra?: CSSProperties;
  search?: CSSProperties;
  tree?: CSSProperties;
  empty?: CSSProperties;
  node?: CSSProperties;
  nodeIcon?: CSSProperties;
  nodeLabel?: CSSProperties;
};

export type TrueAdminTreeFilterProps<TValue extends TrueAdminTreeFilterValue> = {
  className?: string;
  style?: CSSProperties;
  classNames?: TrueAdminTreeFilterClassNames;
  styles?: TrueAdminTreeFilterStyles;
  title?: ReactNode;
  value?: TValue;
  items: Array<TrueAdminTreeFilterItem<TValue>>;
  placeholder?: string;
  emptyText?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  defaultExpandAll?: boolean;
  showExpandAction?: boolean;
  expandAllText?: ReactNode;
  collapseAllText?: ReactNode;
  reloadText?: ReactNode;
  extra?: ReactNode;
  searchProps?: Omit<InputProps, 'className' | 'disabled' | 'onChange' | 'style' | 'value'>;
  treeProps?: Omit<
    TreeProps,
    | 'className'
    | 'disabled'
    | 'expandedKeys'
    | 'onExpand'
    | 'onSelect'
    | 'selectedKeys'
    | 'style'
    | 'treeData'
  >;
  emptyProps?: Omit<EmptyProps, 'className' | 'description' | 'image' | 'style'>;
  reloadButtonProps?: Omit<ButtonProps, 'disabled' | 'loading' | 'onClick'>;
  expandButtonProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
  extraSpaceProps?: Omit<SpaceProps, 'children' | 'className' | 'style'>;
  onChange?: (value: TValue, item: TrueAdminTreeFilterItem<TValue>) => void;
  onReload?: () => void;
};

export declare function TrueAdminTreeFilter<TValue extends TrueAdminTreeFilterValue>(
  props: TrueAdminTreeFilterProps<TValue>,
): ReactElement | null;
