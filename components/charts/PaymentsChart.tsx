"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { CustomSelect } from "../ui/customeSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
} from "../ui/select";

const COLORS = ["red", "blue"]; // red + blue

const data = [
  { name: "Pending Payments", value: 5783 },
  { name: "Refund Requests", value: 1177 },
];
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
export default function PaymentsChart() {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-[450px] bg-black-500 rounded-2xl p-4 ">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-2xl font-semibold">Payments</h3>
        <Select
          defaultValue="January"
          onValueChange={(value) => console.log("Selected month:", value)}
        >
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
              value="Total Payments"
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
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span>Pending Payments</span>
          </span>
          <span className="font-medium text-white">5783</span>
        </span>

        <span className="flex justify-between items-center gap-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Refund Requests</span>
          </span>
          <span className="font-medium text-white">1177</span>
        </span>
      </div>
    </div>
  );
}
