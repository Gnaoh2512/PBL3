"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/authProvider";
import Link from "next/link";

function User() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures this runs only on the client side
  }, []);

  if (!mounted) return null; // Render nothing until the component is mounted

  return (
    <>
      {user ? (
        <>
          <div style={{ padding: "0.5rem" }}>
            <Link href="/user">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>

          <div style={{ padding: "0.5rem" }}>
            <Link href="/user/cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>
          </div>

          <div style={{ padding: "0.5rem" }}>
            <Link href="/user/order">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7l9-5 9 5v10l-9 5-9-5V7z" />
                <path d="M3 7l9 5 9-5" />
                <path d="M12 12v10" />
              </svg>
            </Link>
          </div>
        </>
      ) : (
        <div style={{ whiteSpace: "nowrap" }}>
          <Link href="/auth">Sign in</Link>
        </div>
      )}
    </>
  );
}

export default User;
