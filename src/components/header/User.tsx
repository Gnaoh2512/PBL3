"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../providers/authProvider";

function User() {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleClick = () => {
    if (user) logout();
    else window.location.href = "/auth";
  };

  return (
    <div style={{ whiteSpace: "nowrap" }} onClick={handleClick}>
      {user ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75" // Thicker stroke
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        "Sign in"
      )}
    </div>
  );
}

export default User;
