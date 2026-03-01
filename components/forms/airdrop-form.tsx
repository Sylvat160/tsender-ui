"use client";

import { useAirdropForm } from "@/hooks/use-airdrop-form";
import { FormGenerator } from "../form-generator";
import { FieldConfig } from "@/types";
import { AirdropSchema } from "@/schemas/airdrop.schema";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { CardContent, CardHeader, CardTitle, Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useChainId, useReadContracts, useConfig, useAccount } from "wagmi";
import { chainsToSender, erc20Abi, tsenderAbi } from "@/constants";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { parseAmounts, parseRecipients } from "@/utils";
import { toast } from "sonner";
import { CSpinner } from "../customs";
import { formatEther } from "viem";

const FORM_STORAGE_KEY = "tsender-airdrop-form";

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
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  async function getApprovedAmount(
    tsenderAddress: string | null,
    tokenAddress: string,
  ): Promise<bigint> {
    if (!tsenderAddress) {
      toast.warning("No Tsender address found, please use a supported network");
      return 0n;
    }
    // read from the chain (allowance)
    const res = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress as `0x${string}`],
    });
    // like calling token.allowance(account.address, tsenderAddress)
    return res as bigint;
  }

  const { form } = useAirdropForm(async (values) => {
    console.log("submit called", { chainId, values });
    // Handle form submission logic here (blockchain logic)
    // 1. we need to approve tsender contract to send out tokens
    // 1a. if already approved move to step 2
    // 2. call the airdrop function on tsender contract
    // 3. wait transaction to be mined
    if (!chainsToSender[chainId]) {
      toast.error("Unsupported network");
      return;
    }

    try {
      const tsenderAddress = chainsToSender[chainId]["tsender"];
      const approvedAmount = await getApprovedAmount(
        tsenderAddress,
        values.tokenAddress,
      );
      console.log({ ...values, isUnsafeMode, chainId, approvedAmount });
      const recipientList = parseRecipients(values.recipients);
      const amountList = parseAmounts(values.amounts);
      const totalAmount = amountList.reduce((sum, a) => sum + a, 0n);
      if (approvedAmount < totalAmount) {
        const approveTxHash = await writeContract(config, {
          abi: erc20Abi,
          address: values.tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tsenderAddress as `0x${string}`, totalAmount],
        });
        await waitForTransactionReceipt(config, { hash: approveTxHash });
      }

      await writeContract(config, {
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          values.tokenAddress as `0x${string}`,
          recipientList,
          amountList,
          totalAmount,
        ],
      });
      toast.success("Airdrop successful!");
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Airdrop failed: ${message}`);
      throw error;
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    form.setFieldValue("tokenAddress", parsed.tokenAddress ?? "");
    form.setFieldValue("amounts", parsed.amounts ?? "");
    form.setFieldValue("recipients", parsed.recipients ?? "");
  }, []);

  useEffect(() => {
    return form.store.subscribe(() => {
      localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify(form.store.state.values),
      );
    });
  }, []);

  // Reactively read form field values
  const tokenAddress = useStore(form.store, (s) => s.values.tokenAddress);
  const amountsRaw = useStore(form.store, (s) => s.values.amounts);
  const recipientsRaw = useStore(form.store, (s) => s.values.recipients);
  const recipientCount = parseRecipients(recipientsRaw).length;

  // Only query the chain when we have a valid-looking address
  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(tokenAddress);

  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
    ],
    query: { enabled: isValidAddress },
  });

  const decimals = tokenData?.[0]?.result as number | undefined;
  const tokenName = tokenData?.[1]?.result as string | undefined;

  const totalWei = useMemo(() => {
    try {
      return parseAmounts(amountsRaw).reduce((sum, a) => sum + a, 0n);
    } catch {
      return 0n;
    }
  }, [amountsRaw]);

  const totalTokens =
    decimals !== undefined && totalWei > 0n
      ? (Number(totalWei) / 10 ** decimals).toString()
      : undefined;

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
                    {tokenName ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">Amount (wei):</span>
                  <span className="font-mono text-zinc-900">
                    {totalWei > 0n ? totalWei.toString() : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">
                    Amount (tokens):
                  </span>
                  <span className="font-mono text-zinc-900">
                    {totalTokens ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <>
                  {isSubmitting && (
                    <CSpinner
                      message={`Sending ${tokenName ?? "tokens"} to ${recipientCount} recipients`}
                      endLabel={`${formatEther(totalWei)} ETH`}
                    />
                  )}
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                      isUnsafeMode
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isUnsafeMode ? "Send Tokens (Unsafe)" : "Send Tokens"}
                  </Button>
                </>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { AirdropForm };
