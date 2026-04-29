import { useState } from "react"
import "../css/Articles.css"

function Articles() {
  const [expandedId, setExpandedId] = useState(null)

  const articles = [
    {
      id: 1,
      title: "روزمرہ زندگی میں جڑی بوٹیوں کے فوائد",
      date: "12 March 2026",
      excerpt: `پولن الرجی (نزلہ، زکام، چھینکیں اور گلے کی خارش) کے لیے یہ ایک سادہ اور مؤثر نسخہ ہے جو قوتِ مدافعت کو بہتر بنانے میں مدد دیتا ہے۔

پولن الرجی کا لاجواب نسخہ

اجزاء:
1. ملٹھی — 50 گرام  
2. سونف — 50 گرام  
3. گلِ بنفشہ — 30 گرام  
4. کوزہ مصری — 50 گرام  
5. سفید مرچ — 10 گرام  

تیاری:
تمام اجزاء کو باریک پیس کر سفوف بنا لیں اور محفوظ کر لیں۔

استعمال:
آدھا چھوٹا چمچ صبح اور شام نیم گرم پانی کے ساتھ استعمال کریں۔

فوائد:
گلے کی سوزش کم کرنے، چھینکوں کو قابو میں رکھنے اور نظامِ تنفس کو بہتر بنانے میں مدد دیتا ہے۔

پرہیز:
ٹھنڈے پانی، آئس کریم، کھٹی اشیاء، دھول مٹی اور پولن کے موسم میں بلاوجہ باہر نکلنے سے پرہیز کریں۔`,
    },
    {
      id: 2,
      title: "قدرتی طریقوں سے قوتِ مدافعت بہتر بنائیں",
      date: "08 March 2026",
      excerpt:
        "سادہ روزمرہ عادات اور قدرتی اجزاء آپ کے مدافعتی نظام کو مضبوط بنانے میں مدد دے سکتے ہیں۔ متوازن غذا، مناسب نیند، جڑی بوٹیوں کی معاونت اور روزانہ کی سرگرمی بہتر صحت کے لیے اہم کردار ادا کرتی ہے۔",
    },
    {
      id: 3,
      title: "کلونجی اور شہد کی طاقت",
      date: "02 March 2026",
      excerpt:
        "کلونجی اور شہد دو روایتی اجزاء ہیں جو صحت بخش فوائد کے لیے بہت عرصے سے استعمال ہوتے آ رہے ہیں۔ یہ دونوں چیزیں روزمرہ معمول میں آسانی سے شامل کی جا سکتی ہیں اور مجموعی صحت کو سہارا دیتی ہیں۔",
    },
    {
      id: 4,
      title: "قدرتی مصنوعات سے جلد کی نگہداشت",
      date: "25 February 2026",
      excerpt:
        "قدرتی تیل، جڑی بوٹیوں کے عرق اور مناسب نمی جلد کی نرم اور مؤثر نگہداشت میں مدد دیتے ہیں۔ پودوں سے حاصل کردہ مصنوعات جلد کو تروتازہ اور صحت مند رکھنے کے لیے بہترین انتخاب ہو سکتی ہیں۔",
    },
    {
      id: 5,
      title: "روایتی علاج میں استعمال ہونے والی اہم جڑی بوٹیاں",
      date: "19 February 2026",
      excerpt:
        "روایتی علاج میں کئی جڑی بوٹیاں عام طور پر استعمال ہوتی ہیں جنہیں روزمرہ صحت کے لیے مفید سمجھا جاتا ہے۔ ان کی اہمیت ان کے آسان استعمال اور قدیم تجربات کی بنیاد پر قائم ہے۔",
    },
    {
      id: 6,
      title: "آرگینک طرزِ زندگی کیوں اہم ہے",
      date: "11 February 2026",
      excerpt:
        "چھوٹی چھوٹی آرگینک تبدیلیاں آپ کی روزمرہ زندگی اور صحت پر مثبت اثر ڈال سکتی ہیں۔ قدرتی غذا، صاف مصنوعات اور بہتر عادات ایک متوازن طرزِ زندگی کی بنیاد بنتی ہیں۔",
    },
    {
      id: 7,
      title: "روزانہ معمول کے لیے آسان صحت مند عادات",
      date: "05 February 2026",
      excerpt:
        "چند آسان عادات اگر مسلسل اپنائی جائیں تو وہ آپ کی توانائی، صحت اور روزمرہ کارکردگی میں واضح بہتری لا سکتی ہیں۔ متحرک رہنا، متوازن خوراک لینا اور قدرتی سہارا لینا مفید ثابت ہوتا ہے۔",
    },
  ]

  const visibleArticles = expandedId
    ? articles.filter((article) => article.id === expandedId)
    : articles

  return (
    <section className="articles-page-section page-fade-up">
      <div className="container">
        <div className="articles-page-header fade-up fade-up-delay-1">
          <h1 className="articles-page-title">Our Articles</h1>
          <p className="articles-page-subtitle">
            Explore helpful reads, wellness tips, and natural health insights
            carefully curated for you.
          </p>
          <div className="articles-page-title-line"></div>
        </div>

        <div
          className={`article-list-grid ${
            expandedId ? "article-list-grid-expanded" : ""
          }`}
        >
          {visibleArticles.map((article, index) => {
            const isExpanded = expandedId === article.id

            return (
              <div
                key={article.id}
                className={`article-grid-item fade-up fade-up-delay-${(index % 6) + 1}`}
              >
                <div
                  className={`article-story-card ${
                    isExpanded ? "article-story-card-expanded" : ""
                  }`}
                >
                  <div className="article-story-card-top">
                    <span className="article-story-date">{article.date}</span>

                    <h3
                      className={`article-story-title ${
                        isExpanded ? "article-story-title-expanded" : ""
                      }`}
                      title={article.title}
                    >
                      {article.title}
                    </h3>

                    <div className="article-story-badge">{article.id}</div>
                  </div>

                  <div className="article-story-card-body">
                    <p className="article-story-text">
                      {isExpanded
                        ? article.excerpt
                        : `${article.excerpt.slice(0, 120)}...`}
                    </p>

                    {!isExpanded ? (
                      <button
                        className="article-story-link"
                        onClick={() => setExpandedId(article.id)}
                      >
                        Read more
                      </button>
                    ) : (
                      <button
                        className="article-story-link"
                        onClick={() => setExpandedId(null)}
                      >
                        See less
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Articles