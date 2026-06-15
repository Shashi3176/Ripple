import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { motion } from "framer-motion";

const MotionInput = motion.input;

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setUser } = ChatState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      showToast("Please Fill all the Fields", "warning");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      showToast("Login Successful", "success");
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      showToast(
        "Error Occurred!",
        "error",
        error.response?.data?.message
      );
      setLoading(false);
    }
  };

  const showToast = (title, status, description = "") => {
    const toast = document.createElement("div");
    toast.className = `lp-toast lp-toast-${status}`;
    toast.innerHTML = `
      <div class="lp-toast-content">
        <div class="lp-toast-title">${title}</div>
        ${description ? `<div class="lp-toast-description">${description}</div>` : ""}
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("lp-toast-hide");
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  const handleChange = (setter) => (e) => setter(e.target.value);

  return (
    <form onSubmit={handleSubmit} className="lp-auth-form">
      <div className="lp-auth-input-group">
        <label className="lp-auth-label" htmlFor="email">
          Email Address
        </label>
        <MotionInput
          id="email"
          className="lp-auth-input"
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={handleChange(setEmail)}
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="lp-auth-input-group">
        <label className="lp-auth-label" htmlFor="password">
          Password
        </label>
        <div className="lp-auth-password-container">
          <MotionInput
            id="password"
            className="lp-auth-input"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={handleChange(setPassword)}
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
          <button
            type="button"
            className="lp-auth-toggle-password"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        className="lp-auth-submit-btn"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
      >
        {loading ? "Logging in..." : "Login"}
      </motion.button>

      <a href="/" className="lp-auth-back-link">
        ← Back to Home
      </a>
    </form>
  );
};

export default Login;