import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaTiktok
} from 'react-icons/fa'
import '../css/Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">Hakeem Ismail</h3>
            <p className="footer-text">
              Natural herbal remedies, wellness guidance, and traditional healing
              products designed to support a healthier lifestyle.
            </p>
          </div>

          <div className="footer-contact">
            <h4 className="footer-title">Contact Info</h4>

            <a href="mailto:islamiccenter0007@gmail.com" className="footer-contact-item">
              <span className="contact-icon"><FaEnvelope /></span>
              <span>islamiccenter0007@gmail.com</span>
            </a>

            <a href="tel:+923100671066" className="footer-contact-item">
              <span className="contact-icon"><FaPhoneAlt /></span>
              <span>+92 310 0671066</span>
            </a>

            <a href="tel:+923425880448" className="footer-contact-item">
              <span className="contact-icon"><FaPhoneAlt /></span>
              <span>+92 342 5880448</span>
            </a>
          </div>

          <div className="footer-social-area">
            <h4 className="footer-title">Follow Us</h4>

            <div className="footer-social">
              <a
                href="https://www.facebook.com/HakeemIsmailofficial"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.youtube.com/@Hakeem_Ismail"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>

              <a
                href="#"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>

              <a
                href="https://www.instagram.com/hakeem_muhammad_ismail/"
                className="social-icon"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

           
            </div>

            <a
              href="https://wa.me/923054800448"
              className="footer-whatsapp"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
              <span>WhatsApp: +92 305 4800448</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Hakeem Ismail. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer