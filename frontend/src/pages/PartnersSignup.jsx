import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/PartnersSignup.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEnvelope, 
    faPhone, 
    faMapMarkerAlt, 
    faCheck,
    faUserTie,
    faUpload,
    faFileAlt,
    faGlobe,
    faChartLine,
    faStar
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const PartnersSignup = () => {
    const activeTab = 'individual';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profession: '',
        companyName: '',
        designation: '',
        city: '',
        state: '',
        experience: '',
        qualification: '',
        message: '',
        document: null
    });
    const [formErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [notice, setNotice] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotice('');
        if (!formData.name || !formData.email || !formData.phone) {
            setNotice('Please fill required fields');
            return;
        }
        const form = new FormData();
        form.append('companyName', formData.companyName || 'Partnership Proposal');
        form.append('contactPerson', formData.name);
        form.append('email', formData.email);
        form.append('subject', 'Get Proposal Request');
        const msg = [
            `Phone: ${formData.phone}`,
            formData.city ? `City: ${formData.city}` : '',
            formData.state ? `State: ${formData.state}` : '',
            formData.profession ? `Profession: ${formData.profession}` : '',
            formData.designation ? `Designation: ${formData.designation}` : '',
            formData.experience ? `Experience: ${formData.experience}` : '',
            formData.qualification ? `Qualification: ${formData.qualification}` : '',
            formData.message ? `Message: ${formData.message}` : ''
        ].filter(Boolean).join('\n');
        form.append('message', msg || 'Partnership proposal enquiry');
        if (formData.document) {
            form.append('file', formData.document);
        }
        try {
            setSending(true);
            const res = await fetch(`${API_BASE}/enquiries`, { method: 'POST', body: form });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error((data && (data.error || data.message)) || 'Failed to submit');
            }
            setNotice('Proposal request submitted');
            setFormData(prev => ({ ...prev, message: '', document: null }));
        } catch (err) {
            const msgText = typeof err === 'object' && err && 'message' in err ? String(err.message) : 'Failed to submit';
            setNotice(msgText);
        } finally {
            setSending(false);
        }
    };

    const renderFormField = (label, name, type = 'text', required = true, icon = null, options = []) => (
        <div className="mb-6">
            <label className="block text-[var(--text-secondary)] text-[19px] font-semibold mb-2 uppercase tracking-wider">
                {label} {required && <span className="text-[var(--color-danger)]">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={icon} className="h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                )}
                {type === 'select' ? (
                    <select
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[var(--bg-main)] text-[var(--text-primary)] border ${formErrors[name] ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition duration-200 ${icon ? 'pl-12' : ''} hover:border-[var(--color-brand)]`}
                        required={required}
                    >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : type === 'file' ? (
                    <div className="flex items-center">
                        <label className="flex flex-col items-center px-4 py-2 bg-[var(--bg-main)] text-[var(--color-brand)] rounded-lg tracking-wide uppercase border border-[var(--color-brand)] cursor-pointer hover:bg-[var(--bg-secondary)]">
                            <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
                            <span className="text-[17px]">Choose File</span>
                            <input 
                                type="file" 
                                name={name}
                                className="hidden" 
                                onChange={handleChange}
                                accept=".pdf,.doc,.docx"
                            />
                        </label>
                        {formData[name] && (
                            <span className="ml-2 text-[19px] text-[var(--text-secondary)]">
                                <FontAwesomeIcon icon={faFileAlt} className="mr-1" />
                                {formData[name].name}
                            </span>
                        )}
                    </div>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[var(--bg-main)] text-[var(--text-primary)] border ${formErrors[name] ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition duration-200 ${icon ? 'pl-12' : ''} hover:border-[var(--color-brand)]`}
                        required={required}
                    />
                )}
                {formErrors[name] && (
                    <p className="mt-1 text-[19px] text-[var(--color-danger)]">{formErrors[name]}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)]">
            <NavBar />
          {/* ================= HERO SECTION ================= */}
<section className="partner-hero">
  <div className="partner-hero-overlay"></div>

  <div className="partner-hero-container">
    {/* LEFT CONTENT */}
    <div className="partner-hero-content">
      <h1>Let’s Partner Up!</h1>

      <p className="partner-hero-subtitle">
        Become our partner and drive your business to the next level.
      </p>

      <div className="partner-rating">
        <FontAwesomeIcon icon={faGoogle} className="google-icon" />
        <span className="rating-text">
          Google Customer Rating <strong>4.7</strong>
        </span>
        <div className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} />
          ))}
        </div>
      </div>
    </div>
    </div>
