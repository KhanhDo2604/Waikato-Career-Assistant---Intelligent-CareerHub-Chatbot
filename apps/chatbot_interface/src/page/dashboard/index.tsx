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
import { type CommonQuestion, type MonthlyUserCount, type Interaction } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faQuestionCircle, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const mockQuestionTypes: Record<string, number> = {
    CV: 34,
    Internship: 21,
    'Job Search': 18,
    'Cover Letter': 12,
    General: 14,
};

const mockCommonQuestions: CommonQuestion[] = [
    { question: 'How to write a CV for internship?', count: 12 },
    { question: 'What internships are available for IT students?', count: 9 },
    { question: 'How can I improve my cover letter?', count: 7 },
    { question: 'Where can I find part-time jobs?', count: 6 },
    { question: 'When are the next workshops?', count: 5 },
];

const mockUserCounts: MonthlyUserCount[] = [
    { month: 'Jan', uniqueUsers: 40, users: 55, alumni: 12, total: 107 },
    { month: 'Feb', uniqueUsers: 60, users: 80, alumni: 20, total: 160 },
    { month: 'Mar', uniqueUsers: 75, users: 90, alumni: 25, total: 190 },
    { month: 'Apr', uniqueUsers: 42, users: 58, alumni: 16, total: 116 },
    { month: 'May', uniqueUsers: 66, users: 84, alumni: 19, total: 169 },
    { month: 'Jun', uniqueUsers: 51, users: 70, alumni: 15, total: 136 },
];

const mockInteractions: Interaction[] = [
    {
        id: '1',
        userId: 'u123',
        userType: 'user',
        question: 'How do I write a strong CV?',
        answer: 'Start with a strong summary and highlight key achievements.',
        timestamp: '2025-01-05T10:15:00Z',
        questionType: 'CV',
    },
    {
        id: '2',
        userId: 'u402',
        userType: 'alumni',
        question: 'Any tips for job searching in NZ?',
        answer: 'Try Seek.co.nz and LinkedIn. Tailor your CV for each job.',
        timestamp: '2025-01-04T14:32:00Z',
        questionType: 'Job Search',
    },
    {
        id: '3',
        userId: 'u991',
        userType: 'user',
        question: 'How long should my cover letter be?',
        answer: 'Keep it to one page, with 3–4 strong paragraphs.',
        timestamp: '2025-01-03T09:10:00Z',
        questionType: 'Cover Letter',
    },
    {
        id: '4',
        userId: 'u221',
        userType: 'user',
        question: 'Where can I find internships?',
        answer: 'Check NZUni Talent and your faculty newsletters.',
        timestamp: '2025-01-02T11:48:00Z',
        questionType: 'Internship',
    },
    {
        id: '5',
        userId: 'u556',
        userType: 'alumni',
        question: 'When is the next CV workshop?',
        answer: 'The next CV workshop is on 12 Feb.',
        timestamp: '2025-01-01T16:22:00Z',
        questionType: 'Workshop',
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const [questionTypes, setQuestionTypes] = useState<Record<string, number>>(mockQuestionTypes);
    const [commonQuestions, setCommonQuestions] = useState<CommonQuestion[]>(mockCommonQuestions);
    const [userCounts, setUserCounts] = useState<MonthlyUserCount[]>(mockUserCounts);
    const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [selectedMonth, selectedYear]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            setQuestionTypes(mockQuestionTypes);
            setCommonQuestions(mockCommonQuestions);
            setUserCounts(mockUserCounts);
            setInteractions(mockInteractions);
        } finally {
            setLoading(false);
        }
    };
    // const loadDashboardData = async () => {
    //     setLoading(true);
    //     try {
    //         const [types, questions, counts, allInteractions] = await Promise.all([
    //             api.getQuestionTypes(selectedMonth, selectedYear),
    //             api.getCommonQuestions(selectedMonth, selectedYear),
    //             api.getUserCounts(selectedMonth, selectedYear),
    //             api.getInteractions(undefined, 100),
    //         ]);

    //         setQuestionTypes(types);
    //         setCommonQuestions(questions);
    //         setUserCounts(counts);
    //         setInteractions(allInteractions);
    //     } catch (error) {
    //         console.error('Error loading dashboard data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const questionTypesData = Object.entries(questionTypes).map(([name, value]) => ({
        name,
        value,
    }));

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

    if (loading) {
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="btn btn-ghost btn-circle">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                            <p className="text-gray-600">CareerHub Chatbot Analytics</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="select select-bordered"
                            value={selectedMonth ?? ''}
                            onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : undefined)}
                        >
                            <option value="">All Months</option>
                            {months.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <select
                            className="select select-bordered"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Interactions</p>
                                    <p className="text-3xl font-bold text-gray-800">{interactions.length}</p>
                                </div>
                                <div className="text-4xl text-blue-500">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Question Types</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {Object.keys(questionTypes).length}
                                    </p>
                                </div>
                                <div className="text-4xl text-green-500">
                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Unique Users</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {userCounts.reduce((sum, item) => sum + item.uniqueUsers, 0)}
                                    </p>
                                </div>
                                <div className="text-4xl text-purple-500">
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 text-black">
                    {/* Question Types Chart */}
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-xl mb-4">Question Types (Monthly)</h2>
                            {questionTypesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={questionTypesData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {questionTypesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-300 flex items-center justify-center text-gray-500">
                                    No data available for selected period
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Counts Chart */}
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-xl mb-4">Users Using Chatbot (Monthly)</h2>
                            {userCounts.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={userCounts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="uniqueUsers" fill="#0088FE" name="Unique Users" />
                                        <Bar dataKey="users" fill="#00C49F" name="Regular Users" />
                                        <Bar dataKey="alumni" fill="#FFBB28" name="Alumni" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-300 flex items-center justify-center text-gray-500">
                                    No data available for selected period
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Most Common Questions */}
                <div className="card bg-white shadow-md mb-6 text-gray-500">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Most Common Questions (Monthly)</h2>
                        {commonQuestions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="text-black">
                                            <th>Rank</th>
                                            <th>Question</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commonQuestions.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-bold">{index + 1}</td>
                                                <td className="max-w-md">{item.question}</td>
                                                <td>
                                                    <span className="badge badge-primary badge-lg">{item.count}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No questions available for selected period
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Interactions */}
                <div className="card bg-white shadow-md text-gray-500">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Recent User Interactions</h2>
                        {interactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="text-black">
                                            <th>User Type</th>
                                            <th>Question</th>
                                            <th>Question Type</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interactions.slice(0, 20).map((interaction) => (
                                            <tr key={interaction.id}>
                                                <td>
                                                    <span
                                                        className={`badge ${interaction.userType === 'user' ? 'badge-info' : 'badge-success'}`}
                                                    >
                                                        {interaction.userType}
                                                    </span>
                                                </td>
                                                <td className="max-w-md truncate">{interaction.question}</td>
                                                <td>
                                                    <span className="badge badge-outline">
                                                        {interaction.questionType || 'General'}
                                                    </span>
                                                </td>
                                                <td>{new Date(interaction.timestamp).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No interactions recorded yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
