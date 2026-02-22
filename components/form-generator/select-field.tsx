import { SelectFieldProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SelectField({ field, options, placeholder }: SelectFieldProps) {
  return (
    <Select
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
    >
      <SelectTrigger
        id={field.name}
        aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SelectField };
