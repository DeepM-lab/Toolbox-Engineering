import React, { useState } from 'react';
import { TireVisualizer } from './TireVisualizer';
import { calculateTire, compareTires, parseTireString, type TireParams } from '../utils/tireCalculations';
import { parseFullTireString, type FullTireSpec } from '../utils/tireParser';
import { 
  OE_MARKINGS, 
  TERRAIN_TECH_SPECS, 
  UTQG_DATA, 
  TIRE_WEAR_GUIDE, 
  parseDotCode 
} from '../data/tireEncyclopedia';
import { 
  Info, 
  Speedometer, 
  Scales, 
  Warning, 
  CheckCircle,
  Truck,
  Gauge,
  ShieldCheck,
  MagnifyingGlass,
  CalendarCheck,
  FirstAid,
  CarProfile,
  Article,
  XCircle,
  Lightbulb,
  CaretDown,
  Wrench
} from '@phosphor-icons/react';
import { generateExpertAdvice } from '../utils/tireAdvisor';

const POPULAR_TIRES = [
  { label: 'Vios / City', spec: 'P185/60R15 84H' },
  { label: 'Mazda 3 / K3', spec: '205/60R16 92V' },
  { label: 'Ranger / Hilux Zin', spec: 'LT265/65R17 112T' },
  { label: 'Raptor / Offroad 33"', spec: 'LT285/70R17 121S XL' },
  { label: 'Land Cruiser LC80', spec: '275/70R16 114H' },
  { label: 'Porsche / Sport', spec: '225/45ZR18 95W N0' }
];

