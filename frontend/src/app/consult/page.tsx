import {
  ConsultPageView,
  generateConsultMetadata,
} from "@/components/consult/consult-page";

export const dynamic = "force-dynamic";

export const metadata = generateConsultMetadata();

export default function ConsultPage() {
  return <ConsultPageView />;
}
