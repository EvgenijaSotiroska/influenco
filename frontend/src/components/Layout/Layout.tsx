import type { ReactNode } from "react";
import { Header } from "../Header/Header";
import "../Layout/Layout.css";
import { Footer } from "../Footer/Footer";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="page-shell">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}