import { mutation } from "./_generated/server";

// Seed data for demo — pre-populates realistic SDR profiles, schedules, and call history
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // --- SDR 1: High performer, consistent ---
    const sarah = await ctx.db.insert("sdrs", {
      name: "Sarah Chen",
      phone: "+14155550101",
      timezone: "America/Los_Angeles",
      role: "SDR",
      team: "Enterprise West",
      dailyDialTarget: 60,
      dailyEmailTarget: 40,
      dailyMeetingTarget: 3,
      deviationsToday: 0,
      totalCheckIns: 47,
      totalDeviations: 8,
      currentStreak: 6,
      bestStreak: 12,
      status: "active",
      onboardedAt: Date.now() - 14 * 86400000, // 2 weeks ago
      lastCheckInAt: Date.now() - 3600000, // 1 hour ago
    });

    // --- SDR 2: Needs coaching, drifts to research ---
    const marcus = await ctx.db.insert("sdrs", {
      name: "Marcus Rivera",
      phone: "+14155550102",
      timezone: "America/Los_Angeles",
      role: "SDR",
      team: "Enterprise West",
      dailyDialTarget: 50,
      dailyEmailTarget: 30,
      dailyMeetingTarget: 2,
      deviationsToday: 2,
      totalCheckIns: 38,
      totalDeviations: 19,
      currentStreak: 0,
      bestStreak: 5,
      status: "active",
      onboardedAt: Date.now() - 14 * 86400000,
      lastCheckInAt: Date.now() - 5400000, // 1.5 hours ago
    });

    // --- SDR 3: New, still onboarding ---
    const jess = await ctx.db.insert("sdrs", {
      name: "Jess Okafor",
      phone: "+14155550103",
      timezone: "America/New_York",
      role: "BDR",
      team: "Mid-Market East",
      dailyDialTarget: 40,
      dailyEmailTarget: 25,
      dailyMeetingTarget: 2,
      deviationsToday: 0,
      totalCheckIns: 3,
      totalDeviations: 1,
      currentStreak: 2,
      bestStreak: 2,
      status: "active",
      onboardedAt: Date.now() - 2 * 86400000, // 2 days ago
      lastCheckInAt: Date.now() - 7200000,
    });

    // --- SDR 4: Paused (on PTO) ---
    await ctx.db.insert("sdrs", {
      name: "Kyle Matsuda",
      phone: "+14155550104",
      timezone: "America/Chicago",
      role: "SDR",
      team: "SMB Central",
      dailyDialTarget: 80,
      dailyEmailTarget: 50,
      dailyMeetingTarget: 4,
      deviationsToday: 0,
      totalCheckIns: 62,
      totalDeviations: 11,
      currentStreak: 0,
      bestStreak: 15,
      status: "paused",
      onboardedAt: Date.now() - 30 * 86400000,
      lastCheckInAt: Date.now() - 3 * 86400000,
    });

    const today = new Date().toISOString().split("T")[0];

    // --- Sarah's schedule (tight, well-structured) ---
    for (const block of [
      { startTime: "09:00", endTime: "09:30", activity: "Team standup + pipeline review", category: "meetings" as const },
      { startTime: "09:30", endTime: "11:00", activity: "Cold calls — Enterprise target list", category: "calls" as const, dialTarget: 25 },
      { startTime: "11:00", endTime: "12:00", activity: "Personalized email sequences", category: "email" as const },
      { startTime: "12:00", endTime: "13:00", activity: "Lunch", category: "break" as const },
      { startTime: "13:00", endTime: "14:30", activity: "Cold calls — Inbound lead follow-up", category: "calls" as const, dialTarget: 20 },
      { startTime: "14:30", endTime: "15:30", activity: "LinkedIn outreach + connection requests", category: "linkedin" as const },
      { startTime: "15:30", endTime: "16:00", activity: "CRM updates + meeting prep", category: "admin" as const },
      { startTime: "16:00", endTime: "17:00", activity: "Follow-up calls + voicemail drops", category: "calls" as const, dialTarget: 15 },
    ]) {
      await ctx.db.insert("scheduleBlocks", { sdrId: sarah, date: today, ...block });
    }

    // --- Marcus's schedule (looser, more research time) ---
    for (const block of [
      { startTime: "09:00", endTime: "09:30", activity: "Check emails + Slack", category: "admin" as const },
      { startTime: "09:30", endTime: "11:00", activity: "Outbound dials — new prospects", category: "calls" as const, dialTarget: 20 },
      { startTime: "11:00", endTime: "12:00", activity: "Prospect research + account mapping", category: "research" as const },
      { startTime: "12:00", endTime: "13:00", activity: "Lunch", category: "break" as const },
      { startTime: "13:00", endTime: "14:00", activity: "Email sequences + follow-ups", category: "email" as const },
      { startTime: "14:00", endTime: "15:30", activity: "Cold calls — second block", category: "calls" as const, dialTarget: 20 },
      { startTime: "15:30", endTime: "16:30", activity: "LinkedIn + social selling", category: "linkedin" as const },
      { startTime: "16:30", endTime: "17:00", activity: "CRM cleanup + EOD review", category: "admin" as const },
    ]) {
      await ctx.db.insert("scheduleBlocks", { sdrId: marcus, date: today, ...block });
    }

    // --- Call logs: Sarah's last few check-ins (mostly on track) ---
    const sarahCalls = [
      {
        timestamp: Date.now() - 3600000,
        duration: 72,
        type: "checkin" as const,
        reportedActivity: "Just finished my second call block. Hit 18 out of 20 target dials. Two meetings booked.",
        reportedCategory: "calls",
        scheduledActivity: "Cold calls — Inbound lead follow-up",
        scheduledCategory: "calls",
        deviationDetected: false,
        deviationSeverity: "none" as const,
        coachingTone: "encouraging" as const,
        coachingMessage: "Two meetings from 18 dials — that's a 11% connect rate. Keep that energy going into the LinkedIn block.",
        nextAction: "Start LinkedIn outreach sequence for the 6 prospects who didn't pick up",
        callStatus: "completed" as const,
        voiceEnergyScore: 82,
        vesBreakdown: {
          talkToListenRatio: 0.55,
          fillerWordDensity: 1.2,
          avgResponseLatency: 420,
          sentenceCompletionRate: 0.94,
          energyTrend: "stable" as const,
        },
        coachPersona: "jordan" as const,
      },
      {
        timestamp: Date.now() - 7200000,
        duration: 65,
        type: "checkin" as const,
        reportedActivity: "Finished morning emails. Sent 12 personalized sequences. One reply already.",
        reportedCategory: "email",
        scheduledActivity: "Personalized email sequences",
        scheduledCategory: "email",
        deviationDetected: false,
        deviationSeverity: "none" as const,
        coachingTone: "encouraging" as const,
        coachingMessage: "12 sequences out, reply already coming in. Solid. Grab lunch and come back ready for the afternoon call block.",
        nextAction: "Lunch, then inbound follow-up calls at 1 PM",
        callStatus: "completed" as const,
        voiceEnergyScore: 78,
        vesBreakdown: {
          talkToListenRatio: 0.48,
          fillerWordDensity: 1.8,
          avgResponseLatency: 380,
          sentenceCompletionRate: 0.91,
          energyTrend: "stable" as const,
        },
        coachPersona: "jordan" as const,
      },
    ];

    for (const call of sarahCalls) {
      await ctx.db.insert("callLogs", { sdrId: sarah, ...call });
    }

    // --- Call logs: Marcus's check-ins (deviations detected) ---
    const marcusCalls = [
      {
        timestamp: Date.now() - 5400000,
        duration: 88,
        type: "checkin" as const,
        reportedActivity: "I was doing some deep research on a few accounts. Found some really interesting stuff about their tech stack.",
        reportedCategory: "research",
        scheduledActivity: "Cold calls — second block",
        scheduledCategory: "calls",
        deviationDetected: true,
        deviationSeverity: "moderate" as const,
        deviationReason: "Scheduled for outbound calls but spent the entire block on account research. Research is valuable but was not the committed activity.",
        coachingTone: "direct" as const,
        coachingMessage: "Marcus, you were supposed to be dialing this block — you committed to 20 calls. Research is useful but you can do it during your 11 AM research block tomorrow. Right now you're 20 dials behind pace. Can you knock out 10 in the next 45 minutes?",
        nextAction: "10 dials in the next 45 minutes, use the research findings as talk tracks",
        callStatus: "completed" as const,
        voiceEnergyScore: 44,
        vesBreakdown: {
          talkToListenRatio: 0.32,
          fillerWordDensity: 4.1,
          avgResponseLatency: 890,
          sentenceCompletionRate: 0.67,
          energyTrend: "declining" as const,
        },
        coachPersona: "riley" as const,
      },
      {
        timestamp: Date.now() - 9000000,
        duration: 95,
        type: "checkin" as const,
        reportedActivity: "Honestly I got kind of pulled into LinkedIn. Was looking at a prospect's profile and then started browsing their connections and competitors.",
        reportedCategory: "linkedin",
        scheduledActivity: "Email sequences + follow-ups",
        scheduledCategory: "email",
        deviationDetected: true,
        deviationSeverity: "mild" as const,
        deviationReason: "Scheduled for email work but drifted into LinkedIn browsing. Started with intent (prospect profile) but evolved into unstructured browsing.",
        coachingTone: "curious" as const,
        coachingMessage: "Classic LinkedIn rabbit hole — starts with one profile, ends up 30 tabs deep. Did you find anything you can actually use? If so, grab the key info and pivot back to your email sequences. You've got 15 follow-ups queued.",
        nextAction: "Close LinkedIn tabs, send 15 follow-up emails before next check-in",
        callStatus: "completed" as const,
        voiceEnergyScore: 58,
        vesBreakdown: {
          talkToListenRatio: 0.38,
          fillerWordDensity: 3.2,
          avgResponseLatency: 720,
          sentenceCompletionRate: 0.74,
          energyTrend: "declining" as const,
        },
        coachPersona: "sam" as const,
      },
    ];

    for (const call of marcusCalls) {
      await ctx.db.insert("callLogs", { sdrId: marcus, ...call });
    }

    // --- Patterns for Marcus ---
    await ctx.db.insert("patterns", {
      sdrId: marcus,
      patternType: "drift_trigger",
      description: "Consistently drifts to LinkedIn/research during scheduled call blocks. Strongest between 1-3 PM. Likely avoidance behavior — research feels productive but avoids rejection from cold calls.",
      confidence: 0.78,
      dataPoints: 19,
      firstObserved: Date.now() - 12 * 86400000,
      lastConfirmed: Date.now() - 5400000,
      active: true,
    });

    await ctx.db.insert("patterns", {
      sdrId: marcus,
      patternType: "coaching_response",
      description: "Responds well to direct, specific redirection ('knock out 10 dials in 45 min') rather than open-ended coaching ('try to stay focused'). Giving him a concrete mini-target within the current block is most effective.",
      confidence: 0.72,
      dataPoints: 12,
      firstObserved: Date.now() - 10 * 86400000,
      lastConfirmed: Date.now() - 5400000,
      active: true,
    });

    // --- Patterns for Sarah ---
    await ctx.db.insert("patterns", {
      sdrId: sarah,
      patternType: "peak_hours",
      description: "Highest connect rates between 9:30-11 AM and 1-2:30 PM. Morning block averages 11% connect rate vs 6% after 3 PM. Should front-load high-value dials.",
      confidence: 0.85,
      dataPoints: 47,
      firstObserved: Date.now() - 14 * 86400000,
      lastConfirmed: Date.now() - 3600000,
      active: true,
    });

    // --- One escalation for Marcus ---
    await ctx.db.insert("escalations", {
      sdrId: marcus,
      triggeredAt: Date.now() - 3 * 86400000,
      reason: "5 deviations in a single day (Tuesday). All were research/LinkedIn drift during scheduled call blocks. Coaching redirections were acknowledged but pattern repeated within the same day.",
      severity: "warning",
      deviationCount: 5,
      timeframeDays: 1,
      resolvedAt: Date.now() - 2 * 86400000,
      resolvedBy: "Team Lead (manual)",
      notes: "Discussed with Marcus — he was anxious about a big account presentation. Agreed to schedule dedicated research blocks before call blocks to reduce anxiety-driven drift.",
    });

    // --- Prospect intel from rtrvr.ai (pre-call research) ---
    await ctx.db.insert("prospectIntel", {
      sdrId: sarah,
      prospectCompany: "Meridian Health Systems",
      prospectUrl: "https://meridianhealthsys.com",
      scrapedAt: Date.now() - 2 * 3600000,
      intel: {
        companyName: "Meridian Health Systems",
        industry: "Healthcare IT",
        employeeCount: 340,
        techStack: ["Salesforce", "Epic EHR", "Snowflake", "AWS"],
        recentNews: [
          "Raised $45M Series C (Jan 2026)",
          "Expanding to 3 new states in Q2",
          "Hired new CRO from Veeva Systems",
        ],
        keyPeople: [
          { name: "Diana Frost", title: "CRO", linkedinUrl: "https://linkedin.com/in/dianafrost" },
          { name: "Raj Anand", title: "VP Engineering", linkedinUrl: "https://linkedin.com/in/rajanand" },
        ],
        fundingStage: "Series C",
        painPoints: ["Scaling sales ops across new markets", "EHR integration complexity", "Compliance overhead"],
      },
      rtrvrTaskId: "rtrvr_task_a3f8c2d1",
    });

    await ctx.db.insert("prospectIntel", {
      sdrId: marcus,
      prospectCompany: "Bolt Logistics",
      prospectUrl: "https://boltlogistics.io",
      scrapedAt: Date.now() - 4 * 3600000,
      intel: {
        companyName: "Bolt Logistics",
        industry: "Supply Chain / Logistics Tech",
        employeeCount: 180,
        techStack: ["HubSpot", "Postgres", "GCP", "Retool"],
        recentNews: [
          "Launched last-mile delivery AI product (Dec 2025)",
          "Partnership with DHL announced",
          "Hiring 40+ engineers in Q1 2026",
        ],
        keyPeople: [
          { name: "Tomás Herrera", title: "CEO & Co-founder" },
          { name: "Priya Sharma", title: "Head of Partnerships" },
        ],
        fundingStage: "Series B",
        painPoints: ["Manual route optimization", "Driver scheduling at scale", "Last-mile cost reduction"],
      },
      rtrvrTaskId: "rtrvr_task_7b12e4a9",
    });

    await ctx.db.insert("prospectIntel", {
      sdrId: sarah,
      prospectCompany: "Canopy Financial",
      prospectUrl: "https://canopyfinancial.com",
      scrapedAt: Date.now() - 6 * 3600000,
      intel: {
        companyName: "Canopy Financial",
        industry: "Fintech / Wealth Management",
        employeeCount: 95,
        techStack: ["Plaid", "React", "Node.js", "MongoDB Atlas"],
        recentNews: [
          "SOC 2 Type II certified (Feb 2026)",
          "Launched robo-advisor for small businesses",
        ],
        keyPeople: [
          { name: "James Okonkwo", title: "VP Sales" },
          { name: "Lisa Chen", title: "CTO" },
        ],
        fundingStage: "Series A",
        painPoints: ["Regulatory compliance burden", "Customer acquisition cost", "Integration with legacy banking systems"],
      },
      rtrvrTaskId: "rtrvr_task_c94f1e77",
    });

    return {
      created: {
        sdrs: 4,
        scheduleBlocks: 16,
        callLogs: 4,
        patterns: 3,
        escalations: 1,
        prospectIntel: 3,
      },
    };
  },
});
