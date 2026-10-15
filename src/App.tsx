import { useState } from 'react';
import { TireDecoderPage } from './components/TireDecoderPage';
import { MechanicToolsPage } from './components/MechanicToolsPage';
import { ContactSection } from './components/ContactSection';
import { CircleNotch, Wrench, ShieldCheck } from '@phosphor-icons/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tire' | 'mechanic'>('tire');

  return (
    <div className="min-h-screen bg-brand-bg text-[#e5e5e5] flex flex-col font-sans selection:bg-brand-gold selection:text-black">
      {/* HEADER THEO PHONG CÁCH CHUẨN DEEPM.VN */}
      <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo DeepM chuẩn như web deepm.vn */}
          <div className="flex items-center gap-3">
            <div className="border border-white/80 px-2.5 py-1 text-center bg-black leading-none">
              <div className="text-[14px] font-black tracking-tighter text-white">DM</div>
              <div className="text-[9px] font-bold tracking-tight text-white border-t border-white/40 mt-0.5 pt-0.5">DeepM</div>
            </div>
            <div>
              <div className="font-extrabold text-white tracking-wider text-sm leading-none flex items-center gap-2">
                DEEPM LAB <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#1f1b13] text-brand-gold font-mono border border-[#3d3422]">R&D CENTER</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">AUTOMOTIVE ENGINEERING TOOLBOX</div>
            </div>
          </div>

            {/* Menu & Switch Tabs */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 bg-brand-card p-1.5 border border-brand-border">
              <button
                onClick={() => setActiveTab('tire')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                  activeTab === 'tire'
                    ? 'bg-brand-gold text-brand-bg'
                    : 'text-slate-300 hover:text-white hover:bg-[#1a1815]'
                }`}
              >
                <CircleNotch size={17} weight="bold" />
                <span>Giải Mã Lốp Xe</span>
              </button>

              <button
                onClick={() => setActiveTab('mechanic')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                  activeTab === 'mechanic'
                    ? 'bg-brand-gold text-brand-bg'
                    : 'text-slate-300 hover:text-white hover:bg-[#1a1815]'
                }`}
              >
                <Wrench size={17} weight="bold" />
                <span>Thợ Máy & Excel</span>
              </button>
            </nav>

            {/* Nút Liên Hệ */}
            <div className="flex items-center gap-3 pl-2 border-l border-brand-border">
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 bg-brand-gold text-brand-bg text-sm font-mono font-bold uppercase tracking-wider hover:bg-brand-gold-hover transition cursor-pointer"
              >
                LIÊN HỆ
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'tire' ? <TireDecoderPage /> : <MechanicToolsPage />}
        
        {/* KHỐI LIÊN HỆ ĐỒNG BỘ DEEPM.VN */}
        <ContactSection />
      </main>

      {/* FOOTER CHUẨN KỸ THUẬT DEEPM */}
      <footer className="bg-brand-bg border-t border-brand-border py-8 text-sm font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={20} className="text-brand-gold" weight="bold" />
            <span className="font-medium">DEEPM LAB • MÁY PHÁT ĐIỆN 210A • DENSO JAPAN • NGUYÊN BẢN NHƯ HÃNG</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 DEEPM.VN</span>
            <span>•</span>
            <span className="text-brand-gold font-bold">DeepM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
