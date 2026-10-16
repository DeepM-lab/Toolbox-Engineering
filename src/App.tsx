import { useState } from 'react';
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
  ArrowUp
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

  const handleTabChange = (tab: 'tire' | 'mechanic') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    setMobileMenuOpen(false);
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
            
            {/* Logo DeepM chuẩn */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
              title="Cuộn lên đầu trang"
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
            </div>

            {/* Menu & Switch Tabs trên Desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <nav className="flex items-center gap-1.5 bg-brand-card p-1.5 border border-brand-border">
                <button
                  onClick={() => handleTabChange('tire')}
                  className={`flex items-center gap-2 px-4 lg:px-5 py-2 text-xs lg:text-sm font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                    activeTab === 'tire'
                      ? 'bg-brand-gold text-brand-bg shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#1a1815]'
                  }`}
                >
                  <CircleNotch size={16} weight="bold" />
                  <span>Giải Mã Lốp Xe</span>
                </button>

                <button
                  onClick={() => handleTabChange('mechanic')}
                  className={`flex items-center gap-2 px-4 lg:px-5 py-2 text-xs lg:text-sm font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                    activeTab === 'mechanic'
                      ? 'bg-brand-gold text-brand-bg shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#1a1815]'
                  }`}
                >
                  <Wrench size={16} weight="bold" />
                  <span>Thợ Máy & Excel (135)</span>
                </button>
              </nav>

              {/* Nút Gọi Hotline & Liên Hệ Desktop */}
              <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
                <a
                  href="tel:0982502609"
                  className="flex items-center gap-1.5 px-3 py-2 bg-brand-card hover:bg-[#1c1913] border border-brand-border hover:border-brand-gold text-xs font-mono font-bold text-brand-gold transition"
                  title="Gọi hotline DeepM"
                >
                  <Phone size={15} weight="fill" />
                  <span>0982.502.609</span>
                </a>

                <button 
                  onClick={scrollToContact}
                  className="px-4 py-2 bg-brand-gold text-brand-bg text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-gold-hover transition cursor-pointer"
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

          {/* THANH ĐIỀU HƯỚNG TAB NHANH DƯỚI HEADER TRÊN MOBILE (SEGMENTED CONTROL) */}
          <div className="flex md:hidden border-t border-brand-border py-2 gap-1.5 font-mono">
            <button
              onClick={() => handleTabChange('tire')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs uppercase font-bold transition cursor-pointer border ${
                activeTab === 'tire'
                  ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-sm'
                  : 'bg-brand-card text-slate-300 border-brand-border'
              }`}
            >
              <CircleNotch size={14} weight="bold" />
              <span>Giải Mã Lốp</span>
            </button>

            <button
              onClick={() => handleTabChange('mechanic')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs uppercase font-bold transition cursor-pointer border ${
                activeTab === 'mechanic'
                  ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-sm'
                  : 'bg-brand-card text-slate-300 border-brand-border'
              }`}
            >
              <Wrench size={14} weight="bold" />
              <span>Thợ Máy (135)</span>
            </button>
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
