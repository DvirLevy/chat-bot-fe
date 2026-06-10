import { ArrowDown, Globe, Server, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Layer {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
}

const ARCHITECTURE_LAYERS: Layer[] = [
  {
    icon: <Globe className="h-5 w-5" />,
    label: "React Frontend",
    sublabel: "Vite · TypeScript · shadcn/ui",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  },
  {
    icon: <Server className="h-5 w-5" />,
    label: "FastAPI Backend",
    sublabel: "WebSocket · REST · Python",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    label: "Telegram Bot",
    sublabel: "python-telegram-bot · Webhook",
    color:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  },
  {
    icon: <User className="h-5 w-5" />,
    label: "Telegram User",
    sublabel: "Remote participant",
    color:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  },
];

/**
 * SystemDesignPanel — visual architecture diagram.
 *
 * Shows the request flow: Browser → FastAPI → Telegram Bot → User.
 */
export function SystemDesignPanel() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          System Architecture
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <ol className="flex flex-col items-center gap-1" aria-label="Architecture layers">
          {ARCHITECTURE_LAYERS.map((layer, index) => (
            <li key={layer.label} className="flex w-full flex-col items-center gap-1">
              <div
                className={`flex w-full max-w-xs items-center gap-3 rounded-lg border px-4 py-3 ${layer.color}`}
              >
                <span aria-hidden="true">{layer.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{layer.label}</p>
                  <p className="text-xs opacity-75">{layer.sublabel}</p>
                </div>
              </div>

              {index < ARCHITECTURE_LAYERS.length - 1 && (
                <ArrowDown
                  className="h-4 w-4 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
          Messages flow bidirectionally via WebSocket ↔ Telegram Bot API
        </p>
      </CardContent>
    </Card>
  );
}
