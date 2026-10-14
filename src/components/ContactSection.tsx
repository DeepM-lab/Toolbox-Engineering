import React from 'react';
import { 
  MapPin, 
  ChatCircleDots, 
  Gear, 
  Clock
} from '@phosphor-icons/react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="mt-16 pt-12 border-t border-[#23201b]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Label tiêu đề */}
        <div className="inline-flex items-center gap-3 text-sm font-mono tracking-widest text-[#c9a961] uppercase font-bold">
          <span className="w-10 h-[1.5px] bg-[#c9a961]"></span>
          LIÊN HỆ
          <span className="w-10 h-[1.5px] bg-[#c9a961]"></span>
        </div>

        {/* Tiêu đề chính - Cỡ chữ to ấn tượng, giãn cách thoáng */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-sans leading-tight tracking-normal">
          INBOX NGAY<br />
          <span className="text-[#c9a961]">ĐỂ TƯ VẤN MIỄN PHÍ</span>
        </h2>

        {/* Slogan DeepM */}
        <p className="text-slate-200 text-base sm:text-xl font-sans tracking-wide max-w-2xl mx-auto">
          Không ưng thì hoàn tiền. Sai thì đền gấp đôi. Chỉ vậy thôi.
        </p>

        {/* Hotline lớn vàng gold */}
        <div className="pt-3">
          <a
            href="tel:0982502609"
            className="inline-block text-5xl sm:text-6xl lg:text-7xl font-black font-mono text-[#c9a961] hover:text-[#e5c47c] transition tracking-wider"
          >
            0982502609
          </a>
          <p className="text-sm text-slate-300 font-sans mt-2.5">
            Ưu tiên inbox Facebook để được phản hồi nhanh nhất
          </p>
        </div>

        {/* 3 Nút liên kết hành động - Kích thước lớn, bấm dễ */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://www.google.com/maps/place/DeepM+LaB/@20.9381989,105.8543122,59m/data=!3m1!1e3!4m6!3m5!1s0x3135ad006698afef:0x37657df4913868ce!8m2!3d20.9381929!4d105.854618!16s%2Fg%2F11zcjf5h3n!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#141311] hover:bg-[#1f1b13] border border-[#28241e] hover:border-[#c9a961] text-sm font-mono uppercase font-bold text-slate-200 hover:text-[#c9a961] transition"
          >
            <MapPin size={18} className="text-[#c9a961]" weight="fill" />
            <span>Xem Bản Đồ</span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61593524801396"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#141311] hover:bg-[#1f1b13] border border-[#28241e] hover:border-[#c9a961] text-sm font-mono uppercase font-bold text-slate-200 hover:text-[#c9a961] transition"
          >
            <ChatCircleDots size={18} className="text-[#c9a961]" weight="fill" />
            <span>Inbox Fanpage</span>
          </a>

          <a
            href="https://deepm.vn"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#141311] hover:bg-[#1f1b13] border border-[#28241e] hover:border-[#c9a961] text-sm font-mono uppercase font-bold text-slate-200 hover:text-[#c9a961] transition"
          >
            <Gear size={18} className="text-[#c9a961]" weight="fill" />
            <span>Chi Tiết Sản Phẩm</span>
          </a>
        </div>

        {/* Box địa chỉ xưởng */}
        <a
          href="https://www.google.com/maps/place/DeepM+LaB/@20.9381989,105.8543122,59m/data=!3m1!1e3!4m6!3m5!1s0x3135ad006698afef:0x37657df4913868ce!8m2!3d20.9381929!4d105.854618!16s%2Fg%2F11zcjf5h3n!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noreferrer"
          className="mt-10 mx-auto max-w-2xl bg-[#12110f] hover:bg-[#181512] border border-[#23201b] hover:border-[#c9a961]/60 p-7 text-center space-y-3 block transition cursor-pointer group"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-[#c9a961] font-bold flex items-center justify-center gap-1.5">
            <MapPin size={15} weight="fill" />
            <span>ĐỊA CHỈ XƯỞNG (MỞ GOOGLE MAPS)</span>
          </div>
          <div className="text-2xl font-bold text-white font-sans group-hover:text-[#c9a961] transition">
            DeepM Lab
          </div>
          <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
            Liền kề 12 số nhà 14-15 khu tái định cư Tứ Hiệp, Thanh Trì, Hà Nội
          </p>
          <div className="text-xs sm:text-sm font-mono text-slate-400 pt-1 flex items-center justify-center gap-2">
            <Clock size={16} />
            <span>Thứ 2 – Thứ 7: 8:15 – 17:30 (nghỉ trưa 12:00 – 14:00)</span>
          </div>
        </a>

      </div>
    </section>
  );
};
