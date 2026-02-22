import { AnyFieldApi } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

type Props = {
  field: AnyFieldApi;
  required: boolean;
  description?: string;
  showLabel?: boolean;
  label?: string;
  children: React.ReactNode;
};

// field label helper with required indicator
function FieldLabelHelper({
  field,
  required,
  showLabel = true,
  label,
}: {
  field: AnyFieldApi;
  required: boolean;
  showLabel?: boolean;
  label?: string;
}) {
  return (
    <FieldLabel htmlFor={field.name}>
      {showLabel && label && label}
      {required && <span className="text-red-500">*</span>}
    </FieldLabel>
  );
}

function FieldErrorMesages({ field }: { field: AnyFieldApi }) {
  const state = field.state;
  return state.meta.isTouched && state.meta.errors.length > 0 ? (
    <FieldError>
      {state.meta.errors.map((error, index) => (
        <div key={index}>{error.message}</div>
      ))}
    </FieldError>
  ) : null;
}

/**
 * @summary Wraps every field type. Handles the shell so individual inputs only care about their own <input>/<select>/<textarea>.
 * @param field
 * @param required
 * @param showLabel
 * @param description
 * @param children
 * @returns  JSX.Element
 */
function FieldWrapper({
  field,
  required,
  label,
  showLabel,
  description,
  children,
}: Props) {
  return (
    <Field>
      <FieldLabelHelper
        field={field}
        required={required}
        showLabel={showLabel}
        label={label}
      />
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldErrorMesages field={field} />
    </Field>
  );
}

export { FieldWrapper };