</section>


            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg overflow-hidden border border-[var(--border-color)]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Sidebar */}
                        <div className="lg:w-1/3 p-6">
                            {/* Services */}
                            <div className="bg-[var(--bg-main)] rounded-lg shadow-md p-6 mb-6 border border-[var(--border-color)]">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Our Services</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                                        <div className="flex-shrink-0 bg-[var(--bg-main)] p-3 rounded-full border border-[var(--border-color)]">
                                            <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5 text-[var(--color-brand)]" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-[23px] font-semibold text-[var(--text-primary)]">Legal</h4>
                                            <p className="mt-1 text-[var(--text-secondary)]">Expert legal services for all your business needs</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                                        <div className="flex-shrink-0 bg-[var(--bg-main)] p-3 rounded-full border border-[var(--border-color)]">
                                            <FontAwesomeIcon icon={faGlobe} className="h-5 w-5 text-[var(--color-brand)]" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-[23px] font-semibold text-[var(--text-primary)]">Digital Presence</h4>
                                            <p className="mt-1 text-[var(--text-secondary)]">Enhance your online visibility and reach</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                                        <div className="flex-shrink-0 bg-blue-900/20 p-3 rounded-full">
                                            <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-[var(--color-brand)]" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-[23px] font-semibold text-[var(--text-primary)]">Fundraising</h4>
                                            <p className="mt-1 text-[var(--text-secondary)]">Strategic financial solutions for growth</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Why Partner With Us */}
                            <div className="bg-[var(--bg-main)] rounded-lg shadow-md p-6 border border-[var(--border-color)]">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Why Partner With Us?</h3>
                                
                                <ul className="space-y-3">
                                    {[
                                        'Access to a wide network of clients',
                                        'Competitive commission structure',
                                        'Dedicated relationship manager',
                                        'Marketing and operational support',
                                        'Regular training and updates',
                                        'Quick resolution of queries'
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-4 w-4 bg-blue-900/20 rounded-full flex items-center justify-center mr-2">
                                                    <FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5 text-[var(--color-brand)]" />
                                                </div>
                                            </div>
                                            <span className="text-[19px] text-[var(--text-secondary)]">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-[var(--bg-main)] p-2 rounded-full mr-3">
                                            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-[var(--color-brand)]" />
                                        </div>
                                        <div>
                                            <p className="text-[19px] font-medium text-[var(--text-primary)]">Google Partner</p>
                                            <p className="text-[17px] text-[var(--text-secondary)]">Certified Company</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="lg:w-2/3 p-6">
                            <div className="bg-[var(--bg-main)] rounded-lg shadow-md overflow-hidden p-8 border border-[var(--border-color)]">
                                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Become a Partner</h2>
                                <p className="text-[var(--text-secondary)] mb-8">Fill out the form below and we'll get back to you soon</p>

                                {/* Form */}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                        {activeTab === 'individual' ? 'Individual Professional' : 'Company / CA Firm'} Registration
                                    </h2>
                                    
                                    <form id="partner-form" onSubmit={handleSubmit}>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {renderFormField('Full Name', 'name', 'text', true, faUserTie)}
                                                {renderFormField('Email', 'email', 'email', true, faEnvelope)}
                                                {renderFormField('Mobile No.', 'phone', 'tel', true, faPhone)}
                                                {renderFormField('Select City', 'city', 'select', true, faMapMarkerAlt, [
                                                    { value: 'delhi', label: 'Delhi' },
                                                    { value: 'mumbai', label: 'Mumbai' },
                                                    { value: 'bangalore', label: 'Bangalore' },
                                                    { value: 'hyderabad', label: 'Hyderabad' },
                                                    { value: 'chennai', label: 'Chennai' },
                                                    { value: 'kolkata', label: 'Kolkata' },
                                                    { value: 'pune', label: 'Pune' },
                                                    { value: 'ahmedabad', label: 'Ahmedabad' },
                                                    { value: 'other', label: 'Other' }
                                                ])}
                                                {renderFormField('Select your Occupation', 'occupation', 'select', true, faUserTie, [
                                                    { value: 'ca', label: 'Chartered Accountant' },
                                                    { value: 'cs', label: 'Company Secretary' },
                                                    { value: 'lawyer', label: 'Lawyer' },
                                                    { value: 'cfo', label: 'CFO' },
                                                    { value: 'business_owner', label: 'Business Owner' },
                                                    { value: 'other', label: 'Other Professional' }
                                                ])}
                                            </div>
                                            
                                            {renderFormField('Help in Area', 'expertise', 'select', true, faStar, [
                                                { value: 'taxation', label: 'Taxation' },
                                                { value: 'audit', label: 'Audit & Assurance' },
                                                { value: 'company_law', label: 'Company Law' },
                                                { value: 'corporate_finance', label: 'Corporate Finance' },
                                                { value: 'startup_consulting', label: 'Startup Consulting' },
                                                { value: 'ipr', label: 'Intellectual Property Rights' },
                                                { value: 'gst', label: 'GST' },
                                                { value: 'other', label: 'Other' }
                                            ])}
                                            
                                            <div className="mb-4">
                                                <label className="block text-[var(--text-secondary)] text-[19px] font-medium mb-1">
                                                    Message <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    rows="4"
                                                    className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                                                    placeholder="Tell us about your requirements..."
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                disabled={sending}
                                                className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] disabled:bg-opacity-50 text-white font-semibold py-4 px-6 rounded-md text-[23px] transition duration-200 flex items-center justify-center"
                                            >
                                                {sending ? 'Submitting...' : 'GET PROPOSAL'}
                                            </button>
                                            {notice && <div className="text-center text-[19px] mt-3 text-[var(--text-primary)]">{notice}</div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-[var(--bg-secondary)] py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">What Our Partners Say</h2>
                        <div className="w-20 h-1 bg-[var(--color-brand)] mx-auto mt-4"></div>
                    </div>

                    {/* Testimonial Carousel Placeholder */}
                    <div className="max-w-4xl mx-auto bg-[var(--bg-secondary)] p-8 rounded-lg shadow-md border border-[var(--border-color)]">
                        <div className="text-center">
                            <div className="text-yellow-400 text-4xl mb-4">"</div>
                            <p className="text-[23px] text-white italic mb-6">
                                Partnering with Mr Professional has been a game-changer for my practice. 
                                Their support and resources have helped me serve my clients better and grow my business.
                            </p>
                            <div className="font-semibold text-white">Rahul Sharma</div>
                            <div className="text-[19px] text-white">Chartered Accountant, Mumbai</div>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* Footer */}
            <div className="bg-gray-900 text-white">
                <Footer />
            </div>
        </div>
    );
};

export default PartnersSignup;

