export type Stop = {
  id: string;
  name: string;
  position: number;
  start_time: string | null;
  note: string | null;
  rating?: number | null;
  google_place_id?: string;
};

export type Day = {
  dayId: string;
  dayIndex: number;
  date: string | null;
  places: Stop[];
};