import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { TelegramProvider, OfflineProvider, ErrorBoundaryProvider } from "../components/providers";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a1a",
};

export const metadata: Metadata = {
  title: "Telegram Web3 Gaming",
  description: "Play games, complete quests, and earn rewards in the Telegram Mini App",
  applicationName: "Telegram Web3 Gaming",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Web3 Gaming",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} font-sans antialiased min-h-screen-safe flex justify-center`}
        style={{ backgroundColor: '#0a0a1a' }}
      >
        <div 
          className="w-full overflow-hidden relative"
          style={{ 
            maxWidth: '100%',
            minHeight: '100vh',
            minHeight: '100dvh',
            background: "url('/background.png') no-repeat center center",
            backgroundSize: 'cover'
          }}
        >
          <ErrorBoundaryProvider>
            <TelegramProvider>
              <OfflineProvider>
                {children}
              </OfflineProvider>
            </TelegramProvider>
          </ErrorBoundaryProvider>
        </div>
      </body>
    </html>
  );
}
