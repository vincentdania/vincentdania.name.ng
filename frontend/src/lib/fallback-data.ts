import type { Article, SitePayload } from "@/lib/types";

const publishedAt = "2026-05-22T18:00:00+01:00";

export const fallbackArticles: Article[] = [
  {
    title: "The NGO Sector in Nigeria Is Broken: An Insider's Reflection, Part 1",
    slug: "the-ngo-sector-in-nigeria-is-broken-an-insiders-reflection-part-1",
    summary:
      "An insider's introduction to why NGOs matter in Nigeria, why their work often reaches people others ignore, and why the sector still needs serious reform.",
    author_name: "Vincent Dania",
    featured: true,
    published_at: publishedAt,
    reading_time_minutes: 5,
    cover_image_url: "",
    categories: [{ name: "NGO Sector", slug: "ngo-sector" }],
    tags: [
      { name: "NGO Reform", slug: "ngo-reform" },
      { name: "Development Practice", slug: "development-practice" },
    ],
    body: `
<p>I recently took a break from the NGO sector in Nigeria after 13 years of active employment with one of the leading national NGOs.</p>
<p>I want to take some time to write about my experiences, the lessons I learned, and some observations I believe the donor community needs to pay attention to.</p>
<p>I rose through the ranks from intern to managing national projects worth billions of naira. I have travelled to virtually every state in Nigeria. I have been to rural communities that politicians do not visit even during campaigns.</p>
<p>So my perspective comes from direct field experience gathered over several years of interacting with stakeholders on both the demand and supply side of development work.</p>
<p>The painful truth, however, is that the current operating model of the NGO sector in Nigeria is broken in many ways, and it needs serious reform.</p>
<p>I hope this series of articles draws the attention of NGOs, donors, development partners, and the wider public to some of the issues that deserve urgent reflection.</p>
    `.trim(),
    meta_title: "The NGO Sector in Nigeria Is Broken, Part 1 | Vincent Dania",
    meta_description:
      "An insider's reflection on why NGOs matter in Nigeria and why the sector urgently needs reform.",
  },
  {
    title: "The NGO Sector in Nigeria Is Broken: An Insider's Reflection, Part 2",
    slug: "the-ngo-sector-in-nigeria-is-broken-an-insiders-reflection-part-2",
    summary:
      "A follow-the-money reflection on donor funding, grant cycles, NGO overhead, and the difficult question of whether development spending is producing proportional transformation.",
    author_name: "Vincent Dania",
    featured: false,
    published_at: "2026-05-22T18:05:00+01:00",
    reading_time_minutes: 8,
    cover_image_url: "",
    categories: [{ name: "NGO Sector", slug: "ngo-sector" }],
    tags: [
      { name: "Donor Funding", slug: "donor-funding" },
      { name: "NGO Reform", slug: "ngo-reform" },
    ],
    body: `
<h2>Let's Follow the Money</h2>
<p>In Part 1 of this series, I explained why NGOs remain one of the few institutions still doing genuine development work in Nigeria despite the many challenges within the sector.</p>
<p>To understand the depth of the problem, we need to start by following the money.</p>
<p>Most of the substantial funding NGOs receive in Nigeria comes from foreign foundations and international development partners.</p>
<p>On paper, the system appears rigorous. The money involved is also enormous.</p>
<p>But despite the scale of these investments, a difficult question continues to echo quietly among many Nigerians: <strong>What real value are these grants delivering relative to the amount of money being spent?</strong></p>
<p>The real problem begins when the system gradually becomes more focused on sustaining itself than solving the actual problems it was created to address.</p>
<p>Part 3 will explore another uncomfortable issue within the NGO sector in Nigeria: the growing disconnect between donor expectations, NGO narratives, and the actual realities faced by local communities.</p>
    `.trim(),
    meta_title: "The NGO Sector in Nigeria Is Broken, Part 2 | Vincent Dania",
    meta_description:
      "A follow-the-money reflection on donor funding, NGO overhead, and the value delivered by development spending in Nigeria.",
  },
];

