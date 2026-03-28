-- LaunchDesk Supabase Schema

-- 1. Create Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id TEXT NOT NULL, -- Clerk User ID
    plan TEXT DEFAULT 'FREE', -- FREE, PRO, ENTERPRISE
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Workspace Members table
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk User ID
    role TEXT NOT NULL DEFAULT 'member', -- admin, member, viewer
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- 3. Create AI Generations table
CREATE TABLE ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    tool_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    output TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Usage Limits table
CREATE TABLE usage_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- "MM-YYYY"
    generation_count INTEGER DEFAULT 0,
    reset_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(workspace_id, month_year)
);

-- 5. Create Invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Workspace Policies: Only owners or members can see/edit
CREATE POLICY "Users can view workspaces they are members of"
ON workspaces FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE workspace_members.workspace_id = workspaces.id 
        AND workspace_members.user_id = auth.uid()::text
    ) OR owner_id = auth.uid()::text
);

-- Member Policies
CREATE POLICY "Users can view members of their workspaces"
ON workspace_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members AS current_members
        WHERE current_members.workspace_id = workspace_members.workspace_id 
        AND current_members.user_id = auth.uid()::text
    )
);

-- Generation Policies
CREATE POLICY "Users can view generations in their workspaces"
ON ai_generations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE workspace_members.workspace_id = ai_generations.workspace_id 
        AND workspace_members.user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can create generations in their workspaces"
ON ai_generations FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE workspace_members.workspace_id = ai_generations.workspace_id 
        AND workspace_members.user_id = auth.uid()::text
    )
);
