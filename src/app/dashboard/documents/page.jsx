"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { Upload, Plus } from 'lucide-react';

const Documents = () => {
  return (
    <DataTableLayout 
      title="Documents"
      buttons={[
        { label: 'Upload Documents', icon: Upload },
        { label: 'Request Documents', icon: Plus, variant: 'primary' }
      ]}
      filterStatusOptions={['Pending Documents', 'Verified Documents', 'Rejected Documents']}
      columns={[
        'Doc Id', 'Lead Name', 'Document Type', 'Requested On', 
        'Uploaded On', 'Verified By', 'Status', 'Quick Actions'
      ]}
      emptyStateText="No Documents Found"
    />
  );
};

export default Documents;
