import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Token kontrolü - kullanıcı giriş yapmışsa tekrar login'e girmesin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/");
      } else {
        throw new Error("Geçersiz yanıt, token alınamadı.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Giriş başarısız, tekrar deneyin.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">🔐 Giriş Yap</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Şifre</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Giriş
        </button>
      </form>
    </div>
  );
}

export default Login;
