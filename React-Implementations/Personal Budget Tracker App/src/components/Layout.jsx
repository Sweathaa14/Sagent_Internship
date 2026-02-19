import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, userId }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <div className="ambient-background" aria-hidden="true">
                    <span className="ambient-orb orb-1" />
                    <span className="ambient-orb orb-2" />
                    <span className="ambient-orb orb-3" />
                    <span className="ambient-grid" />
                </div>
                <Navbar userId={userId} />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
