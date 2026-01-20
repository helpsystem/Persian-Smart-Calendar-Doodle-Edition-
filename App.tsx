
import React, { useState, useEffect, useMemo } from 'react';
import { getPersianDate, getSeason, getFirstDayOfMonth } from './utils/jalali';
import { DayState, Season } from './types';
import { STATIC_EVENTS } from './constants';
import CalendarHeader from './components/CalendarHeader';
import SeasonalEffects from './components/SeasonalEffects';
import { getDailyInsight } from './services/geminiService';
import { generateGoogleCalendarLink, downloadICS } from './utils/calendarSync';
import { Sparkles, X, BookOpen, CalendarPlus, Download, History, Info, Heart, MapPin, Navigation, Plus, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';

const App: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const initialPersian = useMemo(() => getPersianDate(today, 'fa'), [today]);

  const [currentYear, setCurrentYear] = useState(initialPersian.year);
  const [currentMonth, setCurrentMonth] = useState(initialPersian.month);
  const [selectedDay, setSelectedDay] = useState<DayState | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<{ 
    insight: { fa: string; en: string }; 
    prayer: { fa: string; en: string };
    traffic?: { fa: string; en: string; links?: string[] };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location access denied", err)
      );
    }
  }, []);

  const days: DayState[] = useMemo(() => {
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays: DayState[] = [];
    const dayOfWeek = firstDay.getDay(); 
    // Saturday is the start of the week in Persian calendar.
    // getDay() is 0 (Sun) to 6 (Sat).
    // Mapping: Sat(6)->0, Sun(0)->1, Mon(1)->2, Tue(2)->3, Wed(3)->4, Thu(4)->5, Fri(5)->6
    const adjustedStart = (dayOfWeek + 1) % 7;
    const startOffset = new Date(firstDay);
    startOffset.setDate(startOffset.getDate() - adjustedStart);

    for (let i = 0; i < 42; i++) {
      const d = new Date(startOffset);
      d.setDate(d.getDate() + i);
      const jd = getPersianDate(d, 'fa');
      const isCurrentMonth = jd.month === currentMonth;
      const events = STATIC_EVENTS.filter(e => e.month === jd.month && e.day === jd.day);
      const isSunday = d.getDay() === 0;
      const isHoliday = events.some(e => e.type === 'holiday') || isSunday;

      calendarDays.push({
        date: d,
        jalali: jd,
        isCurrentMonth,
        isToday: jd.year === initialPersian.year && jd.month === initialPersian.month && jd.day === initialPersian.day,
        isHoliday,
        events
      });
    }
    return calendarDays;
  }, [currentYear, currentMonth, initialPersian]);

  const season = getSeason(currentMonth);

  const handleDayClick = async (day: DayState) => {
    setSelectedDay(day);
    setData(null);
    setIsLoading(true);
    
    const eventWithLocation = day.events.find(e => !!e.location);
    
    const result = await getDailyInsight(
      day.jalali.day, 
      day.jalali.monthName, 
      day.jalali.year, 
      day.date.toDateString(),
      userLocation,
      eventWithLocation?.location
    );
    setData(result);
    setIsLoading(false);
  };

  const weekDays = [
    { fa: 'شنبه', en: 'Saturday' }, { fa: 'یکشنبه', en: 'Sunday' }, { fa: 'دوشنبه', en: 'Monday' },
    { fa: 'سه‌شنبه', en: 'Tuesday' }, { fa: 'چهارشنبه', en: 'Wednesday' }, { fa: 'پنجشنبه', en: 'Thursday' },
    { fa: 'جمعه', en: 'Friday' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-slate-50 font-vazir" dir="rtl">
      <SeasonalEffects season={season} />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 flex flex-col lg:row gap-8 lg:flex-row">
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col">
          <CalendarHeader 
            monthIndex={currentMonth}
            year={currentYear}
            season={season}
            onNext={() => currentMonth === 12 ? (setCurrentYear(y => y + 1), setCurrentMonth(1)) : setCurrentMonth(m => m + 1)}
            onPrev={() => currentMonth === 1 ? (setCurrentYear(y => y - 1), setCurrentMonth(12)) : setCurrentMonth(m => m - 1)}
            onToday={() => { setCurrentYear(initialPersian.year); setCurrentMonth(initialPersian.month); }}
          />

          <div className="grid grid-cols-7 border-t border-slate-100">
            {weekDays.map(d => (
              <div key={d.en} className="py-4 text-center border-b border-slate-50 bg-slate-50/30">
                <div className="text-[10px] lg:text-xs font-bold text-slate-500">{d.fa}</div>
                <div className="text-[8px] lg:text-[10px] font-medium text-slate-300 font-sans uppercase tracking-widest">{d.en}</div>
              </div>
            ))}
            {days.map((day, idx) => (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`relative h-24 lg:h-32 p-3 border-r border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-100/60 group
                  ${!day.isCurrentMonth ? 'opacity-20 pointer-events-none' : ''}
                  ${day.isToday ? 'bg-indigo-50/40' : ''}
                  ${day.isHoliday && day.isCurrentMonth ? 'bg-red-50/20' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-xl text-xs lg:text-sm font-bold transition-all
                    ${day.isHoliday ? 'text-red-600' : 'text-slate-700'}
                    ${day.isToday ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-transparent'}
                    group-hover:scale-105`}>
                    {day.jalali.day}
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">{day.date.getDate()}</span>
                </div>
                
                <div className="mt-2 space-y-1 overflow-hidden">
                  {day.events.slice(0, 2).map((e, i) => (
                    <div key={i} className={`text-[8px] lg:text-[9px] px-2 py-0.5 rounded-md font-medium border-r-2 flex items-center justify-between gap-1
                      ${e.type === 'holiday' ? 'bg-red-50 text-red-700 border-red-400' : 
                        e.type === 'religious' ? 'bg-purple-50 text-purple-700 border-purple-400' : 'bg-amber-50 text-amber-700 border-amber-400'}`}>
                      <div className="truncate flex-1">{e.title}</div>
                      {e.location && <MapPin size={8} className="shrink-0 text-slate-400/70" />}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="flex items-center gap-1 text-[7px] lg:text-[8px] text-slate-400 font-bold px-1 py-0.5 mt-0.5">
                      <Plus size={8} className="shrink-0" />
                      <span>{day.events.length - 2} رویداد بیشتر</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-[30rem] space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar">
          {selectedDay ? (
            <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white/50 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                    {selectedDay.jalali.day} {selectedDay.jalali.monthName}
                    <span className="text-xl font-light text-slate-400 font-sans">{selectedDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">{selectedDay.jalali.dayName} | {selectedDay.date.getFullYear()}</p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all group">
                  <X size={24} className="text-slate-400 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Traffic & Navigation Insight */}
                <section className="p-6 bg-emerald-50/40 rounded-[2rem] border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-5">
                    <Navigation className="text-emerald-600" size={24} />
                    <h3 className="text-base font-black text-emerald-900">وضعیت ترافیک و مسیر | Traffic</h3>
                  </div>
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-3 bg-emerald-200/50 rounded-full w-full"></div>
                      <div className="h-3 bg-emerald-200/50 rounded-full w-4/6"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-emerald-800 leading-relaxed font-bold">{data?.traffic?.fa || "ترافیک روان و بدون محدودیت خاصی پیش‌بینی می‌شود."}</p>
                      <p className="text-xs text-emerald-700/60 font-sans" dir="ltr">{data?.traffic?.en || "Traffic is expected to be smooth and without significant restrictions."}</p>
                      
                      {data?.traffic?.links && data.traffic.links.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-emerald-200/30">
                          <p className="text-[10px] font-black text-emerald-900 mb-3 uppercase tracking-wider">منابع تأیید شده | Grounding Sources</p>
                          <div className="flex flex-wrap gap-2">
                            {data.traffic.links.map((link, i) => (
                              <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] bg-white text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                                <ExternalLink size={12} />
                                منبع نقشه {i + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDay.events.map((e, idx) => e.location && (
                        <div key={idx} className="mt-4 p-4 bg-white/80 rounded-2xl border border-emerald-100 shadow-sm">
                           <div className="flex items-start gap-3">
                             <MapPin className="text-emerald-500 shrink-0 mt-1" size={18} />
                             <div className="flex-1">
                               <p className="text-xs font-black text-slate-800 leading-tight">{e.location}</p>
                               <p className="text-[10px] text-slate-400 font-sans mt-1" dir="ltr">{e.locationEn}</p>
                               <button 
                                 onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${e.coords?.lat},${e.coords?.lng}`, '_blank')}
                                 className="mt-3 text-[10px] bg-emerald-600 text-white px-4 py-2 rounded-xl font-black hover:bg-emerald-700 transition-colors flex items-center gap-2"
                               >
                                 <Navigation size={12} />
                                 مسیریابی هوشمند | Directions
                               </button>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* AI Insights */}
                <section className="p-6 bg-indigo-50/40 rounded-[2rem] border border-indigo-100/50">
                  <div className="flex items-center gap-3 mb-5">
                    <Sparkles className="text-indigo-600" size={24} />
                    <h3 className="text-base font-black text-indigo-900">تحلیل و بینش روز | AI Insight</h3>
                  </div>
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-3 bg-indigo-200/50 rounded-full w-full"></div>
                      <div className="h-3 bg-indigo-200/50 rounded-full w-5/6"></div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <p className="text-sm text-indigo-900 leading-relaxed text-justify font-medium">{data?.insight.fa}</p>
                      <p className="text-xs text-indigo-700/60 leading-relaxed font-sans" dir="ltr">{data?.insight.en}</p>
                    </div>
                  )}
                </section>

                {/* Daily Prayer */}
                <section className="p-6 bg-rose-50/40 rounded-[2rem] border border-rose-100/50">
                  <div className="flex items-center gap-3 mb-5">
                    <Heart className="text-rose-600" size={24} />
                    <h3 className="text-base font-black text-rose-900">نیایش روزانه | Prayer</h3>
                  </div>
                  {isLoading ? (
                     <div className="space-y-4 animate-pulse">
                       <div className="h-3 bg-rose-200/50 rounded-full w-full"></div>
                       <div className="h-3 bg-rose-200/50 rounded-full w-4/6"></div>
                     </div>
                  ) : (
                    <div className="space-y-5 text-center px-4">
                      <p className="text-base text-rose-900 leading-relaxed italic font-black">"{data?.prayer.fa}"</p>
                      <p className="text-xs text-rose-700/60 font-sans italic" dir="ltr">"{data?.prayer.en}"</p>
                    </div>
                  )}
                </section>

                {/* Events List */}
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">رویدادهای ثبت شده | Events</h3>
                  {selectedDay.events.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50/40 rounded-3xl border-2 border-dashed border-slate-100">
                      <p className="text-xs text-slate-400 font-bold italic">رویداد خاصی برای این تاریخ ثبت نشده است.</p>
                    </div>
                  ) : (
                    selectedDay.events.map((event, i) => (
                      <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-5">
                          <div className={`w-2 h-10 rounded-full ${event.type === 'holiday' ? 'bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : event.type === 'religious' ? 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]'}`} />
                          <div>
                            <p className="text-base font-black text-slate-800">{event.title}</p>
                            <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider mt-1" dir="ltr">{event.titleEn}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => window.open(generateGoogleCalendarLink(event, selectedDay.date), '_blank')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-[10px] font-black text-slate-700 rounded-2xl border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                          >
                            <CalendarIcon size={14} />
                            GOOGLE
                          </button>
                          <button 
                            onClick={() => downloadICS(event, selectedDay.date)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-[10px] font-black text-slate-700 rounded-2xl border border-slate-100 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all"
                          >
                            <Download size={14} />
                            ICS FILE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white/95 backdrop-blur-md rounded-[2.5rem] p-12 shadow-xl border border-white/50 text-center">
              <div className="w-28 h-28 bg-indigo-50/50 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 animate-pulse">
                <Info size={48} className="text-indigo-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-4">انتخاب تاریخ</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
                برای مشاهده تحلیل‌های هوشمند، نیایش‌ها و اطلاعات مسیریابی، روی یکی از روزهای تقویم کلیک کنید.
              </p>
              <div className="mt-12 flex items-center justify-center gap-6 opacity-20">
                 <CalendarPlus size={24} />
                 <BookOpen size={24} />
                 <Sparkles size={24} />
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer className="relative z-10 p-10 text-center bg-white/40 backdrop-blur-md border-t border-white/40">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2025 Iranian Christian Church Washington DC | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default App;
