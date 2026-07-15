"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { Users, Upload, Zap, Plus } from 'lucide-react';

const Leads = () => {
  return (
    <DataTableLayout 
      title="Leads"
      buttons={[
        { label: 'Bulk Assign', icon: Users, variant: 'secondary' },
        { label: 'Bulk Upload', icon: Upload },
        { label: 'Quick Lead', icon: Zap, variant: 'primary' },
        { label: 'Add Lead', icon: Plus, variant: 'primary' }
      ]}
      filterStatusOptions={['Active Leads', 'Converted Leads']}
      columns={[
        'Lead Id', 'Business Name', 'Business Entity', 'Primary Phone', 
        'City', 'Sourced By', 'Created Date', 'Follow-Up Date', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Leads Found"
    />
  );
};

export default Leads;
