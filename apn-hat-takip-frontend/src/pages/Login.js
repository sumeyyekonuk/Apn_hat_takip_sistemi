
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027)",
        backgroundSize: "400% 400%",
        animation: "bgAnimation 15s ease infinite",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <style>{`
        @keyframes bgAnimation {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }

        .login-card {
          backdrop-filter: blur(15px);
          background: rgba(0, 0, 0, 0.55);
          border-radius: 20px;
          padding: 40px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 0 40px rgba(0,255,255,0.3);
          color: #fff;
          transition: all 0.3s ease;
        }

        .login-card:hover {
          box-shadow: 0 0 50px rgba(0,255,255,0.5);
          transform: translateY(-5px);
        }

        .form-control {
          background: rgba(0,0,0,0.4);
          border: none;
          border-bottom: 2px solid #0ff;
          color: #fff;
          border-radius: 0;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          background: rgba(0,0,0,0.6);
          border-color: #0ff;
          box-shadow: 0 0 10px #0ff;
          outline: none;
          color: #fff;
        }

        .btn-neon {
          background: linear-gradient(90deg, #00f0ff, #0088ff);
          border: none;
          color: #fff;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px #00f0ff;
        }

        .btn-neon:hover {
          box-shadow: 0 0 20px #00f0ff, 0 0 30px #00f0ff inset;
          transform: scale(1.05);
        }
      `}</style>

      <div className="login-card text-center">
        <h2 className="mb-3 fw-bold">Giriş Yap</h2>
        <p className="text-muted mb-4">Hesabınıza giriş yapın</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4 text-start">
            <label htmlFor="password" className="form-label">Şifre</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-neon w-100">Giriş</button>
        </form>
      </div>
    </div>
  );
}

export default Login;