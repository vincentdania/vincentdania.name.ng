from datetime import date, datetime
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from content.models import Article, ArticleCategory, ArticleTag, Project
from core.models import (
    BlogSettings,
    Certification,
    CredibilityStat,
    EducationCredential,
    Experience,
    ExpertiseCategory,
    ImpactMetric,
    NavigationItem,
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
        self.seed_navigation_and_blog()
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
        settings.footer_note = "Programme leadership, institutional strengthening, and digital systems for measurable social impact."
        settings.hero_primary_cta_label = "Work with Vincent"
        settings.hero_primary_cta_link = "#contact"
        settings.hero_secondary_cta_label = "View Portfolio"
        settings.hero_secondary_cta_link = "#tech"
        settings.navbar_contact_label = "Contact Me"
        settings.navbar_contact_link = "/#contact"
        settings.navbar_cv_label = "Download CV"
        settings.contact_email_button_label = "Send Email"
        settings.contact_whatsapp_button_label = "Chat on WhatsApp"
        settings.contact_cv_button_label = "Download Full CV"
        settings.footer_copyright = "Designed & developed by Vincent Dania. All rights reserved."
        settings.meta_title = "Vincent Dania | AI Enablement, Programme Leadership & Social Impact"
        settings.meta_description = (
            "Portfolio and articles for Vincent Dania, CEO of Hyrax, IT professional, AI advisor, and social impact leader."
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
        profile.hero_eyebrow = "CEO, Hyrax | AI Enablement Leader | IT Professional"
        profile.hero_title = "Building AI-enabled systems, social impact programmes, and digital products that create practical value."
        profile.hero_subtitle = (
            "Vincent Dania is an AI enablement leader, technology builder, and social impact executive working across "
            "practical AI adoption, digital commerce, maternal and infant health, economic opportunity, and institutional delivery."
        )
        profile.about_title = "Turning strategy into systems that deliver results."
        profile.about_body = (
            "Vincent Dania is CEO of Hyrax, positioned as The AI Enablement Company. "
            "His work sits at the intersection of practical technology adoption, digital operations, social impact, and human development.\n\n"
            "Hyrax.ng currently presents a fast, trusted Abuja digital marketplace built around genuine products, verified stock, digital offers, clear support, and convenient web or WhatsApp ordering. "
            "That operating experience strengthens Vincent's AI enablement work with direct exposure to real customer journeys, commerce workflows, product operations, and small business productivity needs.\n\n"
            "Patience Gbenga Foundation works to end preventable maternal and infant deaths while expanding economic opportunity for vulnerable women and families in Nigeria. "
            "Its model combines community-led care, health system strengthening, digital innovation, maternal risk identification, practical family support, and income recovery pathways.\n\n"
            "Vincent also brings more than 15 years of IT education experience, donor-funded programme leadership, project management discipline, and hands-on digital product delivery. "
            "He has worked with foundations, multilateral partners, civil society organisations, community actors, public institutions, learners, and builders to turn ideas into systems people can use."
        )
        profile.builder_title = "The Builder Portfolio"
        profile.builder_intro = (
            "A portfolio of purpose-built digital solutions addressing complex organisational "
            "and educational challenges."
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
        profile.contact_title = "Start a Conversation"
        profile.contact_copy = (
            "Whether it's AI, programme design and delivery, or capacity-building and training, "
            "I'm available to explore how I can support your goals."
        )
        profile.save()

    def seed_navigation_and_blog(self):
        items = [
            ("About Vincent", "/#about", 1),
            ("Experience", "/#experience", 2),
            ("Portfolio", "/#tech", 3),
            ("Blog", "/blog", 4),
            ("PhD Research", "/phd", 5),
            ("AI Consultation", "/consult", 6),
        ]
        for label, href, order in items:
            NavigationItem.objects.update_or_create(
                label=label,
                defaults={
                    "href": href,
                    "order": order,
                    "visible": True,
                    "open_in_new_tab": False,
                },
            )

        blog = BlogSettings.load()
        blog.index_badge_label = "Blog"
        blog.index_title = "Writing on institutions, delivery, policy, and digital systems."
        blog.index_intro = (
            "A curated archive of essays, practical reflections, and research-led thinking "
            "grounded in programme implementation, public value, and technology-enabled systems change."
        )
        blog.featured_badge_label = "Featured post"
        blog.featured_fallback_title = "Practical thinking for systems that serve people well."
        blog.archive_eyebrow = "Archive"
        blog.archive_title = (
            "Explore perspectives on governance, institutional effectiveness, social protection, "
            "and digital execution."
        )
        blog.archive_intro = (
            "Search by topic, filter the archive, and move from strategic reflections to "
            "implementation lessons with a more editorial reading experience."
        )
        blog.archive_link_label = "Full archive"
        blog.subscribe_badge_label = "Subscribe"
        blog.subscribe_title = "Receive new essays directly."
        blog.subscribe_description = (
            "Join the list for practical reflections on programme leadership, policy, "
            "institutional performance, and digital systems that create measurable value."
        )
        blog.detail_back_label = "Back to blog"
        blog.detail_meta_heading = "Post details"
        blog.meta_title = "Vincent Dania Blog | Policy, Delivery & Digital Systems"
        blog.meta_description = (
            "Blog posts and essays by Vincent Dania on programme delivery, social protection, "
            "institutional effectiveness, and digital systems."
        )
        blog.save()

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
            "15+ Years Experience",
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
                "title": "CEO",
                "organization": "Hyrax - The AI Enablement Company",
                "location": "Abuja, Nigeria",
                "employment_type": "Executive Leadership",
                "start_date": date(2026, 5, 1),
                "end_date": None,
                "is_current": True,
                "summary": "Leads Hyrax as an AI enablement company helping people and organisations translate technology into practical productivity, digital operations, and business value.",
                "achievements": [
                    "Hyrax.ng currently presents a trusted Abuja digital marketplace focused on genuine products, verified stock, digital offers, fast fulfilment, and convenient web or WhatsApp ordering.",
                    "Uses direct marketplace and customer-support experience to ground AI advisory in real small-business workflows, commerce operations, and practical productivity needs.",
                    "Shapes Hyrax around AI literacy, automation, digital product thinking, and accessible technology enablement for African businesses and institutions.",
                ],
                "order": 1,
            },
            {
                "title": "Foundation Strategy & Digital Systems Lead",
                "organization": "Patience Gbenga Foundation",
                "location": "Abuja, Nigeria",
                "employment_type": "Advisory & Systems Support",
                "start_date": date(2022, 7, 1),
                "end_date": None,
                "is_current": False,
                "summary": "Supported mission strategy and digital systems for a foundation working to end preventable maternal and infant deaths and expand economic opportunity for vulnerable women and families in Nigeria.",
                "achievements": [
                    "Contributed to an integrated model combining community-led care, health system strengthening, digital innovation, and practical family support.",
                    "Helped shape platform content around mobile maternal care, maternal risk identification, referral coordination, memorial advocacy, and family recovery grants.",
                    "Supported digital storytelling that connects safer motherhood, household stability, data-enabled care, and income recovery for vulnerable families.",
                ],
                "order": 2,
                "featured": False,
            },
            {
                "title": "Programme Coordinator - Male Feminists Network",
                "organization": "African Centre for Leadership, Strategy & Development (Centre LSD)",
                "location": "Abuja, Nigeria",
                "employment_type": "Full-time",
                "start_date": date(2025, 5, 1),
                "end_date": date(2026, 5, 31),
                "is_current": False,
                "summary": "Leads the national rollout of a Ford Foundation-funded programme mobilising men as allies for GBV prevention across all six geopolitical zones of Nigeria.",
                "achievements": [
                    "Coordinates a cross-functional team spanning programme, MEL, media, and administration.",
                    "Designed and deployed a technology-enabled learning system enrolling 8,400+ learners and supporting 5,000+ course completions.",
                    "Leads donor compliance, budgeting, and reporting for a $1M grant while maintaining disciplined budget performance.",
                    "Strengthens accountability through structured workplans, learning loops, and stakeholder review forums.",
                ],
                "order": 3,
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
                "order": 4,
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
                "order": 5,
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
                "order": 6,
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
                "order": 7,
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
                "order": 8,
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
                "order": 9,
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
                "order": 10,
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
            "Hybrid roles",
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
            {
                "name": "NextGen",
                "short_description": "A digital infrastructure platform that enables Nigerian universities to deliver accredited degree programmes online to students anywhere in the world without expanding physical campuses.",
                "long_description": (
                    "NextGen highlights Vincent's ability to shape a polished digital front door for organisations that need clarity, credibility, and a cleaner public presence. "
                    "The project reinforces his strength in turning institutional intent into usable web experiences."
                ),
                "live_url": "https://nextgen.com.ng/",
                "display_order": 6,
                "category": Project.CATEGORY_CORPORATE,
                "tech_stack": "Web strategy, Content structure, Brand-aligned delivery",
                "role_label": "Builder / Digital strategist",
            },
        ]

        for item in projects:
            Project.objects.update_or_create(
                name=item["name"],
                defaults={**item, "featured": True},
            )

        Project.objects.filter(name__in=["Host Communities", "Male Feminists Network"]).delete()

    def seed_articles(self):
        seed_dir = Path(__file__).resolve().parents[3] / "seed_assets"
        ngo_cover_image = "ngo-sector-in-nigeria.jpg"
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
            "ngo-sector": ArticleCategory.objects.update_or_create(
                slug="ngo-sector",
                defaults={"name": "NGO Sector", "description": "Reflections on civil society, donor funding, accountability, and development practice."},
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
                ("donor-funding", "Donor Funding"),
                ("ngo-reform", "NGO Reform"),
                ("development-practice", "Development Practice"),
            ]
        }

        articles = [
            {
                "title": "The NGO Sector in Nigeria Is Broken: An Insider's Reflection, Part 1",
                "summary": "An insider's introduction to why NGOs matter in Nigeria, why their work often reaches people others ignore, and why the sector still needs serious reform.",
                "body": """
<p>I recently took a break from the NGO sector in Nigeria after 13 years of active employment with one of the leading national NGOs.</p>
<p>I want to take some time to write about my experiences, the lessons I learned, and some observations I believe the donor community needs to pay attention to.</p>
<p>I rose through the ranks from intern to managing national projects worth billions of naira. I have travelled to virtually every state in Nigeria. I have been to rural communities that politicians do not visit even during campaigns.</p>
<p>So my perspective comes from direct field experience gathered over several years of interacting with stakeholders on both the demand and supply side of development work.</p>
<p>For a start, many people do not fully appreciate the important role NGOs play in Nigeria. The NGO sector is the true last hope of the common man, especially now that justice in Nigeria increasingly appears to be for the highest bidder.</p>
<p>NGO workers are among the very few people who will risk their lives and personal comfort to deliver life-saving interventions to complete strangers who have no economic or political value to them.</p>
<p>Let me explain this further.</p>
<p>A politician often does things for people and communities that can translate into votes, even though the resources being used actually came from the people through taxes. A corporate organisation carries out CSR activities in communities where they extract resources or where their operations have an impact. An evangelist makes sacrifices so people can give their lives to Christ and so he can reap eternal rewards in heaven. Even many "men of God" prefer big cities where the "flocks" are financially robust.</p>
<p>But a true NGO worker will often travel long distances, endure harsh conditions, and work on little more than a survival allowance just to help communities with whom he has no blood, economic, spiritual, or political ties.</p>
<p>Secondly, NGOs are at the forefront of real development work in Nigeria.</p>
<p>Many politicians are focused on large infrastructure projects like roads and bridges that can generate huge kickbacks. NGOs, on the other hand, are the ones implementing interventions that ensure children receive nutrition supplements so their cognitive abilities can develop properly. They run programmes against child marriage so young girls can stay in school, build confidence, and develop agency over their lives. They champion social protection so poor and vulnerable people are protected from shocks and can live with some dignity. They push for social justice, empower citizens to reclaim their rights, and advocate for government policies to have a human face.</p>
<p>No other sector consistently does this kind of work.</p>
<p>It is not an exaggeration to say that many NGO workers are doing what most people would describe as the real work of God on earth.</p>
<p>This is why it is important to pay attention to what happens within the sector.</p>
<p>One reason many Nigerians do not pay attention to NGOs is because most local NGOs are funded by international foundations and development partners, unlike politicians who spend public funds generated from taxes and national resources.</p>
<p>But in reality, the funds NGOs receive are collected on behalf of the people.</p>
<p>The painful truth, however, is that the current operating model of the NGO sector in Nigeria is broken in many ways, and it needs serious reform.</p>
<p>I hope this series of articles draws the attention of NGOs, donors, development partners, and the wider public to some of the issues that deserve urgent reflection.</p>
<p>Part 2 continues with a closer look at the money.</p>
                """.strip(),
                "cover_image_name": ngo_cover_image,
                "featured": True,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2026, 5, 22, 18, 0)),
                "reading_time_minutes": 5,
                "meta_title": "The NGO Sector in Nigeria Is Broken, Part 1 | Vincent Dania",
                "meta_description": "An insider's reflection on why NGOs matter in Nigeria and why the sector urgently needs reform.",
                "categories": [categories["ngo-sector"], categories["institutional-effectiveness"]],
                "tags": [tags["ngo-reform"], tags["development-practice"], tags["accountability"]],
            },
            {
                "title": "The NGO Sector in Nigeria Is Broken: An Insider's Reflection, Part 2",
                "summary": "A follow-the-money reflection on donor funding, grant cycles, NGO overhead, and the difficult question of whether development spending is producing proportional transformation.",
                "body": """
<h2>Let's Follow the Money</h2>
<p>In Part 1 of this series, I explained why NGOs remain one of the few institutions still doing genuine development work in Nigeria despite the many challenges within the sector.</p>
<p>I also stated clearly that the sector itself is broken in many ways and urgently needs reform.</p>
<p>To understand the depth of the problem, we need to start by following the money.</p>
<p>Most of the substantial funding NGOs receive in Nigeria comes from foreign foundations and international development partners. These funds usually come through one of three routes.</p>
<p>First, an organisation sees a public call for proposals and applies competitively for funding.</p>
<p>Second, a donor organisation notices the work an NGO is doing and approaches them for possible partnership and support.</p>
<p>Third, and this is the uncomfortable part many people do not openly discuss, relationships and networks also play a major role. Sometimes, someone within or close to a donor organisation helps facilitate access to funding opportunities.</p>
<p>Before these grants are approved, many donor organisations conduct extensive assessments of the NGO's governance structures, financial systems, procurement processes, safeguarding policies, and accountability mechanisms. Some organisations go through months of due diligence before a grant agreement is signed.</p>
<p>On paper, the system appears rigorous.</p>
<p>The money involved is also enormous.</p>
<p>Between 2007 and 2025, the Gates Foundation awarded more than $1.38 billion USD in grants to 136 organisations operating in Nigeria. At current exchange rates, this is roughly over &#8358;2 trillion.</p>
<p>Similarly, between 2015 and 2025, the MacArthur Foundation disbursed over $151 million USD to approximately 130 Nigerian organisations.</p>
<p>In 2024 alone, the Ford Foundation awarded about $15.4 million USD to 55 organisations in Nigeria.</p>
<p>These figures are not hidden. They are publicly available on the websites and annual reports of the donor organisations themselves.</p>
<p>To be clear, this level of international support for Nigeria is both significant and commendable.</p>
<p>These grants support important work in healthcare, education, governance reform, gender equality, social justice, economic empowerment, humanitarian response, climate action, and human rights advocacy.</p>
<p>But despite the scale of these investments, a difficult question continues to echo quietly among many Nigerians:</p>
<p><strong>What real value are these grants delivering relative to the amount of money being spent?</strong></p>
<p>This is not an attack on NGOs or donors. It is a serious question that deserves honest reflection.</p>
<p>The Project Management Institute broadly defines project success as the extent to which the value delivered is commensurate with the effort and resources invested.</p>
<p>In simple terms, if billions are being spent year after year, the outcomes should be visible and measurable in the lives of ordinary people.</p>
<p>The facts on ground often suggest otherwise.</p>
<p>Many communities remain trapped in extreme poverty despite years of interventions. Some rural communities have hosted development projects for over a decade, yet their realities barely change. Workshops continue. Reports continue. Conferences continue. Funding cycles continue.</p>
<p>But sometimes it becomes difficult to point clearly to proportional transformation.</p>
<p>So where is the money really going?</p>
<p>A simple place to start is by examining the audited financial statements and annual reports published by NGOs themselves.</p>
<p>Again, everything I will reference in this series comes from information already made public by the organisations involved. This is important because discussions around the NGO sector are often emotional, defensive, or reduced to conspiracy theories.</p>
<p>I am not interested in conspiracy theories.</p>
<p>I am interested in systems.</p>
<p>When you carefully study the financial records of many NGOs, you begin to notice certain patterns.</p>
<p>A substantial portion of donor funding often goes into administrative structures, salaries, international travel, consultancy fees, workshops, branding, meetings, procurement processes, office maintenance, vehicle costs, and endless layers of project management overhead.</p>
<p>Now let me be clear before some people intentionally misunderstand this point.</p>
<p>NGOs need competent staff. Development work is difficult work. Good professionals deserve fair salaries. Organisations need offices, systems, audits, safeguarding structures, monitoring frameworks, logistics, and compliance mechanisms.</p>
<p>That is not the problem.</p>
<p>The real problem begins when the system gradually becomes more focused on sustaining itself than solving the actual problems it was created to address.</p>
<p>At some point, some organisations unconsciously begin to optimise more for grant survival than for transformational impact.</p>
<p>The goal subtly shifts from "How do we solve this problem?" to "How do we position ourselves for the next funding cycle?"</p>
<p>And once that happens, an entire ecosystem quietly develops around perpetual intervention rather than permanent solutions.</p>
<p>Projects become continuous.</p>
<p>Problems become institutionalised.</p>
<p>Communities become statistics in proposal documents.</p>
<p>And donor reports begin to look more successful than the realities on ground.</p>
<p>This is one of the hardest truths I had to confront after spending over a decade inside the sector.</p>
<p>Part 3 will explore another uncomfortable issue within the NGO sector in Nigeria: the growing disconnect between donor expectations, NGO narratives, and the actual realities faced by local communities.</p>
                """.strip(),
                "cover_image_name": ngo_cover_image,
                "featured": False,
                "status": Article.STATUS_PUBLISHED,
                "published_at": aware_datetime(datetime(2026, 5, 22, 18, 5)),
                "reading_time_minutes": 8,
                "meta_title": "The NGO Sector in Nigeria Is Broken, Part 2 | Vincent Dania",
                "meta_description": "A follow-the-money reflection on donor funding, NGO overhead, and the value delivered by development spending in Nigeria.",
                "categories": [categories["ngo-sector"], categories["institutional-effectiveness"]],
                "tags": [tags["donor-funding"], tags["ngo-reform"], tags["development-practice"], tags["accountability"]],
            },
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
            cover_image_name = article_data.pop("cover_image_name", "")
            article, _ = Article.objects.update_or_create(
                title=article_data["title"],
                defaults=article_data,
            )
            if cover_image_name:
                cover_path = seed_dir / cover_image_name
                cover_stem = Path(cover_image_name).stem
                current_cover_stem = Path(article.cover_image.name).stem if article.cover_image else ""
                if cover_path.exists() and (
                    not article.cover_image
                    or not current_cover_stem.startswith(cover_stem)
                ):
                    with cover_path.open("rb") as image_file:
                        article.cover_image.save(cover_image_name, File(image_file), save=True)
            article.categories.set(categories_for_article)
            article.tags.set(tags_for_article)
