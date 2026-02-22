"use client";

import { useAirdropForm } from "@/hooks/use-airdrop-form";
import { FormGenerator } from "../form-generator";
import { FieldConfig } from "@/types";
import { AirdropSchema } from "@/schemas/airdrop.schema";
import { useState } from "react";
import { CardContent, CardHeader, CardTitle, Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useChainId, useReadContract, useConfig, useAccount } from "wagmi";
import { chainsToSender, erc20Abi } from "@/constants";
import { readContract } from "@wagmi/core";

const AIRDROP_FORM_FIELDS: FieldConfig<AirdropSchema>[] = [
  {
    name: "tokenAddress",
    label: "Token Address",
    inputType: "input",
    placeholder: "0x...",
  },
  {
    name: "recipients",
    label: "Recipients",
    inputType: "textarea",
    placeholder: "0x...",
  },
  {
    name: "amounts",
    label: "Amounts",
    inputType: "textarea",
    placeholder: "100",
  },
];

const AirdropForm = () => {
  const [isUnsafeMode, setIsUnsafeMode] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  async function getApprovedAmount(
    tsenderAddress: string | null,
  ): Promise<number> {
    if (!tsenderAddress) {
      alert("No Tsender address found, please use a supported network");
      return 0;
    }
    // read from the chain (allowance)
    const res = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress as `0x${string}`],
    });
    // like calling token.allowance(account.address, tsenderAddress)
    return res as number;
  }

  const { form } = useAirdropForm(async (values) => {
    // Handle form submission logic here (blockchain logic)
    console.log({ ...values, isUnsafeMode, chainId });
    // 1. we need to approve tsender contract to send out tokens
    // 1a. if already approved move to step 2
    // 2. call the airdrop function on tsender contract
    // 3. wait transaction to be mined
    const tsenderAddress = chainsToSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tsenderAddress);
  });

  return (
    <div className="flex justify-center px-a py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>T-Sender</CardTitle>
          <Tabs
            defaultValue="safe"
            onValueChange={(v) => setIsUnsafeMode(v === "unsafe")}
          >
            <TabsList>
              <TabsTrigger value="safe">Safe</TabsTrigger>
              <TabsTrigger value="unsafe">Unsafe</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {AIRDROP_FORM_FIELDS.map((f, id) => (
              <form.Field key={id} name={f.name}>
                {(field) => (
                  <FormGenerator
                    field={field}
                    placeholder={f.placeholder}
                    inputType={f.inputType}
                    disabled={f.disabled}
                    description={f.description}
                    required={f.required}
                    lines={f.lines}
                    label={f.label}
                  />
                )}
              </form.Field>
            ))}

            <div className="bg-sidebar-accent-foreground border border-secondary-foreground rounded-lg p-4">
              <h3 className="text-sm font-medium text-zinc-900 mb-3">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">Token Name:</span>
                  <span className="font-mono text-zinc-900">
                    {/*{tokenData?.[1]?.result as string}*/}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">Amount (wei):</span>
                  <span className="font-mono text-zinc-900">{amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">
                    Amount (tokens):
                  </span>
                  <span className="font-mono text-zinc-900">
                    {/*{formatTokenAmount(total, tokenData?.[0]?.result as number)}*/}
                  </span>
                </div>
              </div>
            </div>

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                    isUnsafeMode
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting
                    ? "Sending..."
                    : isUnsafeMode
                      ? "Send Tokens (Unsafe)"
                      : "Send Tokens"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { AirdropForm };
