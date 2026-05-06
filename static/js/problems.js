// Categories + problems for the team-of-silicons landing funnel.
// Each problem has a `text` (the user-facing pain) and a `solution`
// (how a silicon — an AI 'employee' on the customer's server, chatted
// with via Telegram — handles it). Source: Shivam, May 6 2026.
window.SILICON_PROBLEMS = [
  {
    key: "founder",
    label: "Founder / CEO",
    problems: [
      {
        text: "I don't have enough time to think.",
        solution: "your founder silicon clears low-value meetings, drafts replies, and surfaces only the decisions that actually need you. you get hours back for deep work."
      },
      {
        text: "Everything needs my approval.",
        solution: "silicon proposes the call in chat — you tap yes or rewrite. once it sees the pattern twice, it just handles it. approvals shrink week over week."
      },
      {
        text: "Fundraising follow-ups are eating my week.",
        solution: "silicon tracks every investor thread, drafts personalized follow-ups in your voice, and surfaces who's gone quiet. you approve in two taps."
      },
      {
        text: "Investor updates take too long.",
        solution: "silicon assembles a draft from the week's commits, deals, hires, and metrics every monday. you review and ship in 5 minutes."
      },
      {
        text: "I don't know what to focus on today.",
        solution: "silicon reads yesterday's chaos and your calendar, then sends a 'top 3 for today' message at 7am — ranked by impact, not noise."
      },
      {
        text: "I keep switching contexts.",
        solution: "silicon holds the threads — the agency call, the legal review, the senior hire. when you come back to one, it gives you a 30-second catch-up before you ask."
      },
      {
        text: "Important decisions are stuck in my head.",
        solution: "silicon journals decisions out of you in chat, indexes them, and resurfaces the right one the next time you're stuck on something similar."
      },
      {
        text: "I need someone to turn chaos into clear next steps.",
        solution: "send a voice note of everything on your mind. silicon comes back with a clean list — owners, deadlines, and what's blocked on you."
      }
    ]
  },
  {
    key: "sales",
    label: "Sales",
    problems: [
      {
        text: "Researching and finding the right leads.",
        solution: "give silicon your ICP. it pulls from linkedin, crunchbase, and your existing pipeline, scores each lead, and drops the qualified ones into your CRM with the context you'd need on a call."
      },
      {
        text: "Not enough follow-ups.",
        solution: "silicon watches every deal and pings you (or sends the message itself, with your sign-off) the moment a thread goes cold. nothing slips."
      },
      {
        text: "Personalizing outbound takes too long.",
        solution: "silicon researches each prospect — recent posts, company news, mutuals — and drafts a personalized opener. you approve or tweak."
      },
      {
        text: "CRM is always messy.",
        solution: "after every call, silicon updates the CRM from the transcript: notes, next steps, stage, contacts. no manual entry."
      },
      {
        text: "Good leads go cold.",
        solution: "silicon flags engagement drops within hours and proposes the next move — a check-in, a case study, a calendar nudge. you just say go."
      },
      {
        text: "We don't know who is actually worth chasing.",
        solution: "silicon scores your pipeline weekly using your closed-won patterns. you get a ranked list — chase these first, drop these, revisit these in 30 days."
      },
      {
        text: "Proposal and deck work slows deals down.",
        solution: "tell silicon the deal context. it generates a tailored proposal or deck from your templates in minutes. you review, not write from scratch."
      },
      {
        text: "Sales calls are not summarized properly.",
        solution: "silicon listens to the call, posts the summary, action items, and CRM update to your channel within 10 minutes of hang-up."
      }
    ]
  },
  {
    key: "marketing",
    label: "Marketing",
    problems: [
      {
        text: "We don't post consistently.",
        solution: "silicon plans your social calendar from your roadmap, customer wins, and product news. it drafts each post and queues them — you approve once a week."
      },
      {
        text: "We don't know what content to make.",
        solution: "silicon mines your sales calls, support tickets, and competitor content for the questions your market is actually asking. it ships a content brief every monday."
      },
      {
        text: "Launches are rushed.",
        solution: "silicon owns the launch checklist — copy, assets, scheduled posts, email blasts, press list. it nudges owners daily on what's outstanding."
      },
      {
        text: "SEO is ignored.",
        solution: "silicon tracks rankings, finds keyword gaps, and writes briefs (or full drafts) for the highest-leverage topics. your blog actually moves."
      },
      {
        text: "Case studies never get written.",
        solution: "silicon spots a closed customer, pulls quotes from emails and calls, drafts the case study, and pings the customer for approval. you review the final."
      },
      {
        text: "Competitor research is not regular.",
        solution: "silicon watches competitor sites, releases, pricing pages, and posts. it sends a weekly diff — what changed, what to react to."
      },
      {
        text: "Our positioning is unclear.",
        solution: "silicon runs message tests on ad copy and landing pages, reads what resonates, and proposes positioning tweaks backed by the actual numbers."
      },
      {
        text: "Good ideas die in notes.",
        solution: "drop ideas in chat. silicon files them by theme, resurfaces them when relevant work comes up, and turns the green-lit ones into briefs."
      }
    ]
  },
  {
    key: "product",
    label: "Product",
    problems: [
      {
        text: "User feedback is scattered everywhere.",
        solution: "silicon ingests slack, intercom, app store reviews, and support tickets. it tags each piece of feedback, clusters themes, and posts a weekly digest."
      },
      {
        text: "We don't know what users really want.",
        solution: "silicon clusters feedback by user type and frequency, then maps it to retention and churn signals. you see what actually matters, not what's loudest."
      },
      {
        text: "Roadmap decisions feel messy.",
        solution: "silicon scores feature requests by impact, effort, and strategic fit using your past data. you walk into roadmap reviews with a draft you can argue with."
      },
      {
        text: "Feature requests pile up.",
        solution: "silicon triages every request the moment it lands, dedupes against existing ones, and replies to the user. nothing gets lost."
      },
      {
        text: "Specs take too long to write.",
        solution: "describe the feature in chat. silicon writes the spec — user stories, edge cases, open questions — in your team's format. you edit, not draft."
      },
      {
        text: "Competitor research is outdated.",
        solution: "silicon tracks every competitor's product changelog, pricing, and review sites. you get a fresh picture every week without anyone going hunting."
      },
      {
        text: "User interviews are not synthesized.",
        solution: "drop interview transcripts in. silicon extracts themes, quotes, jobs-to-be-done, and contradictions. by the next morning you have the synthesis."
      },
      {
        text: "We don't know what is actually moving retention.",
        solution: "silicon correlates feature usage with retention cohorts and surfaces the actual drivers. no more guessing at the dashboard."
      }
    ]
  },
  {
    key: "engineering",
    label: "Engineering",
    problems: [
      {
        text: "Docs are outdated.",
        solution: "silicon watches PRs and updates docs to match. when behavior changes, the doc changes. you review the diff, not write from scratch."
      },
      {
        text: "Bugs are not triaged well.",
        solution: "silicon watches your issue tracker, classifies new bugs by severity and area, pings the right engineer, and updates the triage doc daily."
      },
      {
        text: "Tech debt keeps growing.",
        solution: "silicon maintains a live tech-debt register from TODOs, hot files, and incident retros. each sprint it proposes one piece of debt worth paying down."
      },
      {
        text: "Nobody writes tests properly.",
        solution: "silicon reviews PRs for test coverage, drafts the missing tests, and posts them as suggestions on the PR. tests get written without a fight."
      },
      {
        text: "PRs wait too long.",
        solution: "silicon nags reviewers, summarizes the diff for them, and flags blocked PRs in standup. review cycle drops from days to hours."
      },
      {
        text: "Internal tools never get built.",
        solution: "silicon scopes and ships small internal tools — a slack command, a dashboard, a script — directly. the 'someone should build this' tickets actually get done."
      },
      {
        text: "Onboarding new engineers is painful.",
        solution: "silicon answers a new hire's questions in chat 24/7 — codebase, conventions, who owns what. they ramp without burning your senior engineers."
      },
      {
        text: "Important context is stuck in Slack.",
        solution: "silicon indexes channels, decisions, and threads. ask 'why did we choose redis over kafka?' and get the answer with links to the original convo."
      }
    ]
  },
  {
    key: "support",
    label: "Customer Support / Success",
    problems: [
      {
        text: "We answer the same questions again and again.",
        solution: "silicon learns your answers from past tickets and drafts replies for new ones. agents review and send. response time drops, quality stays human."
      },
      {
        text: "Onboarding users takes too much manual work.",
        solution: "silicon runs the playbook — welcome message, setup guide, check-ins on day 1, 7, 30 — personalized from each user's signup info."
      },
      {
        text: "Churn reasons are unclear.",
        solution: "silicon interviews churned users in your voice, codes the responses, and posts a churn-reasons report monthly. patterns become obvious."
      },
      {
        text: "Feedback doesn't reach product.",
        solution: "silicon routes every product-relevant ticket to a tagged feedback channel, dedupes, and links it to the request tracker. PMs see signal, not noise."
      },
      {
        text: "Help docs are stale.",
        solution: "silicon watches tickets for 'this doc is wrong' or repeated questions, drafts the doc update, and pings the owner. docs stay current without a quarterly cleanup."
      },
      {
        text: "We don't check in with customers proactively.",
        solution: "silicon schedules check-ins based on usage drops, expansion signals, and renewal dates. you walk into each call with a brief, not a blank slate."
      },
      {
        text: "Support tickets are not categorized well.",
        solution: "silicon tags every ticket — by product area, severity, customer tier — the moment it's created. routing and reporting just work."
      },
      {
        text: "We don't know which customers are at risk.",
        solution: "silicon watches usage, support volume, sentiment, and exec changes. it posts a weekly at-risk list with the why and the suggested play."
      }
    ]
  },
  {
    key: "operations",
    label: "Operations",
    problems: [
      {
        text: "Processes are in everyone's head.",
        solution: "silicon interviews the team in chat about how each process actually runs, and turns the answers into living SOPs. tribal knowledge stops being tribal."
      },
      {
        text: "SOPs don't exist or are outdated.",
        solution: "silicon writes SOPs from observed work — slack, calls, tickets — and updates them as the process changes. always current, always real."
      },
      {
        text: "Tools are all over the place.",
        solution: "silicon talks to your tools through MCP and APIs. you tell it what you need, it figures out which tool to use. one chat, every tool."
      },
      {
        text: "Nobody knows the source of truth.",
        solution: "silicon picks the canonical source for each kind of question — finance numbers, customer data, roadmap — and routes every question there. arguments end."
      },
      {
        text: "Repetitive admin eats time.",
        solution: "list the admin chores. silicon takes them one by one — invoices, approvals, expense coding, calendar logistics — and you stop doing them."
      },
      {
        text: "Vendor follow-ups get missed.",
        solution: "silicon owns the vendor calendar — renewals, deliverables, payments. it pings the right person on the right day and escalates if ignored."
      },
      {
        text: "Internal requests are chaotic.",
        solution: "silicon becomes the front door. employees ask in chat, silicon routes, tracks, and follows up. no more 'who do i ask for X' confusion."
      },
      {
        text: "Simple work needs too many humans.",
        solution: "silicon owns the simple work end to end — form fills, data moves, cross-tool updates — so humans only touch the judgment calls."
      }
    ]
  },
  {
    key: "finance",
    label: "Finance",
    problems: [
      {
        text: "Runway tracking is messy.",
        solution: "silicon pulls bank, payroll, and AR data daily and updates a runway model. ask 'what's runway if we hire 3 in q3?' and get an answer in seconds."
      },
      {
        text: "Invoices and payments need chasing.",
        solution: "silicon sends polite chase emails on the right cadence, escalates the late ones, and updates the AR sheet. you only step in when escalation is needed."
      },
      {
        text: "Spend is not reviewed properly.",
        solution: "silicon categorizes every transaction, flags anomalies, and posts a weekly spend summary by team and vendor. the review takes 5 minutes."
      },
      {
        text: "Forecasting takes too long.",
        solution: "silicon maintains the forecast live from your CRM, pipeline, and historicals. you don't rebuild the model — you ask it what-if questions."
      },
      {
        text: "Metrics are not updated regularly.",
        solution: "silicon owns the metrics dashboard — pulls, validates, posts daily. the numbers everyone uses are the numbers silicon updates."
      },
      {
        text: "Investor numbers need manual prep.",
        solution: "silicon assembles the investor pack — MRR, burn, runway, top wins — from source systems on the schedule you set. you review, you don't build."
      },
      {
        text: "We don't know where money is leaking.",
        solution: "silicon audits subscriptions, contractor invoices, and unused tools monthly, and posts a 'cancel these' list with the savings. usually pays for itself."
      },
      {
        text: "Finance work is always reactive.",
        solution: "silicon runs the close, the reconciliation, the reports on a schedule. fires stop because the work is already done before the fire starts."
      }
    ]
  },
  {
    key: "people",
    label: "People / Hiring",
    problems: [
      {
        text: "Finding good candidates takes too long.",
        solution: "silicon sources from linkedin, github, and your network using your role brief. you wake up to a shortlist with notes on each candidate."
      },
      {
        text: "Screening resumes is painful.",
        solution: "silicon screens every resume against your rubric, scores them, and explains its reasoning. you review the top 10, not the top 200."
      },
      {
        text: "Interview scheduling is messy.",
        solution: "silicon coordinates with candidates and interviewers, books rooms, sends prep, and reschedules when things break. zero back-and-forth from you."
      },
      {
        text: "Onboarding is inconsistent.",
        solution: "silicon runs every new hire through the same playbook — accounts, intros, first-week reading, check-ins on day 5 and 30. nothing gets skipped."
      },
      {
        text: "Hiring notes are scattered.",
        solution: "silicon collects interview notes from each panelist into a single candidate doc, surfaces disagreements, and prepares the debrief. decisions get faster."
      },
      {
        text: "We don't follow up with candidates fast enough.",
        solution: "silicon replies to every applicant within hours and keeps active candidates warm with personalized check-ins. your funnel stops leaking."
      },
      {
        text: "New hires don't get enough context.",
        solution: "silicon answers a new hire's questions in chat — codebase, customers, strategy — drawing on indexed company knowledge. they ramp in days, not weeks."
      },
      {
        text: "Culture/process docs are missing.",
        solution: "silicon writes the missing docs from how the team actually works — calls, slack threads, decisions — and keeps them updated as things change."
      }
    ]
  },
  {
    key: "legal",
    label: "Legal / Compliance / Security",
    problems: [
      {
        text: "Contracts take too long to review.",
        solution: "silicon redlines incoming contracts against your playbook in minutes, flags non-standard terms, and proposes counter-language. legal reviews the diff."
      },
      {
        text: "Security questionnaires are painful.",
        solution: "silicon answers security questionnaires from your evidence library — SOC2 status, data flows, controls. you sanity-check, you don't draft."
      },
      {
        text: "Privacy docs are outdated.",
        solution: "silicon watches your data flows and vendor list, and updates the privacy policy and DPA when something changes. always shipping-ready for buyers."
      },
      {
        text: "Vendor reviews slow deals.",
        solution: "silicon owns vendor reviews end-to-end — security questionnaire, DPA, references — on a clock. enterprise deals stop stalling on procurement."
      },
      {
        text: "Compliance work is reactive.",
        solution: "silicon tracks every control, evidence, and audit deadline. it pings owners weeks before, not days. you don't scramble."
      },
      {
        text: "Policies are missing.",
        solution: "silicon drafts the policies you need from your actual practice and applicable frameworks. you adopt, not author from blank."
      },
      {
        text: "Nobody owns documentation.",
        solution: "silicon owns it. it watches for changes — code, infra, vendors — and updates the relevant docs. someone always 'owns' it now."
      },
      {
        text: "Enterprise buyers ask things we are not ready for.",
        solution: "silicon reviews your readiness against common enterprise asks — SSO, SCIM, audit logs, DPA — and proposes the smallest changes that close the most deals."
      }
    ]
  },
  {
    key: "data",
    label: "Data / Analytics",
    problems: [
      {
        text: "Metrics are scattered.",
        solution: "silicon defines each metric once, computes it from the source of truth, and serves the answer in chat. no more 'whose number is right'."
      },
      {
        text: "Dashboards are not trusted.",
        solution: "silicon validates dashboards against source data nightly, flags discrepancies, and posts a 'data trust' status. when numbers move, you know why."
      },
      {
        text: "We don't know what changed this week.",
        solution: "silicon writes a 'what changed this week' digest every monday — top metric movers, anomalies, and the likely cause for each."
      },
      {
        text: "Nobody checks funnels regularly.",
        solution: "silicon watches each funnel step daily, alerts on drops, and runs the cohort breakdowns. you find leaks the day they start, not at QBR."
      },
      {
        text: "Experiments are not documented.",
        solution: "silicon writes the experiment doc from the design, runs the analysis when it ends, and files the result. your team learns from past tests instead of redoing them."
      },
      {
        text: "Product usage insights are hidden.",
        solution: "silicon turns event data into plain-language insights — 'these users adopt feature X within 3 days, those churn'. ask in chat, get the answer."
      },
      {
        text: "Reports take too long.",
        solution: "silicon builds the report — pull, transform, chart, narrative — from a one-line ask. you spend time on takeaways, not SQL."
      },
      {
        text: "We don't know which actions actually move growth.",
        solution: "silicon runs causal analyses on your activation, retention, and revenue events. you find the 3 actions that actually move the needle."
      }
    ]
  }
];
