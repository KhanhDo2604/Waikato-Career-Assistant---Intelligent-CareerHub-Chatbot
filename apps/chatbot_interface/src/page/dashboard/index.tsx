/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import DatasetManagementTabs from './DatasetManagementTabs ';
import { useDashboard } from '../../hooks/useDashboard';
import type { MonthlyUserCount } from '../../constants/type/type';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

//  For how many days in a month
function getDaysInMonth(monthIndex: number, year: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
}

// To split the monthly total into different daily values
function buildDailyUserCounts(
    data: MonthlyUserCount[],
    selectedMonth: number | undefined,
    selectedYear: number,
): MonthlyUserCount[] {
    const days = selectedMonth !== undefined ? getDaysInMonth(selectedMonth, selectedYear) : 31;

    // Map backend data by day
    const map = new Map<number, MonthlyUserCount>();
    data.forEach((item) => {
        map.set(item.day, item);
    });

    // Build full array for the chart
    return Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        return (
            map.get(day) ?? {
                day,
                uniqueUsers: 0,
                totalInteractions: 0,
            }
        );
    });
}

function Dashboard() {
    const { dashboardState, dashboardActions } = useDashboard();
    const { questions, questionTypesMonthlyReport, usageChatBot, userInteractions, isLoading } = dashboardState;
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [dailyData, setDailyData] = useState<MonthlyUserCount[]>([]);

    const currentMonth = new Date().getMonth();

    const loadDashboardData = async () => {
        try {
            const year = selectedYear;
            const month = selectedMonth !== undefined ? selectedMonth + 1 : undefined;

            // Load all dashboard data
            await Promise.all([
                dashboardActions.getQuestionTypesMonthlyReport(year, month ?? 0),
                dashboardActions.getUsageChatBot(year, month ?? 0),
                dashboardActions.getUserInteractions(),
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear]);

    // Update daily data when usage data changes
    useEffect(() => {
        if (usageChatBot && usageChatBot.length > 0) {
            const daily = buildDailyUserCounts(usageChatBot, selectedMonth, selectedYear);
            setDailyData(daily);
        } else {
            setDailyData([]);
        }
    }, [usageChatBot, selectedMonth, selectedYear]);

        if (!questions || questions.length === 0) return;
    useEffect(() => {
        if (questions.length === 0) return;
      
        const grouped = questions.map(q => ({
          ...q,
          category:
            ['CV Help', 'Cover Letter'].includes(q.category ?? '')
              ? 'Applications'
              : ['Job Search', 'Internship'].includes(q.category ?? '')
              ? 'Employment'
              : 'Other',
            }));
    
    
    }, [questions]);

    const CATEGORIES = [
        'CV & Cover Letter',
        'Intersnships & Volunteering',
        'Job Search',
        'Career Guidance & Appointment',
        'Workshops & Events',
        "General",
    ]

    // access to QA_list.json --> modify "category" field to group similar question types, based on CATEGORIES array

    const questionTypesData = Object.entries(questionTypesMonthlyReport)
        .map(([name, value]) => ({
            name,
            value,
        }))
        .sort((a, b) => (b.value as any) - (a.value as any));
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const currentYear = 2026;
    const pastYears = 5;

    const yearOptions = Array.from({ length: pastYears + 1 }, (_, i) => currentYear - pastYears + i);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-primary`}>
                            <TrendingUp className={`text-white`} size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                            <p className="text-sm lg:text-base text-gray-600">CareerHub Chatbot Analytics</p>
                        </div>
                    </div>
                    {/* Drop downs */}
                    <div className="flex gap-4">
                        {/* For Selecting the months */}
                        <select
                            className="select select-bordered w-auto bg-gray-200 text-gray-800 cursor-pointer"
                            value={selectedMonth === undefined ? 'all' : String(selectedMonth)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedMonth(value === 'all' ? currentMonth : parseInt(value, 10));
                            }}
                            title="Select a month"
                        >
                            <option value="all">All Months</option>
                            {months.map((month, index) => (
                                <option key={index} value={String(index)}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        {/* Year Selector */}
                        <select
                            className="select select-bordered w-auto bg-gray-200 text-gray-800 cursor-pointer"
                            value={String(selectedYear)}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                            title="Select a year"
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={String(year)}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 text-black">
                    {/* Question Types Chart */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-xl mb-4 ">Question Types (Monthly)</h2>
                            <div className="w-full h-full flex justify-center items-center">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={questionTypesData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {questionTypesData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            wrapperStyle={{
                                                width: '180px',
                                                padding: '16px',
                                                border: '1px solid #ddd',
                                                borderRadius: '12px',
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                                                fontSize: '15px',
                                                lineHeight: '28px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    {/* Change dataset/common questions */}
                    <DatasetManagementTabs />
                </div>

                {/* Daily Users Chart */}
                <div className="card bg-white shadow-sm hover:shadow-md transition-shadow mb-4 lg:mb-6">
                    <div className="card-body p-4 lg:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg lg:text-xl font-bold text-gray-800">Daily Active Users</h2>
                                <p className="text-xs lg:text-sm text-gray-500">
                                    {selectedMonth !== undefined
                                        ? `${months[selectedMonth]} ${selectedYear}`
                                        : 'All Months'}
                                </p>
                            </div>
                            {dailyData.length > 0 && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Total Users</p>
                                    <p className="text-xl lg:text-2xl font-bold text-green-600">
                                        {dailyData.reduce((sum, d) => sum + d.uniqueUsers, 0)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {dailyData.length > 0 ? (
                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fontSize: 12 }}
                                            label={{
                                                value: 'Day of Month',
                                                position: 'insideBottom',
                                                offset: -1,
                                                fontSize: 12,
                                            }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Users', angle: -90, position: 'insideLeft', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                            }}
                                            cursor={{ fill: 'rgba(0, 196, 159, 0.1)' }}
                                        />
                                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '14px' }} />
                                        <Bar
                                            dataKey="uniqueUsers"
                                            fill="#00C49F"
                                            name="Regular Users"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mb-3 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <p className="text-sm font-medium">No data available</p>
                                <p className="text-xs mt-1">Select a different period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Most Common Questions */}
                <div className="card bg-white shadow-sm hover:shadow-md transition-shadow mb-4 lg:mb-6">
                    <div className="card-body p-4 lg:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-purple-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg lg:text-xl font-bold text-gray-800">Top Question Types</h2>
                                <p className="text-xs lg:text-sm text-gray-500">Most frequently asked categories</p>
                            </div>
                        </div>

                        {questionTypesData.length > 0 ? (
                            <div className="overflow-x-auto -mx-4 lg:mx-0">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700">
                                                Rank
                                            </th>
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700">
                                                Question Type
                                            </th>
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700 text-right">
                                                Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questionTypesData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-colors border-b border-gray-100 text-black"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`
                                            w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold
                                            ${index === 0
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : index === 1
                                                                        ? 'bg-gray-200 text-gray-700'
                                                                        : index === 2
                                                                            ? 'bg-orange-100 text-orange-700'
                                                                            : 'bg-blue-50 text-blue-700'
                                                                }
                                        `}
                                                        >
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className="badge badge-outline badge-lg text-xs lg:text-sm">
                                                        {item.name}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm lg:text-base font-semibold">
                                                        {item.value as any}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mb-3 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-sm font-medium">No questions available</p>
                                <p className="text-xs mt-1">Data will appear here once users start asking questions</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Interactions */}
                <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg lg:text-xl font-bold text-gray-800">Recent Interactions</h2>
                                    <p className="text-xs lg:text-sm text-gray-500">Latest user conversations</p>
                                </div>
                            </div>
                        </div>

                        {userInteractions.length > 0 ? (
                            <div className="overflow-x-auto -mx-4 lg:mx-0">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700">
                                                Question
                                            </th>
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700">
                                                Type
                                            </th>
                                            <th className="bg-gray-50 text-xs lg:text-sm font-semibold text-gray-700">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userInteractions.slice(0, 20).map((interaction, index) => (
                                            <tr
                                                key={interaction.id}
                                                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-xs text-gray-400 font-mono mt-1">
                                                            #{index + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm lg:text-base text-gray-800 line-clamp-2">
                                                                {interaction.question}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span
                                                        className={`
                                        badge badge-sm lg:badge-md text-xs lg:text-sm
                                        ${
                                            interaction.category === 'CV'
                                                ? 'badge-primary'
                                                : interaction.category === 'Internship'
                                                  ? 'badge-success'
                                                  : interaction.category === 'Job Search'
                                                    ? 'badge-warning'
                                                    : interaction.category === 'Cover Letter'
                                                      ? 'badge-info'
                                                      : interaction.category === 'Workshop'
                                                        ? 'bg-pink-300 text-black-700 border border-pink-400'
                                                        : 'badge-ghost'
                                        }
                                    `}
                                                    >
                                                        {interaction.category || 'General'}
                                                    </span>
                                                </td>

                                                <td className="py-3">
                                                    <div className="text-xs lg:text-sm text-gray-600">
                                                        {new Date(interaction.createdAt).toLocaleDateString('en-NZ', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(interaction.createdAt).toLocaleTimeString(
                                                                'en-NZ',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-20 w-20 mb-4 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <p className="text-base font-medium mb-1">No interactions yet</p>
                                <p className="text-sm text-gray-400">User conversations will appear here</p>
                            </div>
                        )}

                        {userInteractions.length > 20 && (
                            <div className="mt-4 text-center">
                                <button className="btn btn-sm btn-outline gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
