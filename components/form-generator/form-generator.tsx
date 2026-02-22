"use client";

import { FormGeneratorProps } from "@/types";
import { FieldWrapper } from "./field-wrapper";
import { TextareaField } from "./text-area";
import { InputField } from "./input-field";
import { SelectField } from "./select-field";

export function FormGenerator(props: FormGeneratorProps) {
  const {
    field,
    placeholder,
    inputType,
    description,
    required = true,
    disabled,
    showLabel = true,
    label,
  } = props;
  const wrapper = (children: React.ReactNode) => (
    <FieldWrapper
      field={field}
      required={required}
      showLabel={showLabel}
      description={description}
      label={label}
    >
      {children}
    </FieldWrapper>
  );

  switch (inputType) {
    case "textarea":
      return wrapper(
        <TextareaField
          field={field}
          placeholder={placeholder}
          disabled={disabled}
          lines={props.lines}
        />,
      );

    case "select":
      return wrapper(
        <SelectField
          field={field}
          placeholder={placeholder}
          disabled={disabled}
          options={props.options || []}
        />,
      );

    case "input":
      return wrapper(
        <InputField
          field={field}
          type={props.type}
          placeholder={placeholder}
          disabled={disabled}
        />,
      );

    default:
      return null;
  }
}
