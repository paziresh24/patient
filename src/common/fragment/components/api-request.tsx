'use client';

import { CodeComponentMeta, useSelector } from '@plasmicapp/host';
import { forwardRef, ReactNode, useImperativeHandle, useMemo, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useCustomize from '@/common/hooks/useCustomize';

/**
 * روی سایت‌های اختصاصی (partner) همه‌ی درخواست‌های سرچ باید به همان دانشگاه/مرکز محدود شوند.
 * مسیرِ کدیِ سرچ این کار را با پارامترِ `university` انجام می‌دهد
 * (`apis/services/search/{search,suggestion}.ts`) ولی URLهای codegenِ Plasmic آن را ندارند و
 * دستی‌اضافه‌کردنشان با هر `plasmic sync` پاک می‌شود؛ پس این‌جا — تنها نقطه‌ی مشترکِ همه‌ی
 * آن fetchها — به‌صورتِ جنرال تزریق می‌شود.
 */
const UNIVERSITY_SCOPED_URL = /\/seapi\/v1\/(search|suggestion)|\/qs\/index\//;

type ApiRequestType = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  url: string;
  params: Record<string, string | string[]>;
  body?: Record<string, any>;
  config?: Record<string, any>;
  children: ReactNode;
  errorDisplay?: ReactNode;
  loadingDisplay?: ReactNode;
  previewErrorDisplay?: boolean;
  previewLoadingDisplay?: boolean;
  onError?: (error?: any) => void;
  onLoading?: (loading: boolean) => void;
  onSuccess?: (data: any) => void;
};

export const ApiRequest = forwardRef((props: ApiRequestType, ref): any => {
  const {
    method = 'GET',
    params,
    url,
    body,
    config,
    errorDisplay,
    loadingDisplay,
    children,
    previewErrorDisplay,
    previewLoadingDisplay,
    onError,
    onLoading,
    onSuccess,
  } = props;
  const fragmentConfig = useSelector('Fragment');
  const growthbookContext = useSelector('Growthbook');
  const growthbookReady = growthbookContext?.isReady ?? true;
  const partnerKey = useCustomize(state => state.customize?.partnerKey);

  const scopedParams = useMemo(() => {
    if (!partnerKey || typeof url !== 'string' || !UNIVERSITY_SCOPED_URL.test(url)) return params;
    if (params?.university || /[?&]university=/.test(url)) return params;
    return { ...(params ?? {}), university: partnerKey };
  }, [params, url, partnerKey]);

  const fetchProps = useMemo(
    () => ({
      method,
      url,
      params: scopedParams,
      body,
      config: {
        ...fragmentConfig?.apiConfig,
        ...fragmentConfig?.previewApiConfig,
        ...config,
      },
    }),
    [method, url, scopedParams, body, config, fragmentConfig?.apiConfig, fragmentConfig?.previewApiConfig],
  );

  const { data, isLoading, isInitialLoading, isError, refetch } = useQuery(
    [method, url, scopedParams, body, config, fragmentConfig?.apiConfig, fragmentConfig?.previewApiConfig, growthbookReady],
    () => reuqestFn(fetchProps),
    {
      onError(err) {
        onLoading?.(false);
        if (axios.isAxiosError(err)) {
          onError?.(err.response?.data);
        }
      },
      onSuccess(data) {
        onLoading?.(false);
        onSuccess?.(data?.data);
      },
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        refresh: () => {
          return refetch();
        },
      };
    },
    [],
  );

  const reuqestFn = async ({ method, url, params, body, config }: any) => {
    onLoading?.(true);
    onError?.(null);
    onSuccess?.(null);
    const isKatibeWalletBalance =
      typeof url === 'string' &&
      ((url.includes('apigw.paziresh24.com') && url.includes('/katibe/v1/transactions/balance/p24')) ||
        (url.includes('katibe-api.paziresh24.com') && url.includes('/v1/transactions/balance/p24')));
    const axiosConfig = {
      ...config,
      ...(isKatibeWalletBalance ? { withCredentials: true } : {}),
    };
    if (method === 'GET') {
      return await axios.get(url, {
        params,
        ...axiosConfig,
      });
    }
    if (method === 'DELETE') {
      return await axios.delete(url, {
        params,
        data: {
          ...body,
        },
        ...axiosConfig,
      });
    }
    return await axios[method.toLowerCase() as 'post' | 'delete' | 'put' | 'patch'](url, body, {
      params,
      ...axiosConfig,
    });
  };

  if ((isInitialLoading || isLoading || previewLoadingDisplay) && loadingDisplay != null) {
    return loadingDisplay;
  }

  if ((isError || previewErrorDisplay) && errorDisplay != null) {
    return errorDisplay;
  }

  return children;
});

export const apiRequestMeta: CodeComponentMeta<ApiRequestType> = {
  name: 'ApiRequest',
  displayName: 'Fragment/ApiRequest',
  importPath: '@/common/fragment/components/api-request',
  figmaMappings: [{ figmaComponentName: 'ApiRequest' }],
  props: {
    method: {
      type: 'choice',
      options: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
      defaultValueHint: 'GET',
      defaultValue: 'GET',
    },
    url: {
      displayName: 'URL',
      type: 'string',
      defaultValueHint: '/api/v1/users',
      required: true,
    },
    params: {
      displayName: 'Query Params',
      type: 'object',
      description: `e.g. { id: 20 }`,
      helpText: 'It will append this to the end of the URL as ?key=value.',
    },
    body: {
      displayName: 'Body',
      type: 'object',
      description: `e.g. { id: 20 }`,
      hidden: ps => ps.method == 'GET',
    },
    config: {
      displayName: 'Request Config',
      type: 'object',
      description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
      helpText: 'Read about request configuration options at https://axios-http.com/docs/req_config',
    },
    previewLoadingDisplay: {
      displayName: 'Preview Loading Display',
      type: 'boolean',
      editOnly: true,
    },
    previewErrorDisplay: {
      displayName: 'Preview Error Display',
      type: 'boolean',
      editOnly: true,
    },
    children: { displayName: 'Children', type: 'slot' },
    loadingDisplay: {
      displayName: 'Loading Display',
      type: 'slot',
      defaultValue: [
        {
          type: 'text',
          value: 'Loading...',
        },
      ],
    },
    errorDisplay: {
      displayName: 'Error Display',
      type: 'slot',
      defaultValue: [
        {
          type: 'text',
          value: 'Error fetching data',
        },
      ],
    },
    onSuccess: {
      type: 'eventHandler',
      argTypes: [
        {
          name: 'data',
          type: 'object',
        },
      ],
    },
    onError: {
      type: 'eventHandler',
      argTypes: [
        {
          name: 'error',
          type: 'object',
        },
      ],
    },
    onLoading: {
      type: 'eventHandler',
      argTypes: [
        {
          name: 'loading',
          type: 'boolean',
        },
      ],
    },
  },
  refActions: {
    refresh: {
      argTypes: [],
      displayName: 'Refresh Data',
    },
  },
  classNameProp: 'className',
  states: {
    data: {
      type: 'readonly',
      variableType: 'object',
      onChangeProp: 'onSuccess',
    },
    error: {
      type: 'readonly',
      variableType: 'object',
      onChangeProp: 'onError',
    },
    loading: {
      type: 'readonly',
      variableType: 'boolean',
      onChangeProp: 'onLoading',
    },
  },
};
