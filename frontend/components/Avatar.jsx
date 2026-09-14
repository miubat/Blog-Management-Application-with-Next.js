"use client";

import { useState } from "react";
import { API_ORIGIN } from "@/lib/api";

export default function Avatar({ user, size = "sm" }) {
  const [failed, setFailed] = useState(false);

  const box = size === "lg" ? "h-20 w-20 text-xl" : "h-8 w-8 text-xs";

  if (user?.photoUrl && !failed) {
    return (
      <img
        src={`${API_ORIGIN}${user.photoUrl}`}
        alt=""
        onError={() => setFailed(true)}
        className={`${box} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${box} flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600`}
    >
      {user?.firstname?.[0]}
      {user?.lastname?.[0]}
    </span>
  );
}
