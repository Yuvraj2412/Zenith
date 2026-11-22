export function formatTeamCode(registrationId: string): string {
  const clean = registrationId.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  return `ZEN-${clean.slice(0, 6)}`;
}

export function extractTeamHexPrefix(rawInput: string): string | null {
  const cleaned = rawInput
    .trim()
    .toUpperCase()
    .replace(/^ZEN[-_\s]*/, "")
    .replace(/[^A-F0-9]/g, "")
    .toLowerCase();

  if (cleaned.length < 4 || cleaned.length > 12) {
    return null;
  }
  return cleaned.slice(0, 6);
}
