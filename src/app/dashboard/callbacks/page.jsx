"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { Users, Upload, Plus } from 'lucide-react';

const Callbacks = () => {
  return (
    <DataTableLayout 
      title="Callbacks"
      buttons={[
        { label: 'Bulk Assign', icon: Users, variant: 'secondary' },
        { label: 'Bulk Upload', icon: Upload },
        { label: 'Add Callback', icon: Plus, variant: 'primary' }
      ]}
      filterStatusOptions={['Active Callbacks', 'Resolved Callbacks']}
      columns={[
        'Callback Id', 'Business Name', 'Primary Phone', 'Callback Date', 
        'Remarks', 'Sourced By', 'Created Date', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Callbacks Found"
    />
  );
};

export default Callbacks;
