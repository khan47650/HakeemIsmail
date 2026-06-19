import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
    FaTruck,
    FaClipboardCheck,
    FaClock,
    FaBoxOpen,
    FaMapMarkedAlt,
    FaHeadset,
} from "react-icons/fa";
import SEO from "../components/SEO";
import "../css/InfoPage.css";

function DeliveryInfo() {
    const navigate = useNavigate();

    return (
        <main className="info-page">
            <SEO
                title="Pakistan Delivery | Hakeem Ismail"
                description="Nationwide herbal product delivery across Pakistan with cash on delivery, safe packaging and fast dispatch."
                canonical="/delivery"
            />

            <button className="info-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="info-hero page-reveal">
                <div className="info-hero-inner">
                    <span className="info-badge">
                        <FaTruck /> Nationwide Delivery
                    </span>

                    <h1 className="info-title-en">Delivery Across Pakistan</h1>
                    <p className="info-subtitle-en">
                        We deliver pure herbal products right to your doorstep anywhere in
                        Pakistan — safely, reliably, and on time.
                    </p>

                    <div className="info-divider"></div>

                    <div className="info-feature-grid">
                        <div className="info-feature-card">
                            <FaMapMarkedAlt />
                            <h3>All Over Pakistan</h3>
                            <p>
                                From major cities to remote towns, we ship to every corner of
                                the country through trusted courier partners.
                            </p>
                        </div>

                        <div className="info-feature-card">
                            <FaClipboardCheck />
                            <h3>Confirmed Orders</h3>
                            <p>
                                Every order is personally confirmed with you on WhatsApp before
                                dispatch, so the right product always reaches the right address.
                            </p>
                        </div>

                        <div className="info-feature-card">
                            <FaClock />
                            <h3>Fast Dispatch</h3>
                            <p>
                                Orders are processed within 24 hours and usually delivered in
                                2–4 working days.
                            </p>
                        </div>

                        <div className="info-feature-card">
                            <FaBoxOpen />
                            <h3>Safe Packaging</h3>
                            <p>
                                Every product is sealed and carefully packed so it reaches you
                                fresh and intact.
                            </p>
                        </div>

                        <div className="info-feature-card">
                            <FaHeadset />
                            <h3>Order Support</h3>
                            <p>
                                Place and track your order easily on WhatsApp with direct
                                support from our team.
                            </p>
                        </div>

                        <div className="info-feature-card">
                            <FaTruck />
                            <h3>Transparent Charges</h3>
                            <p>
                                Delivery charges are shared upfront based on your location — no
                                hidden costs, ever.
                            </p>
                        </div>
                    </div>

                    <div className="info-note">
                        <strong>How to order:</strong> Browse our products, tap “Buy”, and
                        confirm your order on WhatsApp. We’ll arrange delivery to your
                        address right away.
                    </div>
                </div>
            </section>
        </main>
    );
}

export default DeliveryInfo;