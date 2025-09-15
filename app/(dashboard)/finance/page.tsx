import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import CommonInput from "@/components/ui/input";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Finance Module
          </h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-dashboard-card border-gray-800">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  $45,231
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-card border-gray-800">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Expenses</p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  $12,543
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-card border-gray-800 col-span-2 lg:col-span-1">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Net Profit</p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  $32,688
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <CommonInput placeholder="Search transactions..." />
        </div>
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:text-white w-full lg:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="bg-dashboard-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Financial Management</CardTitle>
          <CardDescription className="text-gray-400">
            Track revenue, expenses, and financial analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Financial management interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
