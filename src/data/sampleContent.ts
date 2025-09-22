import { Author, ContentItem } from '@/types/blog';

export const sampleAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'Dr. Priya Sharma',
    bio: 'Senior Partner at a leading corporate law firm with over 15 years of experience in securities law, corporate governance, and regulatory compliance. Former SEBI consultant and frequent speaker at legal conferences.',
    photo: '/placeholder-author.jpg',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/priyasharma' },
      { label: 'Email', url: 'mailto:priya@example.com' }
    ]
  },
  {
    id: 'author-2',
    name: 'Advocate Rajesh Kumar',
    bio: 'Specialist in international arbitration and cross-border dispute resolution. Over a decade of experience representing clients before various international arbitral tribunals.',
    links: [
      { label: 'Chambers Profile', url: 'https://example.com/rajesh' }
    ]
  }
];

export const sampleContent: ContentItem[] = [
  {
    id: 'post-1',
    type: 'post',
    title: 'The Evolving Landscape of ESG Compliance in Indian Corporate Law',
    slug: 'esg-compliance-indian-corporate-law',
    date: '2024-01-15',
    summary: 'An analysis of recent amendments to the Companies Act and their implications for environmental, social, and governance compliance in Indian corporations.',
    categories: ['esg', 'company-law'],
    tags: ['compliance', 'corporate governance', 'sustainability', 'companies act'],
    authors: ['author-1'],
    draft: false,
    content: `
# The Evolving Landscape of ESG Compliance in Indian Corporate Law

The integration of Environmental, Social, and Governance (ESG) principles into corporate law has witnessed significant momentum in India over the past few years. Recent amendments to the Companies Act, 2013, coupled with regulatory guidance from SEBI, have established a comprehensive framework for ESG compliance.

## Key Regulatory Developments

### 1. Business Responsibility and Sustainability Reporting (BRSR)

The Securities and Exchange Board of India (SEBI) mandated the Business Responsibility and Sustainability Reporting framework for the top 1,000 listed companies by market capitalization, effective from FY 2022-23.

### 2. Corporate Social Responsibility Enhancement

Section 135 of the Companies Act has been strengthened with clearer guidelines on CSR spending and monitoring mechanisms.

## Practical Implications

Companies now face:
- Enhanced disclosure requirements
- Mandatory sustainability reporting
- Increased stakeholder scrutiny
- Potential liability for non-compliance

## Looking Forward

The trend indicates a move towards mandatory ESG disclosures across a broader spectrum of companies, aligning with global standards while addressing India-specific challenges.
    `
  },
  {
    id: 'case-1',
    type: 'case',
    title: 'Reserve Bank of India v. Peerless General Finance',
    slug: 'rbi-v-peerless-general-finance',
    date: '2024-01-10',
    summary: 'Supreme Court ruling on the scope of RBI\'s supervisory powers over NBFCs and the limits of regulatory intervention.',
    categories: ['company-law', 'securities-sebi'],
    tags: ['rbi', 'nbfc', 'regulatory powers', 'supreme court'],
    authors: ['author-1'],
    draft: false,
    court: 'Supreme Court of India',
    jurisdiction: 'India',
    citation: '2024 SCC (1) 123',
    holding: 'RBI has broad supervisory powers over NBFCs but must exercise them within the statutory framework and with due process.',
    rationale: 'The court emphasized the balance between regulatory oversight and corporate autonomy, establishing clear procedural safeguards.',
    content: `
# Reserve Bank of India v. Peerless General Finance

## Case Overview

This landmark judgment by the Supreme Court of India clarifies the extent of the Reserve Bank of India's supervisory powers over Non-Banking Financial Companies (NBFCs) and establishes important precedents for regulatory intervention.

## Facts

- Peerless General Finance was directed by RBI to cease certain activities
- Company challenged the directive as being beyond RBI's statutory powers
- Lower courts had given conflicting decisions on the scope of regulatory authority

## Issues Raised

1. What is the extent of RBI's supervisory powers over NBFCs?
2. What procedural safeguards must be followed before regulatory intervention?
3. How should courts balance regulatory authority with corporate rights?

## Court's Analysis

The Supreme Court conducted a comprehensive review of the relevant statutory provisions, including:
- Reserve Bank of India Act, 1934
- Companies Act, 2013
- Relevant NBFC regulations

## Conclusion

This judgment provides crucial clarity for both regulators and the financial services industry, establishing a framework for future regulatory actions while protecting legitimate business interests.
    `
  },
  {
    id: 'statute-1',
    type: 'statute',
    title: 'Companies Act, 2013 - Section 166: Duties of Directors',
    slug: 'companies-act-section-166-duties-directors',
    date: '2024-01-05',
    summary: 'Comprehensive analysis of directors\' fiduciary duties under Section 166 of the Companies Act, 2013.',
    categories: ['company-law'],
    tags: ['directors duties', 'fiduciary responsibility', 'corporate governance'],
    authors: ['author-1'],
    draft: false,
    act: 'Companies Act, 2013',
    section: 'Section 166',
    interpretation: 'Section 166 establishes comprehensive fiduciary duties for directors, including duty of care, skill, and diligence.',
    content: `
# Companies Act, 2013 - Section 166: Duties of Directors

## Statutory Text

Section 166 of the Companies Act, 2013 lays down the fundamental duties that every director of a company must observe in the discharge of their functions.

## Key Provisions

### (1) Subject to other provisions of this Act, a director shall act in accordance with the articles of the company.

### (2) A director shall act in good faith in order to promote the objects of the company for the benefit of its members as a whole.

### (3) A director shall exercise his duties with due and reasonable care, skill and diligence.

### (4) A director shall not involve in a situation in which he may have a direct or indirect interest that conflicts, or possibly may conflict, with the interest of the company.

## Judicial Interpretation

Courts have consistently held that these duties are:
- Non-delegable personal responsibilities
- Subject to the business judgment rule
- Enforceable through derivative actions

## Practical Applications

Directors must ensure:
- Regular board attendance and preparation
- Independent decision-making
- Proper disclosure of conflicts
- Maintenance of confidentiality

## Penalties for Breach

Non-compliance can result in:
- Personal liability for losses
- Disqualification from directorship
- Criminal prosecution in serious cases
    `
  },
  {
    id: 'guide-1',
    type: 'guide',
    title: 'Complete Guide to International Commercial Arbitration in India',
    slug: 'international-commercial-arbitration-india-guide',
    date: '2024-01-12',
    summary: 'Comprehensive guide covering the framework, procedures, and best practices for international commercial arbitration in India.',
    categories: ['arbitration', 'international-law'],
    tags: ['international arbitration', 'commercial disputes', 'procedure', 'enforcement'],
    authors: ['author-2'],
    draft: false,
    content: `
# Complete Guide to International Commercial Arbitration in India

## Introduction

India has emerged as a significant jurisdiction for international commercial arbitration, with substantial reforms in recent years making it more arbitration-friendly.

## Legal Framework

### Primary Legislation
- Arbitration and Conciliation Act, 2015 (as amended in 2019 and 2021)
- Indian Contract Act, 1872
- Code of Civil Procedure, 1908

### Key Amendments
The 2019 and 2021 amendments introduced several pro-arbitration measures:
- Automatic stay of awards only in specific circumstances
- Fast-track arbitration procedures
- Stringent timelines for disposal

## Institutional Arbitration

### Leading Institutions
1. **Delhi International Arbitration Centre (DIAC)**
2. **Mumbai Centre for International Arbitration (MCIA)**
3. **Indian Council of Arbitration (ICA)**

## Procedural Aspects

### Seat vs. Venue
Understanding the distinction between seat and venue is crucial:
- **Seat**: Determines the procedural law
- **Venue**: Physical location of hearings

### Appointment of Arbitrators
Various methods include:
- Party appointment
- Institutional appointment
- Court appointment (as last resort)

## Enforcement Mechanisms

### Domestic Awards
- Enforcement under Section 36 of the Arbitration Act
- Limited grounds for challenge under Section 34

### Foreign Awards
- New York Convention applies
- Enforcement under Section 48

## Best Practices

### Drafting Arbitration Clauses
- Clear seat designation
- Institutional vs. ad hoc arbitration
- Governing law specification
- Language of proceedings

### Case Management
- Early case management conferences
- Document production protocols
- Witness examination procedures

## Recent Developments

### Notable Judgments
- Bharat Aluminium Co. v. Kaiser Aluminium (2012)
- Vijay Karia v. Prysmian Cavi (2020)

### Regulatory Changes
- Arbitration and Conciliation (Amendment) Act, 2021
- New arbitration rules for various institutions

## Challenges and Opportunities

### Current Challenges
- Judicial intervention in arbitral proceedings
- Enforcement delays
- Cost considerations

### Future Outlook
- Specialized arbitration benches
- Technology integration
- International recognition

## Conclusion

India's arbitration landscape continues to evolve, offering both opportunities and challenges for international commercial dispute resolution.
    `
  },
  {
    id: 'briefing-1',
    type: 'briefing',
    title: 'SEBI Introduces New Regulations for ESG Rating Providers',
    slug: 'sebi-new-regulations-esg-rating-providers',
    date: '2024-01-18',
    summary: 'SEBI has announced new regulatory framework for ESG rating providers to enhance transparency and standardization.',
    categories: ['securities-sebi', 'esg'],
    tags: ['sebi', 'esg ratings', 'regulation', 'transparency'],
    authors: ['author-1'],
    draft: false,
    content: `
# SEBI Introduces New Regulations for ESG Rating Providers

## Key Highlights

The Securities and Exchange Board of India (SEBI) has issued comprehensive regulations for Environmental, Social, and Governance (ESG) rating providers, effective from April 1, 2024.

## Major Provisions

### Registration Requirements
- Mandatory registration for all ESG rating providers
- Minimum net worth of ₹5 crores
- Professional qualifications for key personnel

### Operational Guidelines
- Standardized methodology disclosure
- Periodic review and update of ratings
- Conflict of interest management

### Transparency Measures
- Public disclosure of rating methodologies
- Annual transparency reports
- Client feedback mechanisms

## Industry Impact

This regulation is expected to:
- Enhance credibility of ESG ratings
- Standardize rating methodologies
- Improve investor confidence
- Align with global best practices

## Implementation Timeline

- **March 2024**: Final regulations published
- **April 2024**: Registration process begins
- **October 2024**: Existing providers must comply
- **January 2025**: Full enforcement

## Next Steps

Market participants should:
1. Review current ESG rating arrangements
2. Assess compliance requirements
3. Update vendor due diligence processes
4. Monitor regulatory developments

*This briefing provides a preliminary analysis. Detailed compliance guidance will follow.*
    `
  }
];