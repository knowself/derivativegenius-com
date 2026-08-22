# The First Priority

## DT-18 Startup Manual: 25-Company Founder-Led Manual Outreach Pilot

**Organization:** Derivative Genius  
**Operator:** Founder or repository maintainer  
**Pilot size:** 25 hand-qualified companies  
**Market:** One vertical across approximately five cities  
**Duration:** Ten business days  
**Primary channel:** Manual phone calls  
**Email rule:** Send only when requested or when continuing an established conversation  
**System of record:** `/centurion`  
**Status:** Startup operating manual  
**Version:** 1.0  
**Date:** August 19, 2026

**Readiness status:** Implementation complete; blocked only on Joe's signed-in DT-19 readiness test

Related documents:

- [Current Development Targets](./current-development-targets.md)
- [Website Prospecting System Plan](./Website-Prospecting-System-Plan.md)

---

## 1. Mission

The first priority is to learn whether Derivative Genius can repeatedly turn careful market research and respectful founder-led calls into qualified website-project conversations.

This pilot is not a contest to collect the most businesses, place the most calls, or generate the most audits. It exists to answer:

1. Which businesses are genuinely good candidates?
2. Which observed website problems earn attention?
3. Which call opener starts a useful conversation?
4. Which offer is clear and commercially credible?
5. Which objections repeat?
6. What follow-up behavior produces discovery calls and proposals?
7. Which repeated operator bottleneck, if any, deserves automation?

The operating loop is:

```text
Select narrowly
    -> Research manually
        -> Identify one real issue
            -> Call respectfully
                -> Listen and qualify
                    -> Record the outcome
                        -> Keep commitments
                            -> Measure and revise
```

## 2. Definition of success

The pilot succeeds when all 25 prospects have a documented disposition and the operator has enough evidence to make a dated **continue**, **revise**, or **stop** decision.

The preferred commercial result is:

- qualified conversations;
- at least one completed discovery call;
- at least one legitimate proposal; and
- ideally, one paid engagement.

A pilot that produces no proposal can still be complete if every outcome is recorded and the evidence clearly identifies whether the niche, qualification criteria, observation, opener, offer, or follow-up process should change.

### Primary metrics

| Metric | Definition |
|---|---|
| Qualified conversations per operator hour | Relevant decision-maker conversations divided by research, call, and follow-up hours |
| Decision-maker reach rate | Decision-makers reached divided by companies called |
| Follow-up commitment rate | Explicit follow-up agreements divided by decision-maker conversations |
| Discovery rate | Discovery calls held divided by qualified conversations |
| Proposal rate | Proposals issued divided by discovery calls held |
| Close rate | Closed-won projects divided by proposals issued |
| Average project value | Total value of won work divided by closed-won projects |

Raw prospect count, contacts found, calls attempted, and audits generated are supporting counts. They are not the goal.

## 3. Non-negotiable operating rules

1. Work one vertical for the entire pilot.
2. Use approximately five cities in the same practical market region.
3. Qualify only 25 companies before expanding the list.
4. Record one specific and defensible website observation before calling.
5. Use human judgment; the score is a prompt, not a verdict.
6. Call manually. Do not use prerecorded, automated, or AI-voice cold calls.
7. Do not send automated cold texts or sequences.
8. Send an email only when requested or when continuing an established conversation.
9. Do not claim traffic, conversion, ranking, compliance, or lost-revenue figures without evidence.
10. Do not create or send a full audit before the prospect shows interest or the conversation establishes a credible reason to continue.
11. Record every outcome immediately.
12. Honor every opt-out immediately and permanently unless an approved policy says otherwise.
13. Never override a suppression because a prospect looks valuable.
14. Keep prospect data private and out of repository files, screenshots, analytics, and public pages.
15. Do not add outreach automation during the pilot.

This manual is an operating guide, not legal advice. Follow approved outreach policies and obtain qualified legal guidance for the jurisdictions and communication methods used.

## 4. Centurion readiness gate

Do not begin live calls until the minimum system-of-record workflow works end to end.

### Implemented current capabilities

The current application exposes:

