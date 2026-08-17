import DayColumn from "./DayColumn";

type Stop = {
  id: string;
  name: string;
  position: number;
  start_time: string | null;
  note: string | null;
  rating?: number | null;
};
type Day = { dayIndex: number; date: string | null; places: Stop[] };

export default function ItineraryList({ days }: { days: Day[] }) {
  return (
    <div>
      {days.map((day) => (
        <DayColumn key={day.dayIndex} day={day} />
      ))}
    </div>
  );
}