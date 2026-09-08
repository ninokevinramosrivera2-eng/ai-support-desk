import { useState } from "react";
import {
  loginUser,
  registerUser,
} from "../services/api";
import "./Login.css";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegisterMode = mode === "register";

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = () => {
    resetMessages();

    if (isRegisterMode) {
      setMode("login");
    } else {
      setMode("register");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetMessages();
    setLoading(true);

    try {
      if (isRegisterMode) {
        await registerUser(
          name,
          email,
          password
        );

        setSuccess(
          "Account created successfully. You can now sign in."
        );

        setPassword("");
        setMode("login");
        return;
      }

      const data = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      if (onLogin) {
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(
        err.message ||
          (isRegisterMode
            ? "Unable to create account."
            : "Unable to sign in.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">AI</div>

          <div>
            <h1>AI Support Desk</h1>
            <p>
              Intelligent customer support workspace
            </p>
          </div>
        </div>

        <div className="login-header">
          <h2>
            {isRegisterMode
              ? "Create your account"
              : "Welcome back"}
          </h2>

          <p>
            {isRegisterMode
              ? "Create an account to test the AI Support Desk."
              : "Sign in to manage and analyze your support tickets."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder={
                isRegisterMode
                  ? "Create a password"
                  : "Enter your password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
              minLength={6}
              autoComplete={
                isRegisterMode
                  ? "new-password"
                  : "current-password"
              }
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? isRegisterMode
                ? "Creating account..."
                : "Signing in..."
              : isRegisterMode
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="login-switch">
          <span>
            {isRegisterMode
              ? "Already have an account?"
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={switchMode}
            className="login-switch-button"
          >
            {isRegisterMode
              ? "Sign in"
              : "Create account"}
          </button>
        </div>

        <div className="login-footer">
          <span>FastAPI</span>
          <span>JWT</span>
          <span>OpenAI</span>
        </div>
      </div>
    </div>
  );
}

export default Login;