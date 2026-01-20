const servicesData = {
  "private-limited-company-registration": {
    title: "Private Limited Company Registration in India – Process & Fees",
    updated: "Updated on November 12, 2025 11:28:11 AM",
    hero: {
      price: "₹9,499",
      bullets: [
        "Includes DSC, PAN/TAN filing",
        "Expert assistance end-to-end",
        "Estimated 10-15 working days"
      ]
    },
    sections: [
      { id: "what", heading: "What is a Pvt. Ltd. Company?", content: "Pvt. Ltd. Company is a separate legal entity governed by the Companies Act, 2013. It provides limited liability and facilitates investment." },
      { id: "process", heading: "Registration Process", content: "Step-by-step: DSC -> Name approval -> SPICe filing -> MoA/AoA -> Certificate of Incorporation." },
      { id: "fees", heading: "Fees", content: "Indicative fees: DSC ₹3,000, Govt fee ₹2,500, Professional fee ₹3,999 (total ₹9,499)." },
      { id: "documents", heading: "Documents Required", content: "Identity & address proof for directors, registered office proof, photographs, PAN/Aadhaar etc." }
    ],
    pricing: {
      packages: [
        { name: "Basic", price: "₹9,499", includes: ["Incorporation Certificate", "PAN & TAN"] },
        { name: "Standard", price: "₹18,499", includes: ["Basic + GST Registration", "MSME"] }
      ]
    },
    faqs: [
      { q: "How to register?", a: "Provide documents and we will file SPICe forms on your behalf." },
      { q: "Is GST mandatory?", a: "No, GST depends on turnover and business nature." }
    ]
  },

  "partnership-firm-registration": {
    title: "Partnership Firm Registration – Process, Fees, Documents",
    hero: { price: "₹3,999", bullets: ["Partnership deed drafting", "PAN application", "Registrar filing"] },
    sections: [
      { id: "what", heading: "What is a Partnership Firm?", content: "A partnership is an association of two or more persons governed by the Indian Partnership Act, 1932." },
      { id: "procedure", heading: "Procedure", content: "Select name -> Draft deed -> File with Registrar -> Stamp duty -> Receive certificate." }
    ],
    pricing: { packages: [{ name: "Standard", price: "₹3,999" }] },
    faqs: [{ q: "Is registration mandatory?", a: "Registration is optional but recommended for legal benefits." }]
  },

  "company-registration": {
    title: "Company Registration – Types, Process & Fees",
    hero: { price: "Varies by entity", bullets: ["Private Limited, Public Limited, OPC, LLP options", "DSC, DIN, SPICe filings", "Expert assistance available"] },
    sections: [
      { id: "types", heading: "Types of Company", content: "Private Limited, Public Limited, One Person Company (OPC), Producer Company, Section 8 Company and others." },
      { id: "process", heading: "Registration Process", content: "Choose entity -> DSC/DIN -> Name approval -> SPICe filing -> MoA/AoA -> Certificate issuance." }
    ],
    pricing: { packages: [{ name: "Enquire", price: "Contact for custom quote" }] },
    faqs: [{ q: "Which structure is right?", a: "Depends on scale, funding needs and compliance appetite; we can advise." }]
  },

  "llp-registration-india": {
    title: "LLP Registration in India – Online Process, Documents, Fees",
    hero: { price: "₹8,499 (indicative)", bullets: ["DSC for partners", "FiLLiP filing", "LLP Agreement drafting"] },
    sections: [
      { id: "what", heading: "What is an LLP?", content: "A Limited Liability Partnership combines limited liability with partnership flexibility, governed by the LLP Act, 2008." },
      { id: "steps", heading: "Registration Steps", content: "DSC -> Name reservation -> FiLLiP filing -> LLP Agreement -> Certificate of Incorporation." }
    ],
    pricing: { packages: [{ name: "Standard", price: "₹8,499" }] },
    faqs: [{ q: "Minimum partners?", a: "Minimum 2 partners; at least one resident in India." }]
  },

  "one-person-company-opc-registration": {
    title: "One Person Company (OPC) Registration in India – Process & Fees",
    hero: { price: "₹9,499 (indicative)", bullets: ["Single member company","Limited liability","SPICe filing for incorporation"] },
    sections: [
      { id: "what", heading: "What is OPC?", content: "OPC allows a single entrepreneur to incorporate a company with limited liability and separate legal identity." },
      { id: "process", heading: "Process", content: "DSC -> Name approval -> SPICe & MoA/AoA -> Certificate -> PAN/TAN issuance." }
    ],
    pricing: { packages: [{ name: "Basic", price: "₹11,499" }] },
    faqs: [{ q: "Can OPC convert later?", a: "Yes — OPC can convert to Pvt Ltd subject to conditions." }]
  },

  "sole-proprietorship-registration": {
    title: "Sole Proprietorship Registration in India – Process, Documents & Fees",
    hero: { price: "From ₹2,999", bullets: ["Fast setup","Minimal compliance","Ideal for small businesses"] },
    sections: [
      { id: "what", heading: "What is Sole Proprietorship?", content: "A sole proprietorship is owned by one person; the owner and business are not separate legal entities." },
      { id: "registrations", heading: "Registrations", content: "GST, Udyam (MSME), Shop & Establishment, current account — depending on business needs." }
    ],
    pricing: { packages: [{ name: "Startup", price: "₹2,999" }] },
    faqs: [{ q: "Is registration mandatory?", a: "No single certificate; registrations depend on business activities and turnover." }]
  },

  "section-8-company-registration": {
    title: "Section 8 Company Registration in India – Process, Documents & Fees",
    hero: { price: "₹9,999 (indicative)", bullets: ["Non-profit structure","Section 8 licence","MOA/AOA drafting"] },
    sections: [
      { id: "what", heading: "What is a Section 8 Company?", content: "A non-profit company formed for charitable purposes under Companies Act; income used only for objectives." },
      { id: "process", heading: "Process", content: "DSC -> DIN -> Name approval -> Section 8 license application -> SPICe filing -> Certificate." }
    ],
    pricing: { packages: [{ name: "NGO Package", price: "₹9,999" }] },
    faqs: [{ q: "Is profit allowed?", a: "Profits must be used only for charitable objectives; cannot be distributed." }]
  },

  "society-registration": {
    title: "Society Registration in India – Process & Fees",
    hero: { price: "Varies by state", bullets: ["Registered under Societies Registration Act, 1860","Ideal for NGOs and associations"] },
    sections: [
      { id: "what", heading: "What is a Society?", content: "A society is an association of persons united by mutual consent to deliberate, determine and act jointly for some common purpose." },
      { id: "process", heading: "Process", content: "Draft Memorandum -> Rules & Regulations -> File with Registrar of Societies." }
    ],
    pricing: { packages: [{ name: "Standard", price: "Varies" }] },
    faqs: [{ q: "Minimum members?", a: "Minimum 7 members are required for registration." }]
  },

  "public-limited-company-registration": {
    title: "Public Limited Company Registration – Process & Fees",
    hero: { price: "Varies", bullets: ["For large scale businesses", "Can list on stock exchange", "Strict compliance"] },
    sections: [
      { id: "what", heading: "What is a Public Limited Company?", content: "A company that can raise capital from the public, requires higher compliance and disclosure." },
      { id: "requirements", heading: "Minimum requirements", content: "Minimum 7 shareholders, 3 directors, registered office, compliance with SEBI when listing." }
    ],
    pricing: { packages: [{ name: "Enquire", price: "Contact for quote" }] },
    faqs: [{ q: "Can I convert to public company?", a: "Yes — private companies can convert subject to compliance and shareholder approvals." }]
  },

  "producer-company-registration": {
    title: "Producer Company Registration – Process & Fees",
    hero: { price: "Varies", bullets: ["For farmers & producers","Hybrid corporate-cooperative model","Limited liability"] },
    sections: [
      { id: "what", heading: "What is a Producer Company?", content: "A company primarily for producers (farmers) which combines benefits of cooperative societies and company law." },
      { id: "process", heading: "Registration Steps", content: "Draft MoA/AoA -> Name approval -> SPICe filing -> Certificate of Incorporation." }
    ],
    pricing: { packages: [{ name: "Standard", price: "Contact for quote" }] },
    faqs: [{ q: "Minimum members?", a: "Usually minimum 10 individuals or 2 institutions depending on the rules." }]
  }
};

export default servicesData;
