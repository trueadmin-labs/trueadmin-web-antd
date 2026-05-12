import type { ButtonProps, DropdownProps, MenuProps, PopconfirmProps, SpaceProps } from 'antd';
import type { CSSProperties, Key, MouseEvent, ReactElement, ReactNode } from 'react';

export type TrueAdminActionItem = Omit<ButtonProps, 'children' | 'onClick'> & {
  key: Key;
  label: ReactNode;
  visible?: boolean;
  onClick?: (
    event: MouseEvent<HTMLElement> | Parameters<NonNullable<MenuProps['onClick']>>[0],
  ) => void;
};

export type TrueAdminActionBarClassNames = {
  root?: string;
  primary?: string;
  more?: string;
};

export type TrueAdminActionBarStyles = {
  root?: CSSProperties;
  primary?: CSSProperties;
  more?: CSSProperties;
};

export type TrueAdminActionBarProps = {
  actions?: TrueAdminActionItem[];
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  classNames?: TrueAdminActionBarClassNames;
  styles?: TrueAdminActionBarStyles;
  max?: number;
  moreText?: ReactNode;
  moreButtonProps?: Omit<ButtonProps, 'children'>;
  dropdownProps?: Omit<DropdownProps, 'children'>;
  spaceProps?: Omit<SpaceProps, 'children'>;
};

export declare function TrueAdminActionBar(props: TrueAdminActionBarProps): ReactElement | null;

export type TrueAdminConfirmActionContext = {
  close: () => void;
};

export type TrueAdminConfirmActionTriggerProps = {
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export type TrueAdminConfirmActionProps = Omit<
  ButtonProps,
  'children' | 'loading' | 'onClick'
> & {
  action?: (context: TrueAdminConfirmActionContext) => void | Promise<void>;
  children?: ReactNode;
  confirm?: ReactNode | PopconfirmProps;
  confirmProps?: Omit<PopconfirmProps, 'children' | 'onConfirm' | 'open' | 'title'>;
  errorMessage?: ReactNode | false;
  loading?: boolean;
  successMessage?: ReactNode | false;
  trigger?: ReactElement<TrueAdminConfirmActionTriggerProps>;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
};

export declare function TrueAdminConfirmAction(
  props: TrueAdminConfirmActionProps,
): ReactElement | null;
