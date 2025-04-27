"use client";

import React from "react";
import { useAuth } from "../../providers/authProvider";
import User from "components/user/User";
import Admin from "components/user/Admin";

function Page() {
  const { user } = useAuth();

  return <>{user?.role === "admin" ? <Admin /> : <User />}</>;
}

export default Page;
