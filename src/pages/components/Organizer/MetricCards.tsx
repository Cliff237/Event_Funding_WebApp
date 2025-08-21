import MetricCard from "./MetricCard";
import type { MetricCard as MetricCardType } from "./dashboard";

export default function MetricCards({ cards }: { cards: MetricCardType[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <MetricCard key={card.title} card={card} />
      ))}
    </div>
  );
}