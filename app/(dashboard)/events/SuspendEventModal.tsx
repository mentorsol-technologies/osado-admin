"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

interface SuspendedEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (reason: string) => void;
  selectedReason?: string;
}

export default function SuspendedEventModal({
  open,
  setOpen,
  onSave,
  selectedReason,
}: SuspendedEventModalProps) {
  const [reason, setReason] = useState(selectedReason || "");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Suspend Event"
      description="Please select a reason for suspending this event. The user and service provider will be notified."
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={() => {
              if (reason) {
                onSave(reason);
                setOpen(false);
              }
            }}
            className="flex-1"
          >
            Submit
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="w-full">
        <label className="block text-sm mb-1">Reason</label>
        <Select defaultValue={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Service Not Provided">
              Service Not Provided
            </SelectItem>
            <SelectItem value="Provider Canceled">Provider Canceled</SelectItem>
            <SelectItem value="Customer Request">Customer Request</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Modal>
  );
}
