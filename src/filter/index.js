import './style.css';
import { CaretDownOutlined, CaretUpOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Segmented, Space, Tag, Tooltip, Tree, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

const toCountText = (count) => {
  if (!count || count <= 0) {
    return 0;
  }

  return count > 99 ? '99+' : count;
};

export function TrueAdminQuickFilter({
  className,
  style,
  classNames,
  styles,
  title,
  mode = 'inline',
  value,
  items,
  loading,
  disabled,
  extra,
  segmentedProps,
  onChange,
}) {
  const options = items.map((item) => ({
    disabled: disabled || loading || item.disabled,
    label: jsxs('span', {
      className: joinClassNames('trueadmin-quick-filter-option', classNames?.option),
      style: styles?.option,
      children: [
        item.icon
          ? jsx('span', {
              className: joinClassNames(
                'trueadmin-quick-filter-option-icon',
                classNames?.optionIcon,
              ),
              style: styles?.optionIcon,
              children: item.icon,
            })
          : null,
        jsx('span', {
          className: joinClassNames('trueadmin-quick-filter-option-label', classNames?.optionLabel),
          style: styles?.optionLabel,
          children: item.label,
        }),
        toCountText(item.count)
          ? jsx(Tag, {
              className: joinClassNames(
                'trueadmin-quick-filter-option-count',
                classNames?.optionCount,
              ),
              style: styles?.optionCount,
              children: toCountText(item.count),
            })
          : null,
      ],
    }),
    value: item.value,
  }));

  return jsxs('div', {
    className: joinClassNames(
      'trueadmin-quick-filter',
      `is-${mode}`,
      classNames?.root,
      className,
    ),
    style: { ...styles?.root, ...style },
    children: [
      title || extra
        ? jsxs('div', {
            className: joinClassNames('trueadmin-quick-filter-header', classNames?.header),
            style: styles?.header,
            children: [
              title ? jsx(Typography.Text, { strong: true, children: title }) : jsx('span', {}),
              extra
                ? jsx('div', {
                    className: joinClassNames(
                      'trueadmin-quick-filter-extra',
                      classNames?.extra,
                    ),
                    style: styles?.extra,
                    children: extra,
                  })
                : null,
            ],
          })
        : null,
      jsx(Segmented, {
        ...segmentedProps,
        block: segmentedProps?.block ?? mode === 'block',
        className: joinClassNames(
          'trueadmin-quick-filter-segmented',
          classNames?.segmented,
          segmentedProps?.className,
        ),
        options,
        style: { ...styles?.segmented, ...segmentedProps?.style },
        value,
        onChange: (nextValue) => onChange?.(nextValue),
      }),
    ],
  });
}

const toKey = (value) => String(value);

const toPlainText = (value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
};

const normalizeKeyword = (value) => value.trim().toLowerCase();

const findItem = (items, key) => {
  for (const item of items) {
    if (toKey(item.value) === key) {
      return item;
    }

    const matchedChild = item.children ? findItem(item.children, key) : undefined;
    if (matchedChild) {
      return matchedChild;
    }
  }

  return undefined;
};

const getExpandedKeys = (items) =>
  items.flatMap((item) => [
    toKey(item.value),
    ...(item.children ? getExpandedKeys(item.children) : []),
  ]);

const filterItems = (items, keyword) => {
  if (!keyword) {
    return items;
  }

  return items.reduce((result, item) => {
    const searchText = `${item.searchText ?? ''} ${toPlainText(item.label)}`.toLowerCase();
    const filteredChildren = item.children ? filterItems(item.children, keyword) : undefined;

    if (searchText.includes(keyword) || (filteredChildren && filteredChildren.length > 0)) {
      result.push({ ...item, children: filteredChildren });
    }

    return result;
  }, []);
};

const toTreeData = (items, classNames, styles) =>
  items.map((item) => ({
    children: item.children ? toTreeData(item.children, classNames, styles) : undefined,
    disabled: item.disabled,
    key: toKey(item.value),
    selectable: item.selectable,
    title: jsxs('span', {
      className: joinClassNames('trueadmin-tree-filter-node', classNames?.node),
      style: styles?.node,
      children: [
        item.icon
          ? jsx('span', {
              className: joinClassNames('trueadmin-tree-filter-node-icon', classNames?.nodeIcon),
              style: styles?.nodeIcon,
              children: item.icon,
            })
          : null,
        jsx('span', {
          className: joinClassNames('trueadmin-tree-filter-node-label', classNames?.nodeLabel),
          style: styles?.nodeLabel,
          children: item.label,
        }),
      ],
    }),
  }));

export function TrueAdminTreeFilter({
  className,
  style,
  classNames,
  styles,
  title,
  value,
  items,
  placeholder,
  emptyText,
  disabled,
  loading,
  defaultExpandAll = true,
  showExpandAction = true,
  expandAllText = '展开全部',
  collapseAllText = '收起全部',
  reloadText = '刷新',
  extra,
  emptyProps,
  expandButtonProps,
  extraSpaceProps,
  reloadButtonProps,
  searchProps,
  treeProps,
  onChange,
  onReload,
}) {
  const [keyword, setKeyword] = useState('');
  const normalizedKeyword = normalizeKeyword(keyword);
  const filteredItems = useMemo(
    () => filterItems(items, normalizedKeyword),
    [items, normalizedKeyword],
  );
  const treeData = useMemo(
    () => toTreeData(filteredItems, classNames, styles),
    [classNames, filteredItems, styles],
  );
  const allExpandedKeys = useMemo(() => getExpandedKeys(filteredItems), [filteredItems]);
  const [expandedKeys, setExpandedKeys] = useState(() =>
    defaultExpandAll ? getExpandedKeys(items) : [],
  );
  const visibleExpandedKeys = normalizedKeyword ? allExpandedKeys : expandedKeys;
  const selectedKeys = value === undefined ? [] : [toKey(value)];
  const visibleExpandedKeySet = new Set(visibleExpandedKeys);
  const isAllExpanded = allExpandedKeys.every((key) => visibleExpandedKeySet.has(key));

  return jsxs('div', {
    className: joinClassNames('trueadmin-tree-filter', classNames?.root, className),
    style: { ...styles?.root, ...style },
    children: [
      title || extra || onReload || showExpandAction
        ? jsxs('div', {
            className: joinClassNames('trueadmin-tree-filter-header', classNames?.header),
            style: styles?.header,
            children: [
              title ? jsx(Typography.Text, { strong: true, children: title }) : jsx('span', {}),
              jsxs(Space, {
                ...extraSpaceProps,
                className: joinClassNames(
                  'trueadmin-tree-filter-extra',
                  classNames?.extra,
                  extraSpaceProps?.className,
                ),
                size: extraSpaceProps?.size ?? 4,
                style: { ...styles?.extra, ...extraSpaceProps?.style },
                children: [
                  onReload
                    ? jsx(Tooltip, {
                        title: reloadText,
                        children: jsx(Button, {
                          ...reloadButtonProps,
                          disabled: disabled || loading || reloadButtonProps?.disabled,
                          icon: reloadButtonProps?.icon ?? jsx(ReloadOutlined, {}),
                          loading,
                          size: reloadButtonProps?.size ?? 'small',
                          type: reloadButtonProps?.type ?? 'text',
                          onClick: onReload,
                        }),
                      })
                    : null,
                  showExpandAction
                    ? jsx(Tooltip, {
                        title: isAllExpanded ? collapseAllText : expandAllText,
                        children: jsx(Button, {
                          ...expandButtonProps,
                          disabled:
                            disabled ||
                            loading ||
                            allExpandedKeys.length === 0 ||
                            expandButtonProps?.disabled,
                          icon:
                            expandButtonProps?.icon ??
                            (isAllExpanded ? jsx(CaretUpOutlined, {}) : jsx(CaretDownOutlined, {})),
                          size: expandButtonProps?.size ?? 'small',
                          type: expandButtonProps?.type ?? 'text',
                          onClick: () =>
                            setExpandedKeys(isAllExpanded ? [] : getExpandedKeys(items)),
                        }),
                      })
                    : null,
                  extra,
                ],
              }),
            ],
          })
        : null,
      jsx(Input.Search, {
        ...searchProps,
        allowClear: searchProps?.allowClear ?? true,
        className: joinClassNames(
          'trueadmin-tree-filter-search',
          classNames?.search,
          searchProps?.className,
        ),
        disabled: disabled || searchProps?.disabled,
        placeholder,
        style: { ...styles?.search, ...searchProps?.style },
        value: keyword,
        onChange: (event) => {
          setKeyword(event.target.value);
          searchProps?.onChange?.(event);
        },
      }),
      treeData.length > 0
        ? jsx(Tree, {
            ...treeProps,
            blockNode: treeProps?.blockNode ?? true,
            className: joinClassNames(
              'trueadmin-tree-filter-tree',
              classNames?.tree,
              treeProps?.className,
            ),
            disabled: disabled || loading || treeProps?.disabled,
            expandedKeys: visibleExpandedKeys,
            selectedKeys,
            style: { ...styles?.tree, ...treeProps?.style },
            treeData,
            onExpand: (keys, info) => {
              setExpandedKeys(keys.map(String));
              treeProps?.onExpand?.(keys, info);
            },
            onSelect: (keys, info) => {
              const nextKey = keys[0];
              if (nextKey === undefined) {
                treeProps?.onSelect?.(keys, info);
                return;
              }

              const nextItem = findItem(items, String(nextKey));
              if (nextItem) {
                onChange?.(nextItem.value, nextItem);
              }
              treeProps?.onSelect?.(keys, info);
            },
          })
        : jsx(Empty, {
            ...emptyProps,
            className: joinClassNames(
              'trueadmin-tree-filter-empty',
              classNames?.empty,
              emptyProps?.className,
            ),
            image: emptyProps?.image ?? Empty.PRESENTED_IMAGE_SIMPLE,
            description: emptyProps?.description ?? emptyText,
            style: { ...styles?.empty, ...emptyProps?.style },
          }),
    ],
  });
}
