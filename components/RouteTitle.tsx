"use client";

import { usePathname } from "next/navigation";

export default function RouteTitle() {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    if (path === "/") return "Osado / Dashboard";
    return (
      "Osado / " +
      path
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" / ")
    );
  };

  // 👇 only a <span>, no padding, no bg
  return <span className="ml-2 text-gray-600">{getTitle(pathname)}</span>;
}