- campaign creation with offer and price range at `/centurion/campaigns`;
- quote-aware, campaign-assigned CSV import with explicit scoring evidence and source provenance at `/centurion/import`;
- editable prospect evidence, decision-maker contacts, transparent scoring, audits, and opportunities on prospect detail pages;
- a due-first queue at `/centurion/queue` covering every required call outcome, custom notes, and dated next actions;
- atomic phone- or company-level do-not-contact suppression using keyed hashes;
- audit review and approval at `/centurion/audits`;
- real opportunities, proposals, and project handoffs at `/centurion/pipeline`;
- real funnel, pipeline, and founder-time metrics at `/centurion/reports`; and
- administrator-only suppression, audit-log review, and export at `/centurion/compliance`.

### Remaining verification gap

The implementation, live database migration, automated tests, production build, and unauthenticated-denial checks pass. Joe must still sign in and execute the checklist below using disposable test data. Do not begin live calls until that human workflow test passes. This gate does not authorize scaled automation.

### Readiness test

Before Day 1, use test data to confirm:

- [ ] The authorized operator can sign in to `/centurion`.
- [ ] A pilot campaign can be created.
- [ ] A test prospect can be imported without creating a duplicate.
- [ ] The prospect appears in the list and detail views.
- [ ] A priority prospect appears in the daily queue.
- [ ] A call outcome appears in outreach history.
- [ ] Selecting do-not-contact creates a suppression and removes the prospect from active outreach.
- [ ] Each required pilot field and outcome has an approved place in Centurion.
- [ ] Follow-up commitments and due dates can be retrieved reliably.
- [ ] Proposal evidence and the final pilot decision can be recorded without prospect PII entering the repository.
- [ ] An imported prospect can be assigned to the pilot campaign, reviewed by a human, and promoted into the action queue.
- [ ] A viewer cannot create, edit, call, suppress, or export prospect data.
- [ ] A sales operator cannot perform administrator-only export or compliance actions.
- [ ] Suppression identifiers are keyed hashes rather than raw normalized contact values.

DT-19 is complete only when every check passes. Until then, DT-18 remains blocked and no live calls begin. Implement only the smallest operator-support changes required to pass the gate; do not use a parallel private spreadsheet as the permanent system of record.

## 5. The first 90 minutes

Complete these actions in order:

1. Reserve a daily two-hour pilot block for ten business days.
2. Choose one vertical using the market-selection test below.
3. Choose approximately five nearby or commercially comparable cities.
4. Write a one-sentence offer and a credible project range.
5. Create the campaign in `/centurion/campaigns`.
6. Research the first five businesses.
7. Reject weak candidates instead of filling the list for its own sake.
8. Record one evidence-based website observation for each accepted company.
9. Import the first five prospects.
10. Run the Centurion readiness test before calling anyone.

Do not spend the first day polishing scripts, building integrations, or researching all 25 companies. The goal is to reach a safe first calling block quickly.

## 6. Select the market

### Vertical-selection test

Choose a vertical where most answers are yes:

- Can one or a few new customers plausibly justify a $2,000-$5,000 website project?
- Do established operators depend on calls, quote requests, bookings, or consultations?
- Are at least five qualified companies discoverable in each target city?
- Can the owner or responsible manager usually be reached through a public business channel?
- Are weak websites common enough to create a real improvement opportunity?
- Can Derivative Genius describe a fixed-scope outcome in plain language?
- Can the operator understand the buying process without becoming an industry expert?

Good starting candidates from the prospecting plan include HVAC, roofing, plumbing, electrical contracting, tree service, restoration, remodeling, pest control, dental practices, med spas, law firms, property management, and commercial cleaning.

### City-selection test

Choose approximately five cities that:

- share a state or compact region when practical;
- use similar customer language and market conditions;
- contain enough established businesses for comparison;
- fall within calling times the operator can manage consistently; and
- are not so large that the pilot becomes unfocused.

### Market lock

Record this before research:

| Decision | Pilot value |
|---|---|
| Vertical | |
| State or region | |
| City 1 | |
| City 2 | |
| City 3 | |
| City 4 | |
| City 5 | |
| Reason this market can support the project price | |
| Date locked | |

Do not change the market mid-pilot because of a few unsuccessful calls. Use the Day 5 review gate.

## 7. Define the pilot offer

The offer is a conversation hypothesis, not a guarantee.

Complete this one-page offer card:

