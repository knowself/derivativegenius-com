import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

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
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

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
  assignedUserId: text('assigned_user_id'),
  lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

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
});

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
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// Suppressions & Do-Not-Contact
// -----------------------------------------------------------------------------
export const suppressions = pgTable('suppressions', {
  id: uuid('id').primaryKey().defaultRandom(),
  scope: text('scope').notNull(), // phone, email, domain, company
  valueHash: text('value_hash').notNull(),
  reason: text('reason').notNull(), // opt_out, do_not_contact, competitor, bad_data
  prospectId: uuid('prospect_id').references(() => prospects.id),
  effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
