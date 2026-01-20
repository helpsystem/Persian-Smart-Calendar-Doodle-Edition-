
export interface CalendarEvent {
  day: number;
  month: number;
  title: string;
  titleEn: string;
  type: 'holiday' | 'historical' | 'religious' | 'cultural';
  description?: string;
  descriptionEn?: string;
  narrative?: string;
  narrativeEn?: string;
  location?: string; // Physical address
  locationEn?: string;
  coords?: { lat: number; lng: number }; // GPS Coordinates for Maps Grounding
}

export interface PersianDateInfo {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER'
}

export interface DayState {
  date: Date;
  jalali: PersianDateInfo;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  events: CalendarEvent[];
}
