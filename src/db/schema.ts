import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// -----------------------------------------------------------------------------
// Campaigns
// -----------------------------------------------------------------------------
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  targetState: text('target_state'),
  targetCities: text('target_cities'), // JSON array string
  minimumReviewCount: integer('minimum_review_count').default(10),
  minimumRating: text('minimum_rating').default('4.0'),
  offerSummary: text('offer_summary'),
  projectPriceMin: integer('project_price_min').default(2000),
  projectPriceMax: integer('project_price_max').default(5000),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('campaigns_status_idx').on(table.status),
]);

// -----------------------------------------------------------------------------
// Prospects
// -----------------------------------------------------------------------------
export const prospects = pgTable('prospects', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  industry: text('industry'),
  status: text('status').notNull().default('raw'), // raw, qualified, contacting, audit_accepted, proposal_sent, closed_won, closed_lost, disqualified
  qualificationStatus: text('qualification_status').notNull().default('unverified'), // unverified, qualified, priority, excluded
  score: integer('score').default(0),
  scoreVersion: text('score_version').default('v1.0'),
  websiteUrl: text('website_url'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  placeId: text('place_id'),
  googleRating: text('google_rating'),
  reviewCount: integer('review_count'),
  sourceUrl: text('source_url'),
  sourceCapturedAt: timestamp('source_captured_at', { withTimezone: true }),
  websiteObservation: text('website_observation'),
  commercialConsequence: text('commercial_consequence'),
  hasHighCustomerValue: boolean('has_high_customer_value').default(false).notNull(),
  hasWeakOrOutdatedWebsite: boolean('has_weak_or_outdated_website').default(false).notNull(),
  hasDecisionMakerRoute: boolean('has_decision_maker_route').default(false).notNull(),
  hasMultipleEmployeesOrLocations: boolean('has_multiple_employees_or_locations').default(false).notNull(),
  hasActiveAdsOrSocial: boolean('has_active_ads_or_social').default(false).notNull(),
  hasWeakBookingWorkflow: boolean('has_weak_booking_workflow').default(false).notNull(),
  hasRecentGrowthTrigger: boolean('has_recent_growth_trigger').default(false).notNull(),
  scoreConfirmedAt: timestamp('score_confirmed_at', { withTimezone: true }),
  scoreConfirmedBy: text('score_confirmed_by'),
  assignedUserId: text('assigned_user_id'),
  sourceId: text('source_id'),
  notes: text('notes'),
  disqualificationReason: text('disqualification_reason'),
  nextAction: text('next_action'),
  nextActionAt: timestamp('next_action_at', { withTimezone: true }),
  lastContactedAt: timestamp('last_contacted_at', { withTimezone: true }),
  lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('prospects_campaign_idx').on(table.campaignId),
  index('prospects_queue_idx').on(table.qualificationStatus, table.status, table.nextActionAt),
]);

export const prospectSources = pgTable('prospect_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  sourceName: text('source_name').notNull(),
  sourceUrl: text('source_url'),
  sourceRecordId: text('source_record_id'),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  capturedBy: text('captured_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('prospect_sources_prospect_idx').on(table.prospectId),
]);

// -----------------------------------------------------------------------------
// Contacts (Decision-Makers & Staff)
// -----------------------------------------------------------------------------
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  fullName: text('full_name').notNull(),
  roleTitle: text('role_title'),
  email: text('email'),
  phone: text('phone'),
  phoneType: text('phone_type').default('public_business_line'), // public_business_line, business_direct_line, mobile, unknown
  isVerified: boolean('is_verified').default(false).notNull(),
  enrichmentSource: text('enrichment_source'), // apollo, manual, website
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('contacts_prospect_idx').on(table.prospectId),
]);

