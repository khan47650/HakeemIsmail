import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaShieldAlt, FaCheckCircle, FaFileContract, FaUserMd } from "react-icons/fa";
import SEO from "../components/SEO";
import "../css/InfoPage.css";

function RegisteredClinic() {
    const navigate = useNavigate();

    return (
        <main className="info-page">
            <SEO
                title="رجسٹرڈ کلینک | Hakeem Ismail"
                description="Hakeem Ismail ka registered aur verified Unani clinic — qabil-e-aitemaad aur mayari tibbi khidmat."
                canonical="/clinic"
            />

            <button className="info-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="info-hero info-rtl urdu-font page-reveal">
                <div className="info-hero-inner">
                    <span className="info-badge">
                        <FaShieldAlt /> تصدیق شدہ
                    </span>

                    <h1 className="info-title">رجسٹرڈ اور تصدیق شدہ کلینک</h1>
                    <p className="info-subtitle">قابلِ اعتماد اور معیاری طبی خدمات</p>

                    <div className="info-divider"></div>

                    <div className="info-stats">
                        <div className="info-stat-card">
                            <span className="info-stat-label">رجسٹریشن نمبر</span>
                            <strong className="info-stat-value" dir="ltr">QH-47258-A</strong>
                        </div>

                        <div className="info-stat-card">
                            <span className="info-stat-label">PL کوڈ</span>
                            <strong className="info-stat-value" dir="ltr">PL-83571</strong>
                        </div>
                    </div>

                    <p className="info-paragraph">
                        یہ کلینک متعلقہ ضوابط کے مطابق رجسٹرڈ اور تصدیق شدہ ہے، اور مریضوں کو
                        معیاری اور قابلِ اعتماد طبی خدمات فراہم کرنے کے لیے پُرعزم ہے۔
                    </p>

                    <div className="info-points">
                        <div className="info-point">
                            <FaCheckCircle />
                            <span>سرکاری ضوابط کے مطابق مکمل رجسٹرڈ</span>
                        </div>

                        <div className="info-point">
                            <FaFileContract />
                            <span>تصدیق شدہ رجسٹریشن دستاویزات</span>
                        </div>

                        <div className="info-point">
                            <FaUserMd />
                            <span>ماہر اور تجربہ کار طبی رہنمائی</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default RegisteredClinic;