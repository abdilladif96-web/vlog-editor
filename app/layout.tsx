import type { Metadata } from "next";
import { VideoProvider } from "@/context/VideoContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vlog Editor",
  description: "Chat-based vlog editing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <VideoProvider>
          {children}
        </VideoProvider>
      </body>
    </html>
  );
}
