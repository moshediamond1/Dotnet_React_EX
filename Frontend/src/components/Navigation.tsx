import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export function Navigation() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900">🎫 Ticket System</Link>
        <div className="flex items-center gap-4">
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Admin logged in</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <LogIn size={18} />
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
