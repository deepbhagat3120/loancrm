-- Supabase Schema for LoanCRM

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    business_entity TEXT,
    applicant_name TEXT NOT NULL,
    primary_phone TEXT NOT NULL,
    sourced_by TEXT,
    followup_date DATE,
    enquiry_source TEXT,
    status TEXT DEFAULT 'Active Enquiries',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    business_entity TEXT,
    primary_phone TEXT NOT NULL,
    city TEXT,
    sourced_by TEXT,
    followup_date DATE,
    status TEXT DEFAULT 'Active Leads',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for Enquiries (RBAC)
-- Allow users to read their own enquiries
CREATE POLICY "Users can view their own enquiries" 
ON enquiries FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own enquiries
CREATE POLICY "Users can create their own enquiries" 
ON enquiries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own enquiries
CREATE POLICY "Users can update their own enquiries" 
ON enquiries FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Create RLS Policies for Leads (RBAC)
-- Allow users to read their own leads
CREATE POLICY "Users can view their own leads" 
ON leads FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own leads
CREATE POLICY "Users can create their own leads" 
ON leads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own leads
CREATE POLICY "Users can update their own leads" 
ON leads FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- (Repeat for Documents, Callbacks, Logins, Sanctions as needed...)
