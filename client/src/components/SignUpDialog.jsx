import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/api';
import '../css/SignInDialog.css';
import { useAuth } from '../context/AuthContext';

function SignUpDialog({ onClose, onSwitchToSignIn }) {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSignup = async () => {
        try {
            setLoading(true);

            const { data } = await api.post('/auth/signup', {
                email,
                name,
                number,
                password,
            });

            login(data.user, data.token);

            toast.success(data.message);

            onClose();

        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    type="text"
                    className="auth-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="tel"
                    className="auth-input"
                    placeholder="Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />

                <input
                    type="password"
                    className="auth-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className="auth-switch-text">
                    Already Login?
                    <span onClick={onSwitchToSignIn}> Login</span>
                </p>

                <button
                    className="auth-submit-btn"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

            </div>
        </div>
    );
}

export default SignUpDialog;