import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "FollowOps Games",
  description: "Global viral social games platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}