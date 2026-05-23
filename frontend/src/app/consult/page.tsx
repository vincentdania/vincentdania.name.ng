import {
  ConsultPageView,
  generateConsultMetadata,
} from "@/components/consult/consult-page";

export const revalidate = 300;

export const metadata = generateConsultMetadata();

export default function ConsultPage() {
  return <ConsultPageView />;
}
