import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { AirdropForm } from "./airdrop-form";
// import "@testing-library/jest-dom";

vi.mock("wagmi", () => ({
  useChainId: () => 31337,
  useAccount: () => ({
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  }),
  useConfig: () => ({}),
  useReadContracts: () => ({ data: undefined }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("AIRDROP FORM", () => {
  it("renders all form fields", () => {
    renderWithProviders(<AirdropForm />);
    expect(screen.getByText("Token Address")).toBeInTheDocument();
    expect(screen.getByText("Recipients")).toBeInTheDocument();
    expect(screen.getByText("Amounts")).toBeInTheDocument();
    expect(screen.getByText("Unsafe")).toBeInTheDocument();
  });
});
