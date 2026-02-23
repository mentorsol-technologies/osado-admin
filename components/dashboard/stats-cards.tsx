"use client";

import { PartyPopper } from "lucide-react";

const stats = [
  {
    title: "Total Events",
    value: "4,539",
    change: "+12.5%",
    positive: true,
  },
  {
    title: "Active Events",
    value: "1,290",
    change: "+5.4%",
    positive: true,
  },
  {
    title: "Upcoming Events",
    value: "3,339",
    change: "+8.2%",
    positive: true,
  },
  {
    title: "Total Bookings",
    value: "539",
    change: "+15.3%",
    positive: true,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card bg-black-500">
          <div className="flex flex-col gap-  mb-2 lg:mb-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-600  rounded-lg flex items-center justify-center">
              <PartyPopper className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
            <h3 className="text-xs lg:text-sm font-normal">{stat.title}</h3>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex gap-4">
              <p className="text-lg lg:text-2xl font-bold text-white">
                {stat.value}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full ${
                    stat.positive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
