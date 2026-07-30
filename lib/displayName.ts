/**
 * Resolves a human-readable name for a user record.
 *
 * Name is optional on accounts (phone-auth signups can complete registration
 * without one), so falling straight back to "Unknown" hides information we
 * actually have. This walks the identifiers we do hold, most human-friendly
 * first, so a card shows something recognisable instead of "Unknown Organizer".
 *
 *   "Jane Doe"  ->  full name (name + surName)
 *   "jane.doe"  ->  email local-part, when no name is set
 *   "12345992"  ->  phone number, when there's no email either
 *   fallback    ->  only when the record is empty or missing entirely
 */
export interface DisplayNameSource {
  name?: string | null;
  surName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export function getDisplayName(
  person: DisplayNameSource | null | undefined,
  fallback = "Unknown",
): string {
  if (!person) return fallback;

  const fullName = [person.name, person.surName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  if (fullName) return fullName;

  const email = person.email?.trim();
  if (email) return email.split("@")[0];

  const phone = person.phoneNumber?.trim();
  if (phone) return phone;

  return fallback;
}

/**
 * First character for an initials avatar, derived from the same resolution
 * order so the avatar and the label never disagree. Returns null when there's
 * nothing to show, so callers can render an icon instead.
 */
export function getInitial(
  person: DisplayNameSource | null | undefined,
): string | null {
  const resolved = getDisplayName(person, "");
  return resolved ? resolved.charAt(0).toUpperCase() : null;
}
