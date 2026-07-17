module.exports = {
  profile: {
    name: "Tanishk Goswami",
    tagline: "Full-Stack Engineer · Team Lead at Metabull Universe",
    location: "BHOPAL, INDIA",
    statusText: "BUILDING SAAS & AI SYSTEMS",
    skillsSummary: "React · Next.js · Node.js · TypeScript · PostgreSQL · Redis · Supabase · BullMQ"
  },
  socials: [
    {
      name: "Portfolio",
      color: "4F46E5",
      logo: "vercel",
      url: "https://tanishkgoswami-portfolio.vercel.app/"
    },
    {
      name: "LinkedIn",
      color: "4F46E5",
      logo: "linkedin",
      url: "https://www.linkedin.com/in/designwithtanishk/"
    },
    {
      name: "Email",
      color: "4F46E5",
      logo: "gmail",
      url: "mailto:designwithtanishk@gmail.com"
    }
  ],
  about: {
    intro: `> **👑 Leadership & Engineering Excellence:** Promoted to **Team Lead within the first year** of my professional career at **Metabull Universe**, currently leading a team of 5–9 software developers through sprint planning, architecture design, and end-to-end delivery of multi-tenant SaaS applications.

I sit at the intersection of **product architecture** and **hands-on implementation**. My core focus is building resilient backend infrastructures, integrating complex enterprise platforms (Meta Graph API, WhatsApp Cloud API, OAuth 2.0, Twilio, Razorpay), and developing AI-powered automation engines that solve high-impact business challenges.`,
    secondary: `Outside of leading my engineering team at Metabull, I build and run **Truwok** ([truwok.com](https://truwok.com)), a solo-developed freelancer marketplace — owning everything from database schema to production deployment.`,
    stackSummary: `> **⚡ Enterprise Integrations & Cloud Infrastructure:** Meta WhatsApp Cloud API · Meta Graph API · OAuth 2.0 · Google Cloud APIs · Twilio · Razorpay · BullMQ · Redis Pub/Sub`
  },
  projects: [
    {
      title: "GAP AI Agent",
      description: "AI-first WhatsApp business automation platform. Features flow-based routing with general-purpose fallback LLM logic, session-state persistence, click-to-WhatsApp ad attribution, and embedded self-serve signup via WhatsApp Cloud API.<br/><br/>[**Live Platform**](https://gap-whatsapp.vercel.app)"
    },
    {
      title: "QuickPost",
      description: "AI-powered social media scheduling & Instagram Auto-DM platform. Contextually interprets comment/DM intent to automate customer engagement, backed by a 3-tier Razorpay subscription architecture with idempotency and entitlement handling.<br/><br/>[**Live Platform**](https://quick-post-livid.vercel.app)"
    },
    {
      title: "SuperMailBox",
      description: "Multi-tenant CPaaS (Communication Platform as a Service) layer serving 6+ internal products across the Metabull ecosystem. Engineered reliable transactional email and broadcast delivery using **BullMQ + Redis queues**, MJML templating, and provider routing across ZeptoMail and Amazon SES."
    },
    {
      title: "BroadcastPilot",
      description: "AI-assisted broadcast campaign platform. Helps businesses automatically draft, personalize, and optimize messaging campaigns with smart audience segmentation and send-time logic without manual configuration.<br/><br/>[**Live Platform**](https://vercel.com/designwithtanishk/broadcast-pilot)"
    },
    {
      title: "Truwok",
      description: "Solo-built freelancer marketplace engineered end-to-end from database modeling to deployment. Connects independent professionals with high-growth businesses.<br/><br/>[**Live Platform**](https://truwok.com)"
    },
    {
      title: "Omnichannel Engine",
      description: "Internal unified messaging architecture supporting WhatsApp, SMS, email, and CRM workflows across products with secure authentication and role-based access control (RBAC)."
    }
  ],
  techStack: [
    {
      category: "Frontend Development",
      icons: "react,nextjs,ts,js,tailwind,html,css"
    },
    {
      category: "Backend & Architecture",
      icons: "nodejs,express,graphql"
    },
    {
      category: "Databases & Caching",
      icons: "postgres,redis,supabase,docker"
    },
    {
      category: "DevOps & Tooling",
      icons: "git,github,vscode,postman"
    },
    {
      category: "UI/UX & Product Design",
      icons: "figma,ps,ai,xd,canva,blender"
    }
  ],
  githubUsername: "TanishkGoswami",
  dynamicConfig: {
    enabled: true,
    maxProjects: 6,
    priorityRepos: ["gap-whatsapp", "QuickPost", "SuperMailBox", "BroadcastPilot", "truwok-platform"],
    persistToDataFile: true
  },
  connectText: "Open to freelance collaborations, architecture discussions, technical advisory, and full-stack leadership roles."
};
