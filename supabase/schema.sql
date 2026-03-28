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

-- Workspace Policies: Only owners can see/edit their own workspaces
CREATE POLICY "Users can view their own workspaces"
ON workspaces FOR SELECT
USING (owner_id = auth.uid()::text);

CREATE POLICY "Users can manage their own workspaces"
ON workspaces FOR ALL
USING (owner_id = auth.uid()::text);

-- Member Policies: Users can see a workspace's members if they belong to it
-- We avoid recursion by NOT querying workspace_members within its own policy
CREATE POLICY "Users can view their own membership"
ON workspace_members FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can see other members of a workspace if it belongs to them"
-- Instead of checking members, we check the workspace table owner
ON workspace_members FOR SELECT
USING (
  EXISTS(SELECT 1 FROM workspaces WHERE workspaces.id = workspace_members.workspace_id AND workspaces.owner_id = auth.uid()::text)
);

-- Generation Policies
CREATE POLICY "Users can view their own generations"
ON ai_generations FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own generations"
ON ai_generations FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own generations"
ON ai_generations FOR DELETE
USING (user_id = auth.uid()::text);