export const fallbackSitePayload: SitePayload = {
  site_settings: {
    site_name: "Vincent Dania",
    short_name: "Vincent Dania",
    site_description:
      "Programme leadership, AI enablement, digital systems, and social impact delivery.",
    site_keywords:
      "Vincent Dania, programme leadership, AI enablement, NGO sector, development practice",
    location: "Abuja, Nigeria",
    public_email: "vincentdania@live.com",
    whatsapp_number: "+2348034210082",
    whatsapp_url: "https://wa.me/2348034210082",
    linkedin_url: "https://www.linkedin.com/in/vincentdania/",
    contact_intro:
      "Available for consulting, advisory, programme leadership, and digital systems work.",
    footer_note:
      "Programme leadership, institutional strengthening, and digital systems for measurable social impact.",
    hero_primary_cta_label: "Work with Vincent",
    hero_primary_cta_link: "#contact",
    hero_secondary_cta_label: "Read the Blog",
    hero_secondary_cta_link: "/blog",
    navbar_contact_label: "Contact Me",
    navbar_contact_link: "/#contact",
    navbar_cv_label: "Download CV",
    contact_email_button_label: "Send Email",
    contact_whatsapp_button_label: "Chat on WhatsApp",
    contact_cv_button_label: "Download Full CV",
    footer_copyright: "Designed & developed by Vincent Dania. All rights reserved.",
    meta_title: "Vincent Dania | AI Enablement, Programme Leadership & Social Impact",
    meta_description:
      "Portfolio and articles by Vincent Dania on AI enablement, programme delivery, NGO systems, and social impact.",
    cv_file_url: "",
    portrait_image_url: "",
  },
  profile: {
    hero_eyebrow: "AI Enablement. Programme Leadership. Social Impact.",
    hero_title:
      "Building AI-enabled systems, social impact programmes, and digital products that create practical value.",
    hero_subtitle:
      "Vincent Dania works across practical AI adoption, digital operations, donor-funded delivery, and institutional strengthening.",
    about_title: "A hybrid professional built for complex delivery.",
    about_body:
      "Vincent brings together programme leadership, donor accountability, monitoring and learning, technology delivery, and systems thinking.",
    about_paragraphs: [
      "Vincent brings together programme leadership, donor accountability, monitoring and learning, technology delivery, and systems thinking.",
    ],
    builder_title: "He does not just manage projects. He builds systems.",
    builder_intro:
      "His work spans AI education, SaaS, e-commerce, corporate web platforms, and nonprofit digital presence.",
    expertise_title: "Core competencies shaped by delivery, policy, and execution.",
    expertise_intro:
      "The strongest thread across Vincent's work is execution: designing clear systems and delivering outcomes that hold under scrutiny.",
    education_title: "Credentials that reinforce technical depth and management discipline.",
    education_intro:
      "Academic and professional training grounded in programme discipline, digital fluency, and continuous learning.",
    thought_leadership_title: "Writing on technology, policy, and practical delivery.",
    thought_leadership_intro:
      "Essays and reflections on institutions, development practice, accountability, and digital systems.",
    opportunities_title: "Open to opportunities that require judgment and delivery discipline.",
    opportunities_copy:
      "Open to senior programme leadership, project management, consulting, advisory, remote, and onsite opportunities.",
    contact_title: "Initiate a conversation.",
    contact_copy:
      "If you are hiring, building a programme, or need a technology-enabled delivery partner, Vincent welcomes a thoughtful conversation.",
  },
  blog_settings: {
    index_badge_label: "Blog",
    index_title: "Writing on institutions, delivery, policy, and digital systems.",
    index_intro:
      "A curated archive of essays, practical reflections, and research-led thinking.",
    featured_badge_label: "Featured post",
    featured_fallback_title: "Practical thinking for systems that serve people well.",
    archive_eyebrow: "Archive",
    archive_title:
      "Explore perspectives on governance, institutional effectiveness, social protection, and digital execution.",
    archive_intro: "Search by topic and move from strategic reflections to implementation lessons.",
    archive_link_label: "Full archive",
    subscribe_badge_label: "Subscribe",
    subscribe_title: "Receive new essays directly.",
    subscribe_description:
      "Join the list for practical reflections on programme leadership, policy, and digital systems.",
    detail_back_label: "Back to blog",
    detail_meta_heading: "Post details",
    meta_title: "Vincent Dania Blog",
    meta_description:
      "Essays by Vincent Dania on development practice, programme delivery, and digital systems.",
  },
  navigation_items: [
    { label: "Home", href: "/", order: 1, visible: true, open_in_new_tab: false },
    { label: "Blog", href: "/blog", order: 2, visible: true, open_in_new_tab: false },
    { label: "Consult", href: "/consult", order: 3, visible: true, open_in_new_tab: false },
    { label: "PhD", href: "/phd", order: 4, visible: true, open_in_new_tab: false },
  ],
  credibility_stats: [{ label: "15+ Years Experience", order: 1 }],
  impact_metrics: [
    {
      icon: "banknote",
      value: "$2M+",
      label: "Donor grants managed",
      detail: "Programme and institutional delivery across national portfolios.",
      order: 1,
    },
  ],
  experiences: [],
  expertise_categories: [],
  education: [],
  certifications: [],
  opportunities: [],
  social_links: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/vincentdania/",
      order: 1,
      visible_in_footer: true,
    },
  ],
  projects: [],
  featured_article: fallbackArticles[0],
  recent_articles: fallbackArticles.slice(1),
};