// -----------------------------------------------------------------------------
// Website Audits
// -----------------------------------------------------------------------------
export const audits = pgTable('audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull().default('draft'), // draft, internal_review, approved, sent, viewed
  targetOutcome: text('target_outcome'),
  findingsJson: text('findings_json'), // JSON string of conversion & technical findings
  scoreSummary: text('score_summary'),
  proposalRange: text('proposal_range'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  approvedBy: text('approved_by'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('audits_prospect_idx').on(table.prospectId),
  index('audits_status_idx').on(table.status),
]);

// -----------------------------------------------------------------------------
// Suppressions & Do-Not-Contact
// -----------------------------------------------------------------------------
export const suppressions = pgTable('suppressions', {
  id: uuid('id').primaryKey().defaultRandom(),
  scope: text('scope').notNull(), // phone, email, domain, company
  valueHash: text('value_hash').notNull(),
  reason: text('reason').notNull(), // opt_out, do_not_contact, competitor, bad_data
  prospectId: uuid('prospect_id').references(() => prospects.id),
  createdBy: text('created_by'),
  effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('suppressions_scope_hash_uidx').on(table.scope, table.valueHash),
  index('suppressions_prospect_idx').on(table.prospectId),
]);

// -----------------------------------------------------------------------------
// Activities & Call Logs
// -----------------------------------------------------------------------------
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  type: text('type').notNull(), // call, email, meeting, audit_sent, stage_change
  outcome: text('outcome'), // decision_maker_reached, voicemail, gatekeeper, audit_requested, meeting_booked, do_not_contact
  notes: text('notes'),
  performedBy: text('performed_by'),
  durationMinutes: integer('duration_minutes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('activities_prospect_created_idx').on(table.prospectId, table.createdAt),
  index('activities_outcome_idx').on(table.outcome),
]);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  activityId: uuid('activity_id').references(() => activities.id, { onDelete: 'set null' }),
  assignedUserId: text('assigned_user_id').notNull(),
  actionType: text('action_type').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('open'),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('tasks_due_status_idx').on(table.status, table.dueAt),
  index('tasks_prospect_idx').on(table.prospectId),
]);

export const opportunities = pgTable('opportunities', {
  id: uuid('id').primaryKey().defaultRandom(),
  prospectId: uuid('prospect_id').references(() => prospects.id, { onDelete: 'cascade' }).notNull(),
  primaryContactId: uuid('primary_contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  ownerUserId: text('owner_user_id').notNull(),
  stage: text('stage').notNull().default('qualified'),
  estimatedValue: integer('estimated_value'),
  probabilityPercent: integer('probability_percent').default(10).notNull(),
  packageName: text('package_name'),
  discoveryAt: timestamp('discovery_at', { withTimezone: true }),
  expectedCloseAt: timestamp('expected_close_at', { withTimezone: true }),
  lossReason: text('loss_reason'),
  nextAction: text('next_action'),
  nextActionAt: timestamp('next_action_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('opportunities_prospect_uidx').on(table.prospectId),
  index('opportunities_stage_idx').on(table.stage),
]);

export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull().default('draft'),
  scopeSummary: text('scope_summary').notNull(),
  amount: integer('amount').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('proposals_opportunity_idx').on(table.opportunityId),
  index('proposals_status_idx').on(table.status),
]);

export const projectHandoffs = pgTable('project_handoffs', {
  id: uuid('id').primaryKey().defaultRandom(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id, { onDelete: 'restrict' }).notNull(),
  proposalId: uuid('proposal_id').references(() => proposals.id, { onDelete: 'restrict' }),
  ownerUserId: text('owner_user_id').notNull(),
  scopeSummary: text('scope_summary').notNull(),
  kickoffAt: timestamp('kickoff_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('project_handoffs_opportunity_uidx').on(table.opportunityId),
]);

export const workSessions = pgTable('work_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  operatorUserId: text('operator_user_id').notNull(),
  workType: text('work_type').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  notes: text('notes'),
  workedAt: timestamp('worked_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('work_sessions_campaign_idx').on(table.campaignId, table.workedAt),
]);

// -----------------------------------------------------------------------------
// Audit Logs (Centurion Root System Trail)
// -----------------------------------------------------------------------------
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: text('action').notNull(), // export_csv, role_change, suppression_override, config_update
  performedBy: text('performed_by').notNull(),
  targetId: text('target_id'),
  detailsJson: text('details_json'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
