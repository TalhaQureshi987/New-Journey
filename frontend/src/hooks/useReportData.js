import { useMemo } from 'react';

export const useReportData = (rawData) => {
    return useMemo(() => {
        if (!rawData || !rawData.data) return null;

        const data = rawData.data;

        // Extract overview data with safe fallbacks
        const overview = {
            users: {
                total: data && data.overview && data.overview.users ? data.overview.users.total : 0,
                active: data && data.overview && data.overview.users ? data.overview.users.active : 0,
                inactive: data && data.overview && data.overview.users ? data.overview.users.inactive : 0,
                growth: data && data.overview && data.overview.users ? data.overview.users.growth : 0
            },
            jobs: {
                total: data && data.overview && data.overview.jobs ? data.overview.jobs.total : 0,
                active: data && data.overview && data.overview.jobs ? data.overview.jobs.active : 0,
                growth: data && data.overview && data.overview.jobs ? data.overview.jobs.growth : 0
            },
            companies: {
                total: data && data.overview && data.overview.companies ? data.overview.companies.total : 0,
                active: data && data.overview && data.overview.companies ? data.overview.companies.active : 0,
                inactive: data && data.overview && data.overview.companies ? data.overview.companies.inactive : 0,
                growth: data && data.overview && data.overview.companies ? data.overview.companies.growth : 0
            }
        };

        // Extract time series data with safe fallbacks
        const timeSeriesData = {
            users: (data && data.timeSeriesData && data.timeSeriesData.users ? data.timeSeriesData.users : []).map(item => ({
                date: new Date(item.date).toLocaleDateString(),
                value: item.value || 0
            })),
            jobs: (data && data.timeSeriesData && data.timeSeriesData.jobs ? data.timeSeriesData.jobs : []).map(item => ({
                date: new Date(item.date).toLocaleDateString(),
                value: item.value || 0
            })),
            companies: (data && data.timeSeriesData && data.timeSeriesData.companies ? data.timeSeriesData.companies : []).map(item => ({
                date: new Date(item.date).toLocaleDateString(),
                value: item.value || 0
            }))
        };

        // Extract stats with safe fallbacks
        const userStats = {
            active: data && data.userStats ? data.userStats.active : 0,
            inactive: data && data.userStats ? data.userStats.inactive : 0
        };

        const companyStats = {
            active: data && data.companyStats ? data.companyStats.active : 0,
            inactive: data && data.companyStats ? data.companyStats.inactive : 0
        };

        return {
            overview,
            timeSeriesData,
            userStats,
            companyStats
        };
    }, [rawData]);
};