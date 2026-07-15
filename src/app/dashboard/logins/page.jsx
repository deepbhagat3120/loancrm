"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { LogIn, FilePlus } from 'lucide-react';

const Logins = () => {
  return (
    <DataTableLayout 
      title="Logins"
      buttons={[
        { label: 'New Login', icon: FilePlus, variant: 'primary' },
        { label: 'Bank Portal', icon: LogIn, variant: 'secondary' }
      ]}
      filterStatusOptions={['Pending Logins', 'Successful Logins', 'Failed Logins']}
      columns={[
        'Login Id', 'Lead Name', 'Bank Name', 'Loan Amount', 
        'Login Date', 'Processed By', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Logins Found"
    />
  );
};

export default Logins;
