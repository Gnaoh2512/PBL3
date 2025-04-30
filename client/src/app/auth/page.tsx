"use client";

import React, { FormEvent, useState } from "react";
import styles from "./page.module.scss";
import callAPI from "utils/callAPI";
import { User } from "types";

type Mode = "login" | "register" | "forgot";

function Page() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const isPasswordValid = password.length >= 1;

  const isConfirmPasswordValid = mode !== "register" || password === confirmPassword;
  const isSubmitDisabled = !email || !isEmailValid || (mode !== "forgot" && (!password || !isPasswordValid)) || !isConfirmPasswordValid;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const res = await callAPI<{ user: User }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: { email: email.trim(), password },
        });

        if (res.user) {
          window.location.href = "/";
          setPassword("");
          setConfirmPassword("");
          return;
        } else {
          alert("Failed to login");
        }
      } else if (mode === "register") {
        if (!isConfirmPasswordValid) {
          alert("Passwords do not match.");
          return;
        }

        const res = await callAPI<{ user: User }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          body: { email: email.trim(), password, role: "customer" },
        });

        if (res.user) {
          window.location.href = "/";
          setPassword("");
          setConfirmPassword("");
          return;
        } else {
          alert("Failed to register");
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>{mode === "login" ? "Login" : mode === "register" ? "Register" : "Forgot Password"}</h2>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        {email && !isEmailValid && <p className={styles.warningText}>Please enter a valid email address.</p>}

        {(mode === "login" || mode === "register") && (
          <>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {password && !isPasswordValid && <p className={styles.warningText}>Password must be at least 3 characters.</p>}
          </>
        )}

        {mode === "register" && (
          <>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {confirmPassword && !isConfirmPasswordValid && <p className={styles.warningText}>Passwords do not match.</p>}
          </>
        )}

        <button type="submit" disabled={isSubmitDisabled}>
          {mode === "login" ? "Login" : mode === "register" ? "Register" : "Send Reset Link"}
        </button>

        <div className={styles.links}>
          {mode === "login" && (
            <span onClick={() => setMode("register")} className={styles.linkText}>
              Create Account
            </span>
          )}
          {mode !== "login" && (
            <span onClick={() => setMode("login")} className={styles.linkText}>
              Back to Login
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Page;
