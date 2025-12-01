"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

interface StatusReportModalProps {
  open: boolean;
  onClose: () => void;
  onViewReport: () => void;
  title: string;
  description: string;
}

export default function StatusReportModal({
  open,
  onClose,
  onViewReport,
  title,
  description,
}: StatusReportModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={title}
      description={description}
      size="lg"
      footer={
        <div className="flex w-full justify-between gap-4">
          {/* VIEW REPORT BUTTON */}
          <Button
            className="bg-red-700 hover:bg-red-800 text-white w-full py-6 rounded-xl text-lg"
            onClick={onViewReport}
          >
            View Report
          </Button>

          {/* CLOSE BUTTON */}
          <Button
            className="bg-black-500 border border-gray-700 hover:bg-black-600 text-white w-full py-6 rounded-xl text-lg"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      }
    >
      {/* No body content inside, design same as screenshot */}
    </Modal>
  );
}
