import { describe, expect, it } from "vitest";
import { parseRecipients, parseAmounts } from "./index";

describe("Testing parseRecipients Utils", () => {
  const expectedRecipients = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0x1234567890abcdef1234567890abcdef12345684",
    "0x1234567890abcdef1234567890abcdef12346598",
  ];
  it("test parseRecipients with commas separated", () => {
    const recipients =
      "0x1234567890abcdef1234567890abcdef12345678, 0x1234567890abcdef1234567890abcdef12345684, 0x1234567890abcdef1234567890abcdef12346598";
    const parsedRecipients = parseRecipients(recipients);
    expect(parsedRecipients).toEqual(expectedRecipients);
  });

  it("test parseRecipients with new line", () => {
    const recipients =
      "0x1234567890abcdef1234567890abcdef12345678\n0x1234567890abcdef1234567890abcdef12345684\n0x1234567890abcdef1234567890abcdef12346598";
    const parsedRecipients = parseRecipients(recipients);
    expect(parsedRecipients).toEqual(expectedRecipients);
  });

  it("test parseRecipients with new line and commas", () => {
    const recipients =
      "0x1234567890abcdef1234567890abcdef12345678, 0x1234567890abcdef1234567890abcdef12345684\n0x1234567890abcdef1234567890abcdef12346598";
    const parsedRecipients = parseRecipients(recipients);
    expect(parsedRecipients).toEqual(expectedRecipients);
  });

  it("Test parseRecipient with empty string", () => {
    const parsedRecipients = parseRecipients("");
    expect(parsedRecipients).toEqual([]);
  });
});

describe("Testing parseAmounts Utils", () => {
  const expectedAmounts: bigint[] = [
    100n * 10n ** 18n,
    200n * 10n ** 18n,
    300n * 10n ** 18n,
  ];
  it("test parseAmounts with commas separated", () => {
    const amounts = "100, 200, 300";
    const parsedAmounts = parseAmounts(amounts);
    expect(parsedAmounts).toEqual(expectedAmounts);
  });

  it("test parseAmounts with new line", () => {
    const amounts = "100\n200\n300";
    const parsedAmounts = parseAmounts(amounts);
    expect(parsedAmounts).toEqual(expectedAmounts);
  });

  it("test parseAmounts with new line and commas", () => {
    const amounts = "100, 200\n300";
    const parsedAmounts = parseAmounts(amounts);
    expect(parsedAmounts).toEqual(expectedAmounts);
  });

  it("Test parseAmounts with empty string", () => {
    const parsedAmounts = parseAmounts("");
    expect(parsedAmounts).toEqual([]);
  });
});
