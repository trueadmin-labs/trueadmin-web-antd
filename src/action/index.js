import './style.css';
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
  const { message, modal } = App.useApp();
  const visibleActions = actions.filter((action) => action.visible !== false);
  const primaryActions = max === undefined ? visibleActions : visibleActions.slice(0, max);
  const moreActions = max === undefined ? [] : visibleActions.slice(max);

  const runAction = async (action, event) => {
    try {
      await action.onClick?.(event);
      if (action.successMessage) {
        message.success(action.successMessage);
      }
      action.onSuccess?.();
    } catch (error) {
      if (action.errorMessage) {
        message.error(action.errorMessage);
      }
      action.onError?.(error);
    }
  };

  const confirmAction = (action, event) => {
    const mergedConfirmProps = isPopconfirmProps(action.confirm)
      ? { ...action.confirmProps, ...action.confirm }
      : { ...action.confirmProps, title: action.confirm };

    modal.confirm({
      ...mergedConfirmProps,
      onOk: async (...args) => {
        await runAction(action, event);
        return mergedConfirmProps.onOk?.(...args);
      },
    });
  };

  const clickAction = (action, event) => {
    if (action.confirm) {
      confirmAction(action, event);
      return;
    }

    void runAction(action, event);
  };

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
      ...primaryActions.map(
        ({
          key,
          label,
          visible: _visible,
          confirm,
          confirmProps,
          errorMessage,
          successMessage,
          onError,
          onSuccess,
          onClick,
          ...buttonProps
        }) =>
          confirm
            ? jsx(
                TrueAdminConfirmAction,
                {
                  ...buttonProps,
                  action: async () => {
                    await runAction(
                      {
                        key,
                        label,
                        confirm,
                        confirmProps,
                        errorMessage,
                        successMessage,
                        onError,
                        onSuccess,
                        onClick,
                      },
                      undefined,
                    );
                  },
                  className: joinClassNames(
                    'trueadmin-action-bar-item',
                    classNames?.primary,
                    buttonProps.className,
                  ),
                  confirm,
                  confirmProps,
                  errorMessage: false,
                  successMessage: false,
                  style: { ...styles?.primary, ...buttonProps.style },
                  children: label,
                },
                key,
              )
            : jsx(
                Button,
                {
                  ...buttonProps,
                  className: joinClassNames(
                    'trueadmin-action-bar-item',
                    classNames?.primary,
                    buttonProps.className,
                  ),
                  onClick: (event) => clickAction({ key, label, onClick, successMessage, errorMessage, onSuccess, onError }, event),
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
                ({
                  key,
                  label,
                  visible: _visible,
                  onClick,
                  disabled,
                  danger,
                  icon,
                  confirm,
                  confirmProps,
                  errorMessage,
                  successMessage,
                  onError,
                  onSuccess,
                }) => ({
                  key: String(key),
                  label,
                  disabled,
                  danger,
                  icon,
                  onClick: onClick
                    ? (event) => {
                        clickAction(
                          {
                            key,
                            label,
                            confirm,
                            confirmProps,
                            errorMessage,
                            successMessage,
                            onError,
                            onSuccess,
                            onClick,
                          },
                          event,
                        );
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
      disabled: mergedDisabled,
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
