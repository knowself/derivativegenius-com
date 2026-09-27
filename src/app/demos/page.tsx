import { DemosShowcase } from "@/components/DemosShowcase";

export const metadata = {
  title: "Demo Lab | Derivative Genius",
  description:
    "Try our live AI demos and see scoped client work — chatbots, intake assistants, and marketing systems built by Derivative Genius.",
};

export default function DemosPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <DemosShowcase />
    </main>
  );
}
