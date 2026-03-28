from datetime import date, datetime
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from content.models import Article, ArticleCategory, ArticleTag, Project
from core.models import (
    Certification,
    CredibilityStat,
    EducationCredential,
    Experience,
    ExpertiseCategory,
    ImpactMetric,
    Opportunity,
    ProfileContent,
    SiteSettings,
    SocialLink,
)


def aware_datetime(value: datetime):
    return timezone.make_aware(value, timezone.get_current_timezone())


class Command(BaseCommand):
    help = "Seed the portfolio website with Vincent Dania's baseline content."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Seeding website content...")
        self.seed_settings_and_profile()
        self.seed_social_links()
        self.seed_credibility_and_metrics()
        self.seed_experience()
        self.seed_expertise()
        self.seed_education()
        self.seed_certifications()
        self.seed_opportunities()
        self.seed_projects()
        self.seed_articles()
        self.stdout.write(self.style.SUCCESS("Seed complete."))

    def seed_settings_and_profile(self):
        settings = SiteSettings.load()
        settings.site_name = "Vincent Dania"
        settings.short_name = "Vincent Dania"
        settings.site_description = (
            "Senior programme and project manager, IT professional, and digital builder "
            "working across donor-funded delivery, governance, social protection, and technology."
        )
        settings.site_keywords = (
            "Vincent Dania, programme leadership, project management, donor-funded programmes, "
            "digital transformation, IT professional, social protection, governance"
        )
        settings.location = "Abuja, Nigeria"
        settings.public_email = "vincentdania@live.com"
        settings.whatsapp_number = "+2348034210082"
        settings.linkedin_url = "https://www.linkedin.com/in/vincentdania/"
        settings.contact_intro = (
            "Available for remote and onsite roles, programme leadership assignments, consulting engagements, "
            "and advisory work that require execution discipline, governance literacy, and technology fluency."
        )
        settings.footer_note = "Built for credible leadership, practical execution, and globally relevant African expertise."
        settings.meta_title = "Vincent Dania | Programme Leadership, IT & Thought Leadership"
        settings.meta_description = (
            "Portfolio and articles for Vincent Dania, a senior programme and project manager, IT professional, "
            "digital builder, and thought leader in governance, technology, and social impact."
        )
        settings.save()

        seed_dir = Path(__file__).resolve().parents[3] / "seed_assets"
        portrait_path = seed_dir / "vincent-dania-portrait.jpeg"
        cv_path = seed_dir / "vincent-dania-cv.pdf"

        if portrait_path.exists() and not settings.portrait_image:
            with portrait_path.open("rb") as image_file:
                settings.portrait_image.save(portrait_path.name, File(image_file), save=True)
        if cv_path.exists() and not settings.cv_file:
            with cv_path.open("rb") as cv_file:
                settings.cv_file.save(cv_path.name, File(cv_file), save=True)

        profile = ProfileContent.load()
        profile.hero_eyebrow = "Senior Programme & Project Manager | IT Professional | Thought Leader"
        profile.hero_title = "Leading donor-funded programmes and building digital systems that make implementation stronger."
        profile.hero_subtitle = (
            "Vincent Dania works at the intersection of programme delivery, governance, social protection, "
            "gender justice, and technology. He brings 14+ years of experience combining institutional leadership, "
            "monitoring and learning discipline, and hands-on product execution."
        )
        profile.about_title = "A senior development practitioner with the instincts of a builder."
        profile.about_body = (
            "Vincent Dania is a senior programme and project leader with more than 14 years of experience delivering "
            "donor-funded initiatives across governance, gender justice, education, social protection, and extractive-sector accountability.\n\n"
            "His track record spans grant management, donor compliance, cross-sector partnership coordination, "
            "monitoring, evaluation and learning, and nationally scaled implementation across Nigeria. He has worked "
            "with foundations, multilateral partners, civil society organisations, community actors, and public institutions.\n\n"
            "Alongside this development leadership work, Vincent is also a hands-on IT professional and digital builder. "
            "With a Master's degree in Information Technology, adjunct teaching experience in programming, and a portfolio "
            "of live digital products, he brings rare fluency between strategy, systems, and execution."
        )
        profile.builder_title = "Digital products and platforms built with practical intent."
        profile.builder_intro = (
            "The product portfolio below reinforces a simple point: Vincent does not only coordinate programmes. "
            "He also understands how systems are designed, shipped, and improved in the real world."
        )
        profile.expertise_title = "Core competencies grounded in programme rigor and systems thinking."
        profile.expertise_intro = (
            "From donor reporting and MEL frameworks to cloud collaboration and product direction, "
            "the throughline is execution that remains credible under pressure."
        )
        profile.education_title = "Education and certifications that strengthen both management discipline and technical depth."
        profile.education_intro = (
            "Formal study in IT, ongoing doctoral work in social protection, and globally recognized project certifications "
            "support a practice built on both reflective thought and delivery discipline."
        )
        profile.thought_leadership_title = "Thought leadership rooted in policy, systems, and implementation."
        profile.thought_leadership_intro = (
            "Recent writing explores automation, health information systems, institutional effectiveness, "
            "and what it takes to deliver social impact programmes with structure and credibility."
        )
        profile.opportunities_title = "Open to roles where strategy has to become execution."
        profile.opportunities_copy = (
            "Vincent is open to senior programme leadership, project management, consulting, advisory, remote, and onsite roles "
            "where donor accountability, operational clarity, and technology-enabled delivery matter."
        )
        profile.contact_title = "Work with Vincent."
        profile.contact_copy = (
            "If you need a programme leader who understands delivery, governance, partnerships, and digital systems, "
            "this is a strong time to connect."
        )
        profile.save()

    def seed_social_links(self):
        settings = SiteSettings.load()
        links = [
            ("LinkedIn", SocialLink.LINKEDIN, settings.linkedin_url, 1),
            ("Email", SocialLink.EMAIL, f"mailto:{settings.public_email}", 2),
            ("WhatsApp", SocialLink.WHATSAPP, settings.whatsapp_url, 3),
        ]
        for label, platform, url, order in links:
            SocialLink.objects.update_or_create(
                label=label,
                defaults={
                    "platform": platform,
                    "url": url,
                    "order": order,
                    "visible_in_footer": True,
                },
            )

    def seed_credibility_and_metrics(self):
        credibility_items = [
            "14+ Years Experience",
            "Donor-Funded Programmes",
            "IT & Digital Products",
            "Open to Remote & Onsite Roles",
        ]
        for index, label in enumerate(credibility_items, start=1):
            CredibilityStat.objects.update_or_create(label=label, defaults={"order": index})

        metrics = [
            ("banknote", "$2M+", "Cumulative donor grants managed", "Ford Foundation, EU-UN, Christian Aid, and related programme portfolios."),
            ("target", "$1.29M", "BUILD grant implemented", "Coordinated institutional strengthening and movement scale-up under Ford Foundation support."),
            ("monitor-smartphone", "8,400+", "Learners reached through LMS delivery", "Technology-enabled GBV prevention training supported national engagement."),
            ("graduation-cap", "5,000+", "Course completions supported", "Structured digital learning and follow-up improved completion outcomes."),
            ("map-pinned", "16", "Niger Delta communities engaged", "Women in frontline extractive communities intervention reached host communities directly."),
            ("users", "3,265", "Teenage girls enrolled into formal education", "C-CAGE implementation combined advocacy, community mobilization, and sustained enrolment."),
        ]
        for index, (icon, value, label, detail) in enumerate(metrics, start=1):
            ImpactMetric.objects.update_or_create(
                label=label,
                defaults={"icon": icon, "value": value, "detail": detail, "order": index},
            )

    def seed_experience(self):
        experiences = [
            {
                "title": "Programme Coordinator - Male Feminists Network",
                "organization": "African Centre for Leadership, Strategy & Development (Centre LSD)",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2025, 5, 1),
                "end_date": None,
                "is_current": True,
                "summary": "Leads the national rollout of a Ford Foundation-funded programme mobilising men as allies for GBV prevention across all six geopolitical zones of Nigeria.",
                "achievements": [
                    "Coordinates a cross-functional team spanning programme, MEL, media, and administration.",
                    "Designed and deployed a technology-enabled learning system enrolling 8,400+ learners and supporting 5,000+ course completions.",
                    "Leads donor compliance, budgeting, and reporting for a $1M grant while maintaining disciplined budget performance.",
                    "Strengthens accountability through structured workplans, learning loops, and stakeholder review forums.",
                ],
                "order": 1,
            },
            {
                "title": "Programme Coordinator - BUILD Grant & Side by Side Movement",
                "organization": "African Centre for Leadership, Strategy & Development (Centre LSD)",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2022, 1, 1),
                "end_date": date(2025, 4, 30),
                "is_current": False,
                "summary": "Coordinated implementation of the $1.29M Ford Foundation BUILD grant while scaling the Side-by-Side Movement and strengthening institutional resilience.",
                "achievements": [
                    "Led high-level convenings, stakeholder dialogues, and donor engagements that increased visibility and cross-sector collaboration.",
                    "Oversaw workplans, learning processes, and reporting cycles aligned with donor requirements and accountability standards.",
                    "Designed a women-focused intervention across 16 Niger Delta host communities, creating an interest-free cooperative financing model for 182 women.",
                    "Conceptualized and led development of a national digital reporting platform for mining host communities and managed software developers from requirements to deployment.",
                    "Provided technical leadership for revisions to CDA Guidelines, advancing inclusion provisions for women, youth, and persons with disabilities.",
                ],
                "order": 2,
            },
            {
                "title": "Senior Program Officer",
                "organization": "African Centre for Leadership, Strategy & Development (Centre LSD)",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2019, 12, 1),
                "end_date": date(2021, 12, 31),
                "is_current": False,
                "summary": "Managed gender advocacy, policy dialogue, and MEL-heavy programme delivery under EU-UN, Christian Aid, and Malala Fund-supported initiatives.",
                "achievements": [
                    "Led a $100K EU-UN-funded gender advocacy initiative that engaged 300+ traditional, religious, and community leaders.",
                    "Supported advocacy that contributed to enactment of a byelaw banning child marriage in Obanliku LGA, Cross River State.",
                    "Served as MEL lead for the Christian Aid Voices to the People Charter initiative across 12+ communities.",
                    "Oversaw C-CAGE implementation in vulnerable communities in Adamawa State, contributing to 3,265 girls' enrolment into formal education.",
                ],
                "order": 3,
            },
            {
                "title": "Programme & Information Technology Officer",
                "organization": "African Centre for Leadership, Strategy & Development (Centre LSD)",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2014, 5, 1),
                "end_date": date(2019, 11, 30),
                "is_current": False,
                "summary": "Integrated ICT systems into programme delivery, data management, communication, and institutional learning across multiple donor-funded initiatives.",
                "achievements": [
                    "Led digital systems support for planning, implementation, monitoring, and evaluation workflows.",
                    "Managed organisational digital platforms, websites, and online communication channels.",
                    "Migrated the organisation to Microsoft 365 and secured an annual in-kind software grant valued at $3,600.",
                    "Standardised official email and shared repository use to improve information security and operational continuity.",
                ],
                "order": 4,
            },
            {
                "title": "Adjunct Instructor (Programming Fundamentals - Python)",
                "organization": "University of the People",
                "location": "Remote",
                "employment_type": "Adjunct Faculty",
                "start_date": date(2024, 12, 1),
                "end_date": None,
                "is_current": True,
                "summary": "Supports diverse, global learners through structured programming instruction, feedback, and curriculum-aligned assessment.",
                "achievements": [
                    "Teaches Programming Fundamentals (Python) in a remote-first global learning environment.",
                    "Contributes to curriculum review and continuous improvement for learning effectiveness.",
                ],
                "order": 5,
            },
            {
                "title": "IT Specialist (Short-Term Consultancy)",
                "organization": "Emerald International Development Services Ltd",
                "location": "Abuja, Nigeria",
                "employment_type": "Consultancy",
                "start_date": date(2025, 1, 1),
                "end_date": date(2025, 2, 28),
                "is_current": False,
                "summary": "Conducted a technical evaluation of the FLAGIT accountability app to inform usability and product improvement recommendations.",
                "achievements": [
                    "Reviewed usability, engagement quality, and data insights for a civic accountability application.",
                ],
                "order": 6,
            },
            {
                "title": "Operations Manager",
                "organization": "Bigdo Total Facility Services Ltd",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2012, 5, 1),
                "end_date": date(2013, 4, 30),
                "is_current": False,
                "summary": "Managed logistics and operations functions to support more efficient service delivery.",
                "achievements": [
                    "Streamlined operations and coordinated resources for service reliability.",
                ],
                "order": 7,
            },
            {
                "title": "Programme Officer",
                "organization": "AFRIDEV Health Information Centre",
                "location": "Ilorin, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2011, 4, 1),
                "end_date": date(2012, 3, 31),
                "is_current": False,
                "summary": "Delivered community health education, HIV/AIDS counselling, and frontline implementation support.",
                "achievements": [
                    "Supported health education, counselling, and programme monitoring in community settings.",
                ],
                "order": 8,
            },
        ]

        for item in experiences:
            achievements = "\n".join(item.pop("achievements"))
            Experience.objects.update_or_create(
                title=item["title"],
                organization=item["organization"],
                defaults={**item, "achievements": achievements},
            )

    def seed_expertise(self):
        categories = [
            (
                "Programme & Project Management",
                "Delivery management across strategy, budgets, workplans, risk, and cross-functional coordination.",
                [
                    "Programme management",
                    "Project management",
                    "Grant management",
                    "Budget management and forecasting",
                    "Work planning and scheduling",
                    "Risk and compliance management",
                    "Adaptive management",
                    "Consortium coordination",
                ],
            ),
            (
                "Monitoring, Evaluation & Learning",
                "Evidence systems that strengthen accountability, reporting quality, and course correction.",
                [
                    "Results frameworks",
                    "Theory of change",
                    "Logframe development",
                    "Indicator tracking",
                    "Learning and adaptation",
                    "Donor reporting",
                    "Community feedback mechanisms",
                ],
            ),
            (
                "Governance, Gender & Social Inclusion",
                "Programme design and advocacy that center inclusion, justice, and institutional credibility.",
                [
                    "Gender justice programming",
                    "GBV prevention",
                    "Community accountability",
                    "Inclusion frameworks",
                    "Policy advocacy",
                    "Stakeholder dialogue",
                ],
            ),
            (
                "Social Protection & Policy",
                "Systems thinking applied to resilience, institutional strengthening, and public policy implementation.",
                [
                    "Social protection",
                    "Institutional strengthening",
                    "Public systems thinking",
                    "Policy translation into implementation",
                    "Community safety nets",
                ],
            ),
            (
                "Digital Transformation & IT",
                "Hands-on technology fluency for digital products, collaboration tools, and data-enabled delivery.",
                [
                    "IT project management",
                    "Learning management systems",
                    "Digital platforms for social impact",
                    "Microsoft 365",
                    "Requirements gathering",
                    "Software delivery oversight",
                    "Basic Python",
                ],
            ),
            (
                "Stakeholder, Donor & Partnership Management",
                "Relationship-building that keeps programmes aligned, credible, and funder-ready.",
                [
                    "Donor and funder liaison",
                    "Civil society engagement",
                    "Religious and traditional leader engagement",
                    "Government stakeholder coordination",
                    "Cross-functional team leadership",
                ],
            ),
        ]

        for index, (title, description, skills) in enumerate(categories, start=1):
            ExpertiseCategory.objects.update_or_create(
                title=title,
                defaults={
                    "description": description,
                    "skills": "\n".join(skills),
                    "order": index,
                },
            )

    def seed_education(self):
        credentials = [
            ("Doctor of Philosophy (PhD), Social Protection", "Institute of Social Policy, Nnamdi Azikiwe University", "Nigeria", 2025, 2027, True, "In progress"),
            ("Doctorate in Management Studies (DMS), Lean Management", "Kazian School of Management", "Mumbai, India", None, 2025, False, ""),
            ("Master of Science (MSc), Information Technology", "University of the People", "USA", 2023, 2024, False, ""),
            ("Bachelor of Science (BSc), Microbiology", "University of Agriculture, Makurdi", "Nigeria", 2006, 2009, False, ""),
        ]
        for index, (title, institution, location, start_year, end_year, in_progress, note) in enumerate(credentials, start=1):
            EducationCredential.objects.update_or_create(
                title=title,
                defaults={
                    "institution": institution,
                    "location": location,
                    "start_year": start_year,
                    "end_year": end_year,
                    "is_in_progress": in_progress,
                    "note": note,
                    "order": index,
                },
            )

    def seed_certifications(self):
        certifications = [
            ("Project Management Professional (PMP)", "Project Management Institute (PMI)"),
            ("PMI Agile Certified Practitioner (PMI-ACP)", "Project Management Institute (PMI)"),
            ("Monitoring, Evaluation, Accountability & Learning Professional (MEAL DPro)", "PM4NGOs"),
            ("Program Management for Development Professionals (Program DPro)", "PM4NGOs"),
            ("Project Management for Development Professionals (Project DPro)", "PM4NGOs"),
            ("Project Management Certification & Practicing License", "Chartered Institute of Project Managers of Nigeria (CIPMN)"),
            ("Certified Strategic Manager (Chartered)", "Institute of Strategic Management of Nigeria"),
        ]
        for index, (title, issuer) in enumerate(certifications, start=1):
            Certification.objects.update_or_create(title=title, defaults={"issuer": issuer, "order": index})

    def seed_opportunities(self):
        opportunities = [
            "Remote jobs",
            "Onsite jobs",
            "Consulting roles",
            "Programme leadership roles",
            "Project management roles",
            "Advisory opportunities",
        ]
        for index, title in enumerate(opportunities, start=1):
            Opportunity.objects.update_or_create(title=title, defaults={"order": index})

    def seed_projects(self):
        projects = [
            {
                "name": "AI Literacy Nigeria",
                "short_description": "An AI education platform offering quizzes, workbook-style learning, and masterclass pathways for practical AI understanding.",
                "long_description": (
                    "AI Literacy Nigeria is positioned as a practical education product that helps people move from curiosity about AI to real understanding and application. "
                    "The platform combines structured learning, guided workbooks, and training experiences designed for accessible digital literacy."
                ),
                "live_url": "https://ailiteracy.ng/",
                "display_order": 1,
                "category": Project.CATEGORY_AI,
                "tech_stack": "Product direction, UX strategy, Web delivery",
                "role_label": "Builder / Product lead",
            },
            {
                "name": "Hyrax.ng",
                "short_description": "A digital marketplace for genuine products, everyday essentials, and digital offers with fast Abuja delivery positioning.",
                "long_description": (
                    "Hyrax.ng is an e-commerce product focused on trusted product access, clean merchandising, and practical customer support. "
                    "Its positioning shows Vincent's ability to deliver a commercial product with operational clarity and user-facing polish."
                ),
                "live_url": "https://hyrax.ng/",
                "display_order": 2,
                "category": Project.CATEGORY_ECOMMERCE,
                "tech_stack": "E-commerce strategy, Front-end direction, Product operations",
                "role_label": "Builder / Digital operator",
            },
            {
                "name": "Hyrax Invoice",
                "short_description": "A lightweight invoicing SaaS product designed to simplify billing for Nigerian small businesses.",
                "long_description": (
                    "Hyrax Invoice is a practical SaaS application built around a simple business promise: make invoice creation, sending, and tracking easier for small businesses. "
                    "The product demonstrates Vincent's capacity to design useful software around real operational pain points."
                ),
                "live_url": "https://invoice.hyrax.com.ng/",
                "display_order": 3,
                "category": Project.CATEGORY_SAAS,
                "tech_stack": "SaaS concept, Product workflow, Business systems",
                "role_label": "Builder / Systems thinker",
            },
            {
                "name": "HYRAX",
                "short_description": "A corporate website for an AI enablement and IT consultancy helping Africans and institutions adopt AI effectively.",
                "long_description": (
                    "HYRAX positions itself as an AI enablement company focused on automation, software, integration, cloud, cybersecurity, data systems, training, and advisory. "
                    "The website reinforces Vincent's commercial and technical positioning as a builder who can translate capability into a public-facing brand."
                ),
                "live_url": "https://hyrax.com.ng/",
                "display_order": 4,
                "category": Project.CATEGORY_CORPORATE,
                "tech_stack": "Corporate web strategy, AI positioning, Information architecture",
                "role_label": "Builder / Strategy lead",
            },
            {
                "name": "Patience Gbenga Foundation",
                "short_description": "A nonprofit platform centered on maternal health, family support, and economic opportunity for vulnerable women and families.",
                "long_description": (
                    "Patience Gbenga Foundation's digital presence focuses on maternal and infant health, practical family support, and community-led care. "
                    "It demonstrates Vincent's ability to shape nonprofit storytelling and platform experience for mission-driven organisations."
                ),
                "live_url": "https://patiencegbenga.org.ng/",
                "display_order": 5,
                "category": Project.CATEGORY_NONPROFIT,
                "tech_stack": "Nonprofit storytelling, Product direction, Front-end delivery",
                "role_label": "Builder / Mission-driven technologist",
            },
        ]

        for item in projects:
            Project.objects.update_or_create(
                name=item["name"],
                defaults={**item, "featured": True},
            )

    def seed_articles(self):
        categories = {
            "social-protection": ArticleCategory.objects.update_or_create(
                slug="social-protection",
                defaults={"name": "Social Protection", "description": "Essays and research on resilience, policy, and inclusion."},
            )[0],
            "digital-systems": ArticleCategory.objects.update_or_create(
                slug="digital-systems",
                defaults={"name": "Digital Systems", "description": "Technology design, digital transformation, and information systems."},
            )[0],
            "institutional-effectiveness": ArticleCategory.objects.update_or_create(
                slug="institutional-effectiveness",
                defaults={"name": "Institutional Effectiveness", "description": "Programme management, organisational performance, and accountability."},
            )[0],
            "governance-gender": ArticleCategory.objects.update_or_create(
                slug="governance-gender",
                defaults={"name": "Governance & Gender", "description": "Governance, accountability, gender justice, and public leadership."},
            )[0],
        }
        tags = {
            slug: ArticleTag.objects.update_or_create(slug=slug, defaults={"name": name})[0]
            for slug, name in [
                ("automation", "Automation"),
                ("social-policy", "Social Policy"),
                ("health-information", "Health Information"),
                ("lean-management", "Lean Management"),
                ("ngo-management", "NGO Management"),
                ("gbv-prevention", "GBV Prevention"),
                ("accountability", "Accountability"),
                ("digital-transformation", "Digital Transformation"),
            ]
        }

        articles = [
            {
                "title": "Social Protection in the Age of Automation: Policy Options for Skills Security in Nigeria",
                "summary": "A practical policy argument for how countries like Nigeria can protect workers and households as automation reshapes labour demand.",
                "body": """
<h2>Why automation changes the policy conversation</h2>
<p>Automation is no longer a distant issue reserved for highly industrialised economies. In Nigeria, digital tools and AI systems are already changing the kinds of skills employers need, the pace of work, and the expectations placed on workers and institutions. The question is no longer whether automation will affect social protection systems. The question is whether policy will move quickly enough to protect people whose livelihoods will become more fragile in the transition.</p>
<p>For social protection to remain credible, it must move beyond narrow cash-transfer thinking and become more responsive to skills insecurity, labour-market transitions, and the quality of household resilience. A stronger system should protect against income shocks while also helping people retool for the economy that is emerging.</p>
<h2>What skills security should mean in practice</h2>
<p>Skills security means more than training. It requires a public commitment to helping citizens remain economically useful and socially protected as markets change. In practice, that means linking labour intelligence, training systems, targeted support for vulnerable groups, and active transition measures.</p>
<ul>
  <li>Map sectors most exposed to digital displacement and those most likely to create new work.</li>
  <li>Design support packages that combine income protection with reskilling and placement support.</li>
  <li>Prioritise women, youth, and workers in fragile or informal labour markets who face multiple layers of risk.</li>
  <li>Use digital tools to improve targeting, follow-up, and accountability without excluding low-connectivity communities.</li>
</ul>
<h2>Institutional design matters</h2>
<p>Policy ambition fails when institutions are not designed to deliver. Social protection agencies, training institutions, and labour-market actors need clearer interfaces, shared data standards, and stronger coordination. Without these, policy remains declarative rather than operational.</p>
<p>Nigeria does not need imported policy language as much as it needs workable delivery architecture. That includes measurable outcomes, adaptive learning loops, and digital systems that support better implementation rather than simply adding new layers of reporting.</p>
<h2>Conclusion</h2>
<p>The future of work should not be approached as a technology conversation alone. It is also a governance question, a social protection question, and a credibility question. Countries that treat skills security as a core public responsibility will be better positioned to protect citizens while remaining economically competitive.</p>
                """.strip(),
                "featured": True,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2025, 11, 15, 9, 0)),
                "reading_time_minutes": 8,
                "meta_title": "Social Protection in the Age of Automation | Vincent Dania",
                "meta_description": "Policy reflections on automation, labour transitions, and skills security in Nigeria.",
                "categories": [categories["social-protection"]],
                "tags": [tags["automation"], tags["social-policy"]],
            },
            {
                "title": "A Model for an Interoperable Health Information System for Nigeria",
                "summary": "A systems-focused case for health information infrastructure that improves referral, coordination, and decision-making.",
                "body": """
<h2>The problem is not data scarcity alone</h2>
<p>Nigeria produces significant volumes of health data, but fragmented systems often make that data less useful than it should be. When facilities, programmes, and referral pathways cannot exchange information reliably, critical signals are delayed and decision-making becomes reactive rather than preventive.</p>
<p>An interoperable model matters because maternal health, emergency response, public health surveillance, and frontline coordination all depend on information moving across institutional boundaries without distortion or unnecessary delay.</p>
<h2>What an interoperable model should prioritise</h2>
<ul>
  <li>Common data standards that reduce duplication and improve consistency.</li>
  <li>Referral visibility so frontline teams can act earlier when risk escalates.</li>
  <li>Role-based access controls that protect privacy while supporting practical use.</li>
  <li>Governance frameworks that define who owns which decisions and which data flows matter most.</li>
</ul>
<h2>Technology is only one layer</h2>
<p>Interoperability is not a software feature alone. It is an institutional design challenge. Technical standards, training, governance, funding, and user adoption all have to move together. Systems fail when new platforms are introduced without addressing real workflow constraints or the incentives of those expected to use them.</p>
<p>That is why a serious model for Nigeria must treat interoperability as a delivery question. The goal is not simply to connect databases. The goal is to improve care, reduce information loss, and support faster coordination across the health system.</p>
<h2>Why this matters for social impact leaders</h2>
<p>For programme leaders and policymakers, interoperable systems create the conditions for better evidence, better accountability, and better service outcomes. They also make it easier to learn across programmes and reduce the waste caused by parallel systems.</p>
                """.strip(),
                "featured": False,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2024, 9, 12, 10, 30)),
                "reading_time_minutes": 7,
                "meta_title": "Interoperable Health Information Systems for Nigeria | Vincent Dania",
                "meta_description": "Why Nigeria needs interoperable health information systems that improve care and coordination.",
                "categories": [categories["digital-systems"]],
                "tags": [tags["health-information"], tags["digital-transformation"]],
            },
            {
                "title": "Evaluating Lean Management in Nigerian NGOs: Stakeholder Value Beyond Compliance",
                "summary": "A management perspective on how NGOs can reduce waste, improve clarity, and create better value for stakeholders.",
                "body": """
<h2>Lean management is not only for manufacturing</h2>
<p>In NGO settings, inefficiency rarely appears as a single dramatic failure. It shows up as duplicated approvals, overdesigned reporting, weak handoffs, and internal routines that consume energy without improving outcomes. Lean management offers a useful way to interrogate these patterns.</p>
<p>For development organisations, the aim should not be austerity for its own sake. The aim is to protect value by reducing friction between intention, process, and delivery.</p>
<h2>Where stakeholder value is often lost</h2>
<ul>
  <li>Programme teams carry reporting burdens that do not improve decision quality.</li>
  <li>Approvals move slowly, leaving implementation teams unable to adapt in time.</li>
  <li>Knowledge stays trapped in individuals rather than becoming institutional memory.</li>
  <li>Digital tools are introduced without enough clarity on workflow improvement.</li>
</ul>
<h2>A more useful application of lean principles</h2>
<p>Lean thinking becomes valuable when it is translated into practical questions: Which meetings genuinely improve delivery? Which reporting loops support learning? Which workflows slow down decision-making without reducing risk? Answering those questions honestly can create a stronger operating model.</p>
<p>Stakeholder value in NGO work includes donors, communities, staff, and partner institutions. Lean management should help organisations serve all four more effectively by improving responsiveness, transparency, and execution discipline.</p>
<h2>Conclusion</h2>
<p>Compliance matters, but compliance alone is not excellence. Organisations that can simplify workflows, clarify ownership, and build smarter operating rhythms are better positioned to deliver sustained social impact.</p>
                """.strip(),
                "featured": False,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2025, 4, 18, 8, 45)),
                "reading_time_minutes": 6,
                "meta_title": "Lean Management in Nigerian NGOs | Vincent Dania",
                "meta_description": "How lean management can improve stakeholder value, clarity, and execution in NGO settings.",
                "categories": [categories["institutional-effectiveness"]],
                "tags": [tags["lean-management"], tags["ngo-management"]],
            },
            {
                "title": "Building Accountability Systems Communities Can Actually Use",
                "summary": "Digital accountability tools succeed when they respect community realities, verification needs, and institutional follow-through.",
                "body": """
<h2>Accountability starts with usability</h2>
<p>Many accountability systems fail because they are designed around institutional expectations rather than community realities. If reporting is cumbersome, inaccessible, or disconnected from visible response, participation declines quickly. Communities do not need platforms that look impressive. They need tools that are clear, safe, and worth using.</p>
<h2>What usable accountability infrastructure requires</h2>
<ul>
  <li>Simple reporting pathways that lower friction and protect vulnerable users.</li>
  <li>Verification steps that improve credibility without silencing lived experience.</li>
  <li>Safeguarding logic for sensitive issues such as gender-based violence.</li>
  <li>Institutional workflows that make follow-up and response visible.</li>
</ul>
<h2>Digital design must be paired with governance design</h2>
<p>Technology alone cannot fix accountability failures. Digital reporting systems become meaningful only when institutions accept obligations to review, verify, respond, and learn. That requires clear role definitions, escalation pathways, and evidence standards that people can trust.</p>
<p>When these conditions are present, digital tools can strengthen transparency and make it easier for communities to surface implementation gaps that would otherwise remain invisible.</p>
                """.strip(),
                "featured": False,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2025, 7, 5, 11, 15)),
                "reading_time_minutes": 5,
                "meta_title": "Community Accountability Systems | Vincent Dania",
                "meta_description": "What makes digital accountability systems usable, credible, and institutionally meaningful.",
                "categories": [categories["governance-gender"], categories["digital-systems"]],
                "tags": [tags["accountability"], tags["digital-transformation"], tags["gbv-prevention"]],
            },
            {
                "title": "Scaling GBV Prevention Beyond Events: Why Delivery Systems Matter",
                "summary": "National GBV prevention work requires more than campaigns; it needs structured systems, learning loops, and practical accountability.",
                "body": """
<h2>Awareness is not the same as delivery</h2>
<p>GBV prevention programmes often generate strong moments of visibility through events, campaigns, and public dialogue. Those moments matter, but they do not automatically create sustained change. Scale requires systems: clear implementation architecture, structured learning, and accountability for follow-through.</p>
<h2>What stronger delivery looks like</h2>
<ul>
  <li>Consistent implementation frameworks across states and partners.</li>
  <li>Learning systems that track participation, completion, and behavioural signals over time.</li>
  <li>Donor reporting that goes beyond activity counts to evidence of traction and risk.</li>
  <li>Partnership models that include community, faith, and traditional leadership actors.</li>
</ul>
<h2>Technology can support better scale</h2>
<p>Digital learning systems can make GBV prevention work more structured, especially when programmes need to support large numbers of participants across geographies. But digital tools only help when they are integrated into a credible delivery model with clear ownership and follow-up.</p>
<p>At scale, the real test is not whether a programme can launch. It is whether it can sustain quality, accountability, and learning while expanding reach.</p>
                """.strip(),
                "featured": False,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2026, 1, 22, 9, 20)),
                "reading_time_minutes": 5,
                "meta_title": "Scaling GBV Prevention Beyond Events | Vincent Dania",
                "meta_description": "Why GBV prevention programmes need structured delivery systems, not only campaign visibility.",
                "categories": [categories["governance-gender"]],
                "tags": [tags["gbv-prevention"], tags["accountability"]],
            },
        ]

        for article_data in articles:
            categories_for_article = article_data.pop("categories")
            tags_for_article = article_data.pop("tags")
            article, _ = Article.objects.update_or_create(
                title=article_data["title"],
                defaults=article_data,
            )
            article.categories.set(categories_for_article)
            article.tags.set(tags_for_article)
