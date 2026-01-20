
import { CalendarEvent } from '../types';

export const generateGoogleCalendarLink = (event: CalendarEvent, date: Date) => {
  const title = `${event.title} | ${event.titleEn}`;
  const description = `${event.description || ''}\n\n${event.descriptionEn || ''}\n\n${event.narrative || ''}`;
  const location = event.location || '';
  
  const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
};

export const downloadICS = (event: CalendarEvent, date: Date) => {
  const title = `${event.title} | ${event.titleEn}`;
  const description = `${event.description || ''} / ${event.descriptionEn || ''}`;
  const location = event.location || '';
  
  const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "").split('.')[0] + "Z";
  const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "").split('.')[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.titleEn.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
