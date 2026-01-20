
import React from 'react';
import { ChevronRight, ChevronLeft, Plus, Sparkles } from 'lucide-react';
import { Season } from '../types';
import { PERSIAN_MONTHS, GREGORIAN_MONTH_NAMES } from '../utils/jalali';

interface CalendarHeaderProps {
  monthIndex: number; // 1-based
  year: number;
  season: Season;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ monthIndex, year, season, onPrev, onNext, onToday }) => {
  const monthFa = PERSIAN_MONTHS[monthIndex - 1];
  const monthEn = GREGORIAN_MONTH_NAMES[monthIndex - 1];
  const gregorianYear = year + 621;

  // تابع رندر Doodle Engine (مشابه گوگل)
  const renderDoodleLogo = () => {
    // بازه‌های زمانی برای دودل‌ها
    const isWinter = monthIndex === 10 || monthIndex === 11 || monthIndex === 12; // دی، بهمن، اسفند
    const isSpring = monthIndex === 1 || monthIndex === 2 || monthIndex === 3; // فروردین، اردیبهشت، خرداد
    const isSummer = monthIndex === 4 || monthIndex === 5 || monthIndex === 6; // تیر، مرداد، شهریور
    const isAutumn = monthIndex === 7 || monthIndex === 8 || monthIndex === 9; // مهر، آبان، آذر

    return (
      <div className="relative group">
        {/* لایه پشت لوگو: افکت‌های نوری فصلی */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isSummer && (
            <div className="w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          )}
          {isWinter && (
            <div className="w-48 h-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          )}
        </div>

        {/* ظرف اصلی لوگو */}
        <div className="relative z-20 animate-doodle">
          
          {/* لوگوی SVG اختصاصی کلیسا با جزئیات بالا */}
          <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
              <defs>
                <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="goldStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* دایره اصلی */}
              <circle cx="100" cy="100" r="92" fill="url(#logoBlue)" stroke="url(#goldStroke)" strokeWidth="5" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="url(#goldStroke)" strokeWidth="1" opacity="0.3" />

              {/* کتاب و صلیب مرکزی */}
              <path d="M45,135 Q100,115 155,135 L155,155 Q100,135 45,155 Z" fill="#ffffff" />
              <path d="M50,140 Q100,120 150,140 L150,150 Q100,130 50,150 Z" fill="#f1f5f9" />
              
              <g filter="url(#glow)">
                <rect x="97" y="85" width="6" height="60" fill="url(#goldStroke)" rx="2" />
                <rect x="85" y="105" width="30" height="6" fill="url(#goldStroke)" rx="2" />
              </g>

              {/* کبوتر آبی */}
              <path 
                d="M40,50 C60,20 100,30 120,70 C110,80 80,95 70,115 C65,90 45,70 40,50" 
                fill="#3b82f6" 
                stroke="white" 
                strokeWidth="1.5"
              />
              <path d="M115,70 Q125,65 128,72 Z" fill="#fbbf24" />

              {/* متن دور لوگو */}
              <path id="textPath" d="M35,160 A75,75 0 1,1 165,160" fill="none" />
              <text className="font-black fill-amber-400" style={{fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px'}}>
                <textPath xlinkHref="#textPath" startOffset="50%" textAnchor="middle">
                  Iranian Christian Church Washington DC
                </textPath>
              </text>
            </svg>

            {/* --- لایه تزئینات دودل گوگل --- */}

            {/* ۱. ریسه چراغ‌های رنگی (زمستان/دی) */}
            {isWinter && (
              <div className="absolute -inset-4 pointer-events-none z-30">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  {/* سیم ریسه */}
                  <path d="M5,40 Q25,-5 50,10 Q75,25 95,45 Q110,70 80,95 Q50,110 20,95 Q-10,70 5,40" 
                        fill="none" stroke="#262626" strokeWidth="0.8" className="opacity-60" />
                  
                  {/* چراغ‌های رنگی با انیمیشن رقص‌نور */}
                  {[
                    {x:15, y:25, c:'#ef4444', d:'0s'}, {x:40, y:5, c:'#3b82f6', d:'0.4s'}, 
                    {x:70, y:15, c:'#fbbf24', d:'0.8s'}, {x:95, y:45, c:'#10b981', d:'1.2s'},
                    {x:85, y:80, c:'#ef4444', d:'1.6s'}, {x:50, y:98, c:'#3b82f6', d:'0.2s'},
                    {x:15, y:85, c:'#fbbf24', d:'0.6s'}, {x:2, y:55, c:'#10b981', d:'1s'}
                  ].map((bulb, i) => (
                    // Fixed: merged multiple style attributes into one to prevent JSX error
                    <g key={i} className="bulb-pulse" style={{ color: bulb.c, animationDelay: bulb.d }}>
                      <circle cx={bulb.x} cy={bulb.y} r="2.5" fill="currentColor" />
                      <circle cx={bulb.x} cy={bulb.y} r="5" fill="currentColor" opacity="0.3" />
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* ۲. شکوفه‌های بهاری (فروردین) */}
            {isSpring && (
              <div className="absolute inset-0 pointer-events-none z-30">
                {[...Array(6)].map((_, i) => (
                  <div key={i} 
                    className="absolute text-xl animate-seasonal-fall" 
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.7}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    {i % 2 === 0 ? '🌸' : '🌱'}
                  </div>
                ))}
              </div>
            )}

            {/* ۳. هاله‌ی خورشید (تابستان) */}
            {isSummer && (
              <div className="absolute inset-0 pointer-events-none -z-10 animate-sun">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                  {[...Array(12)].map((_, i) => (
                    <rect key={i} x="48" y="0" width="4" height="20" fill="#fbbf24" rx="2" 
                      transform={`rotate(${i * 30} 50 50)`} />
                  ))}
                </svg>
              </div>
            )}

            {/* ۴. برگ‌های پاییزی */}
            {isAutumn && (
              <div className="absolute inset-0 pointer-events-none z-30">
                {['🍂', '🍁', '🍃'].map((leaf, i) => (
                  <div key={i} 
                    className="absolute text-xl animate-seasonal-fall" 
                    style={{
                      left: `${20 + i * 30}%`,
                      animationDelay: `${i * 1.5}s`
                    }}
                  >
                    {leaf}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="relative z-10 p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-12 bg-white/30 backdrop-blur-xl border-b border-white/40">
      <div className="flex items-center gap-10 rtl">
        
        {/* بخش لوگوی دودل هوشمند */}
        {renderDoodleLogo()}

        <div className="text-right flex flex-col items-start md:items-end group">
          {/* عنوان ماه و سال */}
          <div className="flex items-baseline gap-5 mb-3 transition-transform duration-500 group-hover:scale-105">
            <span className="text-3xl lg:text-4xl font-light text-slate-400 font-sans tracking-tighter opacity-70">{monthEn}</span>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 leading-none tracking-tighter drop-shadow-sm">{monthFa}</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-1">
            {/* باکس سال‌های دوزبانه */}
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
              <span className="text-indigo-600 font-black text-3xl lg:text-4xl tracking-tighter">{year}</span>
              <div className="h-8 w-[2px] bg-slate-200" />
              <span className="text-slate-400 font-bold text-2xl lg:text-3xl font-sans tracking-tighter">{gregorianYear}</span>
            </div>
            
            {/* لیبل نسخه دوزبانه */}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/5 rounded-full border border-slate-900/5 transition-colors hover:bg-slate-900/10">
               <Sparkles size={16} className="text-indigo-500 animate-pulse" />
               <div className="h-4 w-[1px] bg-slate-300" />
               <p className="text-slate-600 text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-left leading-tight font-sans" dir="ltr">
                 Bilingual Christian &<br/>Ancient Persian Edition
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* کنترل‌های تقویم با استایل مدرن */}
      <div className="flex items-center bg-white/95 backdrop-blur shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-2.5 rounded-[2.5rem] border border-slate-100 ring-12 ring-slate-50/40">
        <button 
          onClick={onNext} 
          className="p-4 hover:bg-slate-50 rounded-[1.8rem] transition-all active:scale-90 group"
          title="ماه بعد"
        >
          <ChevronRight size={30} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>
        <button 
          onClick={onToday} 
          className="px-10 py-4 text-sm font-black text-slate-700 hover:text-white hover:bg-indigo-600 rounded-[1.8rem] transition-all shadow-sm active:scale-95 bg-white border border-slate-100"
        >
          امروز | Today
        </button>
        <button 
          onClick={onPrev} 
          className="p-4 hover:bg-slate-50 rounded-[1.8rem] transition-all active:scale-90 group"
          title="ماه قبل"
        >
          <ChevronLeft size={30} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
