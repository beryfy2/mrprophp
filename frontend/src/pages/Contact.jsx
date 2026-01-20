import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

library.add(fas);

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        subject: "",
        message: ""
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append("contactPerson", formData.name);
        data.append("email", formData.email);
        data.append("subject", formData.subject);
        data.append("message", `${formData.message}\n\nMobile: ${formData.mobile}`);
        data.append("companyName", "Website Visitor");
        if (file) {
            data.append("file", file);
        }

        try {
            const res = await fetch((import.meta.env.VITE_API_BASE || "http://localhost:5000/api") + "/enquiries", {
                method: "POST",
                body: data
            });
            if (res.ok) {
                alert("Enquiry sent successfully!");
                setFormData({ name: "", mobile: "", email: "", subject: "", message: "" });
                setFile(null);
            } else {
                alert("Failed to send enquiry.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending enquiry.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow">
                <section id="contact" className="bg-[var(--bg-secondary)] py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                        Contact Us
                    </h2>
                    <div className="w-20 h-1 bg-[var(--color-brand)] mx-auto mt-3 rounded-full" />
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8">
                    {/* LEFT: Info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address */}
                        <InfoCard
                            icon={['fas', 'location-dot']}
                            title="Our Address"
                            lines={[
                                "SF-1, Reliable City Center, Sector-6, Vasundhara",
                                "Ghaziabad, Uttar Pradesh, India – 201014",
                            ]}
                        />

                        {/* Working hours */}
                        <InfoCard
                            icon={['fas', 'clock']}
                            title="Working Hours"
                            lines={["Monday - Saturday", "9 AM - 6:30 PM (IST)"]}
                        />

                        {/* Email */}
                        <InfoCard
                            icon={['fas', 'envelope']}
                            title="Email Us"
                            lines={["info@mrprofessional.co.in"]}
                        />

                        {/* Call */}
                        <InfoCard
                            icon={['fas', 'phone']}
                            title="Call Us"
                            lines={["+918800932090","+919415718705"]}
                        />
                    </div>

                    {/* Form */}
                    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl p-8 md:p-12 border border-[var(--border-color)]">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-brand)] mb-2">
                                Get Expert Assistance
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Fill out the form below and our team will get back to you shortly.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-[19px] font-medium text-[var(--text-primary)] mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-[19px] font-medium text-[var(--text-primary)] mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="xxxxxxxxxx"
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-[19px] font-medium text-[var(--text-primary)] mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-[19px] font-medium text-[var(--text-primary)] mb-1">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[#131B2E] text-white focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition"

 

                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Tax Consultation">Tax Consultation</option>
                                        <option value="Legal Services">Legal Services</option>
                                        <option value="Partnership">Partnership</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-[19px] font-medium text-[var(--text-primary)] mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="How can we help you?"
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="mt-2 inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-semibold px-8 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,200,0,0.35)] transition"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

const InfoCard = ({ icon, title, lines }) => (
    <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded shadow-lg px-8 py-8 flex flex-col items-center text-center">
        <div className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={icon} className="text-white text-[23px]" />
        </div>
        <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h4>
        {lines.map((line, idx) => (
            <p key={idx} className="text-[19px] text-[var(--text-secondary)]">
                {line}
            </p>
        ))}
    </div>
);

export default ContactSection;

