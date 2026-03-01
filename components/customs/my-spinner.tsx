import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface MSpinnerProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
  description?: string;
  endLabel?: string;
}

export function CSpinner({
  message,
  className,
  children,
  description,
  endLabel,
}: MSpinnerProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-xs flex-col gap-4 [--radius:1rem]",
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            {message && (
              <ItemTitle className="line-clamp-1">{message}</ItemTitle>
            )}
            {description && <ItemDescription>{description}</ItemDescription>}
          </ItemContent>
          {endLabel && (
            <ItemContent className="flex-none justify-end">
              <span className="text-sm tabular-nums">{endLabel}</span>
            </ItemContent>
          )}
        </Item>
      )}
    </div>
  );
}
