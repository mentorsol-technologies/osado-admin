"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { CustomSelect } from "../ui/customeSelect";

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
        <h3 className="text-white text-lg font-semibold mb-4">Payments</h3>
        <CustomSelect
          placeholder="Month"
          defaultValue="January"
          options={months}
          onChange={(value) => console.log("Selected month:", value)}
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={90}
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
              className="text-white text-sm"
            />
            <Label
              value={total.toLocaleString()}
              position="center"
              dy={15}
              className="text-white text-xl font-semibold"
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