| Offer element | Operator entry |
|---|---|
| Ideal client | |
| Business problem | |
| Fixed-scope outcome | |
| Included deliverables | |
| Explicit exclusions | |
| Expected project range | $2,000-$5,000 unless deliberately changed |
| Indicative timeline | |
| Required client inputs | |
| Primary proof | |
| Discovery-call invitation | |

### One-sentence offer formula

> We help [type of company] improve [customer action or business workflow] by rebuilding [specific website experience] as a focused [project type].

Example structure:

> We help established service businesses turn more mobile visitors into qualified calls by rebuilding the homepage, service pages, and quote-request path as a focused website project.

Do not promise a number of leads, a search ranking, a compliance result, or revenue.

## 8. Build the 25-company list

Research five companies per city unless market density makes another balanced allocation more useful.

### Required prospect record

Every accepted prospect needs:

- public business name;
- vertical;
- city and state;
- public website;
- public business phone;
- source and capture date;
- review count when available;
- decision-maker route or the best lawful public path;
- one specific website observation;
- why the observation matters to a customer action;
- qualification result;
- current suppression status; and
- next action.

### Qualification checklist

Accept a prospect when:

- [ ] The business appears active.
- [ ] Its economics can plausibly support the project range.
- [ ] It has an identifiable website problem related to a real customer action.
- [ ] The problem fits a fixed-scope Derivative Genius engagement.
- [ ] A public business contact route exists.
- [ ] Its reputation and operating signals are credible.
- [ ] No conflict, restriction, or suppression applies.

Reject or disqualify a prospect when:

- permanently closed or apparently inactive;
- required licensing appears inactive;
- reputation problems make the engagement unsuitable;
- no current operations can be verified;
- a do-not-contact instruction exists;
- a client conflict or provider restriction applies; or
- the apparent need falls outside the offer.

### Research timebox

Spend no more than 10-15 minutes on initial qualification. Record uncertainty instead of inventing an answer. Deep research belongs after engagement, not before the first call.

## 9. Find one useful website observation

The observation is the reason for the call, not a fear tactic.

Look first at:

1. whether the main service and customer are immediately clear;
2. whether the primary call, quote, booking, or consultation action is obvious on mobile;
3. whether the form or booking path creates avoidable friction;
4. whether service-area and trust information support the buying decision;
5. whether reviews, credentials, or proof are visible and credible;
6. whether outdated content creates confusion; and
7. whether a broken or unsafe experience is plainly observable.

### Observation formula

> On [page/device], I observed [specific fact]. A prospective customer trying to [action] may have difficulty because [cautious consequence].

Good:

> On the mobile homepage, the request-a-quote action does not appear until after several content sections. A homeowner trying to get an estimate may have to search for the next step.

Avoid:

> Your website is losing $20,000 every month.

### Observation quality test

Before calling, confirm:

- [ ] It is visible and reproducible.
- [ ] It relates to a customer or business action.
- [ ] It can be explained in one sentence.
- [ ] It avoids invented performance or revenue claims.
- [ ] It acknowledges the site's strengths when appropriate.
- [ ] Derivative Genius can plausibly improve it.

## 10. Prepare the call

Open the prospect's detail page and website before dialing. Have only these items visible:

- contact name or requested role;
- public business number;
- the single website observation;
- one discovery question;
- the offer sentence;
- the next-action options; and
- suppression status.

The goal of the first call is not to sell the entire project. It is to learn whether the observation matters and earn the next appropriate conversation.

## 11. Call scripts

Use the scripts as scaffolding. Speak naturally and stop when the prospect is not interested.

### Gatekeeper opener

> Hi, this is [name] with Derivative Genius. I noticed one specific issue in the website's [quote, booking, or contact] path and wanted to ask the person responsible for the website whether it is already on their radar. Who would be best to speak with?

If asked for details:

> On mobile, [short factual observation]. I am not calling about an emergency or claiming a guaranteed result. I wanted to see whether improving that customer path is relevant this quarter.

### Decision-maker opener

> Hi [name], this is [name] with Derivative Genius. I was reviewing [company]'s website and noticed [one factual observation]. Is improving that part of the customer experience something you are already considering, or is it not a priority right now?

Then stop and listen.

### If there is interest

Ask no more than three useful questions:

1. What action do you most want a website visitor to take?
2. Where does the current process create friction for customers or staff?
3. Is there a real timeframe or event driving a change?

