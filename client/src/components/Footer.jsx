import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaTiktok,
  FaArrowRight
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import '../css/Footer.css'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* LEFT: Brand with Logo */}
          <div className="footer-brand">
            <div className="footer-logo-area">
              <img
                src="/logo.png"
                alt="Hakeem Ismail Logo"
                className="footer-logo-img"
              />
              <h3 className="footer-logo">Hakeem Ismail</h3>
            </div>

            <p className="footer-text">
              Natural herbal remedies, wellness guidance, and traditional healing
              products designed to support a healthier lifestyle.
            </p>

            <div className="footer-social">
              <a href="https://www.facebook.com/HakeemIsmailofficial"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a href="https://www.youtube.com/@Hakeem_Ismail"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>

              <a href="#"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>

              <a href="https://www.instagram.com/hakeem_muhammad_ismail/"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* MIDDLE-LEFT: Quick Links */}
          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>

            <ul className="footer-links-list">
              <li>
                <a onClick={() => navigate('/about')}>
                  <FaArrowRight /> About Us
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/contact')}>
                  <FaArrowRight /> Contact Us
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/delivery')}>
                  <FaArrowRight /> Delivery Info
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/clinic')}>
                  <FaArrowRight /> Our Clinic
                </a>
              </li>
            </ul>
          </div>

          {/* MIDDLE-RIGHT: Categories */}
          <div className="footer-categories">
            <h4 className="footer-title">Categories</h4>

            <ul className="footer-links-list">
              <li>
                <a onClick={() => navigate('/products')}>
                  <FaArrowRight /> Popular Products
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/articles')}>
                  <FaArrowRight /> Health Articles
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/videos')}>
                  <FaArrowRight /> Videos
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/shorts')}>
                  <FaArrowRight /> Shorts
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT: Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-title">Contact Info</h4>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="contact-icon"><FaEnvelope /></span>
                <div>
                  <small>Email</small>
                  <p>
                    <a href="mailto:Hakeemismail266@Gmail.com">
                      Hakeemismail266@Gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="footer-contact-item">
                <span className="contact-icon"><FaPhoneAlt /></span>
                <div>
                  <small>Helpline</small>
                  <p>
                    <a href="tel:+923054800448">+92 305 4800448</a>
                  </p>
                </div>
              </div>

              <div className="footer-contact-item">
                <span className="contact-icon"><FaWhatsapp /></span>
                <div>
                  <small>Working Hours</small>
                  <p>Mon - Sat: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Hakeem Ismail. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer