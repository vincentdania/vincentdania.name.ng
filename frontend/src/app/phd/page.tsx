import { generatePhdMetadata, PhdPageView } from "@/components/phd/phd-page";

export const revalidate = 300;

export const generateMetadata = generatePhdMetadata;

export default function PhdPage() {
  return <PhdPageView />;
}
