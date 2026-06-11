import { formatDateLabel } from "@/lib/utils";

interface DateSeparatorProps {
  timestamp: string;
}

export function DateSeparator({ timestamp }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-1" role="separator">
      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        {formatDateLabel(timestamp)}
      </span>
    </div>
  );
}
