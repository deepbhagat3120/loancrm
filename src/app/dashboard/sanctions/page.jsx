"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { CheckCircle, Download } from 'lucide-react';

const Sanctions = () => {
  return (
    <DataTableLayout 
      title="Sanctions"
      buttons={[
        { label: 'Record Sanction', icon: CheckCircle, variant: 'primary' },
        { label: 'Download Letters', icon: Download, variant: 'secondary' }
      ]}
      filterStatusOptions={['Active Sanctions', 'Disbursed', 'Cancelled']}
      columns={[
        'Sanction Id', 'Lead Name', 'Bank Name', 'Sanctioned Amount', 
        'ROI', 'Tenure', 'Sanction Date', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Sanctions Found"
    />
  );
};

export default Sanctions;
