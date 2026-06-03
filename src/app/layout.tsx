import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medium Article RAG Assistant",
  description: "RAG assistant over Medium articles dataset",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
