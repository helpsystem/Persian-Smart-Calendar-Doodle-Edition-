
import { PersianDateInfo, Season } from '../types';

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const ENGLISH_MONTHS_JALALI = [
  'Farvardin', 'Ordibehesht', 'Khordad',
  'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar',
  'Dey', 'Bahman', 'Esfand'
];

export const GREGORIAN_MONTH_NAMES = [
  'March', 'April', 'May',
  'June', 'July', 'August',
  'September', 'October', 'November',
  'December', 'January', 'February'
];

export const getPersianDate = (date: Date, locale: 'fa' | 'en' = 'fa'): PersianDateInfo => {
  const parts = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long'
  }).formatToParts(date);

  const find = (type: string) => parts.find(p => p.type === type)?.value || '';
  const monthIdx = parseInt(find('month')) - 1;

  return {
    year: parseInt(find('year')),
    month: parseInt(find('month')),
    day: parseInt(find('day')),
    monthName: locale === 'fa' ? PERSIAN_MONTHS[monthIdx] : ENGLISH_MONTHS_JALALI[monthIdx],
    dayName: new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long' }).format(date)
  };
};

export const getSeason = (month: number): Season => {
  if (month >= 1 && month <= 3) return Season.SPRING;
  if (month >= 4 && month <= 6) return Season.SUMMER;
  if (month >= 7 && month <= 9) return Season.AUTUMN;
  return Season.WINTER;
};

export const getFirstDayOfMonth = (year: number, month: number): Date => {
  let date = new Date(year - 621, month - 1, 20);
  for (let i = 0; i < 60; i++) {
    const jd = getPersianDate(date);
    if (jd.month === month && jd.day === 1) break;
    date.setDate(date.getDate() + (jd.month < month || (jd.month === 12 && month === 1) ? 1 : -1));
  }
  return date;
};
