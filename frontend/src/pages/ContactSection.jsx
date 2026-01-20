import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

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
        <section id="contact" className="bg-[var(--bg-main)] py-16">
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
                    <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded shadow-lg p-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Get Expert Assistance
                        </h3>
                        <div className="w-20 h-[3px] bg-[var(--color-brand)] mb-6" />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name + Mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[19px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile No."
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[19px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[19px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                                required
                            />

                            {/* Subject */}
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[19px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                                required
                            />

                            {/* Message */}
                            <textarea
                                rows={4}
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[19px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
                            />

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="mt-2 inline-flex items-center justify-center bg-[var(--color-brand)] hover:opacity-90 text-white font-semibold px-8 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,200,0,0.35)] transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
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

