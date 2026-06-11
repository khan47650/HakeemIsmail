import { useState } from "react";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Contact.css";
import { toast } from "react-toastify";

function Contact() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/contact-messages", formData);

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      toast.success("Message sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Message sending failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page-section">
      <SEO
        title="Contact Us | Hakeem Ismail"
        description="Contact Hakeem Ismail for herbal products, Unani treatment guidance, natural health consultation and product related queries."
        canonical="/contact"
      />
      <div className="container">
        <div className="lux-videos-header fade-up fade-up-delay-1">
          <h1 className="lux-videos-title">Contact Us</h1>
          <p className="lux-videos-subtitle">
            Get in touch with us for guidance, consultation, or any queries
            related to natural health and Unani treatment.
          </p>
          <div className="lux-videos-title-line"></div>
        </div>

        <div className="contact-card fade-up fade-up-delay-2">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="contact-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="all-products-buy-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;