Close with:

> I can prepare a short review focused on what we discussed and walk through it with you. Would [specific day and time] be useful?

### If there is no interest

> Understood. Thanks for being direct. I will mark that correctly and let you get back to your day.

Do not argue, create urgency, or immediately introduce another offer.

### If follow-up is requested

Confirm:

- what to send;
- the approved email address;
- who should receive it;
- the next date and time;
- whether the follow-up is an email, call, or meeting; and
- the question the follow-up should answer.

Repeat the commitment before ending the call.

### Voicemail

Use voicemail only when appropriate under the approved outreach policy:

> Hi [name], this is [name] with Derivative Genius at [callback number]. I noticed one specific issue with the [quote, booking, or contact] path on [company]'s website. Nothing urgent. If website improvements are relevant this quarter, you can reach me at [callback number]. Again, this is [name] at [number].

Keep it brief. Do not use fabricated urgency.

## 12. Log the outcome immediately

Do not make the next call until the previous outcome and next action are recorded.

### Standard outcomes

| Outcome | Required action |
|---|---|
| No answer | Record attempt; schedule the next permitted action |
| Voicemail | Record message and callback number used |
| Gatekeeper | Record name, role, routing information, and permitted next step |
| Wrong number | Correct the record; do not repeat the failed route |
| Decision-maker reached | Record the problem discussed and qualification result |
| Audit requested | Record scope, recipient, permission, and promised delivery date |
| Meeting booked | Record date, time, participants, agenda, and confirmation method |
| Follow-up requested | Record exact commitment and due date |
| Not interested | Record the stated reason without rebuttal |
| Do not contact | Select do-not-contact immediately and verify suppression |
| Disqualified | Record the evidence and remove from active outreach |

All outcomes are available in the queue UI. For `follow_up_requested`, a due date is mandatory; for any other outcome, add a due date whenever a commitment was made.

### Useful note format

```text
Reached:
Role:
What they said:
Need or trigger:
Objection:
Permission granted:
Commitment made:
Next action:
Due date:
```

Record facts and concise paraphrases. Do not store unnecessary personal details.

## 13. Requested follow-up email

Send this only after the prospect requests information or agrees to continue.

### Subject

```text
The website item we discussed
```

### Message

> Hi [name],
>
> Thanks for speaking with me. As requested, the item I noticed was [one factual observation].
>
> Based on our conversation, the relevant goal is [their stated goal]. I will [specific promised action] by [date].
>
> Our next step is [meeting or agreed follow-up] on [date and time].
>
> — [name]  
> Derivative Genius  
> [contact information]

Do not turn a requested follow-up into an automated marketing sequence.

## 14. Prepare an audit only after interest

An audit should help the prospect make a decision, not overwhelm or embarrass them.

Include:

1. the business goal stated by the prospect;
2. current website strengths;
3. no more than three observed conversion problems;
4. private screenshots that support the observations;
5. cautious commercial consequences;
6. recommended improvements;
7. an appropriate package or project range; and
8. a clear invitation to review the findings.

Before delivery:

- [ ] Every claim is observable or attributed.
- [ ] No traffic, conversion, ranking, compliance, or revenue figure is invented.
- [ ] Screenshots remain private.
- [ ] The audit does not publicly shame the prospect.
- [ ] The recipient and delivery method were approved.
- [ ] A human has reviewed the final document.
- [ ] The next conversation is scheduled or explicitly invited.

## 15. Daily operating cadence

Reserve one uninterrupted two-hour block.

| Block | Duration | Work |
|---|---:|---|
| Review | 10 minutes | Check suppressions, due commitments, and today's queue |
| Research | 30 minutes | Qualify the next two or three companies and record observations |
| Call | 60 minutes | Place manual calls and log each outcome before continuing |
| Follow up | 15 minutes | Complete only requested emails, audits, and commitments |
| Debrief | 5 minutes | Record time used, repeated objections, and one lesson |

Follow-up commitments come before new cold calls.

### Daily shutdown checklist

- [ ] Every call has an outcome.
- [ ] Every promise has an owner and due date.
- [ ] Every opt-out is suppressed.
- [ ] No sensitive prospect data was placed in repository files.
- [ ] Research, call, and follow-up time is recorded.
- [ ] One short learning note is captured.
- [ ] Tomorrow's first action is clear.

