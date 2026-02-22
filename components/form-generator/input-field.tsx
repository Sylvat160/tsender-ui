import { InputFieldProps } from "@/types";
import { Input } from "../ui/input";

function InputField({ field, type, placeholder, disabled }: InputFieldProps) {
  return (
    <Input
      id={field.name}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}

export { InputField };
