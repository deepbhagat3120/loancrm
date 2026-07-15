"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Calculator.css';

const Calculator = () => {
  const { type } = useParams();
  const router = useRouter();
  
  // Format the loan type for display
  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) + ' Loan' : 'Business Loan';

  const [calcType, setCalcType] = useState('flat'); // 'flat' | 'diminishing'
  
  const [businessName, setBusinessName] = useState('');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(2);
  const [cpp, setCpp] = useState('AS PER CLIENT AGE');
  const [pf, setPf] = useState(0);

  // Derived state calculated during render (no useEffect to avoid out-of-sync flashes)
  let p = parseFloat(loanAmount) || 0;
  let r = parseFloat(interestRate) || 0;
  let t = parseFloat(tenure) || 0;
  let months = t * 12;

  let emi = 0;
  let totInterest = 0;
  let totPayable = 0;
  let schedule = [];

  if (calcType === 'flat') {
    totInterest = p * (r / 100) * t;
    totPayable = p + totInterest;
    emi = months > 0 ? totPayable / months : 0;
    
    let balance = p;
    let monthlyPrincipal = p / months;
    let monthlyInterest = totInterest / months;

    for (let i = 1; i <= months; i++) {
      balance -= monthlyPrincipal;
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(monthlyPrincipal),
        interest: Math.round(monthlyInterest),
        balance: Math.max(0, Math.round(balance))
      });
    }
  } else {
    // Diminishing Rate
    if (r > 0) {
      let monthlyRate = (r / 12) / 100;
      emi = p * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      emi = months > 0 ? p / months : 0;
    }
    
    totPayable = emi * months;
    totInterest = Math.max(0, totPayable - p);

    let balance = p;
    for (let i = 1; i <= months; i++) {
      let interestForMonth = balance * ((r / 12) / 100);
      let principalForMonth = emi - interestForMonth;
      balance -= principalForMonth;
      
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalForMonth),
        interest: Math.round(interestForMonth),
        balance: Math.max(0, Math.round(balance))
      });
    }
  }

  const monthlyEmi = Math.round(emi);
  const totalInterest = Math.round(totInterest);
  const totalPayable = Math.round(totPayable);

  // Chart data
  const data = [
    { name: 'Principal', value: p },
    { name: 'Interest', value: totalInterest }
  ];
  const COLORS = ['#007AFF', '#34C759'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Remove calculateEMI function and useEffect since we calculate during render

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${displayType} - Repayment Schedule`, 14, 15);
    doc.text(`Monthly EMI: Rs. ${monthlyEmi}`, 14, 25);
    doc.text(`Principal: Rs. ${loanAmount} | Total Interest: Rs. ${totalInterest}`, 14, 32);
    
    const tableColumn = ["S. No.", "Month", "EMI (Rs.)", "Principal (Rs.)", "Interest (Rs.)", "Balance (Rs.)"];
    const tableRows = [];

    schedule.forEach(row => {
      const rowData = [
        row.month,
        `Month ${row.month}`,
        row.emi,
        row.principal,
        row.interest,
        row.balance
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [204, 240, 245], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    doc.save('repayment_schedule.pdf');
  };

  return (
    <div className="calculator-container">
      
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', marginBottom: '2rem' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="calc-type-toggle">
        <button 
          className={`calc-type-btn ${calcType === 'flat' ? 'active' : 'inactive'}`}
          onClick={() => setCalcType('flat')}
        >
          Flat Rate
        </button>
        <button 
          className={`calc-type-btn ${calcType === 'diminishing' ? 'active' : 'inactive'}`}
          onClick={() => setCalcType('diminishing')}
        >
          Diminishing Rate
        </button>
      </div>

      <div className="calc-card-main">
        <h2 className="calc-title">{displayType} - {calcType === 'flat' ? 'Flat Rate' : 'Diminishing Rate'} EMI Calculator</h2>
        
        <div className="calc-content-grid">
          {/* Form */}
          <div className="calc-form">
            <div className="calc-form-group">
              <label className="calc-form-label">Business Name</label>
              <div className="calc-form-input-wrapper">
                <input 
                  type="text" 
                  className="calc-form-input" 
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            </div>

            <div className="calc-form-group">
              <label className="calc-form-label" style={{alignItems: 'center'}}>
                Loan Amount (₹) 
                <input 
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{color: '#7B61FF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '2px 8px', width: '100px', textAlign: 'right', outline: 'none'}}
                />
              </label>
              <input 
                type="range" 
                className="calc-range" 
                min="50000" 
                max="10000000" 
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>

            <div className="calc-form-group">
              <label className="calc-form-label" style={{alignItems: 'center'}}>
                Interest Rate (%) 
                <input 
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{color: '#7B61FF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '2px 8px', width: '80px', textAlign: 'right', outline: 'none'}}
                />
              </label>
              <input 
                type="range" 
                className="calc-range" 
                min="5" 
                max="15" 
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>

            <div className="calc-form-group">
              <label className="calc-form-label" style={{alignItems: 'center'}}>
                Tenure (Years) 
                <input 
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  style={{color: '#7B61FF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '2px 8px', width: '80px', textAlign: 'right', outline: 'none'}}
                />
              </label>
              <input 
                type="range" 
                className="calc-range" 
                min="1" 
                max="4" 
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
              />
            </div>

            <div className="calc-form-group">
              <label className="calc-form-label">CPP</label>
              <div className="calc-form-input-wrapper">
                <input 
                  type="text" 
                  className="calc-form-input" 
                  value={cpp}
                  onChange={(e) => setCpp(e.target.value)}
                />
              </div>
            </div>

            <div className="calc-form-group">
              <label className="calc-form-label">PF %</label>
              <div className="calc-form-input-wrapper">
                <input 
                  type="number" 
                  className="calc-form-input" 
                  value={pf}
                  onChange={(e) => setPf(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Button is purely decorative since it's dynamic */}
            <button className="calc-btn">
              Calculate EMI
            </button>
          </div>

          {/* Results and Chart grouped as iPhone Widget */}
          <div className="calc-widget" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
            
            {/* Chart */}
            <div className="calc-chart" style={{ flexDirection: 'column', width: '100%' }}>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="chart-legend" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#86868B' }}>
                  <div className="legend-color" style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: COLORS[0] }}></div>
                  Principal
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#86868B' }}>
                  <div className="legend-color" style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: COLORS[1] }}></div>
                  Interest
                </div>
              </div>
            </div>

            {/* Results Text */}
            <div className="calc-results" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div className="monthly-emi-title" style={{ color: '#86868B', fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>Monthly EMI</div>
              <div className="monthly-emi-value" style={{ color: '#1D1D1F', fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', letterSpacing: '-0.02em' }}>₹{monthlyEmi}</div>
              
              <div className="results-table" style={{ width: '100%', backgroundColor: '#F5F5F7', borderRadius: '16px', padding: '1.5rem' }}>
                <div className="results-row" style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.75rem' }}>
                  <span className="results-label" style={{ fontWeight: '500', color: '#86868B' }}>Principal Amount:</span>
                  <span className="results-value" style={{ fontWeight: '600', color: '#1D1D1F' }}>₹{loanAmount}</span>
                </div>
                <div className="results-row" style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.75rem' }}>
                  <span className="results-label" style={{ fontWeight: '500', color: '#86868B' }}>Total Interest:</span>
                  <span className="results-value" style={{ fontWeight: '600', color: '#1D1D1F' }}>₹{totalInterest}</span>
                </div>
                <div className="results-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="results-label" style={{ fontWeight: '500', color: '#86868B' }}>Total Payable:</span>
                  <span className="results-value" style={{ fontWeight: '600', color: '#007AFF' }}>₹{totalPayable}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        <div className="repayment-section">
          <div className="repayment-header">
            <h3 className="repayment-title">Repayment Schedule</h3>
            <div className="download-btn" onClick={downloadPDF}>
              <Download size={16} /> Download PDF
            </div>
          </div>
          
          <div className="repayment-table-container">
            <table className="repayment-table">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Month</th>
                  <th>EMI (₹)</th>
                  <th>Principal (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>Month {row.month}</td>
                    <td>{row.emi}</td>
                    <td>{row.principal}</td>
                    <td>{row.interest}</td>
                    <td>{row.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Calculator;
