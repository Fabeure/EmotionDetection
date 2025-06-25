import { useNavigate } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="navbar">
            <div className="left">
                <span className="logo">EmoTrack</span>
            </div>
            <div className="right">
                <div className="nav-links">
                    {isLoggedIn && (
                        <button onClick={() => navigate('/sessions')} className="nav-link">
                            Sessions
                        </button>
                    )}
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="nav-link">
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="nav-link">
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;