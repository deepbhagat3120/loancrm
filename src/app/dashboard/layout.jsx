"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, PhoneCall, Users, FileText, 
  Activity, LogIn, Files, CheckCircle, Calculator, LogOut,
  Search, MessageCircle, Bell, Settings, User as UserIcon, Mail, Wallet, Menu, X
} from 'lucide-react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import './Dashboard.css';

const SidebarItem = ({ icon: Icon, text, active, onClick }) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon />
    <span>{text}</span>
  </div>
);

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

const Dashboard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If we have no session AND the supabase URL is configured, kick them out
      if (!session && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  if (loading && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#5F59E1'}}>Loading CRM...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">m</div>
          MyLoanCRM
          {isMobileMenuOpen && (
            <X size={24} className="mobile-close-btn" style={{marginLeft: 'auto', cursor: 'pointer', color: '#4B5563'}} onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </div>
        <div className="sidebar-menu">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" active={isActive('/dashboard')} onClick={() => router.push('/dashboard')} />
          <SidebarItem icon={MessageSquare} text="Online Enquiries" active={isActive('/dashboard/online-enquiries')} onClick={() => router.push('/dashboard/online-enquiries')} />
          <SidebarItem icon={PhoneCall} text="Callbacks" active={isActive('/dashboard/callbacks')} onClick={() => router.push('/dashboard/callbacks')} />
          <SidebarItem icon={Users} text="Leads" active={isActive('/dashboard/leads')} onClick={() => router.push('/dashboard/leads')} />
          <SidebarItem icon={FileText} text="Documents" active={isActive('/dashboard/documents')} onClick={() => router.push('/dashboard/documents')} />
          <SidebarItem icon={Activity} text="Credit Evaluation" active={isActive('/dashboard/credit-evaluation')} onClick={() => router.push('/dashboard/credit-evaluation')} />
          <SidebarItem icon={LogIn} text="Logins" active={isActive('/dashboard/logins')} onClick={() => router.push('/dashboard/logins')} />
          <SidebarItem icon={Files} text="File In Process" active={isActive('/dashboard/file-in-process')} onClick={() => router.push('/dashboard/file-in-process')} />
          <SidebarItem icon={CheckCircle} text="Sanctions" active={isActive('/dashboard/sanctions')} onClick={() => router.push('/dashboard/sanctions')} />
          <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)' }}></div>
          <SidebarItem icon={Users} text="HRM" />
          <SidebarItem icon={Calculator} text="ROI Calculators" onClick={() => router.push('/calculator/business')} />
          <SidebarItem icon={LogOut} text="Logout" onClick={handleLogout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          <div className="search-bar">
            <Search size={18} color="#9CA3AF" />
            <input type="text" placeholder="Search...." />
          </div>

          <div className="topbar-right">
            <button className="free-trial-btn">Free Trial</button>
            <div className="icon-btn">
              <MessageCircle size={18} />
              <span className="icon-badge">0</span>
            </div>
            <div className="icon-btn" style={{ borderColor: '#25D366', color: '#25D366' }}>
              {/* Using MessageCircle for WhatsApp placeholder */}
              <MessageCircle size={18} />
              <span className="icon-badge" style={{ backgroundColor: '#25D366' }}>0</span>
            </div>
            <div className="icon-btn">
              <Bell size={18} />
              <span className="icon-badge">0</span>
            </div>
            
            <div className="user-profile-container" style={{ position: 'relative' }} ref={profileRef}>
              <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="user-info">
                  <span className="user-name">Deep Bhagat</span>
                  <span className="user-role">Admin</span>
                </div>
                <div className="user-avatar" style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}>
                  <UserIcon size={20} />
                </div>
              </div>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="user-avatar-large" style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserIcon size={32} />
                    </div>
                    <div className="user-name">Deep Bhagat</div>
                    <div className="user-role">Admin</div>
                  </div>
                  
                  <div className="profile-dropdown-wallet">
                    <div className="wallet-header">
                      <span>Balance</span>
                      <span className="wallet-amount">₹0</span>
                    </div>
                    <button className="wallet-btn">
                      <Wallet size={14} /> Wallet
                    </button>
                  </div>
                  
                  <div className="profile-dropdown-item">
                    <UserIcon size={16} /> View Profile
                  </div>
                  
                  <div className="profile-dropdown-section">HELP & SUPPORT</div>
                  
                  <div className="profile-dropdown-item text-green">
                    <MessageCircle size={16} /> WhatsApp Chat
                  </div>
                  <div className="profile-dropdown-item text-red">
                    <Mail size={16} /> Email Support
                  </div>
                  <div className="profile-dropdown-item text-blue">
                    <PhoneCall size={16} /> Request a Callback
                  </div>
                  
                  <div className="profile-dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area (Outlet for nested routes) */}
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
