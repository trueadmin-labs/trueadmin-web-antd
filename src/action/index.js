import { DownOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Popconfirm, Space } from 'antd';
import { cloneElement, isValidElement, useState } from 'react';
import { jsx } from 'react/jsx-runtime';

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

const isPopconfirmProps = (confirm) =>
  Boolean(confirm && typeof confirm === 'object' && !('type' in confirm));

export function TrueAdminActionBar({
  actions = [],
  children,
  className,
  style,
  classNames,
  styles,
  max,
  moreText,
  moreButtonProps,
  dropdownProps,
  spaceProps,
}) {
  const visibleActions = actions.filter((action) => action.visible !== false);
  const primaryActions = max === undefined ? visibleActions : visibleActions.slice(0, max);
  const moreActions = max === undefined ? [] : visibleActions.slice(max);

  return jsx(Space, {
    size: 8,
    wrap: true,
    ...spaceProps,
    className: joinClassNames(
      'trueadmin-action-bar',
      classNames?.root,
      className,
      spaceProps?.className,
    ),
    style: { ...styles?.root, ...style, ...spaceProps?.style },
    children: [
      children,
      ...primaryActions.map(({ key, label, visible: _visible, ...buttonProps }) =>
        jsx(
          Button,
          {
            ...buttonProps,
            className: joinClassNames(
              'trueadmin-action-bar-item',
              classNames?.primary,
              buttonProps.className,
            ),
            style: { ...styles?.primary, ...buttonProps.style },
            children: label,
          },
          key,
        ),
      ),
      moreActions.length
        ? jsx(Dropdown, {
            trigger: ['click'],
            ...dropdownProps,
            menu: {
              ...dropdownProps?.menu,
              items: moreActions.map(
                ({ key, label, visible: _visible, onClick, disabled, danger }) => ({
                  key: String(key),
                  label,
                  disabled,
                  danger,
                  onClick: onClick
                    ? (event) => {
                        onClick(event);
                      }
                    : undefined,
                }),
              ),
            },
            children: jsx(Button, {
              ...moreButtonProps,
              className: joinClassNames(
                'trueadmin-action-bar-more',
                classNames?.more,
                moreButtonProps?.className,
              ),
              icon: moreButtonProps?.icon ?? jsx(DownOutlined, {}),
              style: { ...styles?.more, ...moreButtonProps?.style },
              children: moreText,
            }),
          })
        : null,
    ],
  });
}

export function TrueAdminConfirmAction({
  action,
  children,
  confirm,
  confirmProps,
  disabled,
  errorMessage,
  loading,
  successMessage,
  trigger,
  onError,
  onSuccess,
  ...buttonProps
}) {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const mergedLoading = loading ?? innerLoading;
  const mergedDisabled = disabled || mergedLoading;

  const runAction = async () => {
    if (!action) {
      setOpen(false);
      return;
    }

    setInnerLoading(true);
    try {
      await action({ close: () => setOpen(false) });
      setOpen(false);
      if (successMessage) {
        message.success(successMessage);
      }
      onSuccess?.();
    } catch (error) {
      if (errorMessage) {
        message.error(errorMessage);
      }
      onError?.(error);
    } finally {
      setInnerLoading(false);
    }
  };

  const renderTrigger = (onClick) => {
    if (trigger) {
      return cloneElement(trigger, {
        disabled: mergedDisabled || trigger.props.disabled,
        onClick: (event) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) {
            onClick?.(event);
          }
        },
      });
    }

    return jsx(Button, {
      ...buttonProps,
      disabled,
      loading: mergedLoading,
      onClick,
      children,
    });
  };

  if (!confirm) {
    return renderTrigger(() => {
      void runAction();
    });
  }

  const triggerNode = renderTrigger();
  const mergedConfirmProps = isPopconfirmProps(confirm)
    ? { ...confirmProps, ...confirm }
    : { ...confirmProps, title: confirm };

  return jsx(Popconfirm, {
    ...mergedConfirmProps,
    disabled: mergedDisabled || mergedConfirmProps.disabled,
    okButtonProps: { loading: mergedLoading, ...mergedConfirmProps.okButtonProps },
    open,
    onCancel: (event) => {
      setOpen(false);
      mergedConfirmProps.onCancel?.(event);
    },
    onConfirm: (event) => {
      void runAction();
      mergedConfirmProps.onConfirm?.(event);
    },
    onOpenChange: (nextOpen) => {
      if (!mergedDisabled) {
        setOpen(nextOpen);
      }
      mergedConfirmProps.onOpenChange?.(nextOpen);
    },
    children: isValidElement(triggerNode) ? triggerNode : jsx('span', { children: triggerNode }),
  });
}
