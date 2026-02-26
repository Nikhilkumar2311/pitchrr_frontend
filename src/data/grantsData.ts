// =============================================================================
// GRANTS DATA
// =============================================================================
// Static grants dataset used for browsing and AI recommendation context.
// =============================================================================

export interface Grant {
    title: string;
    type?: string | null;
    organization?: string | null;
    startup_stage?: string | string[] | null;
    category: string | string[];
    sector: string | string[];
    benefits?: string[] | null;
    funding?: string | null;
    deadline?: string | null;
    eligibility?: string | null;
    official_url?: string | null;
    description?: string | null;
    scraped_at?: string | null;
    first_seen?: string | null;
    url_hash?: string | null;
    grantId?: string | null;
    applicationUrl?: string | null;
    industryEligibility?: string | null;
    [key: string]: unknown; // allow extra scraped fields
}

export interface GrantCategory {
    id: string;
    label: string;
    grants: Grant[];
}

/** Raw grants array — data is unmodified from the scrape */
export const grants: Grant[] = [
    {
        "title": "DPIIT Startup Recognition",
        "type": "Recognition",
        "organization": "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
        "startup_stage": ["Idea", "Early Stage", "Growth"],
        "category": "Recognition",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Income tax exemption eligibility",
            "Self-certification for labour & environmental laws",
            "IPR fast-tracking and fee rebate",
            "Access to government tenders",
            "Easier public procurement norms"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Entity must be incorporated as a private limited company, LLP, or partnership firm and meet DPIIT startup criteria.",
        "official_url": "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html",
        "description": "Eligible companies can obtain DPIIT recognition to access tax benefits, regulatory easing, IPR support, and government procurement advantages."
    },
    {
        "title": "Startup India Seed Fund Scheme (SISFS)",
        "type": "Funding Support",
        "organization": "DPIIT, Government of India",
        "startup_stage": ["Proof of Concept", "Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Up to ₹20 lakh for proof of concept",
            "Up to ₹50 lakh for product development & market entry",
            "Support through incubators"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "DPIIT-recognized startups not older than 2 years at application and supported by an eligible incubator.",
        "official_url": "https://seedfund.startupindia.gov.in/",
        "description": "Provides financial assistance to startups for validation of ideas, prototype development, product trials, and market entry."
    },
    {
        "title": "Credit Guarantee Scheme for Startups (CGSS)",
        "type": "Credit Support",
        "organization": "Government of India",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Credit guarantee cover for loans",
            "Reduced collateral requirements",
            "Encourages lending to startups"
        ],
        "funding": "20,00,00,000",
        "deadline": null,
        "eligibility": "DPIIT-recognized startups seeking loans from scheduled commercial banks, NBFCs, or SEBI-registered AIF-backed VDFs.",
        "official_url": "https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html",
        "description": "Provides government-backed credit guarantees to encourage financial institutions to lend to startups."
    }, {
        "title": "Andaman & Nicobar Startup Incubator Support Scheme",
        "type": "Incubator Support",
        "organization": "Andaman and Nicobar Islands Integrated Development Corporation (ANIIDCO) Ltd.",
        "startup_stage": ["Incubator", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Innovation fund support",
            "Development of coworking spaces",
            "Infrastructure support for incubators"
        ],
        "funding": "1,00,00,000",
        "deadline": null,
        "eligibility": "Entities establishing incubators under the Andaman & Nicobar Startup Policy.",
        "official_url": "https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "description": "Provides financial support for establishing startup incubators and developing coworking infrastructure in the Andaman & Nicobar Islands."
    },
    {
        "title": "Startup India Seed Fund Scheme (SISFS)",
        "type": "Funding Support",
        "organization": "DPIIT, Government of India",
        "startup_stage": ["Proof of Concept", "Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Financial support for prototype development",
            "Market entry assistance",
            "Validation and commercialization support"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "DPIIT-recognized startups supported by eligible incubators.",
        "official_url": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Guidelines%20for%20Startup%20India%20Seed%20Fund%20Scheme.pdf",
        "description": "Provides seed funding to startups for proof of concept, product development, trials, and market entry."
    },
    {
        "title": "RaM Ventures Accelerator Programme",
        "type": "Accelerator",
        "organization": "RaM Ventures",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "Accelerator",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Mentorship and networking",
            "Investor and funding access",
            "Business growth support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups with a strong business model and growth potential.",
        "official_url": "https://www.startupgrantsindia.com/accelarator-program",
        "description": "A 1-year accelerator program offering mentorship, networking, and investor access to help startups scale."
    },
    {
        "title": "DST NIDHI Seed Support Programme – STBI (Savli Technology & Business Incubator)",
        "type": "Seed Fund",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Seed funding support",
            "Incubation support",
            "Mentorship and technical guidance"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Innovative startups incubated at STBI under DST NIDHI guidelines.",
        "official_url": "https://dst.gov.in/",
        "description": "Seed funding support under the DST NIDHI program provided through Savli Technology and Business Incubator (STBI)."
    },
    {
        "title": "DST NIDHI Seed Support Programme – VJTI TBI Foundation",
        "type": "Seed Fund",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Seed capital assistance",
            "Incubation support",
            "Mentorship"
        ],
        "funding": "20,00,000",
        "deadline": null,
        "eligibility": "Innovative startups incubated at VJTI TBI under DST NIDHI Seed Support guidelines.",
        "official_url": "https://dst.gov.in/",
        "description": "Financial assistance provided under the DST NIDHI Seed Support Programme via VJTI TBI Foundation."
    },
    {
        "title": "MeitY GENESIS Entrepreneur-in-Residence (EiR) Program – KIIF",
        "type": "Entrepreneur-in-Residence (EiR)",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Pre-Seed"],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [
            "Monthly fellowship support",
            "Mentorship and incubation",
            "Access to startup ecosystem"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Early-stage entrepreneurs selected under MeitY GENESIS EiR program at KIIF.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Entrepreneur-in-Residence program under MeitY GENESIS supporting early-stage technology innovators."
    },
    {
        "title": "MeitY GENESIS Entrepreneur-in-Residence (EiR) Program – AIC SMUTBI",
        "type": "Entrepreneur-in-Residence (EiR)",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Pre-Seed"],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [
            "Fellowship grant",
            "Mentorship and incubation",
            "Networking and ecosystem access"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Selected entrepreneurs under MeitY GENESIS EiR at AIC SMUTBI.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Financial and mentorship support under the MeitY GENESIS EiR initiative."
    },
    {
        "title": "MeitY GENESIS Entrepreneur-in-Residence (EiR) Program – AIC ISB",
        "type": "Entrepreneur-in-Residence (EiR)",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Pre-Seed"],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [
            "Fellowship support",
            "Incubation and mentorship",
            "Access to investor network"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Early-stage entrepreneurs selected under MeitY GENESIS EiR guidelines.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Entrepreneurship support program under MeitY GENESIS for technology-driven innovators."
    },
    {
        "title": "MeitY GENESIS Entrepreneur-in-Residence (EiR) Program – Runway Incubator, UPES",
        "type": "Entrepreneur-in-Residence (EiR)",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Pre-Seed"],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [
            "Entrepreneur fellowship support",
            "Mentorship and incubation",
            "Access to startup ecosystem"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Early-stage entrepreneurs selected under MeitY GENESIS EiR program at Runway Incubator, UPES.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Entrepreneur-in-Residence support under the MeitY GENESIS program implemented at Runway Incubator, UPES."
    },
    {
        "title": "MeitY GENESIS Entrepreneur-in-Residence (EiR) Program – AIC BIMTECH",
        "type": "Entrepreneur-in-Residence (EiR)",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Pre-Seed"],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [
            "Fellowship support",
            "Mentorship and incubation",
            "Networking and ecosystem access"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Entrepreneurs selected under MeitY GENESIS EiR guidelines at AIC BIMTECH.",
        "official_url": "https://www.meity.gov.in/",
        "description": "EiR fellowship program under MeitY GENESIS implemented through AIC BIMTECH."
    },
    {
        "title": "India–Canada Collaborative Industrial R&D Programme",
        "type": "Research & Development Grant",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "Bilateral R&D Programme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Support for joint industrial R&D",
            "International collaboration funding",
            "Technology development support"
        ],
        "funding": "1,50,00,000",
        "deadline": null,
        "eligibility": "Indian companies and research organizations collaborating with eligible Canadian partners.",
        "official_url": "https://dst.gov.in/",
        "description": "Bilateral industrial R&D program supporting joint innovation projects between India and Canada."
    },
    {
        "title": "Vernacular Innovation Program (VIP)",
        "type": "Ecosystem Support Program",
        "organization": "Atal Innovation Mission (AIM), NITI Aayog",
        "startup_stage": ["Idea", "Early Stage"],
        "category": "Government Initiative",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Design thinking resources in Indian languages",
            "Entrepreneurship capacity building",
            "Ecosystem access for vernacular innovators"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Innovators and entrepreneurs working in Indian vernacular languages.",
        "official_url": "https://aim.gov.in/Vernacular-Innovation-Program.php",
        "description": "AIM initiative to reduce language barriers and enable innovation and entrepreneurship in Indian vernacular languages."
    },
    {
        "title": "AIM-PRIME (Program for Researchers on Innovation, Market-readiness & Entrepreneurship)",
        "type": "Capacity Building Program",
        "organization": "Atal Innovation Mission (AIM), NITI Aayog, Government of India",
        "startup_stage": ["Research", "Idea", "Deep Tech"],
        "category": "Government Program",
        "sector": "Deep Technology",
        "benefits": [
            "9-month structured entrepreneurship training",
            "Market-readiness mentoring",
            "Commercialization guidance",
            "Incubator capacity building"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Science-based and deep-technology researchers, entrepreneurs, and incubator managers selected under AIM-PRIME guidelines.",
        "official_url": "https://aim.gov.in/primeprogram.php",
        "description": "A national initiative to promote science-based deep-tech ideas toward commercialization through structured training and mentoring."
    },
    {
        "title": "BIRAC SEED Fund Scheme",
        "type": "Seed Fund",
        "organization": "Biotechnology Industry Research Assistance Council (BIRAC), Department of Biotechnology, Government of India",
        "startup_stage": ["Idea", "Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Biotechnology",
        "benefits": [
            "Equity-based seed funding",
            "Support through BioNEST incubators",
            "Mentorship and commercialization assistance"
        ],
        "funding": "30,00,00,000",
        "deadline": null,
        "eligibility": "Biotech startups supported through BIRAC-recognized BioNEST partner incubators.",
        "official_url": "https://birac.nic.in/seedFundNew.php",
        "description": "Equity-based seed funding support provided through BIRAC’s SEED Fund Partner BioNEST incubators to promote biotechnology startups."
    },
    {
        "title": "PM Vishwakarma Scheme",
        "type": "Central Sector Scheme",
        "organization": "Ministry of Micro, Small & Medium Enterprises, Government of India",
        "startup_stage": ["Micro Enterprise", "Established"],
        "category": "Government Scheme",
        "sector": "Traditional Crafts & Artisans",
        "benefits": [
            "Collateral-free credit support",
            "Skill training",
            "Toolkit incentive",
            "Interest subvention"
        ],
        "funding": "13,00,00,00,000",
        "deadline": null,
        "eligibility": "Traditional artisans and craftspeople engaged in notified trades.",
        "official_url": "https://msme.gov.in/",
        "description": "Central sector scheme aimed at supporting traditional artisans and craftspeople through credit, skill development, and market linkage support."
    },
    {
        "title": "PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)",
        "type": "Micro-Credit Scheme",
        "organization": "Ministry of Housing & Urban Affairs, Government of India",
        "startup_stage": ["Micro Enterprise"],
        "category": "Government Scheme",
        "sector": "Street Vendors",
        "benefits": [
            "Working capital loan",
            "Interest subsidy",
            "Digital transaction incentives"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Street vendors operating before March 24, 2020.",
        "official_url": "https://pmsvanidhi.mohua.gov.in/",
        "description": "Provides affordable working capital loans to street vendors to restart their businesses."
    },
    {
        "title": "Production Linked Incentive (PLI) Scheme",
        "type": "Incentive Scheme",
        "organization": "Government of India",
        "startup_stage": ["Growth", "Scale-up", "Manufacturing"],
        "category": "Government Scheme",
        "sector": "Manufacturing",
        "benefits": [
            "Performance-based financial incentives",
            "Manufacturing expansion support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Eligible manufacturing companies meeting sector-specific criteria.",
        "official_url": "https://www.investindia.gov.in/production-linked-incentives-schemes-india",
        "description": "Provides financial incentives to boost domestic manufacturing and attract investments across key sectors."
    },
    {
        "title": "Scheme for Assistance to Startups/Innovation",
        "type": "Seed Fund & Scale-up Assistance",
        "organization": "Industries & Mines Department, Government of Gujarat",
        "startup_stage": ["Prototype", "Seed", "Scale-up"],
        "category": "State Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Seed funding support",
            "Sustenance allowance",
            "Interest subsidy",
            "Market development assistance"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups recognized under DPIIT or Gujarat Startup Policy criteria.",
        "official_url": "https://startup.gujarat.gov.in/scheme-for-assistance",
        "description": "Provides financial and ecosystem support to startups at seed and scale-up stages under Gujarat Startup Policy."
    },
    {
        "title": "Scheme of Assistance for Incubators and Startups – Electronics & IT/ITeS",
        "type": "Sector-Specific Incentive Scheme",
        "organization": "Government of Gujarat",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "State Government Scheme",
        "sector": "Electronics & IT/ITeS",
        "benefits": [
            "Capital assistance",
            "Interest subsidy",
            "Lease rental support",
            "Patent assistance"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Eligible startups in Electronics & IT/ITeS sector meeting Gujarat Startup Policy criteria.",
        "official_url": "https://startup.gujarat.gov.in/scheme-for-assistance/scheme-three",
        "description": "Financial assistance scheme under Gujarat Electronics & IT/ITeS Startup Policy to promote tech innovation."
    },
    {
        "title": "Scheme of Assistance for Biotechnology Industry",
        "type": "Sector-Specific Incentive Scheme",
        "organization": "Government of Gujarat",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "State Government Scheme",
        "sector": "Biotechnology",
        "benefits": [
            "Capital subsidy",
            "Interest subsidy",
            "Infrastructure support",
            "Incentives under Gujarat Biotechnology Policy"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Biotechnology units/startups operating in Gujarat under state biotechnology policy guidelines.",
        "official_url": "https://startup.gujarat.gov.in/scheme-for-assistance/scheme-four",
        "description": "Provides financial and infrastructure incentives to biotechnology startups under Gujarat Biotechnology Policy."
    },
    {
        "title": "Student Startup and Innovation Policy (SSIP 2.0)",
        "type": "Innovation Grant Program",
        "organization": "Education Department, Government of Gujarat",
        "startup_stage": ["Student Idea", "Prototype"],
        "category": "State Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Prototype development funding",
            "Institutional innovation support",
            "Mentorship and incubation assistance"
        ],
        "funding": null,
        "deadline": "Valid until 31-03-2027",
        "eligibility": "Students, universities, institutes, and schools based in Gujarat meeting SSIP criteria.",
        "official_url": "https://startup.gujarat.gov.in/scheme-for-assistance/scheme-five",
        "description": "Policy to promote innovation and entrepreneurship among students through institutional support and funding assistance."
    },
    {
        "title": "Zomato Sustainable Packaging Open Innovation Challenge",
        "type": "Corporate Innovation Challenge",
        "organization": "Zomato in collaboration with Startup India",
        "startup_stage": ["Prototype", "Early Stage", "Growth"],
        "category": "Open Innovation Challenge",
        "sector": "ClimateTech",
        "benefits": [
            "Funding support",
            "Pilot opportunity with Zomato",
            "National recognition"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups developing sustainable alternatives to plastic packaging in food delivery.",
        "official_url": "https://www.startupindia.gov.in/",
        "description": "Corporate innovation challenge to identify scalable sustainable packaging solutions."
    },
    {
        "title": "DST NIDHI Accelerator – C3iHub (IIT Kanpur)",
        "type": "Government Accelerator",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "Government Scheme",
        "sector": "Cybersecurity & DeepTech",
        "benefits": [
            "Equity-based seed funding",
            "Industry mentorship",
            "Investor access",
            "Technology validation support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Cybersecurity and deeptech startups under NIDHI Accelerator guidelines.",
        "official_url": "https://dst.gov.in/",
        "description": "Accelerator program under DST's NIDHI framework supporting cybersecurity and deeptech startups."
    },
    {
        "title": "India–Canada Collaborative Industrial R&D Programme",
        "type": "International R&D Grant",
        "organization": "Department of Science & Technology (DST) and Technology Development Board (TDB), Government of India",
        "startup_stage": ["Growth", "Scale-up"],
        "category": "Government Scheme",
        "sector": "Advanced Manufacturing, AgriTech, CleanTech, Digital Tech, HealthTech",
        "benefits": [
            "Grant support for industrial R&D",
            "Bilateral collaboration with Canadian partners",
            "Commercialization assistance"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Indian companies collaborating with eligible Canadian partners for industrial R&D projects.",
        "official_url": "https://www.tdb.gov.in/",
        "description": "Supports joint industrial R&D and commercialization projects between Indian and Canadian companies."
    },
    {
        "title": "Startup India – MoFPI National FoodTech Challenge",
        "type": "Government-backed Startup Challenge",
        "organization": "Startup India (DPIIT) and Ministry of Food Processing Industries (MoFPI), Government of India",
        "startup_stage": ["Prototype", "Early Stage", "Growth"],
        "category": "Startup Challenge",
        "sector": "FoodTech, AgriTech, Sustainability",
        "benefits": [
            "National recognition",
            "Industry partnerships",
            "Pilot opportunities",
            "Potential funding support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Eligible Indian startups working in food-tech, automation, packaging, sustainability and related domains.",
        "official_url": "https://www.startupindia.gov.in/",
        "description": "National-level startup challenge to promote innovation in food processing and sustainability sectors."
    },
    {
        "title": "PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi) – CGTMSE Guarantee Support",
        "type": "Credit Guarantee Scheme",
        "organization": "Ministry of Housing & Urban Affairs (MoHUA) and CGTMSE, Government of India",
        "startup_stage": ["Micro Enterprise"],
        "category": "Government Scheme",
        "sector": "Street Vendors",
        "benefits": [
            "Collateral-free working capital loan",
            "Credit guarantee coverage",
            "Interest subsidy"
        ],
        "funding": "10,000",
        "deadline": null,
        "eligibility": "Street vendors operating prior to notified cut-off date and eligible under PM SVANidhi guidelines.",
        "official_url": "https://streetvendor.cgtmse.in/SV/Login.html",
        "description": "Provides collateral-free working capital loans up to 10,000 to street vendors with credit guarantee support under CGTMSE."
    },
    {
        "title": "Startup India Seed Fund Scheme (SISFS)",
        "type": "Seed Fund",
        "organization": "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
        "startup_stage": ["Proof of Concept", "Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Seed funding up to 50,00,000",
            "Support through approved incubators",
            "Mentorship and infrastructure assistance"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "DPIIT-recognized startups supported by approved incubators under SISFS guidelines.",
        "official_url": "https://seedfund.startupindia.gov.in/",
        "description": "Provides financial assistance to early-stage startups for validation of ideas, prototype development, product trials, and market entry through approved incubators."
    },
    {
        "title": "MeitY GENESIS Pilot Funding Program",
        "type": "Pilot Funding Grant",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Early Stage", "Growth"],
        "category": "Government Scheme",
        "sector": "DeepTech, Electronics, ICT",
        "benefits": [
            "Pilot funding support",
            "Market validation assistance",
            "Deployment support"
        ],
        "funding": "40,00,000",
        "deadline": null,
        "eligibility": "Indian startups with work orders from eligible corporates/PSUs under GENESIS guidelines.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Provides pilot funding support to startups under the GENESIS umbrella scheme to validate and deploy market-ready solutions."
    },
    {
        "title": "Biotechnology Ignition Grant (BIG)",
        "type": "Early-Stage Biotechnology Grant",
        "organization": "Biotechnology Industry Research Assistance Council (BIRAC), Department of Biotechnology, Government of India",
        "startup_stage": ["Idea", "Proof of Concept"],
        "category": "Government Scheme",
        "sector": "Biotechnology",
        "benefits": [
            "Proof-of-concept funding",
            "Mentorship support",
            "Technical guidance"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Individual innovators, startups, and academic researchers in biotechnology domain.",
        "official_url": "https://birac.nic.in/",
        "description": "Flagship BIRAC program offering early-stage funding to biotech innovators for proof-of-concept development."
    },
    {
        "title": "MeitY GENESIS Scheme",
        "type": "Technology Commercialization Grant",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Idea", "Prototype", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Electronics, DeepTech, ICT",
        "benefits": [
            "Proof-of-concept funding",
            "Pilot deployment funding",
            "Incubation support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups in Tier-II / Tier-III cities focusing on technology productization.",
        "official_url": "https://www.meity.gov.in/",
        "description": "Umbrella scheme supporting technology startups through incubation and pilot funding under MeitY Startup Hub."
    },
    {
        "title": "Startup India FinTech Challenge",
        "type": "Startup Challenge",
        "organization": "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
        "startup_stage": ["Early Stage", "Growth Stage"],
        "category": "Government Challenge",
        "sector": "FinTech",
        "benefits": [
            "Recognition",
            "Scaling support",
            "Potential partnership opportunities"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Pan-India fintech startups building solutions for MSME and startup finance access.",
        "official_url": "https://www.startupindia.gov.in/",
        "description": "A national challenge hosted on the Startup India portal to discover and scale innovative fintech solutions improving MSME and startup access to formal finance."
    },
    {
        "title": "MSME Innovative & Design Entrepreneurship (MSME IDEA) Hackathon",
        "type": "Innovation Grant",
        "organization": "Ministry of Micro, Small and Medium Enterprises (MSME), Government of India",
        "startup_stage": ["Idea Stage", "Early Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Financial assistance for innovative ideas",
            "Support for commercialization",
            "National recognition"
        ],
        "funding": "15,00,000",
        "deadline": null,
        "eligibility": "Indian innovators and MSMEs with commercially viable ideas.",
        "official_url": "https://my.msme.gov.in/",
        "description": "A national innovation initiative by the Ministry of MSME to support smart, sustainable and commercially viable ideas that strengthen the MSME ecosystem."
    },
    {
        "title": "NIDHI-PRAYAS Scheme",
        "type": "Prototype Grant",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Idea Stage", "Prototype Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Prototype development funding",
            "Mentorship through Technology Business Incubators",
            "Technical validation support"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Indian innovators and early-stage startups supported by approved DST incubators.",
        "official_url": "https://dst.gov.in/",
        "description": "NIDHI-PRAYAS supports individual innovators and startups with non-equity funding up to 10,00,000 for prototype development and validation through DST-supported incubators."
    },
    {
        "title": "NIDHI-PRAYAS Scheme",
        "type": "Prototype Grant",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Idea Stage", "Prototype Stage"],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [
            "Prototype development funding",
            "Incubation support through DST-supported centers"
        ],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Indian innovators and startups supported by approved PRAYAS centers under DST.",
        "official_url": "https://dst.gov.in/",
        "description": "Provides non-equity funding up to 10,00,000 to innovators for prototype development under the NIDHI initiative."
    },
    {
        "title": "NIDHI Seed Support Program (NIDHI-SSP)",
        "type": "Seed Fund",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": ["Early Stage", "Post-Prototype"],
        "category": "Government Scheme",
        "sector": "Technology / DeepTech",
        "benefits": [
            "Seed funding support",
            "Incubation assistance",
            "Mentorship and commercialization support"
        ],
        "funding": "1,00,00,000",
        "deadline": null,
        "eligibility": "Startups incubated at DST-approved incubators under NIDHI guidelines.",
        "official_url": "https://dst.gov.in/",
        "description": "Provides seed funding up to 1,00,00,000 to startups through DST-supported incubators for product development and commercialization."
    },
    {
        "title": "SAMRIDH Scheme",
        "type": "Accelerator with Grant Support",
        "organization": "Ministry of Electronics & Information Technology (MeitY), Government of India",
        "startup_stage": ["Early Stage", "Growth Stage"],
        "category": "Government Scheme",
        "sector": "Technology / Sector-Agnostic",
        "benefits": [
            "Funding support up to 1,00,00,000",
            "Acceleration through selected incubators",
            "Market access support",
            "Mentorship and investor connects"
        ],
        "funding": "1,00,00,000",
        "deadline": null,
        "eligibility": "Indian technology startups selected through MeitY-approved accelerators under SAMRIDH guidelines.",
        "official_url": "https://www.meity.gov.in/",
        "description": "SAMRIDH (Startup Accelerator of MeitY for Product Innovation, Development and Growth) supports technology startups with funding and acceleration support to scale and commercialize products."
    },
    {
        "title": "BIRAC Thematic Innovation Challenge (Women’s Health)",
        "type": "Innovation Grant",
        "organization": "Biotechnology Industry Research Assistance Council (BIRAC), Department of Biotechnology, Government of India",
        "startup_stage": ["Early Stage", "Proof of Concept"],
        "category": "Government Scheme",
        "sector": "Biotechnology / HealthTech",
        "benefits": [
            "Grant funding support",
            "Technical evaluation",
            "Regulatory and commercialization guidance"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Indian biotech startups and researchers working on women’s health innovations.",
        "official_url": "https://www.birac.nic.in/",
        "description": "A BIRAC-led innovation challenge supporting scalable and affordable technologies in women’s health and drug delivery."
    },
    {
        "title": "ANRF Research Grant",
        "type": "Research Grant",
        "organization": "Anusandhan National Research Foundation (ANRF), Government of India",
        "startup_stage": [],
        "category": "Government Research Grant",
        "sector": "Science & Engineering",
        "benefits": [
            "Long-term flexible research funding",
            "Support for manpower, travel, consumables",
            "Patent filing and publication support"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Eligible Indian researchers in science and engineering disciplines.",
        "official_url": "https://anrfonline.in/",
        "description": "Provides competitive research funding to Indian researchers in frontier science and engineering fields."
    },
    {
        "title": "Female Founders Fund",
        "type": "Venture Capital",
        "organization": "Female Founders Fund",
        "startup_stage": ["Seed", "Early Stage"],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [
            "Equity investment",
            "Founder community support",
            "Strategic guidance"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Women-led technology startups globally.",
        "official_url": "https://femalefoundersfund.com/",
        "description": "A VC firm founded in 2013 by Anu Duggal that invests exclusively in women-led technology startups.",
        "grantId": "667eac9c39167ac7ac4c7fd9d6981803b852922f47f7267e469c5da946a139e0"
    },
    {
        "title": "HCL TechBee Program",
        "type": "Training Program",
        "organization": "HCLTech",
        "startup_stage": [],
        "category": "Grant",
        "sector": "DeepTech",
        "benefits": [
            "Monthly stipend (10,000)",
            "12 months training",
            "Full-time employment after completion"
        ],
        "funding": "10,000",
        "deadline": null,
        "eligibility": "Class 12 graduates eligible for IT career training.",
        "official_url": "https://www.hcltechbee.com/",
        "description": "A job-integrated IT training program that provides stipend and full-time employment opportunity.",
        "startup_stage_classification": null,
        "category_classification": null,
        "sector_classification": null,
        "scheme_type": "Employment Program"
    },
    {
        "title": "Startup India Rubber Innovation Challenge",
        "type": "Startup Challenge",
        "organization": "Startup India (DPIIT), Government of India",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Sector-Agnostic",
        "benefits": [],
        "funding": "50,000",
        "deadline": null,
        "eligibility": "Indian startups and innovators in rubber technology.",
        "official_url": "https://www.startupindia.gov.in/",
        "description": "A challenge to promote innovation in rubber technology and value addition.",
        "industryEligibility": "Startup Challenge, Pan-India, Agritech, Materials Innovation, Natural Rubber, Processing, Rubber, Social Impact"
    },
    {
        "title": "AUM DeepSpark",
        "type": "Venture Capital Program",
        "organization": "AUM Ventures",
        "startup_stage": [],
        "category": "Grant",
        "sector": "DeepTech",
        "benefits": [
            "Funding",
            "Strategic guidance",
            "Investor access"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "DeepTech startups in India.",
        "official_url": "https://aumvc.com/deepspark/",
        "description": "Supports IP-led DeepTech startups with funding and strategic support.",
        "grantId": "77a4e69b4191b1b735b601f0e6a5dc729e570f8ce296a52f30bf6affc19f22c0"
    },
    {
        "title": "Enterprise Operator-backed VC",
        "type": "Venture Capital",
        "organization": "Enterprise Operator Community VC",
        "startup_stage": [],
        "category": "Grant",
        "sector": "DeepTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage B2B startups.",
        "official_url": "https://airtable.com/",
        "description": "Early-stage B2B venture firm leveraging enterprise operators for strategic support.",
        "grantId": "f6fe49f4da860d1163fc4ec18bdeb78655991334d38a0c266af56c45bb14a91a"
    },
    {
        "title": "iDEX FIRST Seed Fund",
        "type": "Seed Fund",
        "organization": "SIIC IIT Kanpur in collaboration with SIDBI & iDEX",
        "startup_stage": [],
        "category": "Seed Fund",
        "sector": "DeepTech",
        "benefits": [
            "Seed fund support (10,00,000 - 1,50,00,000)"
        ],
        "funding": "1,50,00,000",
        "deadline": null,
        "eligibility": "Defence and allied startups supported by iDEX.",
        "official_url": "https://www.idex.gov.in/",
        "description": "Seed funding support for defence and allied sector startups.",
        "grantId": "c52f9135a82ebbd3dc9515a3f2dddfdbef58ead122d0fb8d21b2cb44b0b10098"
    },
    {
        "title": "Australian Economic Accelerator (AEA)",
        "type": "Research Grant",
        "organization": "Australian Economic Accelerator (Australian Government)",
        "startup_stage": [],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Australian universities collaborating with industry in priority sectors.",
        "official_url": "https://www.aea.gov.au/researcher-applicant/grants",
        "description": "A A$1.6 billion Australian Government initiative supporting commercialisation of university-led research.",
        "grantId": "8217f9b51190186442bc8dff2fbcceb83acdfbc74d4f3b0339998a8e9706a30f"
    },
    {
        "title": "HearstLab Investment Program",
        "type": "Venture Capital",
        "organization": "HearstLab (Hearst Communications)",
        "startup_stage": [],
        "category": "Investment",
        "sector": "HealthTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Women-led tech-enabled startups.",
        "official_url": "https://www.hearstlab.com/",
        "description": "Corporate VC arm of Hearst Communications investing in women-led ventures.",
        "grantId": "f31f31283b38815520d4ff4a46743f546a6895a6d03f24081365bc18008c76d5"
    },
    {
        "title": "Slush'D India Pitch Series",
        "type": "Startup Competition",
        "organization": "Slush",
        "startup_stage": [],
        "category": "Competition",
        "sector": "Sector-Agnostic",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage startups across India.",
        "official_url": "https://slush.org/",
        "description": "Multi-city startup pitch series culminating in Slush'D Bangalore.",
        "grantId": "1ad5080db8de0109f7255648c974493b21c9b0e67274ab3bfa6cbbbc7ae24eb2"
    },
    {
        "title": "Techstars Accelerator Program",
        "type": "Accelerator",
        "organization": "Techstars",
        "startup_stage": [],
        "category": "Accelerator",
        "sector": "HealthTech",
        "benefits": [
            "Mentorship",
            "Global network access"
        ],
        "funding": "1,09,07,100",
        "deadline": null,
        "eligibility": "Early-stage startups globally.",
        "official_url": "https://www.techstars.com/",
        "description": "Global accelerator providing funding and mentorship to early-stage startups.",
        "grantId": "06c3ce8c2c1c0233c9d9ad713e79bc4eeb2c6a3d3959dbbb419dae93de5117d8"
    },
    {
        "title": "ACIC-VGU Seed Support Program",
        "type": "Seed Fund",
        "organization": "ACIC-VGU Foundation (DST Supported)",
        "startup_stage": [],
        "category": "Seed Fund",
        "sector": "DeepTech",
        "benefits": [
            "Seed funding support"
        ],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Technology-driven startups in deep tech sectors.",
        "official_url": "https://vgu.ac.in/",
        "description": "DST-supported seed funding program under the NIDHI initiative.",
        "grantId": null
    },
    {
        "title": "ACT Grants Program",
        "type": "Seed Fund",
        "organization": "ACT Grants",
        "startup_stage": [],
        "category": "Seed Fund",
        "sector": "HealthTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Pan-India startups in education, environment, health, and workforce inclusion.",
        "official_url": "https://actgrants.in/apply-for-a-grant/",
        "description": "Venture-philanthropy platform offering seed capital and mentoring.",
        "grantId": "95e466d5483ef4435fd483713e3ea8e9ef12780b8fbde461d26e0a0783b9f231"
    },
    {
        "title": "Bharat Rural Agriecology Fund",
        "type": "Grant",
        "organization": "Bharat Rural Livelihoods Foundation",
        "startup_stage": [],
        "category": "Grant",
        "sector": "AgriTech",
        "benefits": [],
        "funding": "2,00,00,000",
        "deadline": null,
        "eligibility": "Agritech and climate-focused startups in India.",
        "official_url": "https://bharatrural.org/programs/agriecology-fund",
        "description": "Grant program supporting agritech startups with funding up to ₹2 Crores.",
        "grantId": "27d8920cc07fbcb5350ebc77992bf852b5e24e30ff3e0403e28f86fa0dd18225"
    },
    {
        "title": "Qualcomm Design in India Challenge",
        "type": "Incubator",
        "organization": "Qualcomm (in collaboration with NASSCOM CoE-IoT & Startup India)",
        "startup_stage": [],
        "category": "Incubator",
        "sector": "EdTech",
        "benefits": [
            "mentoring",
            "engineering support",
            "incubation",
            "cash grants"
        ],
        "funding": null,
        "deadline": null,
        "eligibility": "Private Scheme, Pan-India hardware startups",
        "official_url": "https://www.qualcomm.com/company/locations/india/design-in-india-program/design-in-india-challenge#registration",
        "description": "Qualcomm’s flagship annual hardware incubation program supporting deep-tech hardware startups.",
        "grantId": "5ed428a6e39b034dd4b4b437471d5af87cdc7dbf7d03ad9231dc73b472b15d4e"
    },
    {
        "title": "Fund F VC Program",
        "type": "Venture Capital",
        "organization": "Fund F",
        "startup_stage": [],
        "category": "Seed Fund",
        "sector": "FinTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Europe-based startups with at least one female co-founder",
        "official_url": "https://www.fund-f.com/",
        "description": "Early-stage VC fund investing in gender-diverse digital startups.",
        "grantId": "e9e03bcd86a89f712d869dbc98fc16d55cbfc7a217d351c21c141212f9df201f"
    },
    {
        "title": "BigShift by Inc42",
        "type": "Startup Competition",
        "organization": "Inc42",
        "startup_stage": [],
        "category": "Competition",
        "sector": "Sector-Agnostic",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Pan-India scalable startups",
        "official_url": "https://inc42.com/",
        "description": "Flagship demo day platform showcasing scalable startups.",
        "grantId": "f99185061aeb2f1a111353474f57b93230b70041ebe77dc09cbe4238cb58e3ed"
    },
    {
        "title": "NIDHI-PRAYAS",
        "type": "Government Grant",
        "organization": "NSTEDB, Department of Science & Technology (DST), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Sector-Agnostic",
        "benefits": [],
        "funding": "10,00,000",
        "deadline": null,
        "eligibility": "Indian innovators and early-stage startups",
        "official_url": "https://www.nstedb.com/",
        "description": "Support for translating innovative ideas into market-ready prototypes.",
        "grantId": "11e27cecab4e0db4d99e9fdea4e7698136b39b24b9134779324605644a417619"
    },
    {
        "title": "SSIP Gujarat",
        "type": "Government Grant",
        "organization": "Government of Gujarat",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Students and startups in Gujarat",
        "official_url": "https://www.ssipgujarat.in/",
        "description": "Student Startup and Innovation Policy support scheme by Gujarat Government.",
        "grantId": "eed918efa1fc83543988396443c6a4744ec03708d6bbdf1e4e560204ca9510ae"
    },
    {
        "title": "PRISM Scheme",
        "type": "Government Grant",
        "organization": "DSIR, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Innovators, students, startups and MSMEs in India",
        "official_url": "https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
        "description": "Promoting Innovations in Students and Researchers (PRISM).",
        "grantId": "7c103aeae4ed01d8aeeb5b98950b3ee59ff773f969c976ff892b5df72d29b3a1"
    },
    {
        "title": "BIG - Biotechnology Innovation Grant",
        "type": "Government Grant",
        "organization": "BIRAC, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "HealthTech",
        "benefits": [],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Early-stage biotech startups in India",
        "official_url": "https://birac.nic.in/",
        "description": "Biotechnology Innovation Grant supporting early-stage biotech ideas.",
        "grantId": "2796b083f841e6c8cb7384425633a2e64bdd007490e8274472ee380e66384d3f"
    },
    {
        "title": "NIDHI-SSP",
        "type": "Government Seed Fund",
        "organization": "Department of Science & Technology (DST), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Technology startups supported by DST incubators",
        "official_url": "https://dst.gov.in/",
        "description": "Startup Support Programme for technology startups.",
        "grantId": "37413050772cf7f620e30740b394bf48f7dbe326c61ad7aa494630b8b6f5819a"
    },
    {
        "title": "SAMRIDH",
        "type": "Government Accelerator",
        "organization": "MeitY Startup Hub, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": "40,00,000",
        "deadline": null,
        "eligibility": "Indian software product startups",
        "official_url": "https://meitystartuphub.in/",
        "description": "Software products and services support program.",
        "grantId": "25a17a063bdebdec746300f7cc8a246fe3c0946a0466ab37298eece221f5280e"
    },
    {
        "title": "TIDE 2.0",
        "type": "Government Grant",
        "organization": "MeitY, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": "7,00,000 - ₹27,00,000",
        "deadline": null,
        "eligibility": "ICT and electronics startups in India",
        "official_url": "https://meity.gov.in/",
        "description": "Technology Incubation and Development of Entrepreneurs scheme.",
        "grantId": "fb9f9ea0a439d8f199b10d5a3395565bd6a8621e4691d33535103c077f358acb"
    },
    {
        "title": "Stand-Up India",
        "type": "Government Loan Scheme",
        "organization": "Department of Financial Services, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": "10,00,000 - ₹1,00,00,000 (Loan)",
        "deadline": null,
        "eligibility": "SC/ST and Women entrepreneurs in India",
        "official_url": "https://www.standupmitra.in/",
        "description": "Provides bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs.",
        "grantId": "c02241e3e66528776137a41dc4d59fe1c394fbd0bbcdd338c423ce5467e4d41f"
    },
    {
        "title": "BIRAC BIG",
        "type": "Government Grant",
        "organization": "BIRAC, Department of Biotechnology, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "HealthTech",
        "benefits": [],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Early-stage biotech startups and innovators in India",
        "official_url": "https://birac.nic.in/",
        "description": "Biotechnology Innovation Grant supporting early-stage biotech ideas.",
        "grantId": "a07e35034b0538bbda6f966016ac25a04b49a99e9f4ea4067daee00c8ba94b34"
    },
    {
        "title": "SAMRIDH",
        "type": "Government Accelerator",
        "organization": "MeitY Startup Hub, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": "40,00,000 (Matching Grant)",
        "deadline": null,
        "eligibility": "Indian software product startups",
        "official_url": "https://meitystartuphub.in/",
        "description": "AI and DeepTech focused software product support program.",
        "grantId": "2dbbe387aebe0335c90522ce4ce94a5a1b8484dd35cee4b4ec3777f5b12dd83f"
    },
    {
        "title": "ASPIRE",
        "type": "Government Grant",
        "organization": "Ministry of MSME, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "AgriTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Agricultural and rural innovation startups",
        "official_url": "https://msme.gov.in/",
        "description": "Agricultural technology and rural innovation support scheme.",
        "grantId": "03cc03c4d5892cbb453e6332e57a0893359eec2908a83817ed5f20d4ab18ed02"
    },
    {
        "title": "IN-SPACe",
        "type": "Government Grant",
        "organization": "Indian National Space Promotion and Authorization Center (IN-SPACe)",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Indian space-tech startups and private entities",
        "official_url": "https://www.inspace.gov.in/",
        "description": "Space technology and satellite innovation support.",
        "grantId": "f2363c8da82a07a4336e534b03004dbfd6a75c1ed7c469b02885a97eb6fecb74"
    },
    {
        "title": "Digital India Fund",
        "type": "Government Fund",
        "organization": "Ministry of Electronics & IT (MeitY), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Digital, gaming and content startups",
        "official_url": "https://www.digitalindia.gov.in/",
        "description": "Gaming and digital content development support.",
        "grantId": "ea21d6eb36be45f478450919752f26ba9619d217ccc9c3741bfcbbb7ae35a5e8"
    },
    {
        "title": "MSDE Skill Development Initiatives",
        "type": "Government Scheme",
        "organization": "Ministry of Skill Development and Entrepreneurship, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "EdTech and skilling startups in India",
        "official_url": "https://www.msde.gov.in/",
        "description": "Education technology and skill development initiatives.",
        "grantId": "8fe8650530bda8b43eb4eba99f6509c0a0c7f07115b9ee3524170994c8d8e32a"
    },
    {
        "title": "SINE IIT Bombay",
        "type": "Incubator",
        "organization": "SINE, IIT Bombay",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage technology startups",
        "official_url": "https://www.sineiitb.org/",
        "description": "Sector-agnostic innovation and incubation support.",
        "grantId": "e6c261e14377f0e9b7c26cfdb7629f60463e32795ec700125d6ff36f83cba105"
    },
    {
        "title": "Startup TN",
        "type": "Government Scheme",
        "organization": "Government of Tamil Nadu",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups registered in Tamil Nadu",
        "official_url": "https://startuptn.in/",
        "description": "Tamil Nadu state startup mission and support.",
        "grantId": "462152e061909c7ce460b20db372524575a823fbf993280112b3fdd3c5d3e5e5"
    },
    {
        "title": "Rajasthan iStart",
        "type": "Government Scheme",
        "organization": "Government of Rajasthan",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups registered in Rajasthan",
        "official_url": "https://istart.rajasthan.gov.in/",
        "description": "Rajasthan startup promotion scheme.",
        "grantId": "c98203a370d5303d781b9b77dc3a00861fcb313c80eda3f0c2110c64fcbc9726"
    },
    {
        "title": "HP Startup Yojana",
        "type": "Government Scheme",
        "organization": "Government of Himachal Pradesh",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Startups registered in Himachal Pradesh",
        "official_url": "https://emerginghimachal.hp.gov.in/",
        "description": "Himachal Pradesh startup support scheme.",
        "grantId": "327ae7ad679c57897bbe7099c9f579c7c442d5b38aabe34d8f3226b61de4f0c9"
    },
    {
        "title": "Startup Odisha Incubator",
        "type": "Government Incubator",
        "organization": "Startup Odisha, Government of Odisha",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Entrepreneurs and startups in Odisha",
        "official_url": "https://startupodisha.gov.in/",
        "description": "Government-supported incubator for entrepreneurs in Odisha.",
        "grantId": "f9254a16646a5c03f77af04da72db7d88c81ca37a7a4e6099b3244e81437e58c"
    },
    {
        "title": "Fund of Funds for Startups (FFS)",
        "type": "Government Fund",
        "organization": "SIDBI (Small Industries Development Bank of India)",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "SEBI-registered Alternative Investment Funds investing in startups",
        "official_url": "https://www.sidbi.in/",
        "description": "Fund of Funds for Startups managed by SIDBI to support venture capital investments.",
        "grantId": "9fd5805ed712687fd05e0a7870bcaf2ed06895562cffcb5129d9a92e02f7792b"
    },
    {
        "title": "MUDRA Loans",
        "type": "Government Loan Scheme",
        "organization": "Micro Units Development and Refinance Agency (MUDRA), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "FinTech",
        "benefits": [],
        "funding": "50,000 - ₹10,00,000 (Loan)",
        "deadline": null,
        "eligibility": "Micro and small enterprises in India",
        "official_url": "https://www.mudra.org.in/",
        "description": "Collateral-free loans for micro and small enterprises.",
        "grantId": "579f63e6496202fad619923a83997b89d70ae967b4d7bfbf288a99ca950edad5"
    },
    {
        "title": "Credit Guarantee Scheme for Startups (CGSS)",
        "type": "Government Credit Guarantee",
        "organization": "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": "10,00,00,000 (Credit Guarantee)",
        "deadline": null,
        "eligibility": "DPIIT-recognized startups",
        "official_url": "https://www.startupindia.gov.in/",
        "description": "Credit guarantee support for startup loans.",
        "grantId": "5d13509c25ec7f2b0cda12f22eb4f12b2e8caab0a2977a72e167585d60e4a11f"
    },
    {
        "title": "GENESIS",
        "type": "Government Grant",
        "organization": "MeitY Startup Hub, Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Startup",
        "benefits": [],
        "funding": "20,00,000 - ₹40,00,000",
        "deadline": null,
        "eligibility": "Innovative tech startups supported by MeitY incubators",
        "official_url": "https://meitystartuphub.in/",
        "description": "Gen-next support for innovative startups.",
        "grantId": "ad56e8733ecfa47d7393dc6833cf3fdee15f3acaa5d9d48479bb2263d31a3c5e"
    },
    {
        "title": "Atal Incubation Centres (AICs)",
        "type": "Government Incubator Network",
        "organization": "Atal Innovation Mission, NITI Aayog",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage startups across India",
        "official_url": "https://aim.gov.in/",
        "description": "National network of incubators supporting innovation and entrepreneurship.",
        "grantId": "d1831fc21ccbd66d047b09320846c7770638671f5d0a92437005c0b275713a7c"
    },
    {
        "title": "AWS Activate",
        "type": "Private Startup Credits Program",
        "organization": "Amazon Web Services (AWS)",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Technology",
        "benefits": [],
        "funding": "Up to 1,00,000 USD in AWS Credits",
        "deadline": null,
        "eligibility": "Early-stage startups building on AWS",
        "official_url": "https://aws.amazon.com/activate/",
        "description": "Startup support program offering AWS credits and technical support.",
        "grantId": null
    },
    {
        "title": "Villgro",
        "type": "Incubator",
        "organization": "Villgro Innovations Foundation",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Impact-driven startups in India",
        "official_url": "https://villgro.org/",
        "description": "Social innovation incubator and accelerator.",
        "grantId": null
    },
    {
        "title": "Social Alpha",
        "type": "Impact Investment Platform",
        "organization": "Social Alpha",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Impact tech startups in India",
        "official_url": "https://www.socialalpha.org/",
        "description": "Impact tech innovation and venture development platform.",
        "grantId": null
    },
    {
        "title": "The/Nudge Incubator",
        "type": "Incubator",
        "organization": "The/Nudge Institute",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Startup",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage social impact startups in India",
        "official_url": "https://thenudge.org/",
        "description": "Social impact incubator program supporting mission-driven startups.",
        "grantId": null
    },
    {
        "title": "Bill & Melinda Gates Foundation Grants",
        "type": "Global Grant",
        "organization": "Bill & Melinda Gates Foundation",
        "startup_stage": [],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Global organizations working in health and development",
        "official_url": "https://www.gatesfoundation.org/",
        "description": "Global health and development grants.",
        "grantId": "361f1104abdc763930150c203fcba3f78dfe6ebd9d543eb673c51d52b7ce566a"
    },
    {
        "title": "Microsoft for Startups Founders Hub",
        "type": "Startup Support Program",
        "organization": "Microsoft",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Technology",
        "benefits": [
            "Cloud credits and global support"
        ],
        "funding": "1,50,000",
        "deadline": null,
        "eligibility": "Early-stage startups building software products",
        "official_url": "https://www.microsoft.com/en-us/startups",
        "description": "Cloud credits and global support for private startups.",
        "grantId": null
    },
    {
        "title": "OneValley (formerly GSVlabs)",
        "type": "Startup Platform",
        "organization": "OneValley",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Global early-stage startups",
        "official_url": "https://onevalley.com/",
        "description": "Global startup support platform offering mentoring, workspace and capital access.",
        "grantId": "f140c4892e24f49c99896beb0052a9b4fe99da2f801f424810bad980f6192177"
    },
    {
        "title": "Techstars Bangalore",
        "type": "Accelerator",
        "organization": "Techstars",
        "startup_stage": [],
        "category": "Grant",
        "sector": "Technology",
        "benefits": [],
        "funding": "1,20,000",
        "deadline": null,
        "eligibility": "Early-stage technology startups",
        "official_url": "https://www.techstars.com/",
        "description": "Global accelerator network – Bangalore program for Indian startups.",
        "grantId": "37e90ab6ffccd2ad802fffd94eab86b2bc042235518ea4af53aab367335ce8e9"
    },
    {
        "title": "Inclusivity Research Grant (IRG)",
        "type": "Government Research Grant",
        "organization": "Anusandhan National Research Foundation (ANRF), Government of India",
        "startup_stage": [],
        "category": "Government Scheme",
        "sector": "Science & Engineering",
        "benefits": [],
        "funding": "60,00,000",
        "deadline": "2025-07-31",
        "eligibility": "SC/ST researchers with PhD/MD/MS/MDS in Science & Engineering",
        "official_url": "https://anrfonline.in/",
        "description": "Provides up to ₹60 Lakhs research funding for eligible SC/ST researchers in frontier science and engineering.",
        "grantId": "5edf0b63fb3f8602db62007f04c86c2e1cef2279bb0d53d755e7505a36e94bfe"
    },
    {
        "title": "UNNATI AI-Program – FITT IIT Delhi",
        "type": "Grant",
        "organization": "FITT IIT Delhi",
        "startup_stage": [],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [],
        "funding": "30,00,000",
        "deadline": "2025-07-31",
        "eligibility": "Healthcare, Agriculture, Sustainability, Education startups",
        "official_url": "https://fitt-iitd.in/",
        "description": "Grant support up to ₹30 Lakhs for AI-driven innovation projects."
    },
    {
        "title": "DST NIDHI-SSP – AIC NIFTTEA",
        "type": "Seed Fund",
        "organization": "AIC NIFTTEA Incubation Centre",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": "1,00,00,000",
        "deadline": "2025-07-31",
        "eligibility": "Early revenue startups in textiles sector",
        "official_url": "https://nidhi.dst.gov.in/",
        "description": "Seed fund support up to ₹1 Crore under DST NIDHI-SSP scheme."
    },
    {
        "title": "EDGE Alpha India – KIIT-TBI",
        "type": "Seed Fund",
        "organization": "KIIT Technology Business Incubator",
        "startup_stage": [],
        "category": "Grant",
        "sector": "AgriTech",
        "benefits": [],
        "funding": "50,000",
        "deadline": "2025-07-15",
        "eligibility": "AI, Agritech, Aerospace, Climate Tech startups",
        "official_url": "https://kiitincubator.in/",
        "description": "Seed funding support up to $50,000 for deep-tech startups."
    },
    {
        "title": "NIDHI-SSS – Amity Innovation Incubator",
        "type": "Seed Fund",
        "organization": "Amity Innovation Incubator",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": "50,00,000",
        "deadline": "2025-07-15",
        "eligibility": "Sector-agnostic startups with early revenue",
        "official_url": null,
        "description": "Seed fund support up to ₹50 Lakhs under NIDHI-SSS scheme."
    },
    {
        "title": "Aarohan 5.0 – TIH IIT Bombay",
        "type": "Seed Fund",
        "organization": "TIH IIT Bombay",
        "startup_stage": [],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [],
        "funding": "1,00,00,000",
        "deadline": "2025-07-20",
        "eligibility": "DPIIT-recognized startups",
        "official_url": null,
        "description": "Seed support up to ₹1 Crore for healthcare, agriculture and sensor technology startups."
    },
    {
        "title": "Aarogyam Digital Healthcare Accelerator – BITS Pilani PIEDS",
        "type": "Grant",
        "organization": "PIEDS BITS Pilani",
        "startup_stage": [],
        "category": "Grant",
        "sector": "HealthTech",
        "benefits": [],
        "funding": "10,00,000",
        "deadline": "2025-07-31",
        "eligibility": "Healthcare tech startups",
        "official_url": null,
        "description": "Grant up to ₹10 Lakhs for digital healthcare innovation."
    },
    {
        "title": "Cybersecurity Startup Accelerator (CSAP III) – C3iHub IIT Kanpur",
        "type": "Grant",
        "organization": "C3iHub IIT Kanpur",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": "3,00,00,000",
        "deadline": "2025-07-23",
        "eligibility": "Cybersecurity startups",
        "official_url": null,
        "description": "Grant support up to ₹3 Crore for cybersecurity innovation."
    },
    {
        "title": "GREAT Scheme – IIT Ropar TBIF",
        "type": "Grant",
        "organization": "TBIF IIT Ropar",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": "50,00,000",
        "deadline": null,
        "eligibility": "Early-stage R&D startups",
        "official_url": null,
        "description": "Grant up to ₹50 Lakhs for R&D and innovation startups."
    },
    {
        "title": "NIDHI-SSP – Vishnu Foundation TBI",
        "type": "Seed Fund",
        "organization": "Vishnu Foundation TBI",
        "startup_stage": [],
        "category": "Grant",
        "sector": "AgriTech",
        "benefits": [],
        "funding": "1,00,00,000",
        "deadline": null,
        "eligibility": "MedTech, Assistive Tech, DeepTech, AgriTech startups",
        "official_url": null,
        "description": "Seed fund support up to ₹1 Crore under NIDHI-SSP scheme."
    },
    {
        "title": "AI Grand Challenge – NCIIPC Startup India",
        "type": "Prize Grant",
        "organization": "NCIIPC",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": "1,88,00,000",
        "deadline": "2025-08-15",
        "eligibility": "Students and startups",
        "official_url": null,
        "description": "AI innovation prize grant up to ₹1.88 Crore per problem statement."
    },
    {
        "title": "Start-Up Chile",
        "type": "Grant",
        "organization": "Start-Up Chile (Government of Chile)",
        "startup_stage": [],
        "category": "Grant",
        "sector": "technology",
        "benefits": [],
        "funding": null,
        "deadline": null,
        "eligibility": "Early-stage technology startups (varies by program)",
        "official_url": "https://www.startupchile.org/",
        "description": "Government-backed equity-free startup program providing non-dilutive funding and global expansion support."
    }
];

/**
 * Normalize a raw category/sector value into an array of clean strings.
 * Handles: string, string[], comma-separated strings, null, empty,
 * and the literal string "null" that exists in some scraped entries.
 */
function normalizeField(value: string | string[] | null | undefined): string[] {
    if (!value) return [];
    const items = Array.isArray(value) ? value : [value];
    return items
        .flatMap(v => v.split(','))
        .map(v => v.trim())
        .filter(v => v.length > 0 && v.toLowerCase() !== 'null');
}

/** Capitalize first letter (e.g. "global" → "Global") */
function titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Get the primary category string (first non-empty value) */
export function getCategoryLabel(grant: Grant): string {
    const cats = normalizeField(grant.category);
    return cats.length > 0 ? titleCase(cats[0]) : 'Miscellaneous';
}

/** Get all categories for a grant (for multi-category grouping) */
export function getCategoryLabels(grant: Grant): string[] {
    const cats = normalizeField(grant.category);
    return cats.length > 0 ? cats.map(titleCase) : ['Miscellaneous'];
}

/** Get the primary sector string */
export function getSectorLabel(grant: Grant): string {
    const sectors = normalizeField(grant.sector);
    return sectors.length > 0 ? titleCase(sectors[0]) : 'Sector-Agnostic';
}

/** Group all grants by their category field (each grant can appear in multiple categories) */
export function getGrantCategories(): GrantCategory[] {
    // Use lowercase key for grouping so "Global" and "global" merge
    const map = new Map<string, { label: string; grants: Grant[] }>();

    for (const grant of grants) {
        const cats = getCategoryLabels(grant);
        for (const cat of cats) {
            const key = cat.toLowerCase();
            if (!map.has(key)) map.set(key, { label: cat, grants: [] });
            map.get(key)!.grants.push(grant);
        }
    }

    // Sort alphabetically by label
    return Array.from(map.values())
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ label, grants: items }) => ({
            id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            label,
            grants: items,
        }));
}
