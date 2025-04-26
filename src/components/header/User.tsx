"use client";

import React from "react";
import { useAuth } from "../../providers/authProvider";

function User() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can add a loading spinner or message here
  }

  if (error) {
    return <div>Error: {error}</div>; // Display any errors (e.g., failed to fetch user data)
  }

  return (
    <div style={{ whiteSpace: "nowrap" }}>
      {user ? (
        <span>
          <img src={user.icon || "/default-avatar.png"} alt="User icon" style={{ width: 24, height: 24, borderRadius: "50%" }} />
          {/* Display the user icon if the user is signed in */}
        </span>
      ) : (
        "Sign in"
      )}
    </div>
  );
}

export default User;
