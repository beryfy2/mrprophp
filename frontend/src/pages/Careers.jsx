import React, { useEffect, useState } from "react";
import WhyCompanySection from "./WhyUs";
import TestimonialsSection from "./TestimonialsSection";
import TrustedBy from "../components/TrustBy";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Careers = () => {
  const [formData, setFormData] = useState({
    jobType: '',
    name: '',
    email: '',
    phone: '',
    qualification: '',
    message: '',
    linkedin: '',
    expectedSalary: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);

  const [jobOpenings, setJobOpenings] = useState([
    {
      title: 'Social Media Manager',
      urgent: true,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Manage social media presence across all platforms, create engaging content, analyze performance metrics, and develop social media strategies to increase brand awareness and engagement.',
      responsibilities: [
        'Create and curate engaging content for social media platforms',
        'Develop and execute social media marketing strategies',
        'Monitor social media trends and adapt content accordingly',
        'Analyze performance metrics and prepare reports',
        'Manage community engagement and respond to comments/messages',
        'Collaborate with marketing team for brand consistency'
      ],
      qualifications: [
        'Bachelor\'s degree in Marketing, Communications, or related field',
        '2-4 years of social media management experience',
        'Proficiency in social media platforms and tools',
        'Strong understanding of social media analytics',
        'Excellent written and verbal communication skills',
        'Creative thinking and content creation abilities'
      ]
    },
    {
      title: 'Accounts Executive',
      urgent: true,
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Handle accounting operations, maintain financial records, prepare reports, and ensure compliance with accounting standards and regulations.',
      responsibilities: [
        'Maintain accurate financial records and ledgers',
        'Prepare financial statements and reports',
        'Process invoices, payments, and reconciliations',
        'Ensure compliance with accounting standards',
        'Assist in budget preparation and monitoring',
        'Coordinate with auditors and tax professionals'
      ],
      qualifications: [
        'Bachelor\'s degree in Commerce, Accounting, or Finance',
        '1-3 years of accounting experience',
        'Knowledge of accounting software and MS Excel',
        'Understanding of GST and tax regulations',
        'Strong analytical and numerical skills',
        'Attention to detail and accuracy'
      ]
    },
    {
      title: 'Semi Qualified CS',
      urgent: true,
      type: 'Full-time',
      experience: '1-2 years',
      description: 'Assist in company secretarial work, maintain statutory records, handle compliance requirements, and support corporate governance activities.',
      responsibilities: [
        'Maintain statutory registers and records',
        'Prepare and file statutory forms and returns',
        'Assist in board meeting documentation',
        'Handle company incorporation and compliance',
        'Coordinate with regulatory authorities',
        'Support corporate governance activities'
      ],
      qualifications: [
        'Pursuing or completed CS course',
        '1-2 years of experience in company secretarial work',
        'Knowledge of Companies Act and corporate laws',
        'Proficiency in MS Office and compliance software',
        'Strong organizational and documentation skills',
        'Understanding of regulatory compliance'
      ]
    },
    {
      title: 'Content Writer',
      urgent: true,
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Create engaging content for websites, articles, social media, and marketing materials. Research topics, write compelling copy, and optimize content for SEO.',
      responsibilities: [
        'Research and write engaging content for various platforms',
        'Create blog posts, articles, and website content',
        'Develop social media content and captions',
        'Optimize content for SEO best practices',
        'Edit and proofread content for accuracy and clarity',
        'Collaborate with marketing and design teams'
      ],
      qualifications: [
        'Bachelor\'s degree in English, Journalism, or related field',
        '1-3 years of content writing experience',
        'Excellent written and verbal communication skills',
        'Knowledge of SEO principles and content marketing',
        'Proficiency in content management systems',
        'Creative thinking and research abilities'
      ]
    },
    {
      title: 'Import and Export Compliance Executive',
      urgent: true,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Ensure compliance with import-export regulations, handle documentation, coordinate with customs authorities, and manage international trade compliance.',
      responsibilities: [
        'Ensure compliance with import-export regulations',
        'Prepare and review customs documentation',
        'Coordinate with customs and port authorities',
        'Manage HS codes and tariff classifications',
        'Handle export-import licensing and permits',
        'Monitor regulatory changes and updates'
      ],
      qualifications: [
        'Bachelor\'s degree in Commerce, Business, or related field',
        '2-4 years of import-export experience',
        'Knowledge of customs regulations and procedures',
        'Understanding of international trade laws',
        'Strong analytical and documentation skills',
        'Proficiency in compliance software'
      ]
    },
    {
      title: 'Graphic Designer',
      urgent: true,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Create visual content for marketing materials, websites, and branding. Design graphics, logos, and marketing collateral using design software.',
      responsibilities: [
        'Create visual designs for marketing materials',
        'Design logos, brochures, and promotional content',
        'Develop website graphics and UI elements',
        'Ensure brand consistency across all materials',
        'Collaborate with marketing and content teams',
        'Present design concepts and revisions'
      ],
      qualifications: [
        'Bachelor\'s degree in Graphic Design or related field',
        '2-4 years of graphic design experience',
        'Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
        'Strong portfolio demonstrating design skills',
        'Understanding of design principles and typography',
        'Knowledge of web design and digital media'
      ]
    },
    {
      title: 'Next.js Developer',
      urgent: false,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Develop and maintain web applications using Next.js framework. Build responsive user interfaces, implement features, and optimize performance.',
      responsibilities: [
        'Develop web applications using Next.js and React',
        'Build responsive and interactive user interfaces',
        'Implement frontend features and functionality',
        'Optimize application performance and SEO',
        'Collaborate with backend developers and designers',
        'Write clean, maintainable, and well-documented code'
      ],
      qualifications: [
        'Bachelor\'s degree in Computer Science or related field',
        '2-4 years of Next.js/React development experience',
        'Strong knowledge of JavaScript, HTML, and CSS',
        'Experience with REST APIs and state management',
        'Understanding of web performance optimization',
        'Knowledge of version control systems (Git)'
      ]
    },
    {
      title: 'CS Intern',
      urgent: false,
      type: 'Internship',
      experience: '0-1 year',
      description: 'Learn company secretarial practices, assist in compliance work, and gain hands-on experience in corporate governance and regulatory compliance.',
      responsibilities: [
        'Assist in maintaining statutory records',
        'Learn about company incorporation processes',
        'Support compliance documentation and filing',
        'Research regulatory requirements',
        'Assist in board meeting preparations',
        'Learn about corporate governance practices'
      ],
      qualifications: [
        'Pursuing CS (Company Secretary) course',
        'Basic knowledge of corporate laws',
        'Strong learning attitude and attention to detail',
        'Good communication and organizational skills',
        'Proficiency in MS Office applications',
        'Interest in corporate compliance and governance'
      ]
    },
    {
      title: 'MSDS Expert',
      urgent: false,
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Create and maintain Material Safety Data Sheets (MSDS) for chemical products. Ensure compliance with safety regulations and provide hazard information.',
      responsibilities: [
        'Create and update Material Safety Data Sheets',
        'Research chemical properties and hazards',
        'Ensure compliance with safety regulations',
        'Review and validate MSDS documentation',
        'Collaborate with product development teams',
        'Maintain MSDS database and records'
      ],
      qualifications: [
        'Degree in Chemistry, Chemical Engineering, or related field',
        '3-5 years of experience in MSDS preparation',
        'Knowledge of chemical safety regulations',
        'Understanding of hazard classification systems',
        'Strong research and analytical skills',
        'Attention to detail and accuracy'
      ]
    },
    {
      title: 'Import and Export Compliance Intern',
      urgent: false,
      type: 'Internship',
      experience: '0-1 year',
      description: 'Learn about import-export compliance, assist in documentation, and gain practical experience in international trade regulations.',
      responsibilities: [
        'Learn import-export compliance procedures',
        'Assist in preparing customs documentation',
        'Research trade regulations and requirements',
        'Support compliance monitoring activities',
        'Help maintain import-export records',
        'Learn about international trade practices'
      ],
      qualifications: [
        'Pursuing degree in Commerce, Business, or International Trade',
        'Basic knowledge of import-export processes',
        'Strong analytical and research skills',
        'Attention to detail and accuracy',
        'Good communication skills',
        'Interest in international business'
      ]
    },
    {
      title: 'CA Article',
      urgent: false,
      type: 'Article',
      experience: '0-1 year',
      description: 'Work as a Chartered Accountant article under qualified CA guidance. Learn auditing, taxation, and accounting practices through hands-on training.',
      responsibilities: [
        'Assist in auditing and accounting work',
        'Learn taxation and compliance procedures',
        'Prepare financial statements and reports',
        'Gain exposure to various business sectors',
        'Develop professional accounting skills',
        'Work under CA supervision and guidance'
      ],
      qualifications: [
        'Completed CA Foundation or Intermediate',
        'Pursuing CA Final course',
        'Strong mathematical and analytical skills',
        'Knowledge of accounting principles',
        'Attention to detail and accuracy',
        'Commitment to professional development'
      ]
    },
    {
      title: 'Content Writer Intern',
      urgent: false,
      type: 'Internship',
      experience: '0-1 year',
      description: 'Learn content writing skills, create engaging content, and gain experience in digital marketing and content creation.',
      responsibilities: [
        'Write articles and website content',
        'Create social media content',
        'Learn SEO and content marketing principles',
        'Research and fact-check information',
        'Edit and proofread content',
        'Collaborate with content and marketing teams'
      ],
      qualifications: [
        'Pursuing degree in English, Journalism, or Marketing',
        'Strong writing and communication skills',
        'Basic knowledge of SEO principles',
        'Creative thinking and research abilities',
        'Proficiency in MS Office and content tools',
        'Interest in digital marketing'
      ]
    },
    {
      title: 'BIS Consultant',
      urgent: false,
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Provide consultancy services for Bureau of Indian Standards (BIS) certification. Assist clients with product certification and compliance requirements.',
      responsibilities: [
        'Provide BIS certification consultancy',
        'Assist clients with product testing requirements',
        'Prepare and review certification documentation',
        'Ensure compliance with BIS standards',
        'Coordinate with testing laboratories',
        'Advise on product certification processes'
      ],
      qualifications: [
        'Degree in Engineering or related technical field',
        '3-5 years of experience in BIS certification',
        'Knowledge of BIS standards and procedures',
        'Understanding of product certification processes',
        'Strong client communication skills',
        'Technical writing and documentation abilities'
      ]
    },
    {
      title: 'EPR Consultant',
      urgent: false,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Provide Extended Producer Responsibility (EPR) consultancy services. Help businesses comply with EPR regulations for waste management and recycling.',
      responsibilities: [
        'Provide EPR compliance consultancy',
        'Develop waste management strategies',
        'Assist with EPR registration and reporting',
        'Ensure compliance with environmental regulations',
        'Prepare EPR documentation and plans',
        'Advise on sustainable waste management practices'
      ],
      qualifications: [
        'Degree in Environmental Science, Engineering, or related field',
        '2-4 years of experience in EPR compliance',
        'Knowledge of environmental regulations and EPR laws',
        'Understanding of waste management practices',
        'Strong analytical and problem-solving skills',
        'Client advisory and communication abilities'
      ]
    },
    {
      title: 'Business Development Executive',
      urgent: false,
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Drive business growth through client acquisition, relationship management, and market expansion. Identify opportunities and develop strategic partnerships.',
      responsibilities: [
        'Identify and pursue new business opportunities',
        'Develop and maintain client relationships',
        'Conduct market research and analysis',
        'Prepare proposals and presentations',
        'Achieve sales targets and revenue goals',
        'Collaborate with marketing and product teams'
      ],
      qualifications: [
        'Bachelor\'s degree in Business, Marketing, or related field',
        '2-4 years of business development experience',
        'Strong sales and negotiation skills',
        'Excellent communication and presentation abilities',
        'Understanding of market dynamics',
        'Relationship building and networking skills'
      ]
    },
    {
      title: 'Telecaller Executive',
      urgent: false,
      type: 'Full-time',
      experience: '1-2 years',
      description: 'Handle outbound calls to potential clients, promote services, generate leads, and maintain customer relationships through effective communication.',
      responsibilities: [
        'Make outbound calls to potential clients',
        'Promote company services and solutions',
        'Generate and qualify leads',
        'Maintain customer database and records',
        'Follow up on inquiries and convert leads',
        'Provide excellent customer service'
      ],
      qualifications: [
        'Bachelor\'s degree in any field',
        '1-2 years of telecalling or sales experience',
        'Excellent verbal communication skills',
        'Persuasive and confident speaking ability',
        'Strong listening and problem-solving skills',
        'Proficiency in CRM software and MS Office'
      ]
    }
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/jobs`).then((r) => r.json()).then((jobs) => {
      if (Array.isArray(jobs) && jobs.length > 0) {
        setJobOpenings(jobs.map((j) => ({
          title: j.title,
          urgent: j.urgent || false,
          type: j.type || 'Full-time',
          experience: j.experience || '',
          description: j.description || '',
          responsibilities: [],
          qualifications: []
        })));
      }
    }).catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const subject = `Job Application: ${formData.jobType}`;
      const message = `Name: ${formData.name}\nPhone: ${formData.phone}\nQualification: ${formData.qualification}\nExpected Salary: ${formData.expectedSalary}\nLinkedIn: ${formData.linkedin}\nMessage: ${formData.message}`;
      
      const data = new FormData();
      data.append('companyName', 'Careers');
      data.append('contactPerson', formData.name);
      data.append('email', formData.email);
      data.append('subject', subject);
      data.append('message', message);
      if (formData.resume) {
        data.append('file', formData.resume);
      }

      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        body: data
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitMessage('Thank you for your application! We will review your submission and get back to you soon.');
      setFormData({
        jobType: '',
        name: '',
        email: '',
        phone: '',
        qualification: '',
        message: '',
        linkedin: '',
        expectedSalary: '',
        resume: null
      });
    } catch {
      setSubmitMessage('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-(--bg-main)">
      {/* Top Blue Banner */}
      <div className="w-full bg-(--color-brand) py-2 px-4">
        <div className="container mx-auto text-center text-white text-[19px] md:text-[21px]">
          <p>We're hiring at <span className="font-bold">Mr.Pro</span>! Explore our current job openings and join our growing team.</p>
        </div>
      </div>
      
      {/* Hero Banner Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Join Our Team" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">Build your career with Mr.Pro and be part of something great</p>
            <a 
              href="#job-form" 
              className="bg-(--color-brand) hover:bg-(--color-brand-hover) text-white font-bold py-3 px-8 rounded-full text-[23px] md:text-xl transition-colors duration-300 inline-block"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
      
      {/* Career Section */}
      <section className="relative bg-(--bg-secondary) py-16 md:py-20 border-b border-(--border-color)">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4">
              Career at <span className="text-(--color-brand)">Mr.Professional</span>
            </h1>
            <div className="w-20 h-1 bg-(--color-brand) mx-auto mb-6"></div>
            <p className="text-[23px] text-(--text-secondary) max-w-3xl mx-auto">
              Join our team of experts and be part of a company that values innovation, excellence, and professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Career Growth Card */}
            <div className="bg-(--bg-main) rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-(--border-color)">
              <div className="bg-(--color-brand) w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">Career Growth</h3>
              <p className="text-(--text-secondary)">Opportunities for professional development and career advancement</p>
            </div>

            {/* Work-Life Balance Card */}
            <div className="bg-(--bg-main) rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-(--border-color)">
              <div className="bg-(--color-brand) w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">Work-Life Balance</h3>
              <p className="text-(--text-secondary)">Flexible working hours and supportive work environment</p>
            </div>

            {/* Learning Card */}
            <div className="bg-(--bg-main) rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-(--border-color)">
              <div className="bg-(--color-brand) w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">Continuous Learning</h3>
              <p className="text-(--text-secondary)">Regular training and skill development programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work at Professional Utilities */}
      <section className="py-20 bg-(--bg-main) border-b border-(--border-color)">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-(--text-primary) mb-4">
              Why Work at <span className="text-(--color-brand)">Mr Professional</span>
            </h2>
            <div className="w-20 h-1 bg-(--color-brand) mx-auto mb-6"></div>
            <p className="text-[23px] text-(--text-secondary) max-w-3xl mx-auto">
              Join our team and be part of a company that values innovation, collaboration, and professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Work Environment */}
            <div className="bg-(--bg-secondary) p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-(--border-color)">
              <div className="bg-(--color-brand) w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-(--text-primary) mb-3">Great Work Environment</h3>
              <p className="text-(--text-secondary) text-center">
                Enjoy a positive and collaborative workplace that encourages creativity and innovation.
              </p>
            </div>

            {/* Learning & Development */}
            <div className="bg-(--bg-secondary) p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-(--border-color)">
              <div className="bg-(--color-brand) w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-(--text-primary) mb-3">Learning & Development</h3>
              <p className="text-(--text-secondary) text-center">
                Access to training programs and workshops to enhance your skills and career growth.
              </p>
            </div>

            {/* Career Growth */}
            <div className="bg-(--bg-secondary) p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-(--border-color)">
              <div className="bg-(--color-brand) w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-(--text-primary) mb-3">Career Growth</h3>
              <p className="text-(--text-secondary) text-center">
                Clear career progression paths and opportunities for advancement within the company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Job Openings */}
      <section id="job-openings" className="py-16 bg-(--bg-secondary)">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-(--text-primary) mb-4">
              Current Job Openings
            </h2>
            <div className="w-20 h-1 bg-(--color-brand) mx-auto mb-6"></div>
            <p className="text-[23px] text-(--text-secondary) max-w-3xl mx-auto">
              Explore exciting career opportunities and join our growing team.
            </p>
          </div>
          <div className="space-y-6 max-w-5xl mx-auto">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-(--bg-main) rounded-lg shadow-md overflow-hidden border border-(--border-color)">
                {/* Job Header */}
                <button
                  onClick={() => setExpandedJob(expandedJob === index ? null : index)}
                  className="w-full text-left p-6 hover:bg-(--bg-hover) transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-(--bg-secondary) text-(--color-success) p-3 rounded-lg border border-(--border-color)">
                        <span className="text-2xl">💼</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-(--text-primary)">{job.title}</h3>
                          {job.urgent && (
                            <span className="bg-(--bg-secondary) text-(--color-danger) text-[17px] px-3 py-1 rounded-full font-bold border border-(--color-danger)">
                              Urgent Hiring
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-[19px] text-(--text-secondary)">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01M8 12h.01M12 12h.01M16 12h.01" />
                            </svg>
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.experience}
                          </span>
                          {job.salary && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <span className="text-(--text-secondary) text-2xl font-bold ml-4">
                        {expandedJob === index ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded Job Details */}
                {expandedJob === index && (
                  <div className="px-6 pb-8 border-t border-(--border-color)">
                    <div className="pt-6 space-y-8">
                      {/* Job Description */}
                      <div>
                        <h4 className="text-[23px] font-semibold text-(--text-primary) mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-(--color-brand)" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Job Description
                        </h4>
                        <p className="text-(--text-secondary) leading-relaxed pl-7">{job.description}</p>
                      </div>

                      {/* Key Responsibilities */}
                      <div>
                        <h4 className="text-[23px] font-semibold text-(--text-primary) mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-(--color-brand)" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-2 pl-7">
                          {job.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-(--color-brand) mr-2">•</span>
                              <span className="text-(--text-secondary)">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Qualifications */}
                      {job.qualifications && job.qualifications.length > 0 && (
                        <div>
                          <h4 className="text-[23px] font-semibold text-(--text-primary) mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-(--color-brand)" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Qualifications
                          </h4>
                          <ul className="space-y-2 pl-7">
                            {job.qualifications.map((qualification, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-(--color-brand) mr-2">•</span>
                                <span className="text-(--text-secondary)">{qualification}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Location & Working Days */}
                      {(job.location || job.workingDays) && (
                        <div className="bg-(--bg-main) p-4 rounded-lg border border-(--border-color)">
                          <h4 className="text-md font-semibold text-(--text-primary) mb-3">Job Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.location && (
                              <div className="flex items-start">
                                <svg className="w-5 h-5 text-(--color-brand) mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                  <p className="text-[19px] font-medium text-(--text-secondary)">Location</p>
                                  <p className="text-(--text-primary)">{job.location}</p>
                                </div>
                              </div>
                            )}
                            {job.workingDays && (
                              <div className="flex items-start">
                                <svg className="w-5 h-5 text-(--color-brand) mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                  <p className="text-[19px] font-medium text-(--text-secondary)">Working Days</p>
                                  <p className="text-(--text-primary)">{job.workingDays}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Apply Button */}
                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              jobType: job.title
                            }));
                            document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-(--color-brand) hover:bg-(--color-brand-hover) text-white font-medium py-2.5 px-6 rounded-md transition duration-300 flex items-center mx-auto"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Apply for {job.title}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Application Form */}
      <section id="job-form" className="py-16 bg-(--bg-main)">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-(--color-brand) mb-8 text-center">
            Apply for Job
          </h2>

          {submitMessage && (
            <div className="bg-green-900 border border-green-500 rounded-lg p-4 mb-8 text-center">
              <p className="text-green-400 font-semibold">{submitMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-(--bg-secondary) rounded-lg p-8 border border-(--border-color) shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Type */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  In-Office Job *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                >
                  <option value="">Select Position</option>
                  {jobOpenings.map((job, index) => (
                    <option key={index} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                />
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Com, MBA, CA, etc."
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                />
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Expected Salary *
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹3,00,000 per annum"
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                  required
                />
              </div>

              {/* LinkedIn Profile */}
              <div className="md:col-span-2">
                <label className="block text-(--text-primary) font-semibold mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us why you're interested in this position..."
                  rows="4"
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-brand) focus:border-transparent"
                ></textarea>
              </div>

              {/* Resume Upload */}
              <div className="md:col-span-2">
                <label className="block text-(--text-primary) font-semibold mb-2">
                  Upload Resume *
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full border border-(--border-color) rounded-lg p-3 bg-(--bg-main) text-(--text-primary) file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[19px] file:font-semibold file:bg-(--color-brand) file:text-white hover:file:bg-(--color-brand-hover)"
                  required
                />
                <p className="text-(--text-secondary) text-[19px] mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-(--color-brand) text-white px-12 py-3 rounded-lg font-semibold hover:bg-(--color-brand-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'APPLY NOW'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Why Professional Utilities? */}
      <div className="bg-(--bg-main)">
        <WhyCompanySection />
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Trusted By */}
      <div className="bg-(--bg-main)">
        <TrustedBy />
      </div>
    </div>
  );
};

export default Careers;

