import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    HiOutlineMenuAlt3,
    HiOutlineX,
} from 'react-icons/hi';
import {
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import { FiUser, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi';
import '../css/Header.css'
import { FiSearch } from 'react-icons/fi';
import SignInDialog from './SignInDialog';
import SignUpDialog from './SignUpDialog';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const location = useLocation();
    const [authDialog, setAuthDialog] = useState(null);
    const { user, logout, isAdmin } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [resetDialog, setResetDialog] = useState(false);
    const navigate = useNavigate();

    const isHomePage = location.pathname === '/';
    const closeMenu = () => setMenuOpen(false);

    const getShortName = (name) => {
        if (!name) return "User";
        if (name.length <= 8) return name;
        return name.slice(0, 6) + "...";
    };

    const slides = [
        '/slide-1.jpeg',
        '/slide-2.jpeg',
        '/slide-3.jpeg'
    ]

    const extendedSlides = [...slides, slides[0]]

    useEffect(() => {
        if (!isHomePage) return

        const interval = setInterval(() => {
            setCurrentSlide(prev => prev + 1)
        }, 8000)

        return () => clearInterval(interval)
    }, []);



    useEffect(() => {
        if (currentSlide === slides.length) {
            setTimeout(() => {
                setIsTransitioning(false)
                setCurrentSlide(0)
            }, 1200)

            setTimeout(() => {
                setIsTransitioning(true)
            }, 1300)
        }
    }, [currentSlide]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-dropdown-wrapper')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const goNext = () => {
        if (currentSlide < slides.length) {
            setCurrentSlide((prev) => prev + 1)
        }
    }

    const goPrev = () => {
        if (currentSlide === 0) {
            setIsTransitioning(false)
            setCurrentSlide(slides.length - 1)

            setTimeout(() => {
                setIsTransitioning(true)
            }, 50)
        } else {
            setCurrentSlide((prev) => prev - 1)
        }
    }

    return (
        <header className={`main-header ${isHomePage ? 'home-header' : 'inner-header'}`}>
            <div className="header-hero-bg">
                <div className="header-overlay">
                    <div className="container">

                        <div className="floating-navbar">
                            <div className="nav-left">
                                <img src="/logo-store-2.png" alt="Hakeem Ismail Logo" className="nav-logo" />
                                <span className="brand-name">Hakeem Ismail</span>
                            </div>

                            <nav className="desktop-nav">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                                <NavLink to="/products" className="nav-link">Products</NavLink>
                                <NavLink to="/articles" className="nav-link">Articles</NavLink>
                                <NavLink to="/videos" className="nav-link">Videos</NavLink>
                                <NavLink to="/shorts" className="nav-link">Shorts</NavLink>
                                <NavLink to="/about" className="nav-link">About Us</NavLink>
                                <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
                            </nav>

                            <div className="nav-right">

                                <div className="nav-search">
                                    <input
                                        type="text"
                                        className="nav-search-input"
                                        placeholder="Search"
                                    />
                                    <button className="nav-search-btn">
                                        <FiSearch />
                                    </button>
                                </div>

                                {/* AUTH SECTION */}
                                {!user ? (
                                    <button
                                        className="nav-signin-btn"
                                        onClick={() => setAuthDialog('signin')}
                                    >
                                        Sign In
                                    </button>
                                ) : (
                                    <div className="user-dropdown-wrapper">
                                        <button
                                            className="nav-signin-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("clicked");
                                                setDropdownOpen(prev => !prev);
                                            }}
                                        >
                                            {isAdmin ? (
                                                'Admin'
                                            ) : (
                                                <span title={user.name}>
                                                    {getShortName(user.name)}
                                                </span>
                                            )}
                                        </button>

                                        {dropdownOpen && (
                                            <div className="dropdown-menu">

                                                <div className="dropdown-header">
                                                    <FiUser className="dropdown-icon" />
                                                    <span>
                                                        {isAdmin ? 'Admin Panel' : user.name}
                                                    </span>
                                                </div>

                                                <div className="dropdown-divider"></div>

                                                {!isAdmin && (
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setResetDialog(true);
                                                            setDropdownOpen(false);
                                                        }}
                                                    >
                                                        <FiSettings />
                                                        Reset Password
                                                    </button>
                                                )}

                                                {isAdmin && (
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            navigate('/admin');
                                                            setDropdownOpen(false);
                                                        }}
                                                    >
                                                        <FiGrid />
                                                        Dashboard
                                                    </button>
                                                )}

                                                <button
                                                    className="dropdown-item logout"
                                                    onClick={() => {
                                                        logout();
                                                        navigate('/');
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    <FiLogOut />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    className="menu-toggle"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                >
                                    {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
                                </button>

                            </div>
                        </div>

                        <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>

                            <div className="mobile-search">
                                <input
                                    type="text"
                                    className="mobile-search-input"
                                    placeholder="Search products, articles..."
                                />
                                <button className="mobile-search-btn" aria-label="Search">
                                    <FiSearch />
                                </button>
                            </div>
                            <NavLink to="/" className="mobile-link" onClick={closeMenu}>Home</NavLink>
                            <NavLink to="/products" className="mobile-link" onClick={closeMenu}>Products</NavLink>
                            <NavLink to="/articles" className="mobile-link" onClick={closeMenu}>Articles</NavLink>
                            <NavLink to="/videos" className="mobile-link" onClick={closeMenu}>Videos</NavLink>
                            <NavLink to="/shorts" className="mobile-link" onClick={closeMenu}>Shorts</NavLink>
                            <NavLink to="/about" className="mobile-link" onClick={closeMenu}>About Us</NavLink>
                            <NavLink to="/contact" className="mobile-link" onClick={closeMenu}>Contact Us</NavLink>

                        </div>

                        {isHomePage && (
                            <div className="hero-slider-wrapper">

                                <button
                                    className="slider-arrow slider-left"
                                    onClick={goPrev}
                                >
                                    <FiChevronLeft />
                                </button>

                                <div className="hero-slider-frame">
                                    <div
                                        className="hero-slider-track"
                                        style={{
                                            transform: `translateX(-${currentSlide * 100}%)`,
                                            transition: isTransitioning ? 'transform 1.2s ease-in-out' : 'none'
                                        }}
                                    >
                                        {extendedSlides.map((slide, index) => (
                                            <div className="hero-slide" key={index}>
                                                <img src={slide} className="hero-slide-image" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="slider-arrow slider-right"
                                    onClick={goNext}
                                >
                                    <FiChevronRight />
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {authDialog === 'signin' && (
                <SignInDialog
                    onClose={() => setAuthDialog(null)}
                    onSwitchToSignUp={() => setAuthDialog('signup')}
                />
            )}

            {authDialog === 'signup' && (
                <SignUpDialog
                    onClose={() => setAuthDialog(null)}
                    onSwitchToSignIn={() => setAuthDialog('signin')}
                />
            )}

            {resetDialog && (
                <div className="auth-modal-overlay">
                    <div className="auth-card">

                        <button
                            className="auth-back-btn"
                            onClick={() => setResetDialog(false)}
                        >
                            ✕
                        </button>

                        <h3 className="forgot-title">Reset Password</h3>

                        <p className="forgot-subtitle">
                            Enter new password to update your account
                        </p>

                        <input
                            type="password"
                            className="auth-input"
                            placeholder="New Password"
                        />

                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Confirm Password"
                        />

                        <button
                            className="auth-submit-btn"
                            onClick={() => {
                                toast.success("Password reset UI ready (backend next)");
                                setResetDialog(false);
                            }}
                        >
                            Update Password
                        </button>

                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;