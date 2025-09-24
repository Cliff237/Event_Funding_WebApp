import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowUpRight, School, User } from 'lucide-react';
import type { RecentEvent } from './Events/type';
import apiRequest from '../../../utils/apiRequest';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    name: string;
    role: string;
    exp: number;
}

function OverviewRightSideBar() {
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentEvents();
    }, []);

    const fetchRecentEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No auth token found in localStorage');
                setRecentEvents([]);
                return;
            }

            let userId: number | null = null;
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                userId = decoded.id;
            } catch (err) {
                console.error('Failed to decode JWT token:', err);
                setRecentEvents([]);
                return;
            }

            if (!userId) {
                console.error('User ID not found in decoded token');
                setRecentEvents([]);
                return;
            }

            const data = await apiRequest<{ recentEvents: RecentEvent[] }>(`/api/events/overview/${userId}`);
            setRecentEvents(data.recentEvents || []);
        } catch (error) {
            console.error('Error fetching recent events:', error);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getOrganizerIcon = (organizerRole: string, isOwnEvent: boolean) => {
        if (isOwnEvent) return <User className="w-3 h-3" />;
        if (organizerRole === 'SCHOOL_ORGANIZER' || organizerRole === 'SCHOOL_ADMIN') {
            return <School className="w-3 h-3" />;
        }
        return <User className="w-3 h-3" />;
    };

    if (loading) {
        return (
            <div className="w-full md:w-80 bg-gradient-to-br from-purple-50 to-indigo-100 p-6 space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-200 animate-pulse rounded-lg p-4 h-20"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full md:w-80 bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Events
            </h3>
            
            <div className="space-y-3">
                {recentEvents.map((event) => (
                    <div key={event.id} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">
                                    {event.title}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        event.isOwnEvent 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {event.isOwnEvent ? 'Your Event' : 'School Event'}
                                    </span>
                                    {!event.isOwnEvent && (
                                        <span className="text-xs text-gray-500 flex items-center">
                                            {getOrganizerIcon(event.organizerRole, event.isOwnEvent)}
                                            <span className="ml-1">{event.organizerName}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                            <span className="capitalize">{event.status.toLowerCase()}</span>
                            <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-900">
                                {formatAmount(event.totalContributions)}
                            </span>
                            <span className="flex items-center text-gray-600">
                                <Users className="w-3 h-3 mr-1" />
                                {event.contributorCount}
                            </span>
                        </div>
                    </div>
                ))}
                
                {recentEvents.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                        No recent events found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default OverviewRightSideBar;