import React from 'react';

interface TireVisualizerProps {
  width: number;
  aspectRatio: number;
  rimDiameter: number;
  totalDiameterMm: number;
  sidewallHeightMm: number;
  label?: string;
  compareWith?: {
    totalDiameterMm: number;
    rimDiameter: number;
  };
}

export const TireVisualizer: React.FC<TireVisualizerProps> = ({
  width,
  aspectRatio,
  rimDiameter,
  totalDiameterMm,
  sidewallHeightMm,
  label = 'BẢN VẼ KỸ THUẬT MẶT CẮT',
  compareWith,
}) => {
  const center = 160;
  const scale = 140 / 450;

  const tireRadiusPx = (totalDiameterMm / 2) * scale;
  const rimRadiusPx = ((rimDiameter * 25.4) / 2) * scale;
  const compareTireRadiusPx = compareWith ? (compareWith.totalDiameterMm / 2) * scale : null;

  return (
    <div className="bg-brand-card border border-brand-border p-4 sm:p-6 flex flex-col items-center w-full max-w-full overflow-hidden">
      {/* Header kỹ thuật phong cách deepm.vn */}
      <div className="w-full flex items-center justify-between border-b border-brand-border pb-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-gold shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-slate-300 font-bold truncate">
            {label}
          </span>
        </div>
        <span className="font-mono text-xs text-brand-gold font-bold bg-brand-bg px-2.5 py-1 border border-[#3d3422] shrink-0">
          {width}/{aspectRatio}R{rimDiameter}
        </span>
      </div>

      {/* SVG Canvas mô phỏng - Phóng to thêm diện tích hiển thị */}
      <div className="relative w-65 h-65 sm:w-80 sm:h-80 max-w-full flex items-center justify-center my-2 sm:my-3">
        {/* Lưới tọa độ background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2c271f_1px,transparent_1px)] bg-size-[16px_16px] opacity-70 pointer-events-none" />

        <svg viewBox="0 0 320 320" className="w-full h-full relative z-10">
          {/* Trục tâm chữ thập */}
          <line x1={center} y1="15" x2={center} y2="305" stroke="#2a241b" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="15" y1={center} x2="305" y2={center} stroke="#2a241b" strokeWidth="1" strokeDasharray="4 4" />

          {/* Vòng so sánh nếu có (nét đứt mờ) */}
          {compareTireRadiusPx && (
            <circle
              cx={center}
              cy={center}
              r={compareTireRadiusPx}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.85"
            />
          )}

          {/* Viền gai lốp ngoài cùng */}
          <circle
            cx={center}
            cy={center}
            r={tireRadiusPx}
            fill="#141311"
            stroke="#383227"
            strokeWidth="8"
            strokeDasharray="10 3"
          />

          {/* Thành lốp cao su */}
          <circle
            cx={center}
            cy={center}
            r={tireRadiusPx - 4}
            fill="#0c0b0a"
            stroke="#262119"
            strokeWidth="1"
          />

          {/* Mâm hợp kim kim loại phay màu gold */}
          <circle
            cx={center}
            cy={center}
            r={rimRadiusPx}
            fill="#171512"
            stroke="#c9a961"
            strokeWidth="2.5"
          />

          {/* Nan hoa / Chấu mâm */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = center + (rimRadiusPx - 4) * Math.cos(rad);
            const y2 = center + (rimRadiusPx - 4) * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="#8c7543"
                strokeWidth="4"
                strokeLinecap="square"
              />
            );
          })}

          {/* Tâm mâm */}
          <circle cx={center} cy={center} r="24" fill="#0c0b0a" stroke="#c9a961" strokeWidth="2" />
          <circle cx={center} cy={center} r="10" fill="#c9a961" />

          {/* Ốc tắc kê */}
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = center + 15 * Math.cos(rad);
            const y = center + 15 * Math.sin(rad);
            return <circle key={angle} cx={x} cy={y} r="2.5" fill="#f8fafc" />;
          })}
        </svg>

        {/* Badge đo đạc đường kính danh nghĩa */}
        <div className="absolute bottom-2 bg-brand-bg/95 border border-brand-gold/50 px-4 py-1.5 font-mono text-xs sm:text-sm text-slate-200 shadow-lg">
          Ø DANH NGHĨA: <span className="text-brand-gold font-bold text-sm sm:text-base">{totalDiameterMm} mm</span>
        </div>
      </div>

      {/* Thông số đo lường bên dưới - Chữ to, phân cấp rõ ràng */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3.5 w-full mt-4 font-mono border-t border-brand-border pt-3 sm:pt-4">
        <div className="bg-brand-bg p-3 sm:p-4 border border-brand-border hover:border-[#383329] transition">
          <div className="text-slate-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider truncate">ĐỘ CAO HÔNG LỐP</div>
          <div className="text-white text-base sm:text-xl font-bold mt-1">{sidewallHeightMm} mm</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">{aspectRatio}% bề rộng lốp</div>
        </div>
        <div className="bg-brand-bg p-3 sm:p-4 border border-brand-border hover:border-[#383329] transition">
          <div className="text-slate-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider truncate">BỀ RỘNG TIẾP XÚC</div>
          <div className="text-white text-base sm:text-xl font-bold mt-1">{width} mm</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Tiết diện mặt gai</div>
        </div>
      </div>
    </div>
  );
};