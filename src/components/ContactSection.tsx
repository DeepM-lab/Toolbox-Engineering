import React from 'react';
import { 
  MapPin, 
  ChatCircleDots, 
  Gear, 
  Clock
} from '@phosphor-icons/react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="mt-16 pt-12 border-t border-brand-border">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Label tiêu đề */}
        <div className="inline-flex items-center gap-3 text-sm font-mono tracking-widest text-brand-gold uppercase font-bold">
          <span className="w-10 h-[1.5px] bg-brand-gold"></span>
          LIÊN HỆ
          <span className="w-10 h-[1.5px] bg-brand-gold"></span>
        </div>

        {/* Tiêu đề chính - Cỡ chữ to ấn tượng, thích ứng mobile */}
        <h2 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-sans leading-tight tracking-normal">
          INBOX NGAY<br />
          <span className="text-brand-gold">ĐỂ TƯ VẤN MIỄN PHÍ</span>
        </h2>

        {/* Slogan DeepM */}
        <p className="text-slate-200 text-sm sm:text-xl font-sans tracking-wide max-w-2xl mx-auto px-2">
          Không ưng thì hoàn tiền. Sai thì đền gấp đôi. Chỉ vậy thôi.
        </p>

        {/* Hotline lớn vàng gold */}
        <div className="pt-2 sm:pt-3">
          <a
            href="tel:0982502609"
            className="inline-block text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black font-mono text-brand-gold hover:text-[#e5c47c] transition tracking-normal sm:tracking-wider break-all"
          >
            0982502609
          </a>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-2">
            Ưu tiên inbox Facebook để được phản hồi nhanh nhất
          </p>
        </div>

        {/* 3 Nút liên kết hành động - Kích thước lớn, bấm dễ */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-3 sm:pt-4">
          <a
            href="https://www.google.com/maps/place/DeepM+LaB/@20.9381989,105.8543122,59m/data=!3m1!1e3!4m6!3m5!1s0x3135ad006698afef:0x37657df4913868ce!8m2!3d20.9381929!4d105.854618!16s%2Fg%2F11zcjf5h3n!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-brand-card hover:bg-[#1f1b13] border border-input hover:border-brand-gold text-xs sm:text-sm font-mono uppercase font-bold text-slate-200 hover:text-brand-gold transition"
          >
            <MapPin size={18} className="text-brand-gold" weight="fill" />
            <span>Xem Bản Đồ</span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61593524801396"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-brand-card hover:bg-[#1f1b13] border border-input hover:border-brand-gold text-xs sm:text-sm font-mono uppercase font-bold text-slate-200 hover:text-brand-gold transition"
          >
            <ChatCircleDots size={18} className="text-brand-gold" weight="fill" />
            <span>Inbox Fanpage</span>
          </a>

          <a
            href="https://deepm.vn"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-brand-card hover:bg-[#1f1b13] border border-input hover:border-brand-gold text-xs sm:text-sm font-mono uppercase font-bold text-slate-200 hover:text-brand-gold transition"
          >
            <Gear size={18} className="text-brand-gold" weight="fill" />
            <span>Chi Tiết Sản Phẩm</span>
          </a>
        </div>

        {/* Box địa chỉ xưởng */}
        <a
          href="https://www.google.com/maps/place/DeepM+LaB/@20.9381989,105.8543122,59m/data=!3m1!1e3!4m6!3m5!1s0x3135ad006698afef:0x37657df4913868ce!8m2!3d20.9381929!4d105.854618!16s%2Fg%2F11zcjf5h3n!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noreferrer"
          className="mt-8 sm:mt-10 mx-auto max-w-2xl bg-[#12110f] hover:bg-[#181512] border border-brand-border hover:border-brand-gold/60 p-5 sm:p-7 text-center space-y-2.5 sm:space-y-3 block transition cursor-pointer group"
        >
          <div className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-brand-gold font-bold flex items-center justify-center gap-1.5">
            <MapPin size={15} weight="fill" />
            <span>ĐỊA CHỈ XƯỞNG (MỞ GOOGLE MAPS)</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-sans group-hover:text-brand-gold transition">
            DeepM Lab
          </div>
          <p className="text-xs sm:text-base text-slate-200 font-sans leading-relaxed">
            Liền kề 12 số nhà 14-15 khu tái định cư Tứ Hiệp, Thanh Trì, Hà Nội
          </p>
          <div className="text-[11px] sm:text-sm font-mono text-slate-400 pt-1 flex items-center justify-center gap-1.5 sm:gap-2">
            <Clock size={15} />
            <span>Thứ 2 – Thứ 7: 8:15 – 17:30</span>
          </div>
        </a>

      </div>
    </section>
  );
};
