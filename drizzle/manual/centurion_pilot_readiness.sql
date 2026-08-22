-- DT-19: additive Centurion pilot-readiness migration.
-- Review against the target database, then apply in one transaction.
BEGIN;

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS offer_summary text;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS project_price_min integer DEFAULT 2000;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS project_price_max integer DEFAULT 5000;
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns (status);

ALTER TABLE prospects ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS source_captured_at timestamptz;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS website_observation text;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS commercial_consequence text;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_high_customer_value boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_weak_or_outdated_website boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_decision_maker_route boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_multiple_employees_or_locations boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_active_ads_or_social boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_weak_booking_workflow boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS has_recent_growth_trigger boolean NOT NULL DEFAULT false;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS score_confirmed_at timestamptz;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS score_confirmed_by text;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS next_action text;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS next_action_at timestamptz;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;
CREATE INDEX IF NOT EXISTS prospects_campaign_idx ON prospects (campaign_id);
CREATE INDEX IF NOT EXISTS prospects_queue_idx ON prospects (qualification_status, status, next_action_at);

ALTER TABLE audits ADD COLUMN IF NOT EXISTS approved_by text;
ALTER TABLE suppressions ADD COLUMN IF NOT EXISTS created_by text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration_minutes integer;
CREATE INDEX IF NOT EXISTS contacts_prospect_idx ON contacts (prospect_id);
CREATE INDEX IF NOT EXISTS audits_prospect_idx ON audits (prospect_id);
CREATE INDEX IF NOT EXISTS audits_status_idx ON audits (status);
CREATE UNIQUE INDEX IF NOT EXISTS suppressions_scope_hash_uidx ON suppressions (scope, value_hash);
CREATE INDEX IF NOT EXISTS suppressions_prospect_idx ON suppressions (prospect_id);
CREATE INDEX IF NOT EXISTS activities_prospect_created_idx ON activities (prospect_id, created_at);
CREATE INDEX IF NOT EXISTS activities_outcome_idx ON activities (outcome);

CREATE TABLE IF NOT EXISTS prospect_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  source_url text,
  source_record_id text,
  captured_at timestamptz NOT NULL DEFAULT now(),
  captured_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prospect_sources_prospect_idx ON prospect_sources (prospect_id);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id) ON DELETE SET NULL,
  assigned_user_id text NOT NULL,
  action_type text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  due_at timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tasks_due_status_idx ON tasks (status, due_at);
CREATE INDEX IF NOT EXISTS tasks_prospect_idx ON tasks (prospect_id);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  primary_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  owner_user_id text NOT NULL,
  stage text NOT NULL DEFAULT 'qualified',
  estimated_value integer,
  probability_percent integer NOT NULL DEFAULT 10,
  package_name text,
  discovery_at timestamptz,
  expected_close_at timestamptz,
  loss_reason text,
  next_action text,
  next_action_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS opportunities_prospect_uidx ON opportunities (prospect_id);
CREATE INDEX IF NOT EXISTS opportunities_stage_idx ON opportunities (stage);

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft',
  scope_summary text NOT NULL,
  amount integer NOT NULL,
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS proposals_opportunity_idx ON proposals (opportunity_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals (status);

CREATE TABLE IF NOT EXISTS project_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE RESTRICT,
  proposal_id uuid REFERENCES proposals(id) ON DELETE RESTRICT,
  owner_user_id text NOT NULL,
  scope_summary text NOT NULL,
  kickoff_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS project_handoffs_opportunity_uidx ON project_handoffs (opportunity_id);

CREATE TABLE IF NOT EXISTS work_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  operator_user_id text NOT NULL,
  work_type text NOT NULL,
  duration_minutes integer NOT NULL,
  notes text,
  worked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS work_sessions_campaign_idx ON work_sessions (campaign_id, worked_at);

COMMIT;
