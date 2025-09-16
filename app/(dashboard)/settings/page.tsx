import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CommonInput from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
      </div>
    </div>
  );
}
