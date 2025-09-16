import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Building2 } from "lucide-react";
import CommonInput from "@/components/ui/input";

export default function ServiceProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">Service provider</h2>
                   <Button
                       leftIcon={<Plus size={18} />}
                   > 
                       <span className="hidden md:inline">Add New provider</span>
                   </Button>
                   </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <CommonInput
          placeholder="Search service providers..."
          icon={<Search />}
        />

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
          <CardTitle className="text-white">
            Service Provider Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage service providers and their offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>
              Service provider management interface will be implemented here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
