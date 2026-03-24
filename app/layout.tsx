import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRIS Task Planner",
  description: "MVP для управления задачами, дедлайнами и статусами выполнения.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
