"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { CheckCircle, Activity } from 'lucide-react';

const CreditEvaluation = () => {
  return (
    <DataTableLayout 
      title="Credit Evaluation"
      buttons={[
        { label: 'Start Evaluation', icon: Activity, variant: 'primary' },
        { label: 'Approve Selected', icon: CheckCircle, variant: 'secondary' }
      ]}
      filterStatusOptions={['Pending Evaluation', 'Approved', 'Rejected']}
      columns={[
        'Eval Id', 'Business Name', 'Credit Score', 'Requested Amount', 
        'Assigned To', 'Started On', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Evaluations Found"
    />
  );
};

export default CreditEvaluation;
