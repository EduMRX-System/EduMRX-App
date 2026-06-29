import type { Metadata } from "next";

// Override metadataBase so icon <link> tags in <head> use login.edumrx.uz
// instead of edumrx.uz (inherited from root layout). Google attributes
// the favicon to the subdomain it crawls, not the metadataBase of the parent.
export const metadata: Metadata = {
  metadataBase: new URL("https://login.edumrx.uz"),
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="">{children}</div>;
}
