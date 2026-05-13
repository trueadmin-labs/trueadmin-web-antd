import './style.css';
import { Select, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

export const DEFAULT_SEARCH_DELAY = 300;
export const DEFAULT_PAGE_SIZE = 20;

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

export const toRemoteSelectValueArray = (value) => {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

export const toRemoteSelectValueKey = (value) => String(value);

function RemoteSelectNotFoundContent({ className, emptyText, loading, loadingText, style }) {
  if (!loading) {
    return emptyText;
  }

  return jsxs('div', {
    className: joinClassNames('trueadmin-remote-select-loading', className),
    style,
    children: [
      jsx(Spin, { size: 'small' }),
      loadingText ? jsx('span', { children: loadingText }) : null,
    ],
  });
}

function useRemoteSelectRecords({
  autoLoad = false,
  defaultKeyword = '',
  defaultOptions = [],
  defaultValue,
  fetchByValues,
  fetchOptions,
  onLoadOptionsError,
  onLoadOptionsSuccess,
  pageSize,
  searchDelay,
  value,
}) {
  const requestIdRef = useRef(0);
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [searchSeed, setSearchSeed] = useState(autoLoad ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(defaultOptions);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const emitError = useCallback(
    (error) => {
      onLoadOptionsError?.(error);
    },
    [onLoadOptionsError],
  );

  const loadOptions = useCallback(
    async (nextKeyword) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setLoading(true);
      try {
        const nextRecords = await fetchOptions({
          keyword: nextKeyword,
          page: 1,
          pageSize,
        });
        if (requestIdRef.current === requestId) {
          setRecords(nextRecords);
          onLoadOptionsSuccess?.(nextRecords);
        }
      } catch (error) {
        if (requestIdRef.current === requestId) {
          emitError(error);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [emitError, fetchOptions, onLoadOptionsSuccess, pageSize],
  );

  const search = useCallback((nextKeyword) => {
    setKeyword(nextKeyword);
    setSearchSeed((seed) => seed + 1);
  }, []);

  useEffect(() => {
    if (searchSeed === 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      void loadOptions(keyword);
    }, searchDelay);

    return () => window.clearTimeout(timer);
  }, [keyword, loadOptions, searchDelay, searchSeed]);

  useEffect(() => {
    const values = toRemoteSelectValueArray(value ?? defaultValue);
    if (!fetchByValues || values.length === 0) {
      setSelectedRecords((currentRecords) => (currentRecords.length === 0 ? currentRecords : []));
      return;
    }

    let disposed = false;
    fetchByValues(values)
      .then((nextRecords) => {
        if (!disposed) {
          setSelectedRecords(nextRecords);
        }
      })
      .catch((error) => {
        if (!disposed) {
          emitError(error);
        }
      });

    return () => {
      disposed = true;
    };
  }, [defaultValue, emitError, fetchByValues, value]);

  return {
    keyword,
    loadOptions,
    loading,
    records,
    search,
    selectedRecords,
  };
}

function useRemoteSelectOptions({
  getDisabled,
  getLabel,
  getValue,
  optionRender,
  records,
  selectedOptions = [],
  selectedRecords,
}) {
  const recordMap = useMemo(() => {
    const map = new Map();
    for (const record of [...records, ...selectedRecords, ...selectedOptions]) {
      map.set(toRemoteSelectValueKey(getValue(record)), record);
    }
    return map;
  }, [getValue, records, selectedOptions, selectedRecords]);

  const options = useMemo(
    () =>
      [...recordMap.values()].map((record) => {
        const nextValue = getValue(record);
        return {
          disabled: getDisabled?.(record),
          label: optionRender?.(record) ?? getLabel(record),
          value: nextValue,
        };
      }),
    [getDisabled, getLabel, getValue, optionRender, recordMap],
  );

  return { options, recordMap };
}

export function TrueAdminRemoteSelect({
  defaultKeyword = '',
  defaultOptions = [],
  emptyText,
  autoLoad = false,
  fetchByValues,
  fetchOptions,
  getDisabled,
  getLabel,
  getValue,
  loadingText,
  multiple,
  onChange,
  onLoadOptionsError,
  onLoadOptionsSuccess,
  notFoundContentClassName,
  notFoundContentRender,
  notFoundContentStyle,
  optionRender,
  selectedOptions = [],
  pageSize = DEFAULT_PAGE_SIZE,
  searchDelay = DEFAULT_SEARCH_DELAY,
  searchOnFocus = true,
  value,
  defaultValue,
  ...selectProps
}) {
  const { keyword, loadOptions, loading, records, search, selectedRecords } =
    useRemoteSelectRecords({
      autoLoad,
      defaultKeyword,
      defaultOptions,
      defaultValue,
      fetchByValues,
      fetchOptions,
      onLoadOptionsError,
      onLoadOptionsSuccess,
      pageSize,
      searchDelay,
      value,
    });
  const { options, recordMap } = useRemoteSelectOptions({
    getDisabled,
    getLabel,
    getValue,
    optionRender,
    records,
    selectedOptions,
    selectedRecords,
  });

  const handleChange = (nextValue) => {
    if (multiple) {
      const nextValues = Array.isArray(nextValue) ? nextValue : [];
      const nextRecords = nextValues
        .map((item) => recordMap.get(toRemoteSelectValueKey(item)))
        .filter(Boolean);
      onChange?.(nextValues, nextRecords);
      return;
    }

    const nextSingleValue = nextValue;
    const nextRecord =
      nextSingleValue === undefined
        ? undefined
        : recordMap.get(toRemoteSelectValueKey(nextSingleValue));
    onChange?.(nextSingleValue, nextRecord);
  };

  return jsx(Select, {
    ...selectProps,
    defaultValue,
    filterOption: false,
    loading,
    mode: multiple ? 'multiple' : undefined,
    notFoundContent: notFoundContentRender
      ? notFoundContentRender({ emptyText, loading, loadingText })
      : jsx(RemoteSelectNotFoundContent, {
          className: notFoundContentClassName,
          emptyText,
          loading,
          loadingText,
          style: notFoundContentStyle,
        }),
    options,
    showSearch: true,
    value,
    onChange: handleChange,
    onFocus: (event) => {
      selectProps.onFocus?.(event);
      if (searchOnFocus && records.length === 0) {
        void loadOptions(keyword);
      }
    },
    onSearch: search,
  });
}
