import { ReactNode } from 'react';
import Sidebar from "./Sidebar";
import "./Layout.css";

type LayoutProps = {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="content">{children}</main>
    </div>
  );
}

