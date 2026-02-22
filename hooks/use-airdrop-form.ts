import { useAppForm } from "./use-app-form";
import { airdropSchema, type AirdropSchema } from "@/schemas/airdrop.schema";

export function useAirdropForm(
  onSubmit: (value: AirdropSchema) => Promise<void>,
) {
  const { form } = useAppForm<AirdropSchema>({
    defaultValues: {
      tokenAddress: "",
      recipients: "",
      amounts: "",
    },
    schema: airdropSchema,
    onSubmit,
  });

  return {
    form,
  };
}
