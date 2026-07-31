"use client";

import { useMemo, useState } from "react";
import { Loader2, User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CommonInput from "@/components/ui/input";
import { useBussinessOwnerQuery } from "@/hooks/useBussinessOwnerMutations";
import { useCreateChatConversation } from "@/hooks/useChatMutations";
import { getDisplayName, getInitial } from "@/lib/displayName";
import { toast } from "react-toastify";

interface NewChatModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Ids the admin already has a conversation with - shown as "Existing". */
  existingUserIds?: string[];
  /** Called with the conversation id so the caller can open it immediately. */
  onCreated?: (conversationId: string) => void;
}

export default function NewChatModal({
  open,
  setOpen,
  existingUserIds = [],
  onCreated,
}: NewChatModalProps) {
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: ownersResponse, isLoading } = useBussinessOwnerQuery();
  const { mutate: createConversation } = useCreateChatConversation();

  // /admin/business-owners returns { data: [{ user, eventsInfo }] }
  const owners = useMemo(() => {
    const rows = ownersResponse?.data ?? ownersResponse ?? [];
    if (!Array.isArray(rows)) return [];

    return rows
      .map((row: any) => row?.user ?? row)
      .filter((user: any) => user?.id)
      .filter((user: any) => {
        if (!search.trim()) return true;
        const haystack = [
          getDisplayName(user, ""),
          user.email,
          user.phoneNumber,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      });
  }, [ownersResponse, search]);

  const handleStart = (user: any) => {
    setPendingId(user.id);

    createConversation(
      { user2Id: user.id },
      {
        onSuccess: (response: any) => {
          setPendingId(null);
          // The API returns an existing conversation if one already exists,
          // so this doubles as "open the chat with this owner".
          const conversationId = response?.id ?? response?.data?.id;
          setOpen(false);
          setSearch("");
          if (conversationId) onCreated?.(conversationId);
        },
        onError: (error: any) => {
          setPendingId(null);
          toast.error(
            error?.response?.data?.message || "Could not start the chat.",
          );
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearch("");
      }}
      title="New Chat"
      footer={
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Start a conversation with a business owner.
        </p>

        <CommonInput
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : owners.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {search.trim()
                ? "No business owners match your search."
                : "No business owners found."}
            </p>
          ) : (
            owners.map((user: any) => {
              const name = getDisplayName(user, "------");
              const initial = getInitial(user);
              const alreadyChatting = existingUserIds.includes(user.id);

              return (
                <button
                  key={user.id}
                  type="button"
                  disabled={pendingId === user.id}
                  onClick={() => handleStart(user)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black-400 transition-colors disabled:opacity-60 text-left"
                >
                  <span className="w-9 h-9 rounded-full bg-black-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={name}
                        className="w-9 h-9 object-cover"
                      />
                    ) : initial ? (
                      <span className="text-sm font-semibold uppercase">
                        {initial}
                      </span>
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{name}</span>
                    {user.phoneNumber && (
                      <span className="block text-xs text-gray-400 truncate">
                        {user.phoneNumber}
                      </span>
                    )}
                  </span>

                  {pendingId === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : alreadyChatting ? (
                    <span className="text-xs text-gray-500">Existing</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
