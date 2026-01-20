import React, { useState, useEffect } from 'react'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import '../style/aboutUs.css'
import '../style/team.css'
import AnimatedShapes from '../components/AnimatedShapes'
import ValueCard from '../components/ValueCard'
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const IMG_BASE = API_BASE.replace('/api', '');

export default function AboutUs() {
  console.log('AboutUs component mounted')

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/employees`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      })
      .catch(err => console.error('Failed to load employees', err));
  }, []);

  const handlePlayWhoWeAre = () => {
    // Stop any existing speech
    window.speechSynthesis.cancel();

    const text = `
    Who We Are.

    Mr.Professional is a professional services firm started by M/s Aaramo Private Limited, 
backed by a team of Chartered Accountants, Company Secretaries, Cost Accountants, 
Advocates, and IIM-trained professionals. 
The firm provides personalized services across India in tax preparation, accounting, 
business setup, startup registration, licensing, compliance, legal support, tax planning and 
management, payroll and labour law services, and protection and enforcement of 
Intellectual Property Rights (IPR). 
Mr.Professional describes itself as a young and energetic team focused on supporting 
entrepreneurs and strengthening the Indian startup ecosystem.
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.lang === 'en-IN' || voice.lang === 'en-US'
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice; 
    }

    window.speechSynthesis.speak(utterance);
  };

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice('');
    if (!formData.name || !formData.email || !formData.mobile) {
      setNotice('Please fill required fields');
      return;
    }
    const data = new FormData();
    data.append('contactPerson', formData.name);
    data.append('email', formData.email);
    data.append('subject', 'About Us Contact Form');
    data.append('message', `${formData.message}\n\nMobile: ${formData.mobile}`);
    data.append('companyName', 'Website Visitor');
    try {
      setSending(true);
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        body: data
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error((body && (body.error || body.message)) || 'Failed to submit');
      }
      setNotice('Enquiry sent successfully!');
      setFormData({ name: '', mobile: '', email: '', message: '' });
    } catch (err) {
      const msg = typeof err === 'object' && err && 'message' in err ? String(err.message) : 'Error sending enquiry';
      setNotice(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <NavBar />

      <header className="about-hero">
        {/* Animated background shapes (pure-CSS + optional JS-generated shapes) */}
        <AnimatedShapes count={7} />
        <div className="about-hero-inner">
          <div className="about-hero-left">
            <h1>Mr.Professional</h1>
            <p className="subtitle">Your one-stop shop for professional services in India</p>
          </div>

          <div className="about-hero-right">
            <div className="card">
              <h3>Come work with us</h3>
              <p>We are an organisation of young & vibrant professionals, looking for candidates who are passionate about India's growth.</p>
            </div>
          </div>

          {/* Floating circles animation elements */}
          <div className="float-wrap">
            <span className="float f1" />
            <span className="float f2" />
            <span className="float f3" />
            <span className="float f4" />
            <span className="float f5" />
          </div>
        </div>
      </header>

      <main className="bg-(--bg-main) text-(--text-primary) py-12 px-7 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto">
          <section className="who-we-are">
            <div className="who-inner">
              <div className="who-left">
                <h2>Who We Are</h2>
                <div className="who-underline" />

                <p className="who-paragraph">
                  Mr Professional is the advisor, guide, and facilitator to entrepreneurs
                  looking to start and manage a business in India. We handhold startups from
                  day one and at every step throughout their entrepreneurship journey.
                </p>

                <p className="who-paragraph" style={{ marginTop: 28 }}>
                  The firm provides personalized services across India in tax preparation, accounting,
                  business setup, startup registration, licensing, compliance, legal support, tax planning,
                  payroll and labour law services, and Intellectual Property Rights (IPR) protection.
                </p>
              </div>

              <div className="who-right">
                <img
                  className="who-image max-w-full h-auto"
                  src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0c3b9d8b9e6f5b1d3f8c6a2c8a2b9f1a"
                  alt="Team"
                />
              </div>
            </div>

            <button
  className="play-circle"
  onClick={handlePlayWhoWeAre}
  aria-label="Play Who We Are Audio"
>

              <span className="play-triangle" />
            </button>
          </section>
          {/* Stats / Key numbers section */}
          <section className="stats-section mt-12">
            <div className="max-w-[1200px] mx-auto">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">4K+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">250+</div>
                  <div className="stat-label">Professional Services</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">5 Star Reviews</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">20K+</div>
                  <div className="stat-label">Questions Solved</div>
                </div>
              </div>
            </div>
          </section>

          {/* Values / Core principles section */}
          <section className="values-section">
            <div className="aboutus-container">
              <h2 className="values-heading">The core values and principles that drive us</h2>
              <div className="who-underline" style={{ marginLeft: 0, marginTop: 8 }} />

              <div className="values-grid">
                <ValueCard icon={<svg viewBox="0 0 64 64" width="48" height="48" fill="currentColor" aria-hidden><path d="M8 20c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4h-8c-2.2 0-4-1.8-4-4v-4z" opacity="0.8"/><path d="M44 20c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4h-8c-2.2 0-4-1.8-4-4v-4z" opacity="0.8"/><path d="M24 24h16v20H24z" opacity="0.6"/></svg>} title="Long-Term Commitment">
                  Years of running a profitable organization gives us a good sense of challenges that a growing business faces. We take pride
                  in running a sustainable business that’s powered by you, our client.
                </ValueCard>

                <ValueCard icon={<svg viewBox="0 0 64 64" width="48" height="48" fill="currentColor" aria-hidden><circle cx="32" cy="18" r="6" opacity="0.8"/><path d="M24 28c-3.3 0-6 2.7-6 6v12h36V34c0-3.3-2.7-6-6-6h-24z" opacity="0.8"/></svg>} title="Client-First Philosophy">
                  In all these years, it's our client's trust and goodwill that has helped us establish a strong position in the market. No matter
                  the size of your business, we're here to help you grow.
                </ValueCard>

                <ValueCard icon={<svg viewBox="0 0 64 64" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg>} title="Empowering Entrepreneurship">
                  India has the 3rd largest startup ecosystem in the world and our vision is to make India the most startup-friendly country. We
                  believe entrepreneurship has the power to solve problems of society at large.
                </ValueCard>
              </div>
            </div>
          </section>

          {/* Meet The Team Section */}
<section className="team-section">
  <div className="team-container">
    <div className="team-left">
      <h2 className="team-heading">Meet The Mr Professional Team</h2>
      <div className="who-underline" />

      <p className="team-text">
        Our highly skilled professionals are people who personify the very qualities
        that have made us successful.
      </p>

      <p className="team-text">
        Mr Professional is transforming the way to start and manage a business
        by simplifying business laws for entrepreneurs. Our experts, specializing
        across tax, accounting and compliances, handhold entrepreneurs throughout
        their journey right from business registration to complying with business laws.
      </p>

      <div className="team-buttons">
          <Link to="/team">
        <button className="btn-green">MEET OUR TEAM</button>
        </Link>
          <Link to="/partners-signup">
        <button className="btn-blue">JOIN OUR TEAM</button>
        </Link>
      </div>
    </div>

    <div className="team-right">
      <div className="team-grid">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <div className="team-card" key={emp._id}>
              <img 
                src={emp.photoUrl ? `${IMG_BASE}${emp.photoUrl}` : 'https://via.placeholder.com/300?text=No+Image'} 
                alt={emp.name}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))
        ) : (
          <div className="team-card">
              <p style={{ padding: 20 }}>Loading team...</p>
          </div>
        )}
      </div>
    </div>
  </div>
