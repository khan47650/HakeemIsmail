import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminArticles.css';

function AdminArticles() {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    const articles = [
        {
            id: 1,
            title: 'روزمرہ زندگی میں جڑی بوٹیوں کے فوائد',
            date: '12 March 2026',
            excerpt: `پولن الرجی کے لیے یہ ایک سادہ اور مؤثر نسخہ ہے جو قوتِ مدافعت کو بہتر بنانے میں مدد دیتا ہے۔ ملٹھی، سونف، گلِ بنفشہ، کوزہ مصری اور سفید مرچ کا سفوف بنا کر نیم گرم پانی کے ساتھ استعمال کیا جا سکتا ہے۔`,
        },
        {
            id: 2,
            title: 'قدرتی طریقوں سے قوتِ مدافعت بہتر بنائیں',
            date: '08 March 2026',
            excerpt: 'سادہ روزمرہ عادات اور قدرتی اجزاء آپ کے مدافعتی نظام کو مضبوط بنانے میں مدد دے سکتے ہیں۔',
        },
        {
            id: 3,
            title: 'کلونجی اور شہد کی طاقت',
            date: '02 March 2026',
            excerpt: 'کلونجی اور شہد دو روایتی اجزاء ہیں جو صحت بخش فوائد کے لیے بہت عرصے سے استعمال ہوتے آ رہے ہیں۔',
        },
        {
            id: 4,
            title: 'قدرتی مصنوعات سے جلد کی نگہداشت',
            date: '25 February 2026',
            excerpt: 'قدرتی تیل، جڑی بوٹیوں کے عرق اور مناسب نمی جلد کی نرم اور مؤثر نگہداشت میں مدد دیتے ہیں۔',
        },
    ];

    const visibleArticles = expandedId
        ? articles.filter((article) => article.id === expandedId)
        : articles;

    return (
        <section className="admin-articles-page page-fade-up">
            <div className="admin-articles-top">
                <div className="admin-articles-title-wrap">
                    <button className="admin-articles-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Articles</h1>
                </div>

                <button className="admin-add-article-btn">
                    <FiPlus />
                    Add New
                </button>
            </div>

            <div className={`admin-articles-grid ${expandedId ? 'admin-articles-grid-expanded' : ''}`}>
                {visibleArticles.map((article, index) => {
                    const isExpanded = expandedId === article.id;

                    return (
                        <div
                            key={article.id}
                            className={`admin-article-item fade-up fade-up-delay-${(index % 6) + 1}`}
                        >
                            <div className={`admin-article-card ${isExpanded ? 'admin-article-card-expanded' : ''}`}>
                                <div className="admin-article-card-top">
                                    <span className="admin-article-date">{article.date}</span>

                                    <h3
                                        className={`admin-article-title ${isExpanded ? 'admin-article-title-expanded' : ''}`}
                                        title={article.title}
                                    >
                                        {article.title}
                                    </h3>

                                    <div className="admin-article-badge">{article.id}</div>
                                </div>

                                <div className="admin-article-card-body">
                                    <p className="admin-article-text">
                                        {isExpanded ? article.excerpt : `${article.excerpt.slice(0, 120)}...`}
                                    </p>

                                    <div className="admin-article-bottom">
                                        {!isExpanded ? (
                                            <button
                                                className="admin-article-link"
                                                onClick={() => setExpandedId(article.id)}
                                            >
                                                Read more
                                            </button>
                                        ) : (
                                            <button
                                                className="admin-article-link"
                                                onClick={() => setExpandedId(null)}
                                            >
                                                See less
                                            </button>
                                        )}

                                        {!isExpanded && (
                                            <div className="admin-article-actions">
                                                <button className="admin-article-edit-btn">
                                                    <FiEdit2 />
                                                </button>
                                                <button className="admin-article-delete-btn">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default AdminArticles;