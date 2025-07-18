"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find(row => row.startsWith("isLoggedIn="))
      ?.split("=")[1];
    setIsLoggedIn(cookieValue === "true");
  }, []);

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("ออกจากระบบแล้ว");
    router.push("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <LogOut
      className="text-red-600 hover:text-red-700 cursor-pointer"
      onClick={handleLogout}
    />
  );
}
