import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
  onNavigate: (page: string) => void;
  activePage: string;
};

export default function Layout({
  children,
  onNavigate,
  activePage,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar onNavigate={onNavigate} activePage={activePage} />
      <main className="flex-1 bg-bg overflow-x-auto">
        <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
