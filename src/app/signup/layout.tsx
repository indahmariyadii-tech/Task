import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Initialize Access",
  description: "Join TaskVibe and elevate your professional productivity.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
