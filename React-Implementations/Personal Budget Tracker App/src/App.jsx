import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Transfers from './pages/Transfers';
import RecurringTransactions from './pages/RecurringTransactions';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import './App.css';

function App() {
    // Default user ID (simulating logged-in user)
    const [currentUserId] = useState(1);

    return (
        <Router>
            <Layout userId={currentUserId}>
                <Routes>
                    <Route 
                        path="/" 
                        element={<Dashboard userId={currentUserId} />} 
                    />
                    <Route 
                        path="/accounts" 
                        element={<Accounts userId={currentUserId} />} 
                    />
                    <Route 
                        path="/income" 
                        element={<Income userId={currentUserId} />} 
                    />
                    <Route 
                        path="/expenses" 
                        element={<Expenses userId={currentUserId} />} 
                    />
                    <Route 
                        path="/budgets" 
                        element={<Budgets userId={currentUserId} />} 
                    />
                    <Route 
                        path="/goals" 
                        element={<Goals userId={currentUserId} />} 
                    />
                    <Route 
                        path="/transfers" 
                        element={<Transfers userId={currentUserId} />} 
                    />
                    <Route 
                        path="/recurring" 
                        element={
                            <RecurringTransactions userId={currentUserId} />
                        } 
                    />
                    <Route 
                        path="/alerts" 
                        element={<Alerts userId={currentUserId} />} 
                    />
                    <Route 
                        path="/reports" 
                        element={<Reports userId={currentUserId} />} 
                    />
                    <Route 
                        path="/categories" 
                        element={<Categories userId={currentUserId} />} 
                    />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;