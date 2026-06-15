import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

const MotionInput = motion.input;

const Signup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmpassword) {
      showToast("Please Fill all the Fields", "warning");
      return;
    }
    if (password !== confirmpassword) {
      showToast("Passwords Do Not Match", "warning");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password},
        config
      );

      showToast("Registration Successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
    } catch (error) {
      showToast(
        "Error Occurred!",
        "error",
        error.response?.data?.message
      );
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
            placeholder="Enter Password"
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

      <div className="lp-auth-input-group">
        <label className="lp-auth-label" htmlFor="confirmpassword">
          Confirm Password
        </label>
        <MotionInput
          id="confirmpassword"
          className="lp-auth-input"
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmpassword}
          onChange={handleChange(setConfirmpassword)}
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      </div>      

      <motion.button
        type="submit"
        className="lp-auth-submit-btn"
      >
        {"Sign Up"}
      </motion.button>

      <a href="/" className="lp-auth-back-link">
        ← Back to Home
      </a>
    </form>
  );
};

export default Signup;