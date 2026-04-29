import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../css/SignInDialog.css';

function SignInDialog({ onClose, onSwitchToSignUp }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email === 'admin123@gmail.com' && password === 'Admin123@') {
            toast.success('Login Successful');
            onClose();
            navigate('/admin');
        } else {
            toast.error('Invalid email or password');
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-card">
                <button className="auth-back-btn" onClick={onClose}>
                    <FiArrowLeft />
                </button>

                <div className="auth-logo-wrap">
                    <img src="/logo-store-2.png" alt="Hakeem Ismail Logo" className="auth-logo" />
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

                <p className="auth-switch-text">
                    Not Registered?
                    <span onClick={onSwitchToSignUp}> Sign Up</span>
                </p>

                <button className="auth-submit-btn" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default SignInDialog;