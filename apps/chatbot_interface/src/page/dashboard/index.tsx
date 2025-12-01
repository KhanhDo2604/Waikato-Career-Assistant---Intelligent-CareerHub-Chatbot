import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { api, type CommonQuestion, type MonthlyUserCount, type Interaction } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faQuestionCircle, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function Dashboard() {
    const navigate = useNavigate();
    const [questionTypes, setQuestionTypes] = useState<Record<string, number>>({});
    const [commonQuestions, setCommonQuestions] = useState<CommonQuestion[]>([]);
    const [userCounts, setUserCounts] = useState<MonthlyUserCount[]>([]);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [selectedMonth, selectedYear]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [types, questions, counts, allInteractions] = await Promise.all([
                api.getQuestionTypes(selectedMonth, selectedYear),
                api.getCommonQuestions(selectedMonth, selectedYear),
                api.getUserCounts(selectedMonth, selectedYear),
                api.getInteractions(undefined, 100),
            ]);

            setQuestionTypes(types);
            setCommonQuestions(questions);
            setUserCounts(counts);
            setInteractions(allInteractions);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const questionTypesData = Object.entries(questionTypes).map(([name, value]) => ({
        name,
        value,
    }));

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
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
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-ghost btn-circle"
                        >
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
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        <select
                            className="select select-bordered"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
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
                                    <p className="text-3xl font-bold text-gray-800">{Object.keys(questionTypes).length}</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                <div className="card bg-white shadow-md mb-6">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Most Common Questions (Monthly)</h2>
                        {commonQuestions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
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
                <div className="card bg-white shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Recent User Interactions</h2>
                        {interactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
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
                                                    <span className={`badge ${interaction.userType === 'user' ? 'badge-info' : 'badge-success'}`}>
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
                            <div className="text-center py-8 text-gray-500">
                                No interactions recorded yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