export const TireDecoderPage: React.FC = () => {
  // Tabs: 'decode' (Giải mã chuỗi), 'compare' (So sánh Zin vs Độ), 'knowledge' (Cẩm nang & Báo mòn chi tiết)
  const [mode, setMode] = useState<'decode' | 'compare' | 'knowledge'>('decode');

  // Ô nhập chuỗi lốp
  const [inputText, setInputText] = useState('P205/55R16 91V XL');
  const [parsedSpec, setParsedSpec] = useState<FullTireSpec | null>(() => parseFullTireString('P205/55R16 91V XL'));
  const [parseError, setParseError] = useState<string | null>(null);

  // Trạng thái mở accordion FAQ của chuyên gia
  const [openFaqs, setOpenFaqs] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const advice = parsedSpec ? generateExpertAdvice(parsedSpec) : null;

  // Ô tra cứu mã tuần/năm DOT sản xuất
  const [dotInput, setDotInput] = useState('4721'); // Tuần 47 năm 2021
  const dotResult = parseDotCode(dotInput);

  // Ô tra cứu áp suất lốp tối đa (MAX PRESS)
  const [maxPressInput, setMaxPressInput] = useState(51); // PSI

  // Lốp hiện tại
  const [currentTire, setCurrentTire] = useState<TireParams>({
    width: 205,
    aspectRatio: 55,
    rimDiameter: 16,
  });

  // Lốp mới khi so sánh độ lốp
  const [newTire, setNewTire] = useState<TireParams>({
    width: 225,
    aspectRatio: 50,
    rimDiameter: 17,
  });

  const currentCalc = calculateTire(currentTire);
  const newCalc = calculateTire(newTire);
  const comparison = compareTires(currentCalc, newCalc);

  const handleParseInput = (textToParse: string) => {
    setParseError(null);
    const result = parseFullTireString(textToParse);
    if (result) {
      if (result.validationWarning) {
        setParseError(result.validationWarning);
      }
      setParsedSpec(result);
      setCurrentTire({
        width: result.width,
        aspectRatio: result.aspectRatio,
        rimDiameter: result.rimDiameter,
      });
    } else {
      const simple = parseTireString(textToParse);
      if (simple) {
        setCurrentTire(simple);
        setParsedSpec({
          rawString: textToParse,
          width: simple.width,
          aspectRatio: simple.aspectRatio,
          rimDiameter: simple.rimDiameter,
          construction: 'R',
        });
      } else {
        setParseError(`Ký hiệu "${textToParse}" không đúng định dạng hoặc vượt quá quy chuẩn thực tế. Vui lòng kiểm tra lại (Ví dụ: 205/55R16 91V, LT265/75R16 123/120R E, P245/40ZR19 98Y XL MO...)`);
      }
    }
  };

  const handleSelectQuickTire = (spec: string) => {
    setInputText(spec);
    handleParseInput(spec);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Banner Title chuẩn phong cách DeepM */}
      <div className="border-b border-brand-border pb-8">
        <div className="inline-block px-3 py-1 bg-[#1a1711] border border-[#3d3422] text-brand-gold text-[11px] font-mono tracking-widest uppercase font-bold mb-4">
          DEEPM LAB • ENCYCLOPEDIA & TIRE FITMENT DECODER
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white uppercase leading-tight sm:leading-snug tracking-normal font-sans">
          CẨM NANG & GIẢI MÃ <span className="text-brand-gold">THÔNG SỐ LỐP XE</span>
        </h1>
        <div className="font-mono text-xs sm:text-sm text-slate-400 tracking-widest uppercase mt-3">
          TẢI TRỌNG (LOAD INDEX) • TỐC ĐỘ (SPEED RATING) • TIÊU CHUẨN UTQG • NĂM SẢN XUẤT DOT • DẤU HIỆU BÁO MÒN
        </div>

        {/* Chuyển đổi Tabs 3 Chế Độ */}
        <div className="flex flex-wrap gap-2 mt-8">
          <button
            onClick={() => setMode('decode')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer border ${
              mode === 'decode'
                ? 'bg-brand-gold text-brand-bg border-brand-gold'
                : 'bg-brand-card text-slate-400 border-brand-border hover:text-white hover:border-[#383329]'
            }`}
          >
            <Info size={16} weight="bold" />
            1. Giải Mã Chuỗi Ký Hiệu Lốp
          </button>

          <button
            onClick={() => setMode('compare')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer border ${
              mode === 'compare'
                ? 'bg-brand-gold text-brand-bg border-brand-gold'
                : 'bg-brand-card text-slate-400 border-brand-border hover:text-white hover:border-[#383329]'
            }`}
          >
            <Scales size={16} weight="bold" />
            2. So Sánh Lốp Zin vs Lốp Độ
          </button>

          <button
            onClick={() => setMode('knowledge')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer border ${
              mode === 'knowledge'
                ? 'bg-brand-gold text-brand-bg border-brand-gold'
                : 'bg-brand-card text-slate-400 border-brand-border hover:text-white hover:border-[#383329]'
            }`}
          >
            <Article size={16} weight="bold" />
            3. Cẩm Nang Kỹ Thuật & Nhận Biết Mòn Lốp
          </button>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: ĐIỀN CHUỖI & GIẢI NGHĨA */}
      {mode === 'decode' && (
        <div className="space-y-8">
          {/* Ô Nhập chuỗi */}
          <div className="bg-brand-card p-6 border border-brand-border space-y-4">
            <label className="text-xs font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
              <MagnifyingGlass size={18} className="text-brand-gold" weight="bold" />
              Nhập Đầy Đủ Dãy Ký Hiệu Trên Hông Lốp Của Bạn (Ví dụ: P205/55R16 91V XL, LT265/65R17 112T...)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleParseInput(inputText)}
                placeholder="Ví dụ: P205/55R16 91V XL"
                className="flex-1 bg-brand-bg border border-[#28241e] px-4 py-3 text-lg font-mono font-bold text-brand-gold focus:border-brand-gold focus:outline-none tracking-wider uppercase"
              />
              <button
                onClick={() => handleParseInput(inputText)}
                className="px-8 py-3 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg font-mono text-xs uppercase tracking-wider font-bold transition cursor-pointer shrink-0"
              >
                Giải Mã Ngay
              </button>
            </div>

            {/* Gợi ý cỡ lốp nhanh */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono pt-2">
              <span className="text-slate-500 text-[11px] uppercase mr-1">Các cấu hình phổ biến:</span>
              {POPULAR_TIRES.map((item) => (
                <button
                  key={item.spec}
                  onClick={() => handleSelectQuickTire(item.spec)}
                  className="px-2.5 py-1 bg-brand-bg hover:bg-[#1a1815] text-slate-300 border border-brand-border hover:border-brand-gold transition cursor-pointer"
                >
                  <span className="text-brand-gold font-bold">{item.spec}</span>
                  <span className="text-slate-500 text-[10px] ml-1">({item.label})</span>
                </button>
              ))}
            </div>

            {/* Thông báo lỗi hoặc cảnh báo validation nếu có */}
            {parseError && (
              <div className="mt-3 p-3 bg-amber-950/30 border border-brand-gold/50 text-amber-300 text-xs font-mono flex items-center gap-2">
                <Warning size={18} className="text-brand-gold shrink-0" weight="bold" />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* KẾT QUẢ GIẢI MÃ */}
          {parsedSpec && (
            <div className="space-y-6">
              {/* 4 Thẻ chỉ số chuẩn Quốc tế */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                {/* 1. Chỉ số tải trọng */}
                <div className="bg-brand-card p-5 sm:p-6 border border-brand-border hover:border-[#383329] transition">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
                    <span>CHỈ SỐ TẢI TRỌNG</span>
                    <Truck size={18} className="text-brand-gold" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-gold mt-2.5">
                    {parsedSpec.dualLoadIndex ? (
                      <span className="text-xl sm:text-2xl">{parsedSpec.dualLoadIndex}</span>
                    ) : (
                      parsedSpec.loadIndex ? `${parsedSpec.loadIndex}` : '---'
                    )}
                    {parsedSpec.dualLoadKg ? (
                      <span className="text-xs font-normal text-slate-200 block sm:inline ml-0 sm:ml-2">
                        ({parsedSpec.dualLoadKg.single} kg đơn / {parsedSpec.dualLoadKg.dual} kg đôi)
                      </span>
                    ) : (
                      parsedSpec.maxLoadKg && (
                        <span className="text-sm font-normal text-slate-200 ml-2">({parsedSpec.maxLoadKg} kg / lốp)</span>
                      )
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 block font-sans">
                    {parsedSpec.maxTotalLoadKg 
                      ? `Tổng tải 4 bánh: ${(parsedSpec.maxTotalLoadKg).toLocaleString('vi-VN')} kg`
                      : 'Chưa có mã tải'}
                  </span>
                </div>

                {/* 2. Vận tốc tối đa */}
                <div className="bg-brand-card p-5 sm:p-6 border border-brand-border hover:border-[#383329] transition">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
                    <span>VẬN TỐC TỐI ĐA</span>
                    <Speedometer size={18} className="text-brand-gold" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-gold mt-2.5">
                    {parsedSpec.speedRating ? `Mã ${parsedSpec.speedRating}` : '---'}
                    {parsedSpec.maxSpeedKmH && (
                      <span className="text-sm font-normal text-slate-200 ml-2">({parsedSpec.maxSpeedKmH} km/h)</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 block font-sans">
                    {parsedSpec.speedDesc || 'Chưa có mã tốc độ'}
                  </span>
                </div>

                {/* 3. Phân loại xe & Chuẩn OEM */}
                <div className="bg-brand-card p-5 sm:p-6 border border-brand-border hover:border-[#383329] transition">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
                    <span>PHÂN LOẠI XE</span>
                    <CarProfile size={18} className="text-brand-gold" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2.5">
                    {parsedSpec.isFlotation 
                      ? 'Hệ Inch Flotation' 
                      : (parsedSpec.vehicleType ? `Tiền tố ${parsedSpec.vehicleType}` : 'Euro-Metric')}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 block font-sans leading-relaxed">
                    {parsedSpec.isFlotation && parsedSpec.flotationSpec
                      ? `Lốp ${parsedSpec.flotationSpec.diameterInch}" x ${parsedSpec.flotationSpec.widthInch}" mâm R${parsedSpec.flotationSpec.rimInch}" (quy đổi tương đương ~${parsedSpec.width}/${parsedSpec.aspectRatio}R${parsedSpec.rimDiameter})`
                      : parsedSpec.vehicleTypeDesc}
                  </span>
                  {parsedSpec.oeMarking && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1c1810] border border-brand-gold/50 text-brand-gold text-[11px] font-mono">
                      <span>⭐ Chuẩn OEM: {parsedSpec.oeMarking.brand} ({parsedSpec.oeMarking.code})</span>
                    </div>
                  )}
                </div>

                {/* 4. Kết cấu chịu tải & Công nghệ */}
                <div className="bg-brand-card p-5 sm:p-6 border border-brand-border hover:border-[#383329] transition">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
                    <span>KẾT CẤU & CÔNG NGHỆ</span>
                    <Gauge size={18} className="text-brand-gold" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2.5">
                    {parsedSpec.loadRange 
                      ? `Load Range ${parsedSpec.loadRange}` 
                      : (parsedSpec.extraLoad ? `Chịu Tải ${parsedSpec.extraLoad}` : 'Tiêu Chuẩn (SL)')}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 block font-sans leading-relaxed">
                    {parsedSpec.loadRangeDesc 
                      ? parsedSpec.loadRangeDesc 
                      : (parsedSpec.extraLoad === 'HL' 
                          ? 'Chuẩn tải siêu cao (High Load) chuyên dụng xe điện / pin lớn' 
                          : (parsedSpec.extraLoad ? 'Thành lốp gia cố cho xe nặng / xe điện' : 'Áp suất tải tiêu chuẩn thông thường'))}
                  </span>
                  {parsedSpec.terrainOrTech && parsedSpec.terrainOrTech.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {parsedSpec.terrainOrTech.map((item, idx) => (
                        <span 
                          key={idx} 
                          title={item.desc}
                          className="px-2 py-0.5 bg-[#181611] border border-[#3d3422] text-[#c9a961] text-[10px] font-mono cursor-help"
                        >
                          {item.code} ({item.name})
                        </span>
                      ))}
                      {parsedSpec.techFeatures?.filter(f => f.startsWith('Số lớp bố')).map((feat, idx) => (
                        <span key={`pr-${idx}`} className="px-2 py-0.5 bg-[#181611] border border-[#3d3422] text-slate-300 text-[10px] font-mono">
                          {feat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    parsedSpec.techFeatures && parsedSpec.techFeatures.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {parsedSpec.techFeatures.map((feat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#181611] border border-[#3d3422] text-[#c9a961] text-[10px] font-mono">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PHÂN TÍCH AN TOÀN & LỜI KHUYÊN KỸ SƯ */}
              {advice && (
                <div className="bg-brand-card border border-brand-border p-6 space-y-6">
                  {/* Part 1: Safety Score + Summary - Đẳng cấp, chữ to rõ ràng */}
                  <div className={`bg-brand-card p-6 sm:p-7 border ${
                    advice.safetyColor === 'emerald' ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.08)]' :
                    advice.safetyColor === 'amber' ? 'border-brand-gold/40 shadow-[0_0_25px_rgba(201,169,97,0.08)]' : 'border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.08)]'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-6 sm:gap-8">
                      {/* Score Badge */}
                      <div className={`shrink-0 text-center px-7 py-5 border flex flex-col justify-center sm:min-w-[170px] ${
                        advice.safetyColor === 'emerald' ? 'bg-emerald-950/30 border-emerald-500/40' :
                        advice.safetyColor === 'amber' ? 'bg-[#1a1711] border-brand-gold/40' : 'bg-rose-950/30 border-rose-500/40'
                      }`}>
                        <div className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">ĐÁNH GIÁ AN TOÀN</div>
                        <div className={`text-5xl font-black font-mono tracking-tight my-1.5 ${
                          advice.safetyColor === 'emerald' ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]' :
                          advice.safetyColor === 'amber' ? 'text-brand-gold drop-shadow-[0_0_12px_rgba(201,169,97,0.3)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.3)]'
                        }`}>{advice.safetyScore}</div>
                        <div className="text-xs text-slate-400 font-mono">/100 điểm</div>
                        <div className={`text-xs font-mono font-black uppercase tracking-wider mt-3 pt-2 border-t ${
                          advice.safetyColor === 'emerald' ? 'text-emerald-400 border-emerald-500/30' :
                          advice.safetyColor === 'amber' ? 'text-brand-gold border-brand-gold/30' : 'text-rose-400 border-rose-500/30'
                        }`}>{advice.safetyLabel}</div>
                      </div>

                      {/* Summary & Checklist */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold mb-1.5">
                            NHẬN ĐỊNH CHUYÊN GIA — DEEPM LAB
                          </div>
                          <p className="text-white font-sans text-base sm:text-lg font-medium leading-relaxed">
                            {advice.summary}
                          </p>
                        </div>

                        {/* Checklist 2 cols - Chữ to, phân tách rõ tiêu đề & diễn giải */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-brand-border">
                          {advice.checklist.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-2.5 rounded bg-brand-bg/70 border border-brand-border/80">
                              {item.status === 'ok' && (
                                <CheckCircle size={20} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />
                              )}
                              {item.status === 'warn' && (
                                <Warning size={20} weight="fill" className="text-brand-gold shrink-0 mt-0.5" />
                              )}
                              {item.status === 'error' && (
                                <XCircle size={20} weight="fill" className="text-rose-400 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <div className="font-bold text-white font-mono text-sm sm:text-[15px]">{item.label}</div>
                                <div className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">{item.note}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Part 2: Insights Cards - Tối ưu 2 bảng / 1 dòng, font size to rõ sắc nét */}
                  <div className="space-y-4">
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-bold flex items-center gap-2">
                      <Lightbulb size={18} className="text-brand-gold" weight="fill" /> 
                      <span>GÓC NHÌN KỸ THUẬT CHUYÊN SÂU</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {advice.insights.map((ins, i) => (
                        <div key={i} className={`p-5 sm:p-6 border transition hover:border-brand-gold/50 flex flex-col justify-between ${
                          ins.type === 'warning' ? 'bg-rose-950/20 border-rose-500/30' :
                          ins.type === 'tip' ? 'bg-[#16130e] border-brand-gold/40' : 'bg-brand-card-inner border-brand-border'
                        }`}>
                          <div>
                            <div className={`font-bold font-mono uppercase tracking-wide text-sm sm:text-base mb-2.5 flex items-center gap-2 ${
                              ins.type === 'warning' ? 'text-rose-400' :
                              ins.type === 'tip' ? 'text-brand-gold' : 'text-slate-100'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>{ins.topic}</span>
                            </div>
                            <p className="text-slate-200 font-sans leading-relaxed text-sm sm:text-base">
                              {ins.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part 3: FAQ Accordion - Tăng cỡ chữ rõ ràng */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-gold font-bold">
                      CÂU HỎI THƯỜNG GẶP TỪ CHUYÊN GIA
                    </div>
                    {advice.faqs.map((faq, i) => (
                      <div key={i} className="border border-brand-border bg-[#12110f] transition hover:border-[#383329]">
                        <button
                          onClick={() => toggleFaq(i)}
                          className="w-full text-left p-4 flex items-center justify-between text-sm sm:text-base font-mono font-bold text-white hover:text-brand-gold transition cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <CaretDown size={16} className={`transition-transform duration-200 text-brand-gold shrink-0 ml-2 ${openFaqs.includes(i) ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaqs.includes(i) && (
                          <div className="px-4 pb-4 text-sm sm:text-base text-slate-300 font-sans leading-relaxed border-t border-[#1f1c16] pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid 2 Cột: Đồ họa kỹ thuật & Bóc tách chi tiết */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <TireVisualizer
                    width={currentTire.width}
                    aspectRatio={currentTire.aspectRatio}
                    rimDiameter={currentTire.rimDiameter}
                    totalDiameterMm={currentCalc.totalDiameterMm}
                    sidewallHeightMm={currentCalc.sidewallHeightMm}
                  />
                  {/* Widget Tra Cứu Năm Sản Xuất DOT & Hạn Sử Dụng */}
                  <div className="bg-brand-card p-5 sm:p-6 border border-brand-border space-y-3.5 font-mono">
                    <div className="flex items-center justify-between border-b border-brand-border pb-2.5 font-bold text-white">
                      <span className="flex items-center gap-2 text-brand-gold text-xs sm:text-sm uppercase tracking-wider">
                        <CalendarCheck size={18} /> TRA CỨU HẠN SỬ DỤNG (MÃ DOT 4 SỐ)
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                      Tìm 4 chữ số cuối cạnh chữ DOT trên thành lốp (2 số đầu: Tuần, 2 số cuối: Năm sản xuất).
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        maxLength={4}
                        value={dotInput}
                        onChange={(e) => setDotInput(e.target.value)}
                        placeholder="Ví dụ: 4721"
                        className="bg-brand-bg border border-[#3d3422] focus:border-brand-gold focus:outline-none px-4 py-2.5 text-center text-brand-gold font-bold text-base sm:text-lg w-full sm:w-32 tracking-widest"
                      />
                      <div className="flex-1 bg-brand-bg p-3 border border-brand-border flex flex-wrap items-center justify-between gap-2">
                        {dotResult ? (
                          <>
                            <div className="space-y-1">
                              <span className="text-slate-200 text-xs sm:text-sm font-sans block">
                                Tuần <b className="text-white font-mono">{dotResult.week}</b> / Năm <b className="text-white font-mono">{dotResult.year}</b>
                                {dotResult.status === 'future' ? (
                                  <span className="text-rose-400 font-bold ml-1.5">(Thời điểm tương lai)</span>
                                ) : dotResult.status === 'invalid' ? (
                                  <span className="text-rose-400 font-bold ml-1.5">(Mã không hợp lệ)</span>
                                ) : (
                                  <span className="text-slate-300 ml-1.5">
                                    ({dotResult.years > 0 ? (
                                      <>
                                        <b className="text-brand-gold font-mono">{dotResult.years}</b> năm <b className="text-brand-gold font-mono">{dotResult.months}</b> tháng tuổi
                                      </>
                                    ) : (
                                      <>
                                        <b className="text-brand-gold font-mono">{dotResult.months}</b> tháng tuổi
                                      </>
                                    )})
                                  </span>
                                )}
                              </span>
                              {dotResult.message && (
                                <p className={`text-[11px] font-sans ${dotResult.status === 'future' || dotResult.status === 'invalid' || dotResult.status === 'expired' ? 'text-rose-400' : 'text-amber-400'}`}>
                                  {dotResult.message}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 ${dotResult.badgeClass}`}>
                              {dotResult.statusLabel}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500 italic text-xs sm:text-sm font-sans">Nhập 4 chữ số DOT để kiểm tra hạn dùng</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Widget Áp suất tối đa MAX PRESS */}
                  <div className="bg-brand-card p-5 sm:p-6 border border-brand-border space-y-3.5 font-mono">
                    <div className="flex items-center justify-between border-b border-brand-border pb-2.5 font-bold text-white">
                      <span className="flex items-center gap-2 text-brand-gold text-xs sm:text-sm uppercase tracking-wider">
                        <Gauge size={18} /> ÁP SUẤT LỐP TỐI ĐA (MAX PRESS)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-300 font-sans text-xs sm:text-sm">Nhập số PSI ghi sau chữ MAX PRESS:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={maxPressInput}
                          onChange={(e) => setMaxPressInput(Number(e.target.value))}
                          className="w-24 bg-brand-bg border border-[#3d3422] focus:border-brand-gold focus:outline-none px-2 py-1.5 text-center text-brand-gold font-bold text-base sm:text-lg"
                        />
                        <span className="text-slate-400 text-sm font-bold">PSI</span>
                      </div>
                    </div>
                    <div className="bg-brand-bg p-3.5 border border-brand-border flex flex-col sm:flex-row justify-between gap-2 text-slate-300 text-xs sm:text-sm">
                      <span>Tương đương: <b className="text-white text-sm sm:text-base ml-1">{(maxPressInput * 6.89476).toFixed(0)} kPa</b></span>
                      <span>Quy đổi Bar: <b className="text-brand-gold text-sm sm:text-base ml-1">{(maxPressInput * 0.0689476).toFixed(2)} Bar</b></span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      * <span className="text-slate-300 font-medium">Lưu ý:</span> Đây là áp suất giới hạn tối đa trước khi nổ lốp. Áp suất bơm thực tế hằng ngày nên theo tem bệ cửa xe (thường 32 - 36 PSI / 2.2 - 2.5 Bar).
                    </p>
                  </div>
                </div>

                {/* Bóc tách ý nghĩa chuỗi */}
                <div className="lg:col-span-7 bg-brand-card p-6 sm:p-7 border border-brand-border space-y-5">
                  <div className="border-b border-brand-border pb-3.5">
                    <h3 className="text-xs sm:text-sm font-mono uppercase font-bold text-white tracking-wider flex flex-wrap items-center gap-2">
                      <span>BÓC TÁCH Ý NGHĨA KỸ THUẬT CHUỖI:</span>
                      <span className="text-brand-gold bg-brand-bg px-3 py-1 border border-[#3d3422] text-sm sm:text-base">
                        {parsedSpec.rawString}
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-3 font-mono">
                    {parsedSpec.vehicleType && (
                      <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="bg-[#211d17] text-brand-gold border border-[#3d3422] px-2 py-0.5 text-xs sm:text-sm font-bold">
                            Chữ {parsedSpec.vehicleType}
                          </span>
                          <span className="text-white font-bold text-xs sm:text-sm uppercase">
                            TIỀN TỐ PHÂN LOẠI XE
                          </span>
                        </div>
                        <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                          {parsedSpec.vehicleTypeDesc}. Xác định tiêu chuẩn thiết kế theo chuẩn xe du lịch hoặc xe tải nhẹ.
                        </p>
                      </div>
                    )}

                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-[#211d17] text-brand-gold border border-[#3d3422] px-2 py-0.5 text-xs sm:text-sm font-bold">
                          Số {currentTire.width}
                        </span>
                        <span className="text-white font-bold text-xs sm:text-sm uppercase">
                          CHIỀU RỘNG MẶT GAI DANH ĐỊNH (SECTION WIDTH)
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                        Bề rộng mặt lốp tiếp xúc đường là <b className="text-white font-mono">{currentTire.width} mm</b>. Mặt lốp càng rộng thì diện tích bám đường và khả năng phanh càng tốt, nhưng lực cản lăn lớn hơn và tiêu tốn nhiều nhiên liệu hơn.
                      </p>
                    </div>

                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-[#211d17] text-brand-gold border border-[#3d3422] px-2 py-0.5 text-xs sm:text-sm font-bold">
                          Số {currentTire.aspectRatio}
                        </span>
                        <span className="text-white font-bold text-xs sm:text-sm uppercase">
                          BIÊN ĐỘ HÔNG LỐP (ASPECT RATIO)
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                        Chiều cao thành lốp bằng <b className="text-white font-mono">{currentTire.aspectRatio}%</b> của bề rộng = <b className="text-brand-gold font-mono">{currentCalc.sidewallHeightMm} mm</b>. Hông lốp dày giúp xe vận hành êm ái, hấp thụ xung lực ổ gà tốt hơn; hông lốp mỏng giúp xe đầm chắc và phản hồi lái nhạy hơn ở tốc độ cao.
                      </p>
                    </div>

                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-[#211d17] text-brand-gold border border-[#3d3422] px-2 py-0.5 text-xs sm:text-sm font-bold">
                          Chữ {parsedSpec.construction}
                        </span>
                        <span className="text-white font-bold text-xs sm:text-sm uppercase">
                          CẤU TRÚC BỐ THÉP RADIAL
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                        Lớp bố kim loại gia cường chạy tỏa tròn 90°, cho độ đàn hồi êm dịu, giảm ma sát lăn và tản nhiệt tối ưu ở tốc độ cao.
                      </p>
                    </div>

                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-[#211d17] text-brand-gold border border-[#3d3422] px-2 py-0.5 text-xs sm:text-sm font-bold">
                          Số {currentTire.rimDiameter}
                        </span>
                        <span className="text-white font-bold text-xs sm:text-sm uppercase">
                          ĐƯỜNG KÍNH VÀNH MÂM LA-ZĂNG (RIM DIAMETER)
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                        Đường kính mép trong lắp vừa mâm <b className="text-white font-mono">{currentTire.rimDiameter} inch</b> ({(currentTire.rimDiameter * 25.4).toFixed(0)} mm).
                      </p>
                    </div>

                    {parsedSpec.loadIndex && (
                      <div className="bg-brand-bg p-4 border border-[#3d3422] hover:border-brand-gold/50 transition">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="bg-[#2a2215] text-brand-gold border border-brand-gold/50 px-2 py-0.5 text-xs sm:text-sm font-bold">
                            Cụm {parsedSpec.loadIndex}{parsedSpec.speedRating}
                          </span>
                          <span className="text-brand-gold font-bold text-xs sm:text-sm uppercase">
                            CHỈ SỐ TẢI & TỐC ĐỘ GIỚI HẠN
                          </span>
                        </div>
                        <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                          Chỉ số <b className="text-white font-mono">{parsedSpec.loadIndex}</b> chịu tải tối đa <b className="text-brand-gold font-mono">{parsedSpec.maxLoadKg} kg / 1 lốp</b> (tổng tải 4 bánh: {(parsedSpec.maxTotalLoadKg || 0).toLocaleString('vi-VN')} kg). Ký hiệu <b className="text-white font-mono">{parsedSpec.speedRating}</b> cho phép xe chạy an toàn tối đa đến <b className="text-white font-mono">{parsedSpec.maxSpeedKmH} km/h</b>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Kích thước hình học lăn - Thiết kế số to hoành tráng */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-brand-border text-center font-mono">
                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <span className="text-slate-400 block text-xs uppercase font-bold tracking-wider mb-1">ĐƯỜNG KÍNH TỔNG</span>
                      <span className="text-white font-bold text-lg sm:text-xl">{currentCalc.totalDiameterMm} mm</span>
                      <span className="text-xs text-brand-gold block mt-1">({currentCalc.totalDiameterInch}″)</span>
                    </div>
                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <span className="text-slate-400 block text-xs uppercase font-bold tracking-wider mb-1">CHU VI LĂN VÒNG</span>
                      <span className="text-white font-bold text-lg sm:text-xl">{currentCalc.circumferenceMm} mm</span>
                      <span className="text-xs text-slate-500 block mt-1">Quãng đường 1 vòng</span>
                    </div>
                    <div className="bg-brand-bg p-4 border border-brand-border hover:border-[#383329] transition">
                      <span className="text-slate-400 block text-xs uppercase font-bold tracking-wider mb-1">VÒNG QUAY / 1KM</span>
                      <span className="text-brand-gold font-bold text-lg sm:text-xl">{currentCalc.revsPerKm} vòng</span>
                      <span className="text-xs text-slate-500 block mt-1">Tốc độ quay trục</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 2: ĐỐI SÁNH LỐP ĐỘ (ZIN VS LÊN SIZE) */}
      {mode === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lốp Cũ (Zin) */}
            <div className="bg-brand-card p-5 sm:p-6 border border-brand-border space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border pb-2.5 font-mono">
                <span className="text-slate-300 uppercase tracking-wider font-bold text-xs sm:text-sm">1. LỐP NGUYÊN BẢN (ZIN)</span>
                <span className="text-white font-bold bg-brand-bg px-3 py-1 border border-brand-border text-sm sm:text-base">
                  {currentTire.width}/{currentTire.aspectRatio}R{currentTire.rimDiameter}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Rộng (mm)</label>
                  <input
                    type="number"
                    value={currentTire.width}
                    onChange={(e) => setCurrentTire({ ...currentTire, width: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-[#28241e] focus:border-brand-gold focus:outline-none p-2.5 text-center text-white font-bold text-base sm:text-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Tỷ lệ (%)</label>
                  <input
                    type="number"
                    value={currentTire.aspectRatio}
                    onChange={(e) => setCurrentTire({ ...currentTire, aspectRatio: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-[#28241e] focus:border-brand-gold focus:outline-none p-2.5 text-center text-white font-bold text-base sm:text-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Mâm (inch)</label>
                  <input
                    type="number"
                    value={currentTire.rimDiameter}
                    onChange={(e) => setCurrentTire({ ...currentTire, rimDiameter: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-[#28241e] focus:border-brand-gold focus:outline-none p-2.5 text-center text-white font-bold text-base sm:text-lg"
                  />
                </div>
              </div>
              <div className="font-mono text-slate-300 bg-brand-bg p-3 border border-brand-border flex flex-wrap justify-between gap-2 text-xs sm:text-sm">
                <span>Đường kính: <b className="text-white text-sm sm:text-base">{currentCalc.totalDiameterMm} mm</b></span>
                <span>Chu vi: <b className="text-white text-sm sm:text-base">{currentCalc.circumferenceMm} mm</b></span>
              </div>
            </div>

            {/* Lốp Mới Dự Kiến Lên */}
            <div className="bg-brand-card p-5 sm:p-6 border border-brand-gold/40 space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border pb-2.5 font-mono">
                <span className="text-brand-gold uppercase tracking-wider font-bold text-xs sm:text-sm">2. LỐP MỚI DỰ KIẾN LÊN</span>
                <span className="text-brand-gold font-bold bg-brand-bg px-3 py-1 border border-brand-gold/40 text-sm sm:text-base">
                  {newTire.width}/{newTire.aspectRatio}R{newTire.rimDiameter}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Rộng (mm)</label>
                  <input
                    type="number"
                    value={newTire.width}
                    onChange={(e) => setNewTire({ ...newTire, width: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-brand-gold/50 focus:border-brand-gold focus:outline-none p-2.5 text-center text-brand-gold font-bold text-base sm:text-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Tỷ lệ (%)</label>
                  <input
                    type="number"
                    value={newTire.aspectRatio}
                    onChange={(e) => setNewTire({ ...newTire, aspectRatio: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-brand-gold/50 focus:border-brand-gold focus:outline-none p-2.5 text-center text-brand-gold font-bold text-base sm:text-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-xs uppercase font-bold">Mâm (inch)</label>
                  <input
                    type="number"
                    value={newTire.rimDiameter}
                    onChange={(e) => setNewTire({ ...newTire, rimDiameter: Number(e.target.value) })}
                    className="w-full bg-brand-bg border border-brand-gold/50 focus:border-brand-gold focus:outline-none p-2.5 text-center text-brand-gold font-bold text-base sm:text-lg"
                  />
                </div>
              </div>
              <div className="font-mono text-slate-300 bg-brand-bg p-3 border border-brand-border flex flex-wrap justify-between gap-2 text-xs sm:text-sm">
                <span>Đường kính: <b className="text-brand-gold text-sm sm:text-base">{newCalc.totalDiameterMm} mm</b></span>
                <span>Chu vi: <b className="text-brand-gold text-sm sm:text-base">{newCalc.circumferenceMm} mm</b></span>
              </div>
            </div>
          </div>

          {/* Bảng phân tích sai lệch */}
          <div className="bg-brand-card p-6 sm:p-7 border border-brand-border space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-3.5">
              <h3 className="text-xs sm:text-sm font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Speedometer size={18} className="text-brand-gold" weight="bold" />
                Kết Quả Đối Sánh Kỹ Thuật
              </h3>
              <span className="text-xs font-mono text-slate-400 font-bold">GEOMETRIC DELTA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">CHÊNH LỆCH ĐƯỜNG KÍNH</span>
                <div className={`text-2xl sm:text-3xl font-bold mt-2 ${comparison.diameterDiffMm >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparison.diameterDiffMm > 0 ? `+${comparison.diameterDiffMm}` : comparison.diameterDiffMm} mm
                </div>
                <span className="text-xs text-slate-300 mt-1.5 block">
                  Lệch {comparison.diameterDiffPercent > 0 ? `+${comparison.diameterDiffPercent}` : comparison.diameterDiffPercent}%
                </span>
              </div>

              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">ĐỘ NÂNG KHOẢNG SÁNG GẦM</span>
                <div className={`text-2xl sm:text-3xl font-bold mt-2 ${comparison.rideHeightDiffMm >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparison.rideHeightDiffMm > 0 ? `+${comparison.rideHeightDiffMm}` : comparison.rideHeightDiffMm} mm
                </div>
                <span className="text-xs text-slate-300 mt-1.5 block">
                  {comparison.rideHeightDiffMm >= 0 ? 'Nâng cao gầm' : 'Hạ thấp gầm'}
                </span>
              </div>

              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">TỐC ĐỘ THỰC (ĐỒNG HỒ 100 KM/H)</span>
                <div className="text-2xl sm:text-3xl font-bold text-brand-gold mt-2">
                  {comparison.speedometerErrorAt100Kmh} km/h
                </div>
                <span className="text-xs text-slate-300 mt-1.5 block">
                  {comparison.speedometerErrorAt100Kmh > 100 ? 'Chạy nhanh hơn ODO báo' : 'Chạy chậm hơn ODO'}
                </span>
              </div>

              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">CHÊNH LỆCH VÒNG QUAY / KM</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                  {newCalc.revsPerKm - currentCalc.revsPerKm} vòng
                </div>
                <span className="text-xs text-slate-400 mt-1.5 block">
                  Zin: {currentCalc.revsPerKm} | Mới: {newCalc.revsPerKm}
                </span>
              </div>
            </div>

            {/* Cảnh báo an toàn */}
            {Math.abs(comparison.diameterDiffPercent) > 3 ? (
              <div className="bg-[#1a1610] border border-brand-gold/50 p-5 sm:p-6 flex items-start gap-4">
                <Warning size={24} className="text-brand-gold shrink-0 mt-0.5" weight="fill" />
                <div className="space-y-1.5">
                  <div className="font-bold text-brand-gold uppercase tracking-wide text-sm sm:text-base font-mono">
                    CẢNH BÁO: SAI SỐ ĐƯỜNG KÍNH VƯỢT QUÁ TIÊU CHUẨN (±3%)
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                    Đường kính lệch <strong className="text-white font-mono">{comparison.diameterDiffPercent}%</strong>. Cần lưu ý kiểm tra khoảng hở vè chắn bùn khi đánh hết lái hoặc khi phuộc nhún hết hành trình để tránh cạ lốp. Đồng hồ tốc độ ODO sẽ hiển thị chậm hơn thực tế, cần chú ý khi qua các cung đường có biển giới hạn tốc độ.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#0e1713] border border-emerald-500/50 p-5 sm:p-6 flex items-start gap-4">
                <CheckCircle size={24} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                <div className="space-y-1.5">
                  <div className="font-bold text-emerald-400 uppercase tracking-wide text-sm sm:text-base font-mono">
                    KÍCH THƯỚC ĐẠT CHUẨN AN TOÀN KỸ THUẬT (TRONG NGƯỠNG ±3%)
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                    Độ lệch danh nghĩa <strong className="text-white font-mono">{comparison.diameterDiffPercent}%</strong> đảm bảo xe vận hành ổn định, không ảnh hưởng đến hệ thống kiểm soát lực kéo (TCS/ESP) và bảo toàn tính năng hình học treo.
                  </p>
                </div>
              </div>
            )}

            {/* Lời khuyên thực tế khi độ lốp */}
            <div className="bg-brand-bg border border-brand-border p-5 sm:p-6 space-y-3.5 font-mono">
              <div className="text-xs sm:text-sm uppercase tracking-widest text-brand-gold font-bold flex items-center gap-2">
                <Wrench size={18} /> LỜI KHUYÊN THỰC TẾ KHI ĐỘ LỐP — DEEPM LAB
              </div>
              <ul className="space-y-2.5 font-sans text-xs sm:text-sm">
                {/* Tự sinh theo delta */}
                {Math.abs(newTire.width - currentTire.width) > 20 && (
                  <li className="flex gap-2.5 text-amber-400">
                    <Warning size={16} className="shrink-0 mt-0.5" />
                    <span>Chiều rộng tăng <b className="text-white font-mono">{newTire.width - currentTire.width}mm</b> — Kiểm tra khoảng hở vè chắn bùn khi đánh hết lái và phuộc nhún hết hành trình.</span>
                  </li>
                )}
                {Math.abs(comparison.diameterDiffPercent) > 3 && (
                  <li className="flex gap-2.5 text-amber-400">
                    <Warning size={16} className="shrink-0 mt-0.5" />
                    <span>Đường kính thay đổi <b className="text-white font-mono">{Math.abs(comparison.diameterDiffPercent)}%</b> — Hệ thống kiểm soát lực kéo (TCS/ABS/ESP) và cảm biến TPMS có thể cần hiệu chỉnh lại.</span>
                  </li>
                )}
                {newTire.aspectRatio < 45 && (
                  <li className="flex gap-2.5 text-rose-400">
                    <XCircle size={16} className="shrink-0 mt-0.5" />
                    <span>Hông lốp <b className="text-white font-mono">{newTire.aspectRatio}%</b> rất mỏng — Trên đường VN nhiều ổ gà, nguy cơ bong vành và phồng hông lốp cao hơn đáng kể.</span>
                  </li>
                )}
                {newTire.rimDiameter > currentTire.rimDiameter && (
                  <li className="flex gap-2.5 text-slate-200">
                    <Info size={16} className="shrink-0 mt-0.5 text-brand-gold" />
                    <span>Tăng mâm <b className="text-white font-mono">{currentTire.rimDiameter}"</b> lên <b className="text-brand-gold font-mono">{newTire.rimDiameter}"</b> — Cần mua mâm mới phù hợp. Kiểm tra PCD (số lỗ và khoảng cách lỗ bu-lông) trùng khớp với xe.</span>
                  </li>
                )}
                {comparison.speedometerErrorAt100Kmh !== 100 && (
                  <li className="flex gap-2.5 text-slate-200">
                    <Info size={16} className="shrink-0 mt-0.5 text-brand-gold" />
                    <span>Khi đồng hồ báo 100 km/h, tốc độ thực là <b className="text-brand-gold font-mono">{comparison.speedometerErrorAt100Kmh} km/h</b>. {comparison.speedometerErrorAt100Kmh > 100 ? 'Xe chạy nhanh hơn ODO — chú ý biển giới hạn tốc độ.' : 'Xe chạy chậm hơn ODO.'}</span>
                  </li>
                )}
                <li className="flex gap-2.5 text-slate-300">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sau khi lắp lốp mới, nên đi <b className="text-white">50-100 km đầu</b> với tốc độ vừa phải để lốp mài in và ổn định nhiệt. Kiểm tra lại áp suất sau 24 giờ đầu.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 3: CẨM NANG TOÀN DIỆN TỪ FILE OBSIDIAN */}
      {mode === 'knowledge' && (
        <div className="space-y-8">
          {/* Mục A: Dấu hiệu nhận biết lốp đã đạt độ mòn tối đa */}
          <div className="bg-brand-card p-6 sm:p-7 border border-brand-border space-y-5">
            <div className="border-b border-brand-border pb-3.5 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <FirstAid size={20} className="text-brand-gold" weight="bold" />
                Dấu Hiệu Nhận Biết Lốp Cần Thay Thế Ngay Lập Tức
              </h2>
              <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">TIRE WEAR & DAMAGE GUIDE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
              {TIRE_WEAR_GUIDE.map((wear, idx) => (
                <div key={idx} className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-brand-gold font-bold block text-sm sm:text-[15px] border-b border-brand-border pb-1.5">{wear.type}</span>
                    <p className="text-slate-200 font-sans text-xs sm:text-sm leading-relaxed">
                      <b className="text-white">Hiện tượng:</b> {wear.symptom}
                    </p>
                    {wear.cause && (
                      <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                        <b className="text-slate-400">Nguyên nhân:</b> {wear.cause}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1f1b15] text-xs sm:text-sm font-sans text-amber-300 leading-relaxed">
                    <b className="text-brand-gold">Khuyến nghị:</b> {wear.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mục B: Ký hiệu lốp nguyên gốc theo hãng xe (OE Markings) */}
          <div className="bg-brand-card p-6 sm:p-7 border border-brand-border space-y-5">
            <div className="border-b border-brand-border pb-3.5">
              <h2 className="text-sm sm:text-base font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-gold" weight="bold" />
                Ký Hiệu Lốp Nguyên Gốc Nhà Sản Xuất (Original Equipment - OE Markings)
              </h2>
              <p className="text-slate-300 font-sans text-xs sm:text-sm mt-1.5 leading-relaxed">
                Lốp lắp theo xe xuất xưởng thường có các mã dập nổi đặc thù được tinh chỉnh riêng cho từng hãng xe danh tiếng.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
              {Object.entries(OE_MARKINGS).map(([code, item]) => (
                <div key={code} className="bg-brand-bg p-4 border border-brand-border hover:border-brand-gold/40 transition text-center flex flex-col justify-between">
                  <div className="text-xl sm:text-2xl font-bold text-brand-gold">{code}</div>
                  <div className="text-white font-bold text-xs sm:text-sm mt-1">{item.brand}</div>
                  <div className="text-xs text-slate-400 font-sans mt-1.5 leading-tight">{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mục C: Tiêu chuẩn chất lượng UTQG của Mỹ */}
          <div className="bg-brand-card p-6 sm:p-7 border border-brand-border space-y-5">
            <div className="border-b border-brand-border pb-3.5">
              <h2 className="text-sm sm:text-base font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Gauge size={20} className="text-brand-gold" weight="bold" />
                Hệ Thống Tiêu Chuẩn Chất Lượng UTQG (Uniform Tire Quality Grading - Mỹ)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition flex flex-col justify-between">
                <div>
                  <span className="text-brand-gold font-bold text-sm sm:text-base block mb-2">1. TREADWEAR (ĐỘ CHỐNG MÒN)</span>
                  <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                    {UTQG_DATA.treadwear.desc}
                  </p>
                </div>
                <div className="mt-4 bg-brand-card p-3 border border-brand-border text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  {UTQG_DATA.treadwear.scale}
                </div>
              </div>

              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-brand-gold font-bold text-sm sm:text-base block mb-2">2. TRACTION (BÁM ĐƯỜNG ƯỚT)</span>
                <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed mb-3">
                  {UTQG_DATA.traction.desc}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-[#1f1b15]">
                  {UTQG_DATA.traction.levels.map((lvl) => (
                    <div key={lvl.grade} className="flex gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-brand-gold font-mono min-w-[28px]">{lvl.grade}:</span>
                      <span className="text-slate-300 font-sans">{lvl.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                <span className="text-brand-gold font-bold text-sm sm:text-base block mb-2">3. TEMPERATURE (CHỊU NHIỆT CAO)</span>
                <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed mb-3">
                  {UTQG_DATA.temperature.desc}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-[#1f1b15]">
                  {UTQG_DATA.temperature.levels.map((lvl) => (
                    <div key={lvl.grade} className="flex gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-brand-gold font-mono min-w-[24px]">{lvl.grade}:</span>
                      <span className="text-slate-300 font-sans">{lvl.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mục D: Ký hiệu địa hình & công nghệ */}
          <div className="bg-brand-card p-6 sm:p-7 border border-brand-border space-y-5">
            <div className="border-b border-brand-border pb-3.5">
              <h2 className="text-sm sm:text-base font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Truck size={20} className="text-brand-gold" weight="bold" />
                Ký Hiệu Công Nghệ Vận Hành & Địa Hình Mở Rộng
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono">
              {Object.entries(TERRAIN_TECH_SPECS).map(([code, item]) => (
                <div key={code} className="bg-brand-bg p-5 border border-brand-border hover:border-[#383329] transition">
                  <div className="text-lg sm:text-xl font-bold text-brand-gold">{code}</div>
                  <div className="text-white font-bold text-xs sm:text-sm mt-1">{item.name}</div>
                  <p className="text-slate-300 font-sans text-xs sm:text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
