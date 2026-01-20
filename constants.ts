
import { CalendarEvent } from './types';

// Default location for Church events (e.g., Saint Sarkis Cathedral, Tehran)
const CHURCH_LOCATION = {
  address: 'تهران، خیابان کریمخان زند، نبش خیابان استاد نجات‌اللهی، کلیسای جامع سرکیس مقدس',
  addressEn: 'Saint Sarkis Cathedral, Karimkhan Zand St, Tehran, Iran',
  coords: { lat: 35.7036, lng: 51.4150 }
};

export const STATIC_EVENTS: CalendarEvent[] = [
  // --- Ancient Persian Festivals ---
  { 
    month: 1, day: 1, title: 'جشن نوروز', titleEn: 'Nowruz Festival', type: 'cultural', 
    description: 'آغاز سال نو خورشیدی و رستاخیز طبیعت', 
    descriptionEn: 'The Persian New Year and the rebirth of nature',
    narrative: 'نوروز نماد پیروزی نور بر تاریکی و کهن‌ترین جشن ایرانی است که همزمان با اعتدال بهاری آغاز می‌شود.',
    narrativeEn: 'Nowruz symbolizes the victory of light over darkness and is the oldest Persian festival, beginning exactly at the vernal equinox.'
  },
  { 
    month: 1, day: 13, title: 'سیزده‌بدر', titleEn: 'Nature Day', type: 'cultural',
    description: 'روز آشتی با طبیعت',
    descriptionEn: 'The day of reconciliation with nature',
    narrative: 'ایرانیان در این روز به دشت و صحرا می‌روند تا آخرین روز جشن‌های نوروزی را در آغوش طبیعت سپری کنند.',
    narrativeEn: 'On this day, Persians head to the outdoors to spend the final day of Nowruz holidays in the embrace of nature.'
  },
  { 
    month: 4, day: 10, title: 'جشن تیرگان', titleEn: 'Tirgan Festival', type: 'cultural',
    description: 'جشن آب‌ریزگان و بزرگداشت آرش کمانگیر',
    descriptionEn: 'The festival of water and commemoration of Arash the Archer',
    narrative: 'تیرگان یادآور حماسه تعیین مرزهای ایران توسط آرش کمانگیر و جشنی برای طلب باران است.',
    narrativeEn: 'Tirgan commemorates the epic boundary-setting of Iran by Arash the Archer and is a festival to pray for rain.'
  },
  { 
    month: 7, day: 16, title: 'جشن مهرگان', titleEn: 'Mehregan Festival', type: 'cultural',
    description: 'جشن مهر، دوستی و اعتدال پاییزی',
    descriptionEn: 'The festival of love, friendship, and the autumnal equinox',
    narrative: 'مهرگان پس از نوروز بزرگترین جشن ایرانی است که بر پایه دوستی و پیمان‌داری بنا شده است.',
    narrativeEn: 'After Nowruz, Mehregan is the largest Persian festival, built upon the values of friendship and covenant.'
  },
  { 
    month: 9, day: 30, title: 'شب یلدا', titleEn: 'Yalda Night', type: 'cultural', 
    description: 'جشن بلندترین شب سال و زایش خورشید', 
    descriptionEn: 'The celebration of the longest night and the birth of the Sun',
    narrative: 'یلدا نماد غلبه نور بر تاریکی است؛ شبی که خانواده‌ها گرد هم می‌آیند تا طلوع خورشید را نظاره‌گر باشند.',
    narrativeEn: 'Yalda symbolizes the victory of light over darkness; a night when families gather to witness the rising of the new Sun.'
  },
  
  // --- Christian Holidays with Locations ---
  { 
    month: 10, day: 4, title: 'میلاد حضرت مسیح (غربی)', titleEn: 'Christmas Day (Western)', type: 'holiday',
    description: 'جشن ولادت عیسی مسیح منجی عالم',
    descriptionEn: 'The celebration of the birth of Jesus Christ, Savior of the world',
    narrative: 'تجلی کلمه خدا در جسم؛ روزی که مژده رهایی و عشق الهی به تمامی جهانیان ابلاغ شد.',
    narrativeEn: 'The manifestation of the Word of God in flesh; the day the news of liberation and divine love reached the world.',
    location: CHURCH_LOCATION.address,
    locationEn: CHURCH_LOCATION.addressEn,
    coords: CHURCH_LOCATION.coords
  },
  { 
    month: 1, day: 7, title: 'میلاد مسیح (ارتدکس)', titleEn: 'Christmas (Orthodox)', type: 'holiday',
    description: 'ولادت منجی در تقویم کلیساهای شرقی',
    descriptionEn: 'The birth of the Savior according to the Eastern Church calendar',
    narrative: 'بسیاری از جوامع ارتدکس و شرقی، میلاد مسیح را در این روز با آیین‌های خاص خود جشن می‌گیرند.',
    narrativeEn: 'Many Orthodox and Eastern communities celebrate the birth of Christ on this day with their unique traditions.',
    location: CHURCH_LOCATION.address,
    locationEn: CHURCH_LOCATION.addressEn,
    coords: CHURCH_LOCATION.coords
  },
  { 
    month: 4, day: 10, title: 'عید تادئوس مقدس (قره کلیسا)', titleEn: 'Feast of St. Thaddeus', type: 'religious',
    description: 'زیارت سالانه در قدیمی‌ترین کلیسای جهان',
    descriptionEn: 'Annual pilgrimage to one of the world\'s oldest churches',
    narrative: 'یادبود شهادت سنت تادئوس که آیین مسیحیت را به فلات ایران و ارمنستان آورد.',
    narrativeEn: 'Commemorating the martyrdom of St. Thaddeus, who brought Christianity to the Persian plateau and Armenia.',
    location: 'آذربایجان غربی، ماکو، کلیسای تادئوس مقدس (قره کلیسا)',
    locationEn: 'Monastery of Saint Thaddeus, Maku, West Azerbaijan, Iran',
    coords: { lat: 39.0921, lng: 44.5436 }
  },
  { 
    month: 5, day: 24, title: 'عروج مریم مقدس', titleEn: 'Assumption of Mary', type: 'religious',
    description: 'انتقال جسمانی و روحانی مریم عذرا به آسمان',
    descriptionEn: 'The bodily and spiritual assumption of the Virgin Mary into heaven',
    narrative: 'جشنی بزرگ برای تکریم مقام والای مادر خداوند و پایان زندگی زمینی او.',
    narrativeEn: 'A major feast honoring the exalted status of the Mother of God and the end of her earthly life.',
    location: CHURCH_LOCATION.address,
    locationEn: CHURCH_LOCATION.addressEn,
    coords: CHURCH_LOCATION.coords
  }
];
