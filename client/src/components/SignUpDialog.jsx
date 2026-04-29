import { FiArrowLeft } from 'react-icons/fi';
import '../css/SignInDialog.css';

function SignUpDialog({ onClose, onSwitchToSignIn }) {
    return (
        <div className="auth-modal-overlay">
            <div className="auth-card">
                <button className="auth-back-btn" onClick={onClose}>
                    <FiArrowLeft />
                </button>

                <div className="auth-logo-wrap">
                    <img src="/logo-store-2.png" alt="Hakeem Ismail Logo" className="auth-logo" />
                </div>

                <input type="email" className="auth-input" placeholder="Email" />
                <input type="text" className="auth-input" placeholder="Name" />
                <input type="tel" className="auth-input" placeholder="Number" />
                <input type="password" className="auth-input" placeholder="Password" />

                <p className="auth-switch-text">
                    Already Login?
                    <span onClick={onSwitchToSignIn}> Login</span>
                </p>

                <button className="auth-submit-btn">Sign Up</button>
            </div>
        </div>
    );
}

export default SignUpDialog;