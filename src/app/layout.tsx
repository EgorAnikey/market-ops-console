import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale } from "@/features/locale/locales";
import { WebVitals } from "@/features/observability/WebVitals";
import { getSession } from "@/server/auth/session";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Operations Console",
  description: "Portfolio performance across markets, with an evidence-backed assistant.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <Providers locale={locale} session={session}>
          {children}
        </Providers>
        <WebVitals />
      </body>
    </html>
  );
}
