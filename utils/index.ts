export const parseRecipients = (inputs: string): string[] => {
  return inputs
    .split(/[\n,]+/)
    .map((r) => r.trim())
    .filter(Boolean);
};

export const parseAmounts = (inputs: string): bigint[] => {
  return inputs
    .split(/[\n,]+/)
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => BigInt(r) * 10n ** 18n);
};
