import { AnyFieldApi } from "@tanstack/react-form";

export type InputType = "input" | "select" | "textarea";

export type SelectOptions = {
  label: string;
  value: string;
};

type BaseProps = {
  field: AnyFieldApi;
  placeholder?: string;
  description?: string;
  label?: string;
  required?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
};

// 3. Child component props (no inputType, no wrapper concerns)
export type InputFieldProps = Pick<
  BaseProps,
  "field" | "placeholder" | "disabled"
> & {
  type?: string;
};

export type TextareaFieldProps = Pick<
  BaseProps,
  "field" | "placeholder" | "disabled"
> & {
  lines?: number;
};

export type SelectFieldProps = Pick<
  BaseProps,
  "field" | "placeholder" | "disabled"
> & {
  options: SelectOptions[];
};

export type FormGeneratorProps = BaseProps & {
  inputType: InputType;
  type?: string;
  lines?: number;
  options?: SelectOptions[];
};

export type FieldConfig<TSchema extends Record<string, unknown>> = Omit<
  FormGeneratorProps,
  "field" | "inputType"
> & {
  name: keyof TSchema;
  inputType: FormGeneratorProps["inputType"];
};
