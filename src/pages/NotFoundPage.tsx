import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * NotFoundPage — 404 fallback route.
 *
 * Rendered for any path that doesn't match a defined route.
 * Provides a clear path back to the chat home.
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center p-4"
      role="main"
    >
      <Card className="w-full max-w-sm text-center shadow-md">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
            <AlertTriangle
              className="h-7 w-7 text-red-400 dark:text-red-300"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            404 — Page Not Found
          </CardTitle>
          <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-0">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Check the URL, or navigate back to the chat.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pt-5">
          <Button
            onClick={() => navigate("/")}
            className="gap-2"
            aria-label="Go back to home page"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
