import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../css/SignInDialog.css';

function SignInDialog({ onClose, onSwitchToSignUp }) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [showForgotDialog, setShowForgotDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    // =========================
    // LOGIN FUNCTION
    // =========================
    const handleLogin = async () => {
        try {
            setLoading(true);

            if (email === 'admin123@gmail.com' && password === 'Admin123@') {
                const adminUser = {
                    id: "admin-id",
                    name: "Admin",
                    email: email,
                    role: "admin"
                };

                login(adminUser, "admin-token");

                toast.success('Admin Login Successful');

                onClose();
                navigate('/admin');

                return;
            }

            // =========================
            // NORMAL USER LOGIN (API)
            // =========================
            const { data } = await api.post('/auth/login', {
                email,
                password,
            });

            login(data.user, data.token);

            toast.success(data.message || 'Login successful');

            onClose();
            navigate('/');

        } catch (error) {
            console.log(error.response?.data);
            console.log(error);
            toast.error(
                error.response?.data?.message || 'Invalid email or password'
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FORGOT PASSWORD (UI ONLY)
    // =========================
    const handleForgotPassword = () => {
        if (!forgotEmail) {
            toast.error('Please enter your email');
            return;
        }

        toast.success('New password will be sent to your email');

        setShowForgotDialog(false);
        setForgotEmail('');
    };

    return (
        <>
            <div className="auth-modal-overlay">
                <div className="auth-card">

                    <button className="auth-back-btn" onClick={onClose}>
                        <FiArrowLeft />
                    </button>

                    <div className="auth-logo-wrap">
                        <img
                            src="/logo-store-2.png"
                            alt="Hakeem Ismail Logo"
                            className="auth-logo"
                        />
                    </div>

                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p
                        className="forgot-password-text"
                        onClick={() => setShowForgotDialog(true)}
                    >
                        Forgot Password?
                    </p>

                    <p className="auth-switch-text">
                        Not Registered?
                        <span onClick={onSwitchToSignUp}> Sign Up</span>
                    </p>

                    <button
                        className="auth-submit-btn"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>

            {/* FORGOT PASSWORD MODAL */}
            {showForgotDialog && (
                <div className="auth-modal-overlay">
                    <div className="forgot-password-card">

                        <button
                            className="auth-back-btn"
                            onClick={() => setShowForgotDialog(false)}
                        >
                            <FiArrowLeft />
                        </button>

                        <div className="auth-logo-wrap">
                            <img
                                src="/logo-store-2.png"
                                alt="Hakeem Ismail Logo"
                                className="auth-logo"
                            />
                        </div>

                        <h3 className="forgot-title">
                            Forgot Password
                        </h3>

                        <p className="forgot-subtitle">
                            Enter your registered email to get new password
                        </p>

                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Enter Email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                        />

                        <button
                            className="auth-submit-btn"
                            onClick={handleForgotPassword}
                        >
                            Send Password
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default SignInDialog;