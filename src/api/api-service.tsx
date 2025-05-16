// lib/api/apiService.ts
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token and log request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Log response and error
api.interceptors.response.use(
    (response) => {
        console.debug('[RESPONSE]', response);
        return response;
    },
    (error) => {
        console.error('[ERROR]', error?.response ?? error);
        return Promise.reject(error?.response ?? error);
    }
);

export const ApiService = {
    get: <T = any>(
        endpoint: string,
        params?: Record<string, any>,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => api.get(endpoint, { params, ...config }),

    post: <T = any>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => api.post(endpoint, data, config),

    put: <T = any>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => api.put(endpoint, data, config),

    delete: <T = any>(
        endpoint: string,
        params?: Record<string, any>,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => api.delete(endpoint, { params, ...config }),
};

/* eslint-enable @typescript-eslint/no-explicit-any */