</section>

      {/* Contact Us Section */}
      <section className="contact-section">
  <div className="contact-container">

    <h2 className="contact-title">
      Contact Us
      <span className="contact-underline" />
    </h2>

    <div className="contact-grid">

      {/* Left cards */}
      <div className="contact-cards">

        <div className="contact-card">
          <div className="contact-icon green">📍</div>
          <h4>Our Address</h4>
          <p>
            SF-1, Reliable City Center, Sector-6, Vasundhara<br />
            Ghaziabad, Uttar Pradesh, India – 201014 
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-icon green">⏰</div>
          <h4>Working Hours</h4>
          <p>
            Monday - Saturday<br />
            9 AM - 6:30 PM (IST)
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-icon green">✉️</div>
          <h4>Email Us</h4>
          <p>info@mrprofessional.co.in</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon green">📞</div>
          <h4>Call Us</h4>
          <p>+918800932090</p>
          <p>+919415718705</p>
        </div>

      </div>

      {/* Right form */}
      <div className="contact-form">
        <h3>
          Get Expert Assistance
          <span className="contact-underline left" />
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile No."
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn" disabled={sending}>
            {sending ? 'Submitting...' : 'SUBMIT'}
          </button>
          {notice && <p className="mt-2">{notice}</p>}
        </form>
      </div>

    </div>
  </div>
</section>




        </div>
      </main>

      <Footer />
    </div>
    
  )
}

