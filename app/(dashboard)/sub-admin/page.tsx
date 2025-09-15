import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, UserCog } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SubAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserCog className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sub Admin</h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Sub Admin
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sub admins..."
            className="pl-10 bg-sidebar border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white w-full lg:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="bg-dashboard-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Sub Admin Management</CardTitle>
          <CardDescription className="text-gray-400">
            Manage sub administrators and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <UserCog className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Sub admin management interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}