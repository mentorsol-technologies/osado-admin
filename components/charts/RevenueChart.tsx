"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { brand } from "@/lib/theme/colors";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthLabel = (key: string) => {
  const [, monthNum] = key.split("-");
  return months[Number(monthNum) - 1]?.slice(0, 3) || key;
};

interface RevenueChartProps {
  data?: { month: string; revenue: number }[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export default function RevenueChart({
  data = [],
  selectedMonth = months[new Date().getMonth()],
  onMonthChange,
}: RevenueChartProps) {
  const chartData = data.map((point) => ({
    month: monthLabel(point.month),
    revenue: point.revenue,
  }));

  return (
    <div className="w-full h-[450px] bg-black-500 rounded-2xl p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-semibold ">
          Revenue Generated
        </h2>
        <Select value={selectedMonth} onValueChange={onMonthChange ?? (() => {})}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="w-[160px]">
            <SelectGroup>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={brand[500]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={brand[500]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis
            stroke="#888"
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}K`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { revenue } = payload[0].payload;
                return (
                  <div className="bg-black-400 px-3 py-2 rounded-lg text-white text-sm shadow-lg">
                    <p className="font-normal">Revenue Generated</p>
                    <p className="text-lg font-semibold">
                      KWD {revenue.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={brand[500]}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
