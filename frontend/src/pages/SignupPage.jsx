import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputClasses =
  "py-3 px-4 border border-[#e0e0e0] rounded text-sm bg-[#f5f5f5] transition-colors duration-200 focus:outline-none focus:border-primary-purple focus:bg-white placeholder:text-[#aaa]";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      setError("Contact number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      await register(
        firstName,
        lastName,
        email,
        countryCode,
        contactNumber,
        password,
      );
      // New user - redirect to calendar
      navigate("/calendar");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6c757d] p-5">
      <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-8 px-6 md:p-12 w-full max-w-[480px] md:max-w-[680px]">
        <div className="mb-8">
          <h1 className="text-black text-[32px] font-bold">Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-error-bg text-error py-3 px-4 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contactNumber"
                className="text-sm font-medium text-black"
              >
                Contact Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={`flex-none w-[100px] ${inputClasses}`}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+971">+971</option>
                </select>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter contact number"
                  required
                  className={`flex-1 min-w-0 ${inputClasses}`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-black"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={inputClasses}
              />
            </div>
          </div>
          <div className="text-center mt-6 ">
            <p className="text-[#666] text-sm">
              Already have an Account?{" "}
              <Link
                to="/login"
                className="text-primary-purple font-semibold no-underline hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-full max-w-sm bg-primary-purple text-white border-none py-3.5 px-6 rounded text-base font-semibold cursor-pointer transition-all duration-200 mt-2 hover:bg-[#5a3d68] hover:-translate-y-px active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-primary-purple disabled:hover:translate-y-0"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
