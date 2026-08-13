// Values must byte-match the backend's PERMISSION enum
// (osado--backend/src/subAdminPermissions/enums/sub-admin-permission.enum.ts).
export const SUB_ADMIN_PERMISSION = {
  MANAGE_EVENTS: "manage_events",
  MANAGE_INFLUENCERS: "manage_influencers",
  HANDLE_TRANSACTIONS: "handle_transactions",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_REFUNDS: "manage_refunds",
} as const;

export type SubAdminPermission =
  (typeof SUB_ADMIN_PERMISSION)[keyof typeof SUB_ADMIN_PERMISSION];

export const SUB_ADMIN_PERMISSION_LABELS: Record<SubAdminPermission, string> = {
  [SUB_ADMIN_PERMISSION.MANAGE_EVENTS]: "Manage Events",
  [SUB_ADMIN_PERMISSION.MANAGE_INFLUENCERS]: "Manage Influencers",
  [SUB_ADMIN_PERMISSION.HANDLE_TRANSACTIONS]: "Handle Transactions",
  [SUB_ADMIN_PERMISSION.VIEW_ANALYTICS]: "View Analytics",
  [SUB_ADMIN_PERMISSION.MANAGE_CATEGORIES]: "Manage Categories",
  [SUB_ADMIN_PERMISSION.MANAGE_REFUNDS]: "Manage Refunds",
};
