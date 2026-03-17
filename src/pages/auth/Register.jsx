import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { colors, fonts } from "../../styles/theme";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", form);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.bg,
      padding: 16,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 40,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 4,
          color: colors.dark,
          fontFamily: fonts.display,
        }}>
          Create Account
        </h1>

        <p style={{
          color: colors.muted,
          textAlign: "center",
          marginBottom: 32,
          fontSize: 13,
          fontFamily: fonts.body,
        }}>
          Start practicing interviews with AI
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <User
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: colors.muted,
              }}
              size={18}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 12,
                paddingTop: 10,
                paddingBottom: 10,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                fontSize: 14,
                fontFamily: fonts.body,
                color: colors.dark,
                outline: "none",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Mail
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: colors.muted,
              }}
              size={18}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 12,
                paddingTop: 10,
                paddingBottom: 10,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                fontSize: 14,
                fontFamily: fonts.body,
                color: colors.dark,
                outline: "none",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: colors.muted,
              }}
              size={18}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 12,
                paddingTop: 10,
                paddingBottom: 10,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                fontSize: 14,
                fontFamily: fonts.body,
                color: colors.dark,
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: colors.orange,
              color: colors.white,
              padding: "12px 20px",
              borderRadius: 6,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: fonts.display,
              transition: "all 0.2s",
            }}
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <p style={{
          color: colors.muted,
          fontSize: 12,
          textAlign: "center",
          marginTop: 20,
          fontFamily: fonts.body,
        }}>
          Already have an account?{" "}
          <a
            href="/#login"
            style={{
              color: colors.orange,
              textDecoration: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Start practicing interviews with AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}