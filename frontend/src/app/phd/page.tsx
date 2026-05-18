import { generatePhdMetadata, PhdPageView } from "@/components/phd/phd-page";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePhdMetadata;

export default function PhdPage() {
  return <PhdPageView />;
}
