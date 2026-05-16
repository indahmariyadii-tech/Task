import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Initialize Access",
  description: "Join Flow and elevate your professional productivity.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
