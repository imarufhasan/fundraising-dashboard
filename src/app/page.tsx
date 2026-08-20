"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const role =
      localStorage.getItem("role") ||
      sessionStorage.getItem("role");

    console.log("ROOT TOKEN:", token);
    console.log("ROOT ROLE:", role);

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role === "support_admin") {
      router.replace("/support");
      return;
    }

    router.replace("/home");
  }, [router]);

  return null;
}