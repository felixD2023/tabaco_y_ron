import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import SiteProvider from "@/components/SiteProvider";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabaco & Ron — El arte de fumar",
  description:
    "Curaduría de habanos y accesorios desde 2009. Una selección curada de los mejores habanos del mundo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={lato.variable}>
      <body>
        <SiteProvider>
          <TopBar />
          <main>{children}</main>
          <Footer />
          <ProductModal />
        </SiteProvider>
      </body>
    </html>
  );
}
