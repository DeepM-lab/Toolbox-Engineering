import { useState, useRef, useEffect } from 'react';
import { TireDecoderPage } from './components/TireDecoderPage';
import { MechanicToolsPage } from './components/MechanicToolsPage';
import { ContactSection } from './components/ContactSection';
import { 
  CircleNotch, 
  Wrench, 
  ShieldCheck, 
  Phone, 
  List, 
  MapPin, 
  ChatCircleDots,
  ArrowUp,
  House,
  BookOpen,
  CaretDown,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { useLocalStorage } from './utils/useLocalStorage';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage<'tire' | 'mechanic'>('deepm_active_tab', 'tire');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wikiDropdownOpen, setWikiDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Xử lý mở/đóng dropdown có khoảng trễ (Grace Period) để không bao giờ bị mất menu khi rê chuột chậm
  const handleMouseEnterWiki = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setWikiDropdownOpen(true);
  };

  const handleMouseLeaveWiki = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Độ trễ 80ms để chuột di chuyển thoải mái qua khoảng trống
    closeTimeoutRef.current = setTimeout(() => {
      setWikiDropdownOpen(false);
    }, 80);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setWikiDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleTabChange = (tab: 'tire' | 'mechanic') => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setWikiDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setMobileMenuOpen(false);
    setWikiDropdownOpen(false);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-foreground flex flex-col font-sans selection:bg-brand-gold selection:text-black overflow-x-hidden">
      {/* HEADER THEO PHONG CÁCH CHUẨN DEEPM.VN - TỐI ƯU MOBILE & DESKTOP */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-2">
            
            {/* Logo DeepM */}
            <a 
              href="https://toolbox-engineering.vercel.app/"
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
              title="Về Trang chủ DeepM.vn"
            >
              <div className="border border-white/80 px-2 py-1 sm:px-2.5 text-center bg-black leading-none group-hover:border-brand-gold transition">
                <div className="text-[13px] sm:text-[14px] font-black tracking-tighter text-white">DM</div>
                <div className="text-[8px] sm:text-[9px] font-bold tracking-tight text-white border-t border-white/40 mt-0.5 pt-0.5">DeepM</div>
              </div>
              <div>
                <div className="font-extrabold text-white tracking-wider text-xs sm:text-sm leading-none flex items-center gap-1.5 sm:gap-2 group-hover:text-brand-gold transition">
                  DEEPM LAB <span className="text-[8px] sm:text-[9px] uppercase px-1 sm:px-1.5 py-0.5 bg-[#1f1b13] text-brand-gold font-mono border border-[#3d3422]">R&D</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5 hidden xs:block">ENGINEERING TOOLBOX</div>
              </div>
            </a>

            {/* Menu & Submenu Wiki trên Desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <nav className="flex items-center gap-2 bg-brand-card p-1.5 border border-brand-border">
                {/* 1. Menu HOME dẫn về https://deepm.vn/ - Đồng bộ border và hover viền vàng giống Wiki */}
                <a
                  href="https://deepm.vn/"
                  className="flex items-center gap-2 px-4 lg:px-4.5 py-2.5 text-xs lg:text-sm font-mono uppercase tracking-wider font-bold text-white bg-transparent border border-brand-border/60 hover:border-brand-gold hover:text-brand-gold hover:bg-[#1f1b13] transition"
                >
                  <House size={17} weight="bold" className="text-brand-gold" />
                  <span>Home</span>
                  <ArrowSquareOut size={13} className="text-slate-500 opacity-80" />
                </a>

                {/* 2. Menu WIKI với Dropdown 2 mục con - Tăng phạm vi bấm & chống mất hover */}
                <div 
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnterWiki}
                  onMouseLeave={handleMouseLeaveWiki}
                >
                  <button
                    onClick={() => setWikiDropdownOpen(prev => !prev)}
                    className={`flex items-center gap-2.5 px-4.5 lg:px-5.5 py-2.5 text-xs lg:text-sm font-mono uppercase tracking-wider font-bold transition cursor-pointer border ${
                      wikiDropdownOpen
                        ? 'bg-[#1f1b13] text-brand-gold border-brand-gold'
                        : 'bg-transparent text-white border-brand-border/60 hover:border-brand-gold hover:text-brand-gold'
                    }`}
                  >
                    <BookOpen size={17} weight="bold" className="text-brand-gold" />
                    <span>Wiki</span>
                    <CaretDown 
                      size={14} 
                      weight="bold" 
                      className={`transition-transform duration-200 text-brand-gold ${wikiDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* SUBMENU DROPDOWN: Kèm cầu nối vô hình (before:content) ngăn mất hover */}
                  {wikiDropdownOpen && (
                    <div 
                      className="absolute left-0 top-full mt-2 w-80 bg-[#12100b] border border-brand-gold/60 shadow-2xl z-50 p-1.5 space-y-1 font-mono before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:bg-transparent"
                      onMouseEnter={handleMouseEnterWiki}
                      onMouseLeave={handleMouseLeaveWiki}
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-[#2b2518] flex items-center justify-between">
                        <span>DEEPM WIKI TOOLBOX</span>
                        <span className="text-brand-gold text-[9px]">2 CÔNG CỤ</span>
                      </div>

                      {/* Submenu 1: Giải Mã Lốp Xe */}
                      <button
                        onClick={() => handleTabChange('tire')}
                        className={`w-full flex items-start gap-3 p-3 text-left transition cursor-pointer border ${
                          activeTab === 'tire'
                            ? 'bg-[#211a10] text-brand-gold border-brand-gold/80'
                            : 'bg-transparent text-slate-300 border-transparent hover:bg-[#19150e] hover:text-white hover:border-[#38301f]'
                        }`}
                      >
                        <CircleNotch size={18} weight="bold" className="text-brand-gold mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>Giải Mã Lốp Xe</span>
                            {activeTab === 'tire' && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-brand-gold text-brand-bg font-bold">ĐANG XEM</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-1 leading-snug">
                            Tra cứu thông số, tải trọng, tốc độ & tính toán độ lốp xe
                          </div>
                        </div>
                      </button>

                      {/* Submenu 2: Thợ Máy & Excel */}
                      <button
                        onClick={() => handleTabChange('mechanic')}
                        className={`w-full flex items-start gap-3 p-3 text-left transition cursor-pointer border ${
                          activeTab === 'mechanic'
                            ? 'bg-[#211a10] text-brand-gold border-brand-gold/80'
                            : 'bg-transparent text-slate-300 border-transparent hover:bg-[#19150e] hover:text-white hover:border-[#38301f]'
                        }`}
                      >
                        <Wrench size={18} weight="bold" className="text-brand-gold mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>Thợ Máy & Excel</span>
                            {activeTab === 'mechanic' && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-brand-gold text-brand-bg font-bold">ĐANG XEM</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-1 leading-snug">
                            135 công thức kỹ thuật cơ khí, tiện, phay & xuất bảng Excel
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Nút Gọi Hotline & Liên Hệ Desktop */}
              <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
                <button 
                  onClick={scrollToContact}
                  className="px-6 py-3 bg-brand-gold text-brand-bg text-sm font-mono font-bold uppercase tracking-wider hover:bg-brand-gold-hover transition cursor-pointer"
                >
                  LIÊN HỆ
                </button>
              </div>
            </div>

            {/* Hành động nhanh trên Mobile: Hotline + Nút Menu Sheet */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href="tel:0982502609"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#171512] border border-[#383226] text-brand-gold text-[11px] font-mono font-bold active:scale-95 transition"
              >
                <Phone size={14} weight="fill" />
                <span>0982502609</span>
              </a>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Mở menu"
                    className="p-2 bg-brand-card border border-brand-border text-slate-200 hover:text-brand-gold hover:border-brand-gold transition cursor-pointer"
                  >
                    <List size={20} weight="bold" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-xs flex flex-col justify-between">
                  <div className="space-y-6">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2 text-brand-gold">
                        <div className="w-2 h-2 bg-brand-gold" />
                        DEEPM LAB MENU
                      </SheetTitle>
                    </SheetHeader>

                    {/* Danh sách mục chọn trong Menu Mobile */}
                    <div className="flex flex-col gap-2 font-mono text-sm">
                      {/* Mục 1: Home sang deepm.vn */}
                      <a
                        href="https://deepm.vn/"
                        className="flex items-center justify-between p-3.5 bg-brand-bg text-slate-200 border border-brand-border hover:border-brand-gold font-bold transition"
                      >
                        <div className="flex items-center gap-3">
                          <House size={20} weight="bold" className="text-brand-gold" />
                          <span>TRANG CHỦ (DEEPM.VN)</span>
                        </div>
                        <ArrowSquareOut size={16} className="text-slate-500" />
                      </a>

                      {/* Phân nhóm Wiki */}
                      <div className="pt-3 pb-1 text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-2 border-t border-brand-border mt-1">
                        <BookOpen size={14} className="text-brand-gold" />
                        <span>KHO CÔNG CỤ WIKI</span>
                      </div>

                      <button
                        onClick={() => handleTabChange('tire')}
                        className={`flex items-center gap-3 p-3.5 border text-left font-bold transition cursor-pointer ${
                          activeTab === 'tire'
                            ? 'bg-brand-gold text-brand-bg border-brand-gold'
                            : 'bg-brand-bg text-slate-300 border-brand-border hover:border-brand-gold'
                        }`}
                      >
                        <CircleNotch size={20} weight="bold" />
                        <div>
                          <div>GIẢI MÃ LỐP XE</div>
                          <div className="text-[11px] font-normal opacity-80">Tra cứu, tính tải, so sánh độ lốp</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleTabChange('mechanic')}
                        className={`flex items-center gap-3 p-3.5 border text-left font-bold transition cursor-pointer ${
                          activeTab === 'mechanic'
                            ? 'bg-brand-gold text-brand-bg border-brand-gold'
                            : 'bg-brand-bg text-slate-300 border-brand-border hover:border-brand-gold'
                        }`}
                      >
                        <Wrench size={20} weight="bold" />
                        <div>
                          <div>THỢ MÁY & EXCEL (135)</div>
                          <div className="text-[11px] font-normal opacity-80">135 công thức cơ khí, xuất Excel</div>
                        </div>
                      </button>

                      <div className="pt-4 border-t border-brand-border space-y-2">
                        <button
                          onClick={scrollToContact}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-brand-gold text-brand-bg font-bold uppercase transition"
                        >
                          <ChatCircleDots size={18} weight="bold" />
                          <span>Liên Hệ Tư Vấn</span>
                        </button>

                        <a
                          href="https://www.google.com/maps/place/DeepM+LaB/@20.9381989,105.8543122,59m/data=!3m1!1e3!4m6!3m5!1s0x3135ad006698afef:0x37657df4913868ce!8m2!3d20.9381929!4d105.854618!16s%2Fg%2F11zcjf5h3n!5m1!1e1?entry=ttu"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 p-3 bg-brand-bg border border-brand-border text-slate-300 hover:text-white font-bold uppercase transition"
                        >
                          <MapPin size={18} weight="fill" className="text-brand-gold" />
                          <span>Xem Bản Đồ Xưởng</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 text-center border-t border-brand-border pt-4">
                    DEEPM.VN • AUTOMOTIVE LAB
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>

          {/* THANH ĐIỀU HƯỚNG NHANH DƯỚI HEADER TRÊN MOBILE */}
          <div className="flex md:hidden border-t border-brand-border py-2 gap-1.5 font-mono items-center">
            <a
              href="https://deepm.vn/"
              className="flex items-center gap-1 px-3 py-2 bg-brand-card text-slate-300 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-xs uppercase font-bold active:scale-95 transition shrink-0"
              title="Về Trang chủ DeepM.vn"
            >
              <House size={14} weight="bold" className="text-brand-gold" />
              <span>Home</span>
            </a>

            <div className="flex-1 flex gap-1">
              <button
                onClick={() => handleTabChange('tire')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] uppercase font-bold transition cursor-pointer border ${
                  activeTab === 'tire'
                    ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-sm'
                    : 'bg-brand-card text-slate-300 border-brand-border'
                }`}
              >
                <CircleNotch size={13} weight="bold" />
                <span>Wiki: Lốp</span>
              </button>

              <button
                onClick={() => handleTabChange('mechanic')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] uppercase font-bold transition cursor-pointer border ${
                  activeTab === 'mechanic'
                    ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-sm'
                    : 'bg-brand-card text-slate-300 border-brand-border'
                }`}
              >
                <Wrench size={13} weight="bold" />
                <span>Wiki: Thợ Máy</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'tire' ? <TireDecoderPage /> : <MechanicToolsPage />}
        
        {/* KHỐI LIÊN HỆ ĐỒNG BỘ DEEPM.VN */}
        <ContactSection />
      </main>

      {/* NÚT CUỘN NHANH LÊN ĐẦU TRANG */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Cuộn lên đầu trang"
        className="fixed bottom-5 right-5 z-30 p-2.5 bg-brand-card hover:bg-brand-gold text-brand-gold hover:text-brand-bg border border-[#383329] hover:border-brand-gold transition shadow-xl cursor-pointer"
        title="Lên đầu trang"
      >
        <ArrowUp size={18} weight="bold" />
      </button>

      {/* FOOTER CHUẨN KỸ THUẬT DEEPM */}
      <footer className="bg-brand-bg border-t border-brand-border py-6 sm:py-8 text-xs sm:text-sm font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={18} className="text-brand-gold shrink-0" weight="bold" />
            <span className="font-medium text-[11px] sm:text-xs">DEEPM LAB • MÁY PHÁT ĐIỆN 210A • DENSO JAPAN • NGUYÊN BẢN NHƯ HÃNG</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>© 2026 DEEPM.VN</span>
            <span>•</span>
            <span className="text-brand-gold font-bold">DeepM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
