import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Authorize Session",
  description: "Securely sign in to your TaskVibe workspace.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
