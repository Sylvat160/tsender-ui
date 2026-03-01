import { describe, it, expect } from "vitest";
import { airdropSchema } from "./airdrop.schema";

describe("AIRDROP SCHEMA TEST", () => {
  const invalidCases = [
    {
      name: "empty fields",
      input: {
        tokenAddress: "",
        recipients: "",
        amounts: "",
      },
    },
    {
      name: "empty tokenAddress",
      input: {
        tokenAddress: "",
        recipients: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        amounts: "10",
      },
    },
    {
      name: "empty recipient",
      input: {
        tokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        recipients: "",
        amounts: "10",
      },
      // expectedError: "At least one recipient is required",
    },
    {
      name: "empty amounts",
      input: {
        tokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        recipients: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        amounts: "",
      },
    },
    {
      name: "invalid address",
      input: {
        tokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F05", // length => 40 instead of 42
        recipients: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        amounts: "10",
      },
    },
    {
      name: "doesnt start with 0x",
      input: {
        tokenAddress: "0000e7f1725E7734CE288F8367e1Bb143E90bb3F05",
        recipients: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        amounts: "10",
      },
    },
  ];

  it.each(invalidCases)("$name should fail", ({ input }) => {
    const result = airdropSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("Test valid schema to be true", () => {
    const result = airdropSchema.safeParse({
      tokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      recipients: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      amounts: "10",
    });
    expect(result.success).toBe(true);
    // expect(result.error?.issues[0]?.message).toBe(expectedError);
    // expect(result.data?.tokenAddress).toBe("");
  });
});
