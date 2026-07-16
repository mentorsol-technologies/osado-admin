"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { brand } from "@/lib/theme/colors";

const COLORS = [brand[500], "#80B2FF"]; // brand purple + light blue

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

interface PaymentsChartProps {
  pendingPaymentsCount?: number;
  pendingWithdrawalRequestsCount?: number;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export default function PaymentsChart({
  pendingPaymentsCount = 0,
  pendingWithdrawalRequestsCount = 0,
  selectedMonth = months[new Date().getMonth()],
  onMonthChange,
}: PaymentsChartProps) {
  const data = [
    { name: "Pending Payments", value: pendingPaymentsCount },
    { name: "Withdrawal Requests", value: pendingWithdrawalRequestsCount },
  ];
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-[450px] bg-black-500 rounded-2xl p-4 ">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-2xl font-semibold">Payments</h3>
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

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={85}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
            <Label
              value="Needs Review"
              position="center"
              dy={-10}
              style={{ fill: "#ffffff", fontSize: "14px" }}
            />
            <Label
              value={total.toLocaleString()}
              position="center"
              dy={15}
              style={{ fill: "#ffffff", fontSize: "18px", fontWeight: "600" }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-3 text-sm mt-4 py-4 ">
        <span className="flex justify-between items-center gap-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Pending Payments</span>
          </span>
          <span className="font-medium text-white">{pendingPaymentsCount}</span>
        </span>

        <span className="flex justify-between items-center gap-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-300"></span>
            <span>Withdrawal Requests</span>
          </span>
          <span className="font-medium text-white">{pendingWithdrawalRequestsCount}</span>
        </span>
      </div>
    </div>
  );
}
