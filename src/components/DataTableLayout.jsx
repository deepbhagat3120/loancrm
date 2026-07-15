"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Search, Calendar, Filter, Columns, List, Grid, ArrowUpDown, Inbox, FileText, Download, Eye, Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import './DataTableLayout.css';

// Mock Data Generator
const generateMockData = (columns, tabName, count = 15) => {
  const data = [];
  const businesses = ['Reliance Tech', 'Tata Motors', 'Infosys Ltd', 'Wipro Services', 'HDFC Bank', 'ICICI Securities', 'Bajaj Finserv', 'Larsen & Toubro', 'Mahindra Group', 'Sun Pharma'];
  const sources = ['Website', 'Referral', 'Facebook Ads', 'Google Ads', 'Cold Call'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
  const names = ['Amit Sharma', 'Priya Singh', 'Rahul Verma', 'Sneha Patel', 'Vikram Desai'];

  for (let i = 0; i < count; i++) {
    const row = {};
    columns.forEach(col => {
      const lowerCol = col.toLowerCase();
      if (lowerCol.includes('business name') || lowerCol.includes('company')) row[col] = businesses[Math.floor(Math.random() * businesses.length)] + (Math.random() > 0.5 ? ' Pvt Ltd' : '');
      else if (lowerCol.includes('applicant') || lowerCol.includes('name')) row[col] = names[Math.floor(Math.random() * names.length)];
      else if (lowerCol.includes('phone') || lowerCol.includes('mobile')) row[col] = '+91 9' + Math.floor(100000000 + Math.random() * 900000000);
      else if (lowerCol.includes('date')) row[col] = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0];
      else if (lowerCol.includes('source') || lowerCol.includes('sourced by')) row[col] = sources[Math.floor(Math.random() * sources.length)];
      else if (lowerCol.includes('city') || lowerCol.includes('location')) row[col] = cities[Math.floor(Math.random() * cities.length)];
      else if (lowerCol.includes('amount') || lowerCol.includes('loan')) row[col] = '₹' + (Math.floor(Math.random() * 90) + 10) + ',00,000';
      else if (lowerCol.includes('status')) row[col] = 'Active';
      else row[col] = '-';
    });
    row.id = i;
    data.push(row);
  }
  return data;
};

const DataTableLayout = ({
  title,
  buttons = [],
  tabs = [
    { label: 'Business Loans', count: 12 },
    { label: 'Personal Loans', count: 8 },
    { label: 'Home Loans', count: 4 },
    { label: 'Mortgage Loans', count: 0 },
    { label: 'Professional Loans', count: 2 },
    { label: 'Educational Loans', count: 1 }
  ],
  filterStatusOptions = ['Active Enquiries'],
  columns = [],
  emptyStateText = 'No Records Found'
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]?.label);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate data when tab or columns change
  useEffect(() => {
    setIsLoading(true);
    setTableData([]);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const tabInfo = tabs.find(t => t.label === activeTab);
      // Give some tabs 0 data for testing empty states
      const count = tabInfo ? tabInfo.count : 0;
      if (count > 0) {
        setTableData(generateMockData(columns, activeTab, count));
      }
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab]); // Removed columns and tabs from dependencies as they are static arrays passed from parents causing infinite re-renders

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    return tableData.filter(row => {
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [tableData, searchTerm]);

  return (
    <div className="data-table-layout">
      {/* Top Bar */}
      <div className="table-top-bar">
        <div className="table-title">
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard')} />
          {title}
        </div>
        <div className="table-header-buttons">
          {buttons.map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button key={idx} className={`header-btn ${btn.variant || 'default'}`}>
                {Icon && <Icon size={16} />}
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="table-tabs">
        {tabs.map((tab, idx) => (
          <div 
            key={idx} 
            className={`table-tab ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label} ({tab.count})
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="table-filters">
        <div className="filter-input-group">
          <input 
            type="text" 
            placeholder="Search all columns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} color="#9CA3AF" />
        </div>
        
        <div className="filter-select-group">
          <select>
            <option>Select Source...</option>
            <option>Website</option>
            <option>Referral</option>
          </select>
        </div>

        <div className="filter-select-group purple">
          <select>
            {filterStatusOptions.map((opt, i) => (
               <option key={i}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="filter-input-group date">
          <input type="text" placeholder="Filter by Month" />
          <Calendar size={16} />
        </div>

        <div className="filter-icons">
          <div className="f-icon active"><Filter size={18} /></div>
          <div className="f-icon"><Columns size={18} /></div>
          <div className="f-icon active"><List size={18} /></div>
          <div className="f-icon"><Grid size={18} /></div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>
                  <div className="th-content">
                    {col}
                    {idx < columns.length - 1 && col !== 'Status' && <ArrowUpDown size={14} color="#6B7280" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} style={{textAlign: 'center', padding: '3rem', color: '#6B7280'}}>
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIdx) => (
                <tr key={rowIdx} style={{borderBottom: '1px solid #E5E7EB'}}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{padding: '1rem', fontSize: '0.875rem', color: '#374151', whiteSpace: 'nowrap'}}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <div className="empty-state">
          <Inbox size={64} className="empty-icon" strokeWidth={1} />
          <div>{searchTerm ? 'No results match your search.' : emptyStateText}</div>
        </div>
      )}
    </div>
  );
};

export default DataTableLayout;
