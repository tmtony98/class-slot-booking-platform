import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      // Redirect based on whether user has bookings
      if (userData.hasBookings) {
        navigate('/scheduled');
      } else {
        navigate('/calendar');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6c757d] p-5">
      <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-8 px-6 md:p-12 w-full max-w-[480px]">
        <div className="mb-8">
          <h1 className="text-black text-[32px] font-bold">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-error-bg text-error py-3 px-4 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email Id
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="py-3 px-4 border border-[#e0e0e0] rounded text-sm bg-[#f5f5f5] transition-colors duration-200 focus:outline-none focus:border-primary-purple focus:bg-white placeholder:text-[#aaa]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="py-3 px-4 border border-[#e0e0e0] rounded text-sm bg-[#f5f5f5] transition-colors duration-200 focus:outline-none focus:border-primary-purple focus:bg-white placeholder:text-[#aaa]"
            />
          </div>
           <div className="text-center mt-6 ">
          <p className="text-[#666] text-sm">
            <Link to="/signup" className="text-primary-purple font-semibold no-underline hover:underline">
              Create a new account
            </Link>
          </p>
        </div>

          <button
            type="submit"
            className="bg-primary-purple text-white border-none py-3.5 px-6 rounded text-base font-semibold cursor-pointer transition-all duration-200 mt-2 hover:bg-[#5a3d68] hover:-translate-y-px active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-primary-purple disabled:hover:translate-y-0"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

       
      </div>
    </div>
  );
}
