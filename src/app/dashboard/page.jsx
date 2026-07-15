"use client";

import React from 'react';
import { 
  MessageSquare, PhoneCall, Users, FileText, 
  Activity, LogIn, Files, CheckCircle, Settings
} from 'lucide-react';

const MetricCard = ({ title, value, percentage, icon: Icon, theme, bgIcon: BgIcon }) => (
  <div className={`metric-card card-${theme}`}>
    {BgIcon && <BgIcon className="metric-card-bg-icon" />}
    <div className="metric-icon-wrapper">
      <Icon size={20} />
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">
      <span>{title}</span>
      <span className="metric-badge">{percentage}</span>
    </div>
  </div>
);

const DashboardHome = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="greeting">
          Good Evening, <span>Deep Bhagat</span>
        </div>
        <div className="filters">
          <select className="filter-select">
            <option>All Loans</option>
          </select>
          <select className="filter-select">
            <option>All</option>
          </select>
          <select className="filter-select">
            <option>Overall Workspace</option>
          </select>
          <button className="settings-btn">
            <Settings size={18} color="#6B7280" />
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard title="Online Enquiries" value="0" percentage="0%" icon={MessageSquare} theme="green" bgIcon={MessageSquare} />
        <MetricCard title="Callbacks" value="0" percentage="0%" icon={PhoneCall} theme="purple" bgIcon={PhoneCall} />
        <MetricCard title="Leads" value="0" percentage="0%" icon={Users} theme="blue" bgIcon={Users} />
        <MetricCard title="Documents" value="0" percentage="0%" icon={FileText} theme="mint" bgIcon={FileText} />
        <MetricCard title="Credit" value="0" percentage="0%" icon={Activity} theme="lilac" bgIcon={Activity} />
        <MetricCard title="Logins" value="0" percentage="0%" icon={LogIn} theme="yellow" bgIcon={LogIn} />
        <MetricCard title="Files In Process" value="0" percentage="0%" icon={Files} theme="cyan" bgIcon={Files} />
        <MetricCard title="Sanctioned" value="0" percentage="0%" icon={CheckCircle} theme="indigo" bgIcon={CheckCircle} />
      </div>
    </div>
  );
};

export default DashboardHome;
