"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { User } from "lucide-react";

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-black-300/60">
      <span className="text-sm text-gray-400 w-1/3 shrink-0">{label}</span>
      <span className="text-sm text-white w-2/3 text-right break-words">
        {value}
      </span>
    </div>
  );
}

export default function ApplicationDetailModal({
  open,
  onOpenChange,
  application,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  const p = application;
  const status: string = p.displayStatus;
  const statusCls =
    status === "Confirmed"
      ? "text-green-400 border-green-500/30"
      : status === "Canceled"
        ? "text-red-400 border-red-500/30"
        : "text-blue-400 border-blue-500/30";

  const categories: any[] = p.categories || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Application Details"
      size="lg"
    >
      <div className="text-white">
        {/* Influencer header */}
        <div className="flex items-center gap-3 pb-4 border-b border-black-300/60">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-black-300 flex items-center justify-center shrink-0">
            {p.influencer?.photoURL ? (
              <Image
                src={p.influencer.photoURL}
                alt={p.influencerName}
                width={56}
                height={56}
                className="w-14 h-14 object-cover"
              />
            ) : (
              <User size={26} className="text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">{p.influencerName}</p>
            <p className="text-xs text-gray-400 capitalize">
              {p.influencer?.role?.role || "influencer"}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-2">
          <Row label="Application ID" value={p.id} />
          <Row label="Event" value={p.eventTitle} />
          <Row
            label="Date"
            value={new Date(p.createdAt).toLocaleDateString()}
          />
          <Row label="Price" value={p.priceLabel} />
          <Row
            label="Category"
            value={
              categories.length ? (
                <span className="flex flex-wrap gap-2 justify-end">
                  {categories.map((c: any) => (
                    <span
                      key={c.id}
                      className="rounded bg-gray-700/40 px-2 py-1 text-xs"
                    >
                      {c.name}
                    </span>
                  ))}
                </span>
              ) : (
                "—"
              )
            }
          />
          <Row
            label="Status"
            value={
              <span className={`rounded px-2 py-1 text-xs border ${statusCls}`}>
                {status}
              </span>
            }
          />
          {p.message ? (
            <div className="py-3">
              <p className="text-sm text-gray-400 mb-1">Message</p>
              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                {p.message}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
