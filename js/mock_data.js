/**
 * LexAI — High-Fidelity Mock & Demo Responses
 * Provides realistic AI outputs for immediate testing and demo mode
 */

export const MOCK_RESPONSES = {
  simplify: `## 📋 Document Overview
This document is a **Mutual Non-Disclosure Agreement (NDA)** between **NexaTech Innovations Inc.** and **Vertex Dynamics LLC**. Its purpose is to allow both companies to share confidential business, technical, and artificial intelligence plans for a potential partnership without fear that either side will leak or misuse the information.

---

## 👥 Key Parties
* **Disclosing Party**: NexaTech Innovations Inc. (Delaware corporation based in San Francisco, CA)
* **Receiving Party**: Vertex Dynamics LLC (California LLC based in San Jose, CA)
* *Note: Because this is a "mutual" agreement, both companies act as both Disclosing and Receiving parties.*

---

## 📌 Plain English Summary
* **What is Protected**: Any proprietary technical data, software code, customer lists, financial forecasts, and business strategies marked confidential or clearly confidential by nature.
* **How It Must Be Handled**: Both companies must treat each other's secrets with at least standard reasonable care and only share them with team members and advisors who strictly need to know.
* **Duration**: The agreement covers secrets shared over the next **2 years**. Confidentiality obligations last for **3 years** after talks end, but trade secrets stay secret forever.
* **Return of Files**: If talks end or upon request, all notes, documents, and copies must be returned or certified as destroyed.

---

## ⚡ Key Obligations
1. **Strict Confidentiality**: Do not disclose shared materials to any outside third parties.
2. **Access Control**: Restrict file access only to necessary employees and legal/financial advisors.
3. **Prompt Return**: Delete or return all sensitive data upon written demand.

---

## 📅 Important Dates & Deadlines
* **Effective Date**: October 15, 2025
* **Disclosure Window**: 2 years from Effective Date (ends October 15, 2027)
* **Confidentiality Survival**: 3 years following conclusion of discussions (Trade secrets: Indefinite)

---

## ⚠️ Things to Watch Out For
* **Liquidated Damages Clause (Section 8)**: The agreement sets a fixed penalty of **$50,000 for each verified willful breach** without requiring the other party to prove actual monetary damages.
* **Delaware Jurisdiction (Section 9)**: Any disputes or lawsuits must be filed in Delaware courts, even though both companies are located in California. This could increase legal travel costs.

---
> ℹ️ *This simplification is for informational purposes only and does not constitute formal legal advice. Consult an attorney before executing binding contracts.*`,

  simplifyElementary: `## 📋 What is this document?
This is a **Secret-Keeping Agreement** (called an NDA) between two companies: **NexaTech** and **Vertex**. They want to talk about building new artificial intelligence computer programs together, but neither company wants their secret ideas leaked to anyone else!

---

## 👥 Who is signing this?
* **Friend 1**: NexaTech Innovations
* **Friend 2**: Vertex Dynamics
* *(Both companies promise to follow the exact same rules.)*

---

## 📌 Plain English Rules
* **No Telling Secrets**: You cannot share secret computer code, customer names, or plans with outside people.
* **Be Careful**: Treat the other team's files just like your own most prized possessions.
* **Who Gets to Look?**: Only teammates who truly need to know for the project can see the files.
* **How Long?**: The promise lasts for **3 whole years** after you finish working together. Big trade secrets must stay secret forever!
* **Give It Back**: When the project is over, you have to delete or return all the notes and files within 10 days.

---

## ⚠️ Big Things to Watch Out For!
* 🚨 **$50,000 Penalty**: If someone breaks the promise on purpose, they have to pay **$50,000 right away**!
* ✈️ **Delaware Court**: If there is an argument, everyone has to go all the way to Delaware to see a judge, which could cost a lot of plane tickets.

---
> ℹ️ *This is an easy 5th-grade explanation for learning, not official lawyer advice.*`,

  compare: {
    summary: "Document A is a balanced, standard Mutual NDA protecting both parties equally with a 3-year term. Document B is an aggressive, unilateral agreement heavily skewed in favor of the Disclosing Company with perpetual obligations, a 24-month non-compete, intrusive audit rights, and severe liquidated damages.",
    riskScoreA: 3,
    riskScoreB: 9,
    riskSummaryA: "Document A is low risk and industry standard. It contains mutual protections, reasonable exclusions, and a standard 3-year survival period.",
    riskSummaryB: "Document B is extremely high risk. It contains perpetual non-disclosure, one-sided attorney fee shifting, intrusive 24-hour device audits, and a 2-year non-compete restriction disguised within an NDA.",
    differences: [
      {
        type: "modified",
        category: "Confidentiality Scope",
        description: "Document A protects both parties mutually; Document B only protects Company trade secrets unilaterally.",
        docA: "Mutual obligations for both NexaTech and Vertex Dynamics.",
        docB: "Unilateral protection solely for Global Enterprise Corp.",
        significance: "high"
      },
      {
        type: "modified",
        category: "Survival Duration",
        description: "Document A limits confidentiality to 3 years; Document B imposes perpetual confidentiality.",
        docA: "3 years post-termination (Trade secrets indefinite).",
        docB: "Perpetual survival; obligations never expire.",
        significance: "high"
      },
      {
        type: "added",
        category: "Non-Compete & Non-Solicitation",
        description: "Document B adds a 24-month non-compete prohibiting consulting with competitors. Document A has no non-compete.",
        docA: "None. Strictly covers confidentiality.",
        docB: "24-month restriction against consulting for any competitor or hiring staff.",
        significance: "high"
      },
      {
        type: "added",
        category: "Audit Rights",
        description: "Document B permits Company to inspect personal computers and email on 24h notice.",
        docA: "None. Standard return or certification of destruction.",
        docB: "Unrestricted right to inspect and image hardware on 24 hours notice.",
        significance: "high"
      },
      {
        type: "modified",
        category: "Liquidated Damages",
        description: "Document B triples the liquidated damages penalty from $50,000 to $150,000 per violation.",
        docA: "$50,000 per verified willful breach.",
        docB: "$150,000 per violation plus mandatory attorney fees.",
        significance: "medium"
      }
    ],
    commonClauses: [
      "Definition of Confidential Information and trade secrets",
      "Injunctive relief remedies for unauthorized disclosure",
      "Return or destruction of proprietary materials upon request"
    ],
    recommendation: "Strongly advise signing Document A over Document B. Document B includes unreasonable restrictions that could severely limit your ability to work with other clients, allows intrusive device inspections, and exposes you to disproportionate $150,000 financial penalties."
  },

  clauses: {
    riskScore: 8,
    riskLevel: "high",
    scoreExplanation: "This agreement contains multiple predatory terms: uncapped liability covering consequential damages, a pay-when-paid clause conditioning payment on third parties, and an overbroad intellectual property assignment encompassing off-hours personal inventions.",
    clauses: [
      {
        title: "Pay-When-Paid Payment Terms",
        category: "Payment & Compensation",
        risk: "high",
        quote: "Client shall have no legal obligation to remit payment to Contractor until and unless Client has received full payment from its underlying enterprise customer...",
        analysis: "You bear the entire credit risk of Client's customer. If the enterprise client goes bankrupt or delays payment for 6 months, you do not get paid.",
        plainMeaning: "You only get paid if and when the client's own customer pays them. If the customer stiffs the client, you work for free.",
        recommendation: "Insist on removing Pay-When-Paid. Replace with Net-30 payment terms triggered by your invoice submission."
      },
      {
        title: "Uncapped Indemnification & Consequential Damages",
        category: "Liability & Indemnity",
        risk: "high",
        quote: "Contractor's liability under this Agreement shall be uncapped and shall include indirect, incidental, punitive, and consequential damages.",
        analysis: "Exposes your personal assets to catastrophic liability far exceeding the total contract value. Consequential damages could include lost business profits.",
        plainMeaning: "If something goes wrong with your code, you could be sued for unlimited amounts, including the client's lost revenue.",
        recommendation: "Cap liability to fees paid under the contract during the preceding 6 months and explicitly exclude indirect and consequential damages."
      },
      {
        title: "Overbroad IP & Moral Rights Assignment",
        category: "Intellectual Property",
        risk: "high",
        quote: "Contractor hereby irrevocably assigns... works created during the period of this Agreement, whether created during business hours or on personal time... including prior inventions.",
        analysis: "Captures inventions made on your personal time and retroactively assigns pre-existing intellectual property.",
        plainMeaning: "The client owns code you write on your weekends on your personal laptop, plus tools you built before even meeting them.",
        recommendation: "Limit assignment strictly to deliverables produced for the client during contracted hours. Attach an Exhibit A listing pre-existing IP."
      },
      {
        title: "24-Month Non-Competition Restriction",
        category: "Restrictive Covenants",
        risk: "medium",
        quote: "For a period of twenty-four (24) months... Contractor shall not directly or indirectly provide consulting... within a 50-mile radius...",
        analysis: "Restricts your livelihood as a freelancer across an entire sector. In some jurisdictions (e.g., California), this is legally void, but it creates litigation risk.",
        plainMeaning: "You cannot take other software jobs in digital media for 2 whole years.",
        recommendation: "Strike out non-compete entirely; agree only to a reasonable non-solicitation of direct clients."
      }
    ],
    inconsistencies: [
      "Client reserves unilateral immediate termination rights, but imposes a 60-day notice requirement on Contractor.",
      "Contractor is designated as an independent contractor, but the agreement exerts employee-like control over personal inventions and post-contract work."
    ],
    obligations: [
      { party: "Contractor", obligation: "Deliver full-stack software development subject to unilateral client approval" },
      { party: "Contractor", obligation: "Defend and indemnify client for all claims without any liability limit" },
      { party: "Contractor", obligation: "Provide 60 days advance written notice before terminating services" },
      { party: "Client", obligation: "Remit $85/hr only after receiving enterprise customer payment" }
    ]
  },

  simplifyLease: `## 📋 Document Overview
This document is a **Residential Lease Agreement** between **Oakwood Properties LLC** (Landlord) and **Jane Doe** (Tenant) for the apartment at **742 Evergreen Terrace, Unit 4B, Springfield**. It establishes a 12-month tenancy with total annual rent of $27,000.

---

## 👥 Key Parties
* **Landlord**: Oakwood Properties LLC
* **Tenant**: Jane Doe

---

## 📌 Plain English Summary
* **Rent & Term**: You pay **$2,250.00 each month**, due on or before the 1st. If not paid by 11:59 PM on the 2nd, you are assessed a steep **$150.00 late fee**. The lease runs for 12 months (Feb 1, 2026 – Jan 31, 2027).
* **Security Deposit**: You must pay **$4,500.00** (two full months' rent) upfront. The landlord states they will return it within 60 days after move-out.
* **Auto-Renewal Trap**: Unless you give formal written notice 60 days before the lease ends, it automatically renews for another year with a **mandatory 10% rent hike** (to $2,475/mo).
* **Repairs**: The lease requires you to pay for all plumbing, appliance, and window repairs **under $200.00**.

---

## ⚡ Key Obligations
1. **Pay Rent Promptly**: Due on the 1st of every month with only a 1-day grace period.
2. **Handle Small Maintenance**: You must pay for maintenance under $200 per incident.
3. **Written Notice to Vacate**: Must provide written non-renewal notice at least 60 days in advance (by Dec 2, 2026).

---

## 📅 Important Dates & Deadlines
* **Lease Start**: February 1, 2026
* **Lease End**: January 31, 2027
* **Notice Deadline**: December 2, 2026 (60 days prior to expiry)

---

## ⚠️ High-Risk Clauses to Negotiate
* **2-Hour Right of Entry (Section 6)**: The landlord claims right to enter with only 2 hours text notice. Standard law requires 24 to 48 hours advance notice.
* **$200 Maintenance Deductible (Section 5)**: Shifting appliance and plumbing upkeep to tenants violates statutory warranty of habitability in most states.
* **Prohibitive Early Break Penalty (Section 8)**: If you need to leave early, you are penalized 2 months rent ($4,500) PLUS ongoing rent until re-rented.
* **60-Day Deposit Return (Section 3)**: Most jurisdictions mandate deposit returns within 14–30 days.

---
> ℹ️ *This simplification is for informational purposes only and does not constitute formal legal advice. Consult a tenant rights attorney before signing.*`,

  simplifyConsulting: `## 📋 Document Overview
This document is an **Independent Contractor & Services Agreement** between **Apex Media Group** (Client) and **Alex Smith** (Contractor) for software engineering services. It contains multiple aggressive clauses that favor the client and pose significant financial and career risks to the contractor.

---

## 👥 Key Parties
* **Client**: Apex Media Group
* **Contractor**: Alex Smith (Independent Freelancer)

---

## 📌 Plain English Summary
* **Compensation**: Hourly rate is **$85.00/hr**, BUT compensation is strictly **"Pay-When-Paid"**. The client does not owe you a penny until their own corporate customer pays them.
* **Intellectual Property Grab**: The client claims ownership of everything you build during the contract term — including inventions made on personal time on weekends, plus your prior pre-existing tools!
* **Non-Compete**: Prohibits you from consulting or building software for any digital media company within 50 miles for **2 full years** after the contract ends.
* **Uncapped Liability**: You agree to defend and indemnify the client for unlimited damages, including their lost profits and attorney fees.

---

## ⚡ Key Obligations
1. **Deliver Services**: Build full-stack software subject to unilateral client satisfaction.
2. **60-Day Termination Notice**: You cannot terminate without giving 60 days written notice, while the client can fire you immediately with no notice.
3. **Indemnity Defense**: Pay all legal fees and liabilities if anyone sues the client over your work.

---

## ⚠️ Critical Warning Points
* **Pay-When-Paid Provision**: You bear 100% of the customer default risk. If the enterprise client goes bankrupt, you work for free.
* **24-Month Non-Compete**: May severely restrict your livelihood as an engineer.
* **Unlimited Consequential Damages**: Could expose your personal life savings to catastrophic legal claims.

---
> ℹ️ *This simplification is for informational purposes only. Do NOT sign without having an attorney redline these predatory terms.*`,

  clausesLease: {
    documentType: "Residential Lease Agreement",
    overallRisk: "high",
    overallRiskSummary: "This lease agreement contains multiple aggressive and tenant-unfavorable provisions that infringe on tenant statutory rights, including a 2-hour entry notice, a mandatory 10% rent escalation, shifting repair costs under $200 to tenant, and an unlawful 60-day security deposit return window.",
    clauses: [
      {
        title: "2-Hour Right of Entry Notice",
        riskLevel: "high",
        plainExplanation: "The landlord reserves the right to enter your home with only 2 hours advance notice for inspections or showings.",
        whyItMatters: "Severely infringes on your right to quiet enjoyment and privacy. Standard state laws require at least 24 to 48 hours advance written notice.",
        redFlags: ["2 hours is unreasonably short notice and creates significant intrusion risk.", "Insist on amending to 24 hours written notice except in verified structural emergencies."],
        originalText: "Landlord reserves the right to enter the Premises at any time for inspections, repairs, or showing to prospective tenants with two (2) hours verbal or text notice."
      },
      {
        title: "Automatic Renewal with Mandatory 10% Rent Hike",
        riskLevel: "high",
        plainExplanation: "Unless you provide written non-renewal notice 60 days before the lease ends, it auto-renews for another 12 months at $2,475/month.",
        whyItMatters: "If you miss the deadline by even one day, you are locked in for an entire additional year at a steep 10% higher rate.",
        redFlags: ["10% escalation exceeds statutory rent caps in many regulated municipalities.", "60-day window is easy to miss without calendar reminders."],
        originalText: "Unless Tenant delivers written notice of non-renewal at least sixty (60) days prior to lease expiration, this Lease shall automatically renew for a successive twelve (12) month term at a mandatory 10% rent increase."
      },
      {
        title: "$200 Tenant Repair Deductible",
        riskLevel: "high",
        plainExplanation: "You are required to pay out of pocket for any plumbing clogs, appliance repairs, or window fixes costing under $200.",
        whyItMatters: "Landlords are legally obligated to maintain working plumbing, heating, and appliances under the implied warranty of habitability.",
        redFlags: ["Shifts landlord's maintenance duties onto tenant.", "Commonly deemed unconscionable and void in housing courts."],
        originalText: "Tenant is responsible for all plumbing clogs, appliance repairs, window maintenance, and general property upkeep under $200.00 per occurrence."
      },
      {
        title: "Excessive Early Termination Penalties",
        riskLevel: "high",
        plainExplanation: "If you break the lease early, you must pay an immediate $4,500 penalty AND remain liable for all remaining monthly rent.",
        whyItMatters: "Landlords have a common-law duty to mitigate damages by making reasonable efforts to re-rent the property rather than double-dipping on rent and penalties.",
        redFlags: ["Demands both full future rent AND a $4,500 penalty.", "Illegal double-recovery in most jurisdictions."],
        originalText: "If Tenant vacates before the end of the term, Tenant remains liable for full rent for all remaining months until the property is re-rented, plus an early break penalty of two (2) months rent ($4,500.00)."
      },
      {
        title: "60-Day Security Deposit Return Window",
        riskLevel: "medium",
        plainExplanation: "The landlord grants themselves 60 full days after move-out to return your $4,500 security deposit.",
        whyItMatters: "Most state landlord-tenant acts require deposit return within 14, 21, or 30 days maximum, often with statutory penalties for late returns.",
        redFlags: ["60 days may violate mandatory state timelines (e.g. 21 days in California, 14 days in New York)."],
        originalText: "Landlord will return the remaining deposit within sixty (60) days of move-out."
      }
    ],
    inconsistencies: [
      "Lease disclaims landlord responsibility for upkeep under $200, which directly conflicts with state statutory warranty of habitability.",
      "The 60-day security deposit return period exceeds statutory maximum return deadlines in most states."
    ],
    obligations: [
      { party: "Tenant", obligation: "Pay $2,250/mo on 1st with only 1-day grace period before $150 penalty" },
      { party: "Tenant", obligation: "Give 60 days advance written notice before lease expiration" },
      { party: "Tenant", obligation: "Pay all repair costs under $200 per occurrence" },
      { party: "Landlord", obligation: "Provide premises in habitable condition and return security deposit" }
    ]
  },

  checklistLease: {
    situationSummary: "Prospective tenant reviewing a 12-month apartment lease ($2,250/mo) containing aggressive terms: 2-hour entry notice, 10% auto-renewal hike, $200 repair deductible, and early break penalties.",
    urgencyLevel: "soon",
    urgencyNote: "Complete all redlines and negotiations BEFORE signing or transferring any deposit funds.",
    groups: [
      {
        groupTitle: "Essential Lease Redlines & Negotiations",
        icon: "edit-3",
        items: [
          { action: "Demand written amendment changing 2-hour entry notice to 24 hours written notice", why: "Protects your constitutional and statutory right to privacy and quiet enjoyment", priority: "urgent" },
          { action: "Strike out Section 5 ($200 repair deductible for plumbing and appliances)", why: "Landlord is legally responsible for structural and appliance maintenance under habitability laws", priority: "urgent" },
          { action: "Cap auto-renewal rent increase to local CPI (e.g. 3-4%) and allow month-to-month continuation", why: "A mandatory 10% hike costs an extra $2,700/year without negotiation rights", priority: "soon" },
          { action: "Amend early termination clause to a standard 2-month buyout with zero future rent liability", why: "Protects you from predatory double-recovery if you need to relocate for job or personal emergency", priority: "soon" }
        ]
      },
      {
        groupTitle: "Move-In Inspection & Evidence Gathering",
        icon: "camera",
        items: [
          { action: "Take timestamped HD photos and 4K video of every room, wall, and appliance before moving furniture", why: "Irrefutable visual proof against fraudulent security deposit deductions upon move-out", priority: "urgent" },
          { action: "Complete and sign a formal Move-In Condition Checklist with the property manager", why: "Establishes a mutually agreed baseline of existing scratches, stains, and wear", priority: "soon" },
          { action: "Test all water faucets, electrical outlets, window locks, and heating/AC units", why: "Discovers existing defects before the $200 tenant deductible could be improperly applied", priority: "normal" }
        ]
      },
      {
        groupTitle: "Financial & Security Deposit Safeguards",
        icon: "shield-check",
        items: [
          { action: "Request written confirmation of the bank holding your $4,500 security deposit in escrow", why: "Many states require landlords to place deposits in an interest-bearing segregated account", priority: "soon" },
          { action: "Never pay security deposit or rent in cash — use electronic wire or cashier's check with memo line", why: "Provides an immutable bank receipt verifying payment date and purpose", priority: "urgent" }
        ]
      }
    ],
    importantWarnings: [
      "Do NOT rely on verbal promises from the leasing agent ('Oh, we never enforce that 2-hour entry rule') — if it is in the signed contract, it is legally binding.",
      "Do NOT sign the lease until all agreed redlines are initialed by both you and the landlord."
    ],
    professionalAdvice: "If the landlord refuses to negotiate high-risk clauses or if local rent control statutes apply, consult a local Tenant Union or Housing Legal Aid clinic before executing."
  },

  checklist: {
    situationSummary: "Tenant dealing with a landlord who is improperly withholding a $4,500 security deposit beyond statutory deadlines and claiming undocumented cleaning deductions.",
    urgencyLevel: "soon",
    urgencyNote: "Check your local jurisdiction's statutory deposit return deadline (typically 14 to 30 days post move-out).",
    groups: [
      {
        groupTitle: "Immediate Document Gathering",
        icon: "folder",
        items: [
          { action: "Locate original signed lease agreement and security deposit receipt", why: "Proves amount paid ($4,500) and agreed move-out conditions", priority: "urgent" },
          { action: "Compile move-in and move-out inspection checklists and photos", why: "Crucial photographic evidence against claims of tenant-caused damage", priority: "urgent" },
          { action: "Save all text messages, emails, and postal mail with the landlord", why: "Establishes timeline of requests and landlord's non-responsiveness", priority: "soon" }
        ]
      },
      {
        groupTitle: "Written Demand & Communications",
        icon: "mail",
        items: [
          { action: "Draft a formal Security Deposit Demand Letter with itemized breakdown request", why: "Many states require a formal written demand before taking legal action", priority: "urgent" },
          { action: "Send the letter via USPS Certified Mail with Return Receipt Requested", why: "Provides admissible legal proof that the landlord received the demand", priority: "soon" },
          { action: "Provide a firm 10-day deadline for full refund before initiating legal proceedings", why: "Sets an unambiguous clock for settlement or small claims filing", priority: "normal" }
        ]
      },
      {
        groupTitle: "Legal Escalation & Remedies",
        icon: "gavel",
        items: [
          { action: "Research bad-faith statutory penalties in your state (e.g. 2x to 3x deposit in CA/NY)", why: "Landlords withholding deposits in bad faith are frequently liable for triple damages", priority: "soon" },
          { action: "Check your local Small Claims Court monetary limit", why: "Small claims avoids attorney fees and is designed for disputes under $10,000", priority: "normal" },
          { action: "Contact local Tenants' Rights Union or Housing Legal Aid clinic", why: "Offers free template letters and guidance on municipal rent board rules", priority: "normal" }
        ]
      }
    ],
    importantWarnings: [
      "Do NOT verbally threaten or harass the landlord over phone or messaging — keep all communications formal, written, and polite.",
      "Do NOT accept a partial refund check if the memo line states 'Payment in Full' or 'Full Settlement' unless you agree to waive the remaining balance."
    ],
    professionalAdvice: "If the landlord ignores the certified demand letter after 10 days, schedule a consultation with a local tenant advocacy attorney or file directly in Small Claims Court."
  },

  checklistContractor: {
    situationSummary: "Independent contractor seeking recovery of $14,200 in overdue milestone invoices from an enterprise client attempting to invoke conditional payment terms.",
    urgencyLevel: "urgent",
    deadlineWarning: "Prompt-payment statutory deadlines and copyright revocation notice clocks require immediate action within 7-14 days.",
    groups: [
      {
        groupTitle: "Immediate Evidence Preservation",
        icon: "shield-check",
        items: [
          { action: "Export and back up all Git repositories, deploy logs, and staging server milestones", why: "Provides indisputable technical proof that deliverables were submitted and deployed", priority: "urgent" },
          { action: "Archive all email and Slack threads containing client sign-offs and praise", why: "Defeats late-stage subjective claims that work was substandard or defective", priority: "urgent" },
          { action: "Compile an itemized accounting statement of all invoices, invoice numbers, and days overdue", why: "Essential documentation for both demand letter and small claims filing", priority: "urgent" }
        ]
      },
      {
        groupTitle: "Formal Demand & Statutory Notice",
        icon: "send",
        items: [
          { action: "Draft and dispatch a Formal 10-Day Final Notice Before Legal Action via Certified Mail", why: "Required pre-condition for statutory late payment interest and attorney fee shifting", priority: "urgent" },
          { action: "Serve Notice of Copyright Revocation if contract specifies IP transfers upon full payment", why: "Client using unpaid software in production constitutes immediate federal copyright infringement", priority: "soon" },
          { action: "Calculate statutory interest (typically 1% to 1.5% per month under Prompt Payment Acts)", why: "Substantially increases client's financial exposure the longer they delay", priority: "soon" }
        ]
      },
      {
        groupTitle: "Recovery Escalation",
        icon: "gavel",
        items: [
          { action: "Assess Small Claims Court limits in client's county of registration", why: "Small claims provides rapid resolution within 30-60 days with minimal filing fees", priority: "normal" },
          { action: "Consult a Commercial Debt Recovery Attorney for a formal firm-letterhead demand", why: "Demand letters on legal letterhead resolve over 65% of contractor invoice disputes without court", priority: "normal" }
        ]
      }
    ],
    importantWarnings: [
      "Do NOT tamper with, disable, or insert backdoors into client's live production servers — doing so violates the Computer Fraud and Abuse Act (CFAA).",
      "Do NOT communicate emotionally in written text or voice calls — maintain meticulous professional documentation."
    ],
    professionalAdvice: "If the client does not respond to the 10-day certified demand letter, retain commercial counsel to file a breach of contract action or submit a claim to small claims court."
  },

  prepare: {
    situationOverview: "Freelance full-stack engineer seeking advice regarding $14,200 in unpaid client invoices where the client is refusing payment citing scope disputes and a vague 'pay-when-paid' clause.",
    keyLegalIssues: [
      "Enforceability of 'Pay-When-Paid' contract provision under governing state law",
      "Breach of contract and promissory estoppel for delivered milestones",
      "Copyright ownership and potential immediate revocation of software license upon non-payment",
      "Applicability of statutory late payment interest and attorney fee shifting provisions"
    ],
    lawyerType: "Commercial Litigation Attorney or Independent Contractor / IP Rights Specialist",
    timelineExpectation: "Demand letter response typically takes 10-14 days. If formal court filing is required, small claims resolution takes 6-10 weeks, while standard civil litigation may take 6-12 months.",
    costConsiderations: "A formal lawyer demand letter typically costs $350–$750. Hourly litigation rates range from $250–$450/hr. Inquire about limited scope representation (unbundled legal services).",
    questionCategories: [
      {
        categoryTitle: "Contract Terms & Legal Merit",
        icon: "file-search",
        questions: [
          { 
            question: "Under our governing state law, is the 'pay-when-paid' clause interpreted as a conditional condition precedent or merely a timing mechanism?", 
            purpose: "Determines whether the client is permanently excused from paying you if their customer defaults.",
            goodAnswer: "A seasoned attorney will clarify that courts disfavor permanent payment forfeitures and usually construe such clauses as giving the client only a reasonable period of time to pay."
          },
          { 
            question: "Can we claim that client's continuous acceptance and deployment of the code in production constitutes formal acceptance of the deliverables?", 
            purpose: "Overcomes their argument that deliverables did not meet subjective satisfaction criteria.",
            goodAnswer: "Yes, deploying software to live commercial end-users constitutes substantial performance and waiver of non-conforming tender objections under commercial law."
          },
          { 
            question: "Since payment has not been tendered, can we serve formal notice revoking their implied license to run the software?", 
            purpose: "Gives immense leverage if the client's business relies on your software code running live.",
            goodAnswer: "If your contract specifies IP ownership transfers upon final payment, ongoing unauthorized use post-breach creates actionable federal copyright infringement claims."
          }
        ]
      },
      {
        categoryTitle: "Strategy, Costs & Timeline",
        icon: "clock",
        questions: [
          { 
            question: "Would a formal Attorney Demand Letter on firm letterhead likely resolve this without filing litigation?", 
            purpose: "Demand letters cost $300-$700 and resolve over 60% of commercial invoice disputes quickly.",
            goodAnswer: "Demand letters written with specific statutory penalties and fee shifting warnings succeed in reaching executive decision-makers who bypass difficult project managers."
          },
          { 
            question: "Does this dispute qualify for Small Claims Court in our county, or does the $14,200 claim require filing in Superior/District Court?", 
            purpose: "Small claims drastically cuts legal fees and yields hearing dates in 45-60 days.",
            goodAnswer: "The lawyer should know the local county small claims ceiling (e.g., $10,000 or $12,500) and whether waiving a few hundred dollars to stay in small claims is cost-efficient."
          },
          { 
            question: "If we prevail in court, does the contract or state prompt-payment statute allow us to recover attorney's fees from the client?", 
            purpose: "Crucial for deciding whether to hire counsel on an hourly or contingency basis.",
            goodAnswer: "The attorney should check both the reciprocal attorney-fee clause in the contract and applicable state prompt-payment statutory fee-shifting provisions."
          }
        ]
      }
    ],
    documentsToGather: [
      "Original signed Independent Contractor Agreement and Statements of Work (SOW)",
      "Unpaid milestone invoices with dates and proof of electronic transmission",
      "Git commit logs, deployment approval emails, or production site screenshots proving delivery",
      "Email/Slack correspondence showing client acknowledged receipt or deployed the code",
      "Notice of demand for payment sent to client prior to attorney consultation"
    ],
    redFlags: [
      "Attorney guarantees a 100% win or quick payout before reviewing contract choice-of-law and dispute venue clauses",
      "Demands a non-refundable multi-thousand dollar retainer for an uncontested debt collection before sending a demand letter",
      "Has zero experience in technology contracts or independent contractor wage/prompt-payment statutes"
    ],
    consultationTips: [
      "Bring a concise 1-page timeline of events, dates invoices were issued, and client's exact excuses",
      "Ask if the attorney can offer unbundled services (e.g. drafting a formal demand letter on firm letterhead for a fixed fee)",
      "Inquire whether your contract allows recovery of legal fees so you can negotiate a fee-shifting settlement"
    ]
  },

  prepareEviction: {
    situationOverview: "Tenant facing an retaliatory 3-day notice to quit or pay $1,500 in alleged undocumented property damage fees after requesting mandatory heating repairs, with current rent fully paid and move-in inspection proof.",
    keyLegalIssues: [
      "Unlawful landlord retaliation under statutory tenant protection codes",
      "Invalid 3-day notice defective under local municipal eviction procedures",
      "Breach of the implied warranty of habitability for broken heating",
      "Bad faith security deposit or fictitious damage assessment"
    ],
    lawyerType: "Tenant Rights Attorney or Housing Defense Specialist",
    timelineExpectation: "Emergency response required within 24-48 hours. Court hearings typically scheduled within 14-21 days in summary eviction proceedings.",
    costConsiderations: "Many legal aid clinics and tenant unions offer free representation for low/moderate income tenants. Private tenant defense lawyers often charge $300-$500 for emergency response filings.",
    questionCategories: [
      {
        categoryTitle: "Immediate Procedural Defense",
        icon: "shield-alert",
        questions: [
          {
            question: "Does this 3-day notice satisfy our local statutory service requirements, or is it legally defective on its face?",
            purpose: "Defective notices require the landlord to restart the entire proceeding from scratch, buying vital time.",
            goodAnswer: "A reassuring lawyer will inspect the service method and statutory disclosures and identify specific statutory defects immediately."
          },
          {
            question: "How do we raise the statutory defense of landlord retaliation under state law?",
            purpose: "Actions taken within 180 days of requesting habitability repairs create a strong legal presumption of unlawful retaliation.",
            goodAnswer: "The lawyer should confirm the timeline creates a rebuttable presumption of retaliation shifting the burden of proof to the landlord."
          }
        ]
      },
      {
        categoryTitle: "Evidence & Counterclaims",
        icon: "gavel",
        questions: [
          {
            question: "Can we assert an affirmative counterclaim for breach of implied warranty of habitability due to lack of heating?",
            purpose: "Establishes tenant rent abatement rights and damages that exceed their alleged damage claim.",
            goodAnswer: "Yes, lack of adequate heating during winter months is a per se habitability violation entitling you to retroactive rent reduction."
          },
          {
            question: "What steps should we take to prevent an unlawful detainer filing from appearing on my public record or credit report?",
            purpose: "Eviction filings can permanently harm tenant screening scores even if dismissed.",
            goodAnswer: "We will seek an immediate sealed record or conditional dismissal before the formal trial date."
          }
        ]
      }
    ],
    documentsToGather: [
      "The physical 3-day notice and envelope or proof of service timestamp",
      "Signed Lease Agreement and all addenda",
      "Bank statements or rent receipts showing every rent payment made on time",
      "Time-stamped photos/videos from move-in showing initial apartment condition",
      "Written repair requests sent to landlord regarding heating issues and landlord's responses"
    ],
    redFlags: [
      "Attorney advises withholding rent without following formal statutory escrow procedures",
      "Attorney is unfamiliar with local municipal rent board ordinances or eviction control rules",
      "Suggests vacating the premises immediately without asserting strong retaliatory eviction defenses"
    ],
    consultationTips: [
      "Do NOT ignore the 3-day notice — the clock runs immediately on court business days",
      "Organize rent payment receipts and repair text messages in chronological order",
      "Contact your local Tenant Rights Union in parallel for local rent control board resources"
    ]
  },

  prepareNonCompete: {
    situationOverview: "Former employee receiving cease-and-desist letter threatening temporary restraining order (TRO) based on an overbroad 2-year nationwide non-compete clause after transitioning to a competitor in the same technology sector.",
    keyLegalIssues: [
      "Enforceability of nationwide non-compete covenants under FTC guidelines and governing state law",
      "Blue-pencil doctrine and reasonable geographic/duration scope limitations",
      "Trade Secrets Protection Act compliance vs ordinary employee general skill and knowledge",
      "Defense against preliminary injunction / Temporary Restraining Order (TRO) standards"
    ],
    lawyerType: "Employment Litigation Attorney or Executive Compensation Counsel",
    timelineExpectation: "Cease & desist responses typically sent within 5-10 business days. TRO hearings are expedited within 7-14 days if filed.",
    costConsiderations: "Pre-litigation negotiation typically costs $1,500-$3,500. Defending an injunction hearing can run $10,000-$25,000. Inquire if your new employer offers indemnification.",
    questionCategories: [
      {
        categoryTitle: "Clause Enforceability & State Law",
        icon: "scale",
        questions: [
          {
            question: "Is this nationwide 2-year non-compete covenant unenforceable as an unreasonable restraint on trade under governing state law?",
            purpose: "Many states (California, Minnesota, New York, etc.) have banned or severely restricted non-competes unless tied to sale of a business.",
            goodAnswer: "The lawyer should analyze the governing law clause and explain whether courts in that jurisdiction strike down or blue-pencil nationwide scopes."
          },
          {
            question: "Does my new position involve true trade secrets, or merely general industry experience and transferable skills?",
            purpose: "Courts will not enjoin employment simply because an employee is knowledgeable, absent genuine proprietary data theft.",
            goodAnswer: "A seasoned attorney will conduct a clear audit showing your duties rely on general skills, dispelling the inevitable disclosure doctrine."
          }
        ]
      },
      {
        categoryTitle: "Defense Strategy & New Employer Involvement",
        icon: "briefcase",
        questions: [
          {
            question: "Should we inform my new employer's general counsel, and will their corporate policy provide legal indemnification?",
            purpose: "New employers frequently assume defense costs if you are a valued hire and they conducted proper onboarding clearance.",
            goodAnswer: "Yes, reviewing your new offer letter's indemnification clause and coordinating with their counsel avoids dual representation conflicts."
          },
          {
            question: "Would sending a forceful response letter demonstrating the clause's legal invalidity deter them from filing a TRO?",
            purpose: "Over 75% of C&D letters are aggressive posturing designed to intimidate rather than commence costly litigation.",
            goodAnswer: "A firm response pointing out statutory fee penalties for bad faith non-compete enforcement often stops litigation in its tracks."
          }
        ]
      }
    ],
    documentsToGather: [
      "Copy of the formal Cease & Desist letter and any attached draft complaints",
      "Complete original signed Employment Agreement, NDA, and Proprietary Inventions Assignment",
      "Offer letter and job description for your new position",
      "Confirmation that all former company laptops, devices, and files were returned without downloading data",
      "Exit interview documents or severance agreements signed upon departure"
    ],
    redFlags: [
      "Lawyer tells you to quit your new job immediately out of caution without analyzing state enforceability",
      "Does not check whether the contract has a mandatory arbitration or choice-of-venue clause",
      "Has not handled preliminary injunction or TRO defense hearings in federal/state court"
    ],
    consultationTips: [
      "Do NOT access old company email, cloud drives, or USBs — digital forensic trails are critical in non-compete disputes",
      "Prepare a side-by-side comparison of your old job description vs your new job description to demonstrate distinct roles",
      "Check your new employer's legal coverage or whether your homeowner's/umbrella policy includes personal liability coverage"
    ]
  },

  qaWelcome: "Hello! I'm LexAI, your GenAI legal assistant. Ask me questions about any legal document or topic, or pick one of the quick suggestions below."
};

