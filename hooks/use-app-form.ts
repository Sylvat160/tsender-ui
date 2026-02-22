import { useForm, type StandardSchemaV1 } from "@tanstack/react-form";
type UseAppFormOptions<TValues extends Record<string, unknown>> = {
  defaultValues: TValues;
  schema: StandardSchemaV1<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useAppForm<TValues extends Record<string, unknown>>(
  options: UseAppFormOptions<TValues>,
) {
  const form = useForm({
    defaultValues: options.defaultValues,
    validators: options.schema ? { onChange: options.schema } : undefined,
    onSubmit: async ({ value }) => {
      try {
        await options.onSubmit(value);
        options.onSuccess?.();
      } catch (error) {
        options.onError?.(error);
      }
    },
  });

  return { form };
}
