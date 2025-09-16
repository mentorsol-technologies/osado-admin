import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Building2, Search } from "lucide-react";
import CommonInput from "@/components/ui/input";

export default function BusinessOwnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Bussiness Owners</h2>
                   <Button
                       leftIcon={<Plus size={18} />}
                   > 
                       <span className="hidden md:inline">Add New owner</span>
                   </Button>
                   </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <CommonInput
          placeholder="Search business owners..."
          icon={<Search />}
        />

        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:text-white-100 w-full lg:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="bg-dashboard-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white-100">
            Business Owner Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage business owners and their profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Business owner management interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
