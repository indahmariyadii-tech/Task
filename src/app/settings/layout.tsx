import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Preferences",
  description: "Personalize your TaskVibe experience and security settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
