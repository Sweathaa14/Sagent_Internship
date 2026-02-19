import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/axiosConfig';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1a237e', '#c62828', '#2e7d32', '#ef6c00', '#6a1b9a'];

const Dashboard = ({ userId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, [userId]);

    const loadDashboard = async () => {
        try {
            const res = await dashboardAPI.get(userId);
            setData(res.data);
        } catch (err) {
            console.error('Error loading dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card">Loading dashboard...</div>;
    if (!data) return <div className="card">Error loading dashboard</div>;

    const incomeExpenseData = [
        { name: 'Income', amount: data.totalIncome },
        { name: 'Expense', amount: data.totalExpense },
        { name: 'Savings', amount: data.savings },
    ];

    return (
        <div>
            <h2 style={{ marginBottom: 24, color: '#1a237e' }}>
                Dashboard Overview
            </h2>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon balance">🏦</div>
                    <div className="stat-info">
                        <h4>Total Balance</h4>
                        <p>₹{data.totalBalance?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon income">💰</div>
                    <div className="stat-info">
                        <h4>Total Income</h4>
                        <p className="amount-positive">
                            ₹{data.totalIncome?.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon expense">💸</div>
                    <div className="stat-info">
                        <h4>Total Expenses</h4>
                        <p className="amount-negative">
                            ₹{data.totalExpense?.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon savings">📊</div>
                    <div className="stat-info">
                        <h4>Net Savings</h4>
                        <p>₹{data.savings?.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Info */}
            <div className="stats-grid" style={{ marginBottom: 30 }}>
                <div className="stat-card">
                    <div className="stat-icon balance">📁</div>
                    <div className="stat-info">
                        <h4>Active Accounts</h4>
                        <p>{data.accountCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon income">🎯</div>
                    <div className="stat-info">
                        <h4>Active Goals</h4>
                        <p>{data.activeGoals}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon expense">🔔</div>
                    <div className="stat-info">
                        <h4>Unread Alerts</h4>
                        <p>{data.unreadAlerts}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Income vs Expense Bar Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>Income vs Expense</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={incomeExpenseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                formatter={(val) => `₹${val.toLocaleString()}`} 
                            />
                            <Bar dataKey="amount" fill="#1a237e" radius={[8,8,0,0]}>
                                {incomeExpenseData.map((entry, index) => (
                                    <Cell 
                                        key={index} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Expense by Category Pie Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>Expenses by Category</h3>
                    </div>
                    {data.expenseByCategory && 
                     data.expenseByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.expenseByCategory}
                                    dataKey="total"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ category, percent }) =>
                                        `${category} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {data.expenseByCategory.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(val) => `₹${val.toLocaleString()}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <p>No expense data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;