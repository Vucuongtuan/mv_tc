import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse flex justify-center items-center rounded-md bg-muted",
        className
      )}
      {...props}
    >
      <span className="text-lg">Loading ...</span>
    </div>
  );
}

export { Skeleton };
