import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MasterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Master</h1>
        <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search master data..."
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
          <CardTitle className="text-white">Master Data</CardTitle>
          <CardDescription className="text-gray-400">
            Manage all master data entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <p>Master data management interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}