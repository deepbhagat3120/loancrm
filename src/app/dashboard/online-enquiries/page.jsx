"use client";

import React from 'react';
import DataTableLayout from '@/components/DataTableLayout';
import { QrCode, Link, Users, Plus } from 'lucide-react';

const OnlineEnquiries = () => {
  return (
    <DataTableLayout 
      title="Online Enquiries"
      buttons={[
        { label: 'QR Code', icon: QrCode },
        { label: 'API', icon: Link, variant: 'secondary' },
        { label: 'Bulk Assign', icon: Users, variant: 'secondary' },
        { label: 'Add Enquiry', icon: Plus, variant: 'primary' }
      ]}
      filterStatusOptions={['Active Enquiries', 'Closed Enquiries']}
      columns={[
        'Enquiry Id', 'Business Name', 'Business Entity', 'Applicant Name', 
        'Primary Phone', 'Sourced By', 'Followup Date', 'Enquiry Source', 'Quick Actions'
      ]}
      emptyStateText="No Enquiries Found"
    />
  );
};

export default OnlineEnquiries;
