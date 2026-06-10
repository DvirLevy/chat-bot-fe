import { Outlet } from "react-router-dom";

/**
 * MainLayout — root layout wrapper.
 *
 * Provides a full-height container for all routed pages.
 * Extend here for global nav, toasts, or theme providers.
 */
export function MainLayout() {
  return (
    <div className="flex h-full min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Outlet />
    </div>
  );
}
