// About.jsx — sirf Urdu content section update karo
import SEO from "../components/SEO";
import { FaUserMd, FaShieldAlt, FaLeaf } from "react-icons/fa";
import "../css/About.css";

function About() {
  return (
    <section className="about-page">
      <SEO
        title="About Hakeem Muhammad Ismail | Unani Medicine & Herbal Expertise"
        description="Learn about Hakeem Muhammad Ismail, his 15 years of experience in Unani medicine, natural healing, herbal remedies and commitment to improving lives through authentic treatment."
        canonical="/about"
      />

      <div className="container">
        <div className="about-head fade-up fade-up-delay-1">
          <h1 className="about-head-title">About Us</h1>
          <div className="about-head-line"></div>
        </div>

        {/* URDU CONTENT — Single Premium Article */}
        <article className="about-urdu-article urdu-font fade-up fade-up-delay-3">
          <h2 className="about-urdu-main-title">تعارف: حکیم محمد اسماعیل</h2>

          <div className="about-urdu-body">

            <section className="about-urdu-section">
              <h3 className="about-urdu-section-title">خاندانی روایت اور ذاتی جذبہ</h3>
              <p className="about-urdu-section-text">
                حکمت اور طبِ یونانی سے وابستگی جہاں <strong>حکیم محمد اسماعیل</strong>{" "}
                کو وراثت میں ملی، وہیں اس شعبے میں ان کا ذاتی شوق اور انسانیت کی
                خدمت کا جذبہ ان کی اصل پہچان بنا۔ انہوں نے روایتی حکمت کو جدید
                تقاضوں کے مطابق ڈھالنے کے لیے باقاعدہ تعلیم{" "}
                <strong>فیصل آباد طبیہ کالج</strong> سے حاصل کی، تاکہ وہ علم اور
                تجربے کے حسین امتزاج سے لوگوں کا بہتر علاج کر سکیں۔
              </p>
            </section>

            <section className="about-urdu-section">
              <h3 className="about-urdu-section-title">15 سالہ تجربہ اور علمی مہارت</h3>
              <p className="about-urdu-section-text">
                گزشتہ <strong>15 سالوں</strong> سے آپ طب کے شعبے میں اپنی خدمات
                سرانجام دے رہے ہیں۔ حکیم صاحب کا ماننا ہے کہ درست علاج کی بنیاد
                <strong> "درست تشخیص" </strong>
                پر ہوتی ہے۔ اگرچہ وہ نبض شناسی اور قدیم و جدید اصولوں کے تحت ہر
                بیماری کی تشخیص اور علاج کرتے ہیں، لیکن درج ذیل مسائل میں انہیں خاص
                مہارت حاصل ہے:
              </p>

              <ul className="about-urdu-list">
                <li>
                  <strong>معدے کے پیچیدہ مسائل:</strong> گیس، تبخیرِ معدہ اور دائمی
                  قبض۔
                </li>
                <li>
                  <strong>ذہنی امراض:</strong> ڈپریشن، انزائٹی اور ذہنی دباؤ کا
                  قدرتی حل۔
                </li>
                <li>
                  <strong>امراضِ قلب:</strong> دل کی گھبراہٹ اور شریانوں کی صحت۔
                </li>
                <li>
                  <strong>مردانہ و زنانہ پوشیدہ امراض:</strong> کمزوری اور دیگر
                  پیچیدہ مسائل کا مکمل علاج۔
                </li>
              </ul>
            </section>

            <section className="about-urdu-section">
              <h3 className="about-urdu-section-title">
                خالص جڑی بوٹیاں اور مستند طریقہ علاج
              </h3>
              <p className="about-urdu-section-text">
                حکیم محمد اسماعیل کے طریقہ علاج کی سب سے بڑی خصوصیت{" "}
                <strong>خالص جڑی بوٹیوں</strong> کا استعمال ہے۔ وہ کسی بھی قسم کے
                کیمیکل سے پاک، قدرتی جڑی بوٹیوں کے انتخاب سے لے کر دوا کی تیاری تک
                تمام مراحل خود اپنی نگرانی میں مکمل کرتے ہیں۔ ان کے تیار کردہ نسخہ
                جات ان کے برسوں کے تجربے اور تحقیق کا نچوڑ ہیں۔
              </p>
            </section>

            <section className="about-urdu-section">
              <h3 className="about-urdu-section-title">قانونی حیثیت اور رجسٹریشن</h3>
              <p className="about-urdu-section-text">
                آپ کا اعتماد ہماری ترجیح ہے۔ الحمدللہ، ہمارا دواخانہ باقاعدہ{" "}
                <strong>رجسٹرڈ</strong> ہے۔
              </p>
            </section>

            <section className="about-urdu-section">
              <h3 className="about-urdu-section-title">
                عوامی اعتماد: سوشل میڈیا پر ایک معتبر نام
              </h3>
              <p className="about-urdu-section-text">
                حکیم صاحب کی دیانت اور ان کے مؤثر مشوروں کی بدولت سوشل میڈیا پر
                لاکھوں لوگ ان سے جڑے ہوئے ہیں۔ ان کی ویڈیوز کو کروڑوں کی تعداد میں
                دیکھا جانا اس بات کی دلیل ہے کہ عوام کا ان پر بھروسہ غیر متزلزل ہے۔
                یہی اعتماد اب اس ویب سائٹ کی صورت میں آپ کے سامنے ہے تاکہ آپ
                براہِ راست مستند مشورہ حاصل کر سکیں۔
              </p>
            </section>

            <section className="about-urdu-section about-urdu-section-last">
              <h3 className="about-urdu-section-title">خدمتِ انسانیت کا مشن</h3>
              <p className="about-urdu-section-text">
                ہمارا مقصد حکمت کو ہر گھر تک پہنچانا اور لوگوں کو قدرتی طریقہ علاج
                کی طرف راغب کرنا ہے۔ اب اس ویب سائٹ کے ذریعے آپ گھر بیٹھے حکیم صاحب
                سے رابطہ کر سکتے ہیں اور ہماری تیار کردہ خالص ادویات{" "}
                <strong>پورے پاکستان</strong> میں کہیں بھی منگوا سکتے ہیں۔
              </p>
            </section>

          </div>
        </article>

      </div>
    </section>
  );
}

export default About;