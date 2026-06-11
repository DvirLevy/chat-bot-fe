import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex h-full min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Outlet />
    </div>
  );
}
