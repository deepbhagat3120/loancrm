"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { Files, Send } from 'lucide-react';

const FileInProcess = () => {
  return (
    <DataTableLayout 
      title="File In Process"
      buttons={[
        { label: 'Update Status', icon: Files, variant: 'primary' },
        { label: 'Forward to Bank', icon: Send, variant: 'secondary' }
      ]}
      filterStatusOptions={['In Process', 'Hold', 'Query Raised']}
      columns={[
        'File Id', 'Lead Name', 'Bank Name', 'Processing Stage', 
        'Assigned To', 'Last Updated', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Files In Process"
    />
  );
};

export default FileInProcess;
