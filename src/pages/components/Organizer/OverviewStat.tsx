import React, { useState, useEffect } from 'react'
import type { QuickStats, OverviewData } from './Events/type';
import { Activity, DollarSign, Users, School } from 'lucide-react';
import StatMatricCard from './StatMatricCard';
import apiRequest from '../../../utils/apiRequest';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    name: string;
    role: string;
    exp: number;
}

function OverviewStat() {
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No auth token found in localStorage');
                setOverviewData(null);
                return;
            }

            let userId: number | null = null;
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                userId = decoded.id;
            } catch (err) {
                console.error('Failed to decode JWT token:', err);
                setOverviewData(null);
                return;
            }

            if (!userId) {
                console.error('User ID not found in decoded token');
                setOverviewData(null);
                return;
            }

            const data = await apiRequest<OverviewData>(`/api/events/overview/${userId}`);
            setOverviewData(data);
        } catch (error) {
            console.error('Error fetching overview data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-200 animate-pulse rounded-lg p-6 h-32"></div>
                ))}
            </div>
        );
    }

    if (!overviewData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center text-red-500">Error loading data</div>
            </div>
        );
    }

    const isSchoolAdmin = overviewData.userRole === 'SCHOOL_ADMIN';
    
    const quickStats: QuickStats[] = [
        {
            label: 'Total Revenue',
            value: formatAmount(overviewData.platformStats.totalRevenue ?? 0),
            change: overviewData.quickStats[0]?.change ?? 0,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'text-green-600',
            bgGradient: 'from-green-400 to-emerald-900'
        },
        {
            label: 'Active Events',
            value: (overviewData.platformStats.activeEvents ?? 0).toString(),
            change: overviewData.quickStats[1]?.change ?? 0,
            icon: <Activity className="w-6 h-6" />,
            color: 'text-purple-600',
            bgGradient: 'from-purple-400 to-indigo-600'
        },
        {
            label: isSchoolAdmin ? 'School Contributors' : 'Total Contributors',
            value: (overviewData.platformStats.totalContributors ?? 0).toLocaleString(),
            change: overviewData.quickStats[2]?.change ?? 0,
            icon: isSchoolAdmin ? <School className="w-6 h-6" /> : <Users className="w-6 h-6" />,
            color: isSchoolAdmin ? 'text-orange-600' : 'text-blue-600',
            bgGradient: isSchoolAdmin ? 'from-orange-400 to-orange-600' : 'from-blue-400 to-blue-600'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickStats.map((stat, index) => (
                <StatMatricCard
                    key={stat.label}
                    index={index}
                    label={stat.label ?? ''}
                    value={stat.value ?? ''}
                    change={stat.change ?? 0}
                    icon={stat.icon}
                    bgGradient={stat.bgGradient ?? ''}
                />
            ))}
        </div>
    );
}

export default OverviewStat;