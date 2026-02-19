import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/accounts', label: 'Accounts', icon: '🏦' },
        { path: '/income', label: 'Income', icon: '💰' },
        { path: '/expenses', label: 'Expenses', icon: '💸' },
        { path: '/budgets', label: 'Budgets', icon: '📋' },
        { path: '/goals', label: 'Goals', icon: '🎯' },
        { path: '/transfers', label: 'Transfers', icon: '🔄' },
        { path: '/recurring', label: 'Recurring', icon: '🔁' },
        { path: '/categories', label: 'Categories', icon: '🏷️' },
        { path: '/alerts', label: 'Alerts', icon: '🔔' },
        { path: '/reports', label: 'Reports', icon: '📈' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>💰 Budget Tracker</h2>
                <p>Personal Finance</p>
            </div>
            <ul className="sidebar-nav">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            end={item.path === '/'}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;