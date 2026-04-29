import "../css/Contact.css"

function Contact() {
  return (
    <section className="contact-page-section">
      <div className="container">

        {/* HEADER */}
        <div className="lux-videos-header fade-up fade-up-delay-1">
          <h1 className="lux-videos-title">Contact Us</h1>
          <p className="lux-videos-subtitle">
            Get in touch with us for guidance, consultation, or any queries
            related to natural health and Unani treatment.
          </p>
          <div className="lux-videos-title-line"></div>
        </div>

        {/* FORM CARD */}
        <div className="contact-card fade-up fade-up-delay-2">
          <form className="contact-form">

            <div className="contact-field">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>

            <div className="contact-field">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea rows="5" placeholder="Write your message..." />
            </div>

            <button type="submit" className="all-products-buy-btn">
              Send Message
            </button>

          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact;