import { config } from 'dotenv';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

async function seed() {
  const { db } = await import('../src/db');
  const { campaigns, prospects, tasks } = await import('../src/db/schema');

  console.log('Seeding Lake County HVAC Campaign, Prospects, and Tasks...');

  // 1. Campaign
  const campaignName = 'Lake County CA HVAC Direct-Response Pilot';
  const existingCampaigns = await db.select().from(campaigns).where(eq(campaigns.name, campaignName));

  let campaignId: string;
  if (existingCampaigns.length > 0) {
    campaignId = existingCampaigns[0].id;
    console.log(`Campaign already exists: ${campaignName} (${campaignId})`);
  } else {
    const [insertedCampaign] = await db.insert(campaigns).values({
      name: campaignName,
      industry: 'HVAC',
      targetState: 'CA',
      targetCities: JSON.stringify(['Clearlake', 'Lakeport', 'Kelseyville', 'Middletown', 'Lower Lake']),
      minimumReviewCount: 10,
      minimumRating: '4.0',
      offerSummary: 'Direct-response single-problem emergency HVAC replacement landing pages, 1-tap call routing, Suno local audio branding, and $300-$500/mo GEO search retainers.',
      projectPriceMin: 2500,
      projectPriceMax: 5000,
      status: 'active',
    }).returning();
    campaignId = insertedCampaign.id;
    console.log(`Created campaign: ${campaignName} (${campaignId})`);
  }

  // 2. Prospects
  const prospectData = [
    {
      name: 'Right On Time Heating and Cooling™',
      normalizedName: 'right on time heating and cooling',
      industry: 'HVAC',
      status: 'qualified',
      qualificationStatus: 'priority',
      score: 85,
      phone: '(707) 367-1194',
      city: 'Clearlake',
      state: 'CA',
      websiteUrl: 'https://rightontimehvac.com',
      websiteObservation: "Classic 'Homepage Mistake' on Wix: Cluttered homepage mixes $129 dryer vent cleaning with urgent $10k heat pump/furnace emergencies. Zero audio/GEO schema; no sticky 1-tap mobile call bar.",
      commercialConsequence: 'Homeowners freezing in Clearlake winter bounce due to cognitive overload. High-margin HVAC replacements get buried behind minor maintenance jobs.',
      hasHighCustomerValue: true,
      hasWeakOrOutdatedWebsite: true,
      hasDecisionMakerRoute: true,
      hasWeakBookingWorkflow: true,
      notes: 'CSLB# 1066745. Family owned. Prime candidate for single-problem emergency heat pump replacement landing page.',
      nextAction: 'Initial Phone Call to (707) 367-1194 using 30-second direct-response opener',
      script: `30-SECOND CALL SCRIPT:
"Hi, my name is Joe Terry with Derivative Genius. I was looking at your site for Right On Time Heating in Clearlake... your site mixes emergency furnace repairs right in with dryer vent cleaning on one long page... when a heat pump breaks in winter, people get overwhelmed and bounce. We build single-problem video landing pages that get Lake County homeowners to tap to call your phone directly. Do you have 3 minutes later this week?"

OBJECTIVE:
Book a 10-minute demonstration of single-problem emergency landing page with 1-tap call routing.`,
    },
    {
      name: 'Economy Heating & Air Conditioning',
      normalizedName: 'economy heating and air conditioning',
      industry: 'HVAC',
      status: 'qualified',
      qualificationStatus: 'priority',
      score: 80,
      phone: '(707) 263-1151',
      address: '74 Soda Bay Rd',
      city: 'Lakeport',
      state: 'CA',
      zip: '95453',
      websiteUrl: 'https://economyheatingandairconditioning.com',
      websiteObservation: 'Runs on older GoDaddy Website Builder 8.0. Generic stock photography, no sticky tap-to-call on mobile, no dedicated emergency replacement page or audio branding.',
      commercialConsequence: 'Mobile conversion leak on Soda Bay Rd: over 80% of emergency repair searches happen on mobile phones, but GoDaddy layout forces manual pinch/zoom and unlinked phone numbers.',
      hasHighCustomerValue: true,
      hasWeakOrOutdatedWebsite: true,
      hasDecisionMakerRoute: true,
      hasWeakBookingWorkflow: true,
      notes: 'Established brick & mortar presence on Soda Bay Rd. Excellent local reputation, weak mobile conversion presence.',
      nextAction: 'Initial Phone Call to (707) 263-1151 offering 2-minute mobile audit video',
      script: `30-SECOND CALL SCRIPT:
"Hi, is this Economy Heating on Soda Bay Road? My name is Joe Terry. I noticed you're running on an older GoDaddy template that doesn't give mobile visitors a sticky tap-to-call button or dedicated emergency repair pages... over 80% of Lake County searches are mobile... can I send you a 2-minute video showing what you could fix?"

OBJECTIVE:
Get permission to email or text a 2-minute screen recording audit of their mobile booking leak.`,
    },
    {
      name: "Abbott's Heating and Air Conditioning",
      normalizedName: 'abbotts heating and air conditioning',
      industry: 'HVAC',
      status: 'qualified',
      qualificationStatus: 'priority',
      score: 90,
      city: 'Lakeport',
      state: 'CA',
      websiteUrl: 'https://abbottshvac.com',
      websiteObservation: 'Server returns HTTP 403 Forbidden to search engine crawlers and AI bots; lack of open-web JSON-LD entity schema confuses search identity with out-of-state Alabama businesses.',
      commercialConsequence: 'Complete local search invisibility on modern generative AI search (ChatGPT, Perplexity, Apple Intelligence) and search engine bot blacklisting.',
      hasHighCustomerValue: true,
      hasWeakOrOutdatedWebsite: true,
      hasDecisionMakerRoute: true,
      hasWeakBookingWorkflow: true,
      notes: 'Severe technical blocker (403 Forbidden). High leverage pitch: fix bot crawlability and establish verified Lake County entity identity.',
      nextAction: 'Warm phone outreach alerting owner to 403 bot blocking and search identity collision',
      script: `30-SECOND CALL SCRIPT:
"Hi, my name is Joe Terry with Derivative Genius. I wanted to quickly give your team a heads up — your website server is throwing 403 Forbidden errors and blocking search engine crawlers. When Lakeport homeowners or AI search assistants look for heating repair, your site is invisible or mixed up with an Alabama business. We fix that with clean local schema and fast direct-response landing pages. Would you like me to send a 2-minute breakdown?"

OBJECTIVE:
Present technical entity fix + GEO search presence package.`,
    },
  ];

  for (const p of prospectData) {
    const existing = await db.select().from(prospects).where(eq(prospects.normalizedName, p.normalizedName));
    let prospectId: string;

    if (existing.length > 0) {
      prospectId = existing[0].id;
      console.log(`Prospect exists: ${p.name} (${prospectId})`);
      await db.update(prospects).set({
        campaignId,
        websiteObservation: p.websiteObservation,
        commercialConsequence: p.commercialConsequence,
        phone: p.phone,
        notes: p.notes,
        nextAction: p.nextAction,
      }).where(eq(prospects.id, prospectId));
    } else {
      const [inserted] = await db.insert(prospects).values({
        campaignId,
        name: p.name,
        normalizedName: p.normalizedName,
        industry: p.industry,
        status: p.status,
        qualificationStatus: p.qualificationStatus,
        score: p.score,
        phone: p.phone,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        websiteUrl: p.websiteUrl,
        websiteObservation: p.websiteObservation,
        commercialConsequence: p.commercialConsequence,
        hasHighCustomerValue: p.hasHighCustomerValue,
        hasWeakOrOutdatedWebsite: p.hasWeakOrOutdatedWebsite,
        hasDecisionMakerRoute: p.hasDecisionMakerRoute,
        hasWeakBookingWorkflow: p.hasWeakBookingWorkflow,
        notes: p.notes,
        nextAction: p.nextAction,
      }).returning();
      prospectId = inserted.id;
      console.log(`Created prospect: ${p.name} (${prospectId})`);
    }

    // Insert Task if not already present
    const existingTasks = await db.select().from(tasks).where(eq(tasks.prospectId, prospectId));
    if (existingTasks.length === 0) {
      await db.insert(tasks).values({
        prospectId,
        assignedUserId: 'operator',
        actionType: 'call',
        title: `Outreach Call: ${p.name} (${p.city})`,
        notes: p.script,
        status: 'open',
        dueAt: new Date(Date.now() + 24 * 3600 * 1000),
      });
      console.log(`Created call task for ${p.name}`);
    } else {
      console.log(`Task already exists for ${p.name}`);
    }
  }

  // 3. General Operator Todo
  const generalTaskTitle = 'Produce 15-Second Suno HVAC Audio Jingle & Lake County Pre-Roll Demo';
  const existingGeneral = await db.select().from(tasks).where(eq(tasks.title, generalTaskTitle));
  if (existingGeneral.length === 0) {
    await db.insert(tasks).values({
      prospectId: null,
      assignedUserId: 'operator',
      actionType: 'follow_up',
      title: generalTaskTitle,
      notes: `Create sample audio jingle using Suno with catchy phonetics for Lake County HVAC emergencies ("When your heater's out in Lakeport, don't freeze tonight — tap to call Right On Time"). Embed as live audio demonstration on pitch audit pages.`,
      status: 'open',
      dueAt: new Date(Date.now() + 72 * 3600 * 1000),
    });
    console.log(`Created general task: ${generalTaskTitle}`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
