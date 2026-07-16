"use client";

import { PartyPopper } from "lucide-react";

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  totalBookings: number;
  totalEventsChange?: number | null;
  activeEventsChange?: number | null;
  upcomingEventsChange?: number | null;
  totalBookingsChange?: number | null;
}
interface StatsCardsProps {
  stats?: DashboardStats[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statData = stats?.[0];

  const cards = [
    {
      title: "Total Events",
      value: statData?.totalEvents ?? 0,
      change: statData?.totalEventsChange,
    },
    {
      title: "Active Events",
      value: statData?.activeEvents ?? 0,
      change: statData?.activeEventsChange,
    },
    {
      title: "Upcoming Events",
      value: statData?.upcomingEvents ?? 0,
      change: statData?.upcomingEventsChange,
    },
    {
      title: "Total Bookings",
      value: statData?.totalBookings ?? 0,
      change: statData?.totalBookingsChange,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      {cards.map((stat, index) => (
        <div key={index} className="stat-card bg-black-500 rounded-2xl">
          <div className="flex flex-col gap-  mb-2 lg:mb-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-600  rounded-lg flex items-center justify-center">
              <PartyPopper className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
            <h3 className="text-xs lg:text-sm font-normal">{stat.title}</h3>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex gap-4">
              <p className="text-lg lg:text-2xl font-bold text-white">
                {stat.value}
              </p>
              {stat.change != null && (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full ${
                      stat.change >= 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