## 16. Ten-business-day sprint

| Day | Primary objective | Exit condition |
|---:|---|---|
| 0 | Readiness | Market, offer, campaign, and system test approved |
| 1 | First live evidence | Five qualified prospects; first call block completed |
| 2 | Improve clarity | Ten total prospects; opener revised only from evidence |
| 3 | Build consistency | Fifteen total prospects; all commitments current |
| 4 | Complete initial list | Twenty-five qualified prospects documented |
| 5 | Midpoint review | Continue, adjust one variable, or pause with reason |
| 6 | Follow-up discipline | All due commitments completed before new calls |
| 7 | Discovery conversion | Interested prospects moved to scheduled conversations |
| 8 | Audit and scope | Requested reviews delivered with human approval |
| 9 | Proposal readiness | Qualified opportunity has scope, price, and next decision |
| 10 | Final review | Every prospect disposed; continue, revise, or stop recorded |

The calendar can flex around prospect availability, but the pilot remains ten business days and the record remains complete.

## 17. Midpoint review

At the end of Day 5, review facts rather than mood.

### Continue unchanged when

- the target businesses fit the offer;
- the observation earns relevant conversations;
- decision-makers can be reached;
- commitments are being honored; and
- no material compliance or system issue exists.

### Change one variable when

- the same objection repeats;
- the observation is routinely irrelevant;
- the opener causes predictable confusion;
- qualification is letting in unsuitable companies; or
- the offer cannot be explained clearly.

Change only one of these at a time:

- qualification threshold;
- website observation category;
- opener;
- discovery question;
- offer framing; or
- follow-up asset.

### Pause when

- opt-outs or complaints indicate a policy problem;
- the system cannot record outcomes or suppressions safely;
- public claims or proof cannot be supported;
- most businesses clearly cannot justify the project range; or
- the operator is not completing promised follow-ups.

## 18. Final pilot review

Complete this decision record on Day 10:

| Review item | Result |
|---|---|
| Companies qualified | /25 |
| Companies called | /25 |
| Decision-makers reached | |
| Qualified conversations | |
| Follow-up commitments | |
| Discovery calls held | |
| Audits requested | |
| Proposals issued | |
| Closed-won projects | |
| Closed revenue | |
| Total operator hours | |
| Qualified conversations per operator hour | |
| Most effective observation | |
| Most common objection | |
| Biggest repeated workflow bottleneck | |

### Decision

Choose exactly one:

- **Continue:** The market and offer show enough evidence for another controlled cohort.
- **Revise:** A specific market, offer, message, or workflow variable must change before the next cohort.
- **Stop:** Evidence shows this motion is not currently commercially or operationally viable.

Record:

```text
Decision:
Date:
Evidence:
What stays the same:
What changes:
Next cohort or action:
Automation justified:
Measured bottleneck addressed:
```

## 19. Automation gate

Do not build scaled discovery, mass enrichment, autonomous sequences, automated audit delivery, or volume-oriented background jobs until the pilot produces:

- qualified conversations;
- at least one proposal; and
- a repeated, measured bottleneck that software can remove.

Automation is justified only when this sentence can be completed:

> During the pilot, [repeated manual task] consumed [measured time or caused measured failures], and automating it would improve [business outcome] without weakening judgment, safety, or compliance.

Examples of valid later bottlenecks:

- duplicate checks repeatedly consume research time;
- follow-up commitments are missed despite complete logging;
- qualified companies cannot be prioritized reliably;
- the same approved audit section is recreated manually; or
- provider usage needs bounded cost and failure monitoring.

“We want more leads” is not a sufficient automation case.

## 20. Day-one checklist

- [ ] Reserve ten daily pilot blocks.
- [ ] Choose one vertical.
- [ ] Choose approximately five cities.
- [ ] Complete the market lock.
- [ ] Complete the offer card.
- [ ] Create the Centurion campaign.
- [ ] Pass the Centurion readiness gate.
- [ ] Research and qualify five companies.
- [ ] Record one website observation per company.
- [ ] Confirm public business contact routes and suppressions.
- [ ] Open the first prospect record.
- [ ] Place the first manual call.
- [ ] Log the outcome and next action immediately.

The first priority begins when the first qualified prospect is called and the result is recorded—not when the list, script, website, or software feels perfect.
