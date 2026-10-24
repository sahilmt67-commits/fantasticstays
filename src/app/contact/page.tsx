import { ContactFormSection } from "@/app/contact/contact-form";
import { getSiteFooter } from "@/lib/villa-api";

export default async function ContactPage() {
  const settings = await getSiteFooter();
  return <ContactFormSection settings={settings} />;
}
