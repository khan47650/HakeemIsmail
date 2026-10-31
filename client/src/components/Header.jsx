import { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import {
    FiChevronLeft,
    FiChevronRight,
    FiUser,
    FiLogOut,
    FiGrid,
    FiSearch
} from 'react-icons/fi';
import '../css/Header.css';
import SignInDialog from './SignInDialog';
import SignUpDialog from './SignUpDialog';
import { useAuth } from '../context/AuthContext';
import api from "../api/api";
import { toast } from "react-toastify";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef(null);

    const [sliderImages, setSliderImages] = useState([]);
    const [sliderLoading, setSliderLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const [authDialog, setAuthDialog] = useState(null);
    const { user, logout, isAdmin } = useAuth();

    const isHomePage = location.pathname === '/';

    const closeMenu = () => setMenuOpen(false);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const matches = allProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(matches);
            setShowSearchDropdown(true);
        } else {
            setShowSearchDropdown(false);
        }
    };

    const handleProductClick = (productId) => {
        setShowSearchDropdown(false);
        setSearchQuery('');
        navigate(`/products/${productId}`);
    };

    useEffect(() => {
        const fetchSliderImages = async () => {
            try {
                setSliderLoading(true);
                const response = await api.get("/slider-images");
                setSliderImages(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Slider images fetch error:", error);
                setSliderImages([]);
            } finally {
                setSliderLoading(false);
            }
        };
        fetchSliderImages();
    }, []);

    const displaySlides = sliderImages.length ? sliderImages.map((image) => image.imageUrl) : ["/slide_4.jpeg"];

    useEffect(() => {
        setCurrentSlide((previous) => previous >= displaySlides.length ? 0 : previous);
        if (!isHomePage || displaySlides.length <= 1) {
            setCurrentSlide(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentSlide((previous) => (previous + 1) % displaySlides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [isHomePage, displaySlides.length]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setAllProducts(Array.isArray(res.data) ? res.data : []);

                const popularExists = Array.isArray(res.data) && res.data.some((product) => product.category === "popular");
                setHasPopularProducts(popularExists);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProducts();
    }, []);

    const goNext = () => {
        if (displaySlides.length <= 1) return;
        setCurrentSlide((previous) => (previous + 1) % displaySlides.length);
    };

    const goPrev = () => {
        if (displaySlides.length <= 1) return;
        setCurrentSlide((previous) => previous === 0 ? displaySlides.length - 1 : previous - 1);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target)
            ) {
                setSearchQuery('');
                setFilteredProducts([]);
                setShowSearchDropdown(false);
            }

            if (!e.target.closest('.user-dropdown-wrapper')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    return (
        <header className={`main-header ${isHomePage ? 'home-header' : 'inner-header'}`}>

            <div className="header-top-bar">
                <div className="container top-bar-inner">
                    <div className="nav-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/logo-store-2.png" alt="Logo" className="nav-logo" />
                        <span className="brand-name">Hakeem Ismail</span>
                    </div>

                    <div className="search-bar-container" ref={searchRef}>
                        <div className="header-search-form">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => {
                                    if (searchQuery.trim()) {
                                        setShowSearchDropdown(true);
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="search-submit-btn"
                                style={{ cursor: 'default', pointerEvents: 'none' }}
                            >
                                <FiSearch />
                            </button>
                        </div>

                        {/* Live Search Dropdown UI */}
                        {showSearchDropdown && (
                            <div className="search-dropdown">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="search-dropdown-item"
                                            onClick={() => handleProductClick(product._id)}
                                        >
                                            {product.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="search-dropdown-no-result">No product found</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="nav-right">
                        <div className="desktop-auth-area">
                            {!user ? (
                                <button className="nav-signin-btn" onClick={() => setAuthDialog('signin')}>
                                    <FiUser style={{ marginRight: '6px' }} /> Sign In
                                </button>
                            ) : (
                                <div className="auth-buttons-wrapper">
                                    {isAdmin && (
                                        <button className="nav-action-btn" onClick={() => navigate('/admin')}>
                                            <FiGrid style={{ marginRight: '6px' }} /> Dashboard
                                        </button>
                                    )}
                                    <button className="nav-action-btn logout-btn" onClick={() => { logout(); navigate('/'); }}>
                                        <FiLogOut style={{ marginRight: '6px' }} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="header-nav-bar">
                <div className="container">
                    <nav className="desktop-nav">
                        <NavLink to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/products" className="nav-link">Products</NavLink>
                        <NavLink to="/articles" className="nav-link">Articles</NavLink>
                        <NavLink to="/blogs" className="nav-link">Blogs</NavLink>
                        <NavLink to="/videos" className="nav-link">Videos</NavLink>
                        <NavLink to="/shorts" className="nav-link">Shorts</NavLink>
                        <NavLink to="/about" className="nav-link">About Us</NavLink>
                        <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
                    </nav>
                </div>
            </div>

            {menuOpen && <div className="mobile-menu-overlay" onClick={closeMenu} />}
            <div className={`mobile-menu-dropdown ${menuOpen ? 'active' : ''}`}>
                {/* --- Ye naya close button yahan add karein --- */}
                <button className="mobile-menu-close-btn" onClick={closeMenu}>
                    <HiOutlineX />
                </button>
                {/* ------------------------------------------- */}
                <NavLink to="/" className="mobile-menu-item" onClick={closeMenu}>Home</NavLink>
                <NavLink to="/products" className="mobile-menu-item" onClick={closeMenu}>Products</NavLink>
                <NavLink to="/articles" className="mobile-menu-item" onClick={closeMenu}>Articles</NavLink>
                <NavLink to="/blogs" className="mobile-menu-item" onClick={closeMenu}>Blogs</NavLink>
                <NavLink to="/videos" className="mobile-menu-item" onClick={closeMenu}>Videos</NavLink>
                <NavLink to="/shorts" className="mobile-menu-item" onClick={closeMenu}>Shorts</NavLink>
                <NavLink to="/about" className="mobile-menu-item" onClick={closeMenu}>About Us</NavLink>
                <NavLink to="/contact" className="mobile-menu-item" onClick={closeMenu}>Contact Us</NavLink>
                <div className="mobile-menu-divider"></div>
                <div className="mobile-menu-auth">
                    {!user ? (
                        <button className="mobile-menu-signin" onClick={() => { setAuthDialog("signin"); closeMenu(); }}>Sign In</button>
                    ) : (
                        <div className="mobile-auth-actions">
                            {isAdmin && (
                                <button className="mobile-menu-action" onClick={() => { navigate('/admin'); closeMenu(); }}>
                                    <FiGrid /> Dashboard
                                </button>
                            )}
                            <button className="mobile-menu-action logout" onClick={() => { logout(); navigate('/'); closeMenu(); }}>
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isHomePage && (
                <div className="hero-slider-wrapper">
                    {displaySlides.length > 1 && (
                        <button type="button" className="slider-arrow slider-left" onClick={goPrev} aria-label="Previous slide">
                            <FiChevronLeft />
                        </button>
                    )}

                    <div className="hero-slider-frame">
                        {sliderLoading ? (
                            <div className="hero-slider-loading"><span /></div>
                        ) : (
                            <div className="hero-slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {displaySlides.map((slide, index) => (
                                    <div className="hero-slide" key={`${slide}-${index}`}>
                                        <img src={slide} alt={`Homepage slider ${index + 1}`} className="hero-slide-image" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {displaySlides.length > 1 && (
                        <button type="button" className="slider-arrow slider-right" onClick={goNext} aria-label="Next slide">
                            <FiChevronRight />
                        </button>
                    )}

                    {displaySlides.length > 1 && (
                        <div className="hero-slider-dots">
                            {displaySlides.map((_, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className={currentSlide === index ? "active" : ""}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {authDialog === 'signin' && <SignInDialog onClose={() => setAuthDialog(null)} onSwitchToSignUp={() => setAuthDialog('signup')} />}
            {authDialog === 'signup' && <SignUpDialog onClose={() => setAuthDialog(null)} onSwitchToSignIn={() => setAuthDialog('signin')} />}
        </header>
    );
}

export default Header;