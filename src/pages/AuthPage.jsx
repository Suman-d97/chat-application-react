import { useState } from "react";
import { supabase } from "../config/SupabaseClient";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate =useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate("/chat")
        alert("Login successful 🎉");
      } else {
        if (!formData.username || !formData.email || !formData.password) {
          throw new Error("All fields are required");
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              phone: formData.phone,
            },
          },
        });
        if (error) throw error;
        alert("Signup successful 🎉 Check your email to verify your account.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  // GitHub login
  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "Login" : "Signup"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Welcome back!" : "Create your account"}
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Enter Your Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {isLogin && (
            <p className="text-right text-sm text-blue-500 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" /> Login with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <FaGithub className="text-xl" /> Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
