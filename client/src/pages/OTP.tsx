import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "../utilities/utils";

export default function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  // If email is not provided, redirect to home
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  // If we don't have email, we don't render anything (redirect handled in useEffect)
  if (!email) {
    return null;
  }

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/verify",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/groupChatRoom");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-md p-4 mx-auto mt-4 mb-4 bg-white rounded-r-md-none border- shadow-input md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Verify Your Email
      </h2>
      <p className="max-w-sm mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        We have sent an OTP to {email}. Please enter it below to verify your account.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
        </div>

        <button
          className="group/btn mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-60 dark:bg-zinc-800"
          type="submit"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP →"}
        </button>
      </form>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <div className="flex justify-between">
        <p className = "mb-3 text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Didn't receive OTP?
        </p>
        <button>
          <p 
            className = "mb-3 text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"                                                                                                                                                                 
          >               
            <Link to={"/signup"}>
              Resend OTP
            </Link>
                                                   
          </p>
        </button>
      </div>
    </div>
  );
}