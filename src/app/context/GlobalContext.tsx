// app/context/GlobalContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ApiService } from '@/api/api-service';
import { ApiEndpoints } from '@/api/endpoints';
import { SiteLocation } from '../(auth)/login/page';

type GlobalContextType = {
    sites: SiteLocation[];
    isLoading: boolean;
    errorMessage: string;
    refreshSites: () => void;
    carouselImages: string[];
    refreshCarousel: () => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [sites, setSites] = useState<SiteLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [carouselImages, setCarouselImages] = useState<string[]>([]);

    const getSiteLocations = async () => {
        setIsLoading(true);
        try {
            const response = await ApiService.get(ApiEndpoints.SITELOCATION);
            if (response?.data?.data) {
                setSites(response.data.data);
                setErrorMessage('');
            } else {
                setErrorMessage('Site Location not found');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to load site locations');
        } finally {
            setIsLoading(false);
        }
    };

    const getCarouselImages = async () => {
        try {
            const response = await ApiService.get(ApiEndpoints.GLOBAL_SETTING);
            const list = response?.data?.data?.['Carousel-List'] ?? [];
            setCarouselImages(list);
        } catch (error) {
            console.error('Failed to fetch carousel images', error);
        }
    };

    useEffect(() => {
        getSiteLocations();
        getCarouselImages();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                sites,
                isLoading,
                errorMessage,
                refreshSites: getSiteLocations,
                carouselImages,
                refreshCarousel: getCarouselImages,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error('useGlobalContext must be used within GlobalProvider');
    return context;
};
