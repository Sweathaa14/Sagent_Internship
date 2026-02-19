import React, { useState, useEffect } from 'react';
import { alertAPI } from '../api/axiosConfig';

const Navbar = ({ userId }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadUnreadCount();
    }, [userId]);

    const loadUnreadCount = async () => {
        try {
            const res = await alertAPI.getUnreadCount(userId);
            setUnreadCount(res.data);
        } catch (err) {
            console.error('Error loading alerts:', err);
        }
    };

    return (
        <div className="navbar">
            <div className="navbar-title">
                Personal Budget Tracker
            </div>
            <div className="navbar-actions">
                <div className="notification-badge">
                    🔔
                    {unreadCount > 0 && (
                        <span className="badge-count">{unreadCount}</span>
                    )}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    👤 User #{userId}
                </span>
            </div>
        </div>
    );
};

export default Navbar;