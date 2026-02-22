import { TextareaFieldProps } from "@/types";
import { Textarea } from "../ui/textarea";

function TextareaField({ field, placeholder, disabled }: TextareaFieldProps) {
  return (
    <Textarea
      id={field.name}
      placeholder={placeholder}
      disabled={disabled}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}

export { TextareaField };
