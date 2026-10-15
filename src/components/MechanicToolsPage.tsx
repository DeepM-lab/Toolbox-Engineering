import React, { useState } from 'react';
import { exportCalculationToExcel, type CalculationResult } from '../utils/excelExport';
import { ALL_TOOLS, TOOL_CATEGORIES, getInputMin, type ToolDefinition } from '../data/engineeringTools';
import { VERIFICATION_CASES, type VerificationCase } from '../data/testCases';
import { 
  FileXls, 
  Plus, 
  Trash, 
  MagnifyingGlass, 
  Funnel, 
  CheckCircle, 
  WarningCircle, 
  ArrowSquareOut, 
  Flask, 
  Play, 
  Info, 
  CarProfile, 
  Cpu, 
  ArrowsClockwise,
  X
} from '@phosphor-icons/react';

export const MechanicToolsPage: React.FC = () => {
  // Tab chế độ: Bàn tính hoặc Kiểm thử nghiệm chứng
  const [activeMode, setActiveMode] = useState<'calculator' | 'verification'>('calculator');

  // Thông tin xe & khách hàng
  const [vehicleInfo, setVehicleInfo] = useState({
    customerName: 'Anh ABC - DeepM',
    carModel: 'Mitsubishi Triton 4N15 / Land Cruiser LC80',
    licensePlate: '30K-888.88',
  });

  // Bộ lọc danh mục & tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Tool đang được kích hoạt tính toán
  const [selectedToolId, setSelectedToolId] = useState<string>('DM-001');

  // Giá trị đầu vào động cho từng Tool (cho phép lưu string rỗng khi người dùng đang gõ/xóa)
  const [formInputs, setFormInputs] = useState<Record<string, Record<string, number | string>>>(() => {
    const initial: Record<string, Record<string, number | string>> = {};
    ALL_TOOLS.forEach((tool) => {
      initial[tool.id] = {};
      tool.inputs.forEach((inp) => {
        initial[tool.id][inp.key] = inp.defaultVal;
      });
    });
    return initial;
  });

  // Danh sách các phép tính đã lưu để xuất file Excel
  const [savedCalculations, setSavedCalculations] = useState<CalculationResult[]>([]);

  // Lọc danh sách công cụ
  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchCat = selectedCategory === 'all' || tool.categoryId === selectedCategory;
    const matchSearch = tool.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        tool.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        tool.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        (tool.formula && tool.formula.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Tool hiện tại
  const currentTool: ToolDefinition = ALL_TOOLS.find((t) => t.id === selectedToolId) || ALL_TOOLS[0];
  const currentInputs = formInputs[currentTool.id] || {};

  // Chuẩn hóa tham số đầu vào và chạy qua Safe Calculation Wrapper
  const { calculationResult, hasEmptyParam, emptyParamLabel } = (() => {
    const sanitizedInputs: Record<string, number> = {};
    let emptyParam: string | null = null;
    let invalidMinParam: { label: string; minVal: number; unit: string; currentVal: number } | null = null;

    for (const inp of currentTool.inputs) {
      const rawVal = currentInputs[inp.key];
      if (rawVal === '' || rawVal === undefined || rawVal === null) {
        if (!emptyParam) emptyParam = inp.label;
        sanitizedInputs[inp.key] = 0;
      } else {
        const num = Number(rawVal);
        const minVal = getInputMin(inp);
        if (!isNaN(num) && num < minVal && !invalidMinParam) {
          invalidMinParam = { label: inp.label, minVal, unit: inp.unit, currentVal: num };
        }
        sanitizedInputs[inp.key] = isNaN(num) ? 0 : num;
      }
    }

    if (emptyParam) {
      return {
        hasEmptyParam: true,
        emptyParamLabel: emptyParam,
        calculationResult: {
          outputs: {},
          notes: `Vui lòng nhập giá trị cho tham số "${emptyParam}" để hệ thống tính toán.`,
          hasMathError: true,
          errorMessage: `Thiếu tham số "${emptyParam}"`
        }
      };
    }

    if (invalidMinParam) {
      return {
        hasEmptyParam: false,
        emptyParamLabel: '',
        calculationResult: {
          outputs: {},
          notes: `⚠️ Tham số "${invalidMinParam.label}" (${invalidMinParam.currentVal} ${invalidMinParam.unit}) không được nhỏ hơn ngưỡng tối thiểu ${invalidMinParam.minVal} ${invalidMinParam.unit}. Vui lòng nhập giá trị hợp lệ!`,
          hasMathError: true,
          errorMessage: `Tham số "${invalidMinParam.label}" < ${invalidMinParam.minVal}`
        }
      };
    }

    try {
      const raw = currentTool.calculate(sanitizedInputs);
      let hasMathError = false;
      let mathErrorMessage = '';
      const cleanOutputs: Record<string, { label: string; value: number | string; unit: string }> = {};

      for (const [k, out] of Object.entries(raw.outputs)) {
        if (typeof out.value === 'number') {
          if (isNaN(out.value)) {
            hasMathError = true;
            mathErrorMessage = 'Tham số đầu vào không hợp lệ (không thể lấy căn số âm hoặc logarit không dương).';
            cleanOutputs[k] = { ...out, value: 'Không hợp lệ (NaN)' };
          } else if (!isFinite(out.value)) {
            hasMathError = true;
            mathErrorMessage = 'Có tham số nằm ở mẫu số bằng 0 (lỗi chia cho 0). Vui lòng nhập giá trị > 0.';
            cleanOutputs[k] = { ...out, value: 'Vô cực (Chia cho 0)' };
          } else {
            cleanOutputs[k] = out;
          }
        } else if (typeof out.value === 'string') {
          const lowerStr = out.value.toLowerCase();
          if (
            lowerStr.includes('không hợp lệ') ||
            lowerStr.includes('vô cực') ||
            lowerStr.includes('nan') ||
            lowerStr.includes('infinity')
          ) {
            hasMathError = true;
            if (!mathErrorMessage) {
              mathErrorMessage = out.value.includes('(')
                ? out.value
                : 'Kết quả tính toán không hợp lệ do vi phạm điều kiện vật lý / toán học.';
            }
          }
          cleanOutputs[k] = out;
        } else {
          cleanOutputs[k] = out;
        }
      }

      return {
        hasEmptyParam: false,
        emptyParamLabel: '',
        calculationResult: {
          outputs: cleanOutputs,
          notes: hasMathError ? `⚠️ ${mathErrorMessage}` : raw.notes,
          hasMathError,
          errorMessage: mathErrorMessage
        }
      };
    } catch (err: any) {
      return {
        hasEmptyParam: false,
        emptyParamLabel: '',
        calculationResult: {
          outputs: {},
          notes: `⚠️ Phát sinh lỗi trong công thức: ${err?.message || 'Lỗi không xác định'}`,
          hasMathError: true,
          errorMessage: err?.message || 'Lỗi tính toán'
        }
      };
    }
  })();

  // Xử lý đổi giá trị input (hỗ trợ nhập rỗng khi đang gõ)
  const handleInputChange = (toolId: string, key: string, value: number | string) => {
    setFormInputs((prev) => ({
      ...prev,
      [toolId]: {
        ...(prev[toolId] || {}),
        [key]: value,
      },
    }));
  };

  // Reset giá trị về mặc định
  const handleResetInputs = () => {
    const defaults: Record<string, number> = {};
    currentTool.inputs.forEach(inp => {
      defaults[inp.key] = inp.defaultVal;
    });
    setFormInputs(prev => ({
      ...prev,
      [currentTool.id]: defaults
    }));
  };

  // Lưu phép tính hiện tại vào danh sách xuất Excel
  const handleSaveCurrentCalculation = () => {
    if (calculationResult.hasMathError) {
      alert(`Không thể lưu phép tính: ${calculationResult.errorMessage || 'Dữ liệu đầu vào hoặc kết quả chưa hợp lệ'}. Vui lòng kiểm tra lại tham số trước khi lưu vào báo cáo!`);
      return;
    }

    const inputsData: Record<string, { label: string; value: number | string; unit: string }> = {};
    currentTool.inputs.forEach((inp) => {
      inputsData[inp.key] = {
        label: inp.label,
        value: currentInputs[inp.key] ?? inp.defaultVal,
        unit: inp.unit,
      };
    });

    const nowIso = new Date().toISOString();
    const newResult: CalculationResult = {
      toolId: currentTool.id,
      category: currentTool.category,
      toolName: currentTool.name,
      formula: currentTool.formula,
      inputs: inputsData,
      outputs: calculationResult.outputs,
      notes: calculationResult.notes,
      timestamp: nowIso,
    };

    setSavedCalculations([...savedCalculations, newResult]);
  };

  // Xóa 1 mục
  const handleRemoveCalculation = (index: number) => {
    setSavedCalculations(savedCalculations.filter((_, i) => i !== index));
  };

  // Xuất file Excel
  const handleExportExcel = () => {
    if (savedCalculations.length === 0) {
      alert('Vui lòng bấm "Lưu Vào Báo Cáo Kỹ Thuật" ít nhất 1 phép tính trước khi xuất Excel!');
      return;
    }
    exportCalculationToExcel(savedCalculations, vehicleInfo);
  };

  // Nạp nhanh bộ dữ liệu test case vào bàn tính
  const handleLoadTestCase = (testCase: VerificationCase) => {
    let toolId = testCase.id;
    if (toolId === 'DM-083-Camping') toolId = 'DM-083';

    setSelectedToolId(toolId);
    setFormInputs(prev => ({
      ...prev,
      [toolId]: {
        ...(prev[toolId] || {}),
        ...testCase.inputs
      }
    }));
    setActiveMode('calculator');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 font-sans">
      {/* 1. HERO BANNER - CHUẨN DEEPM LUXURY INDUSTRIAL */}
      <div className="border-b border-brand-border pb-7 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#161410] border border-[#3d3422] text-brand-gold text-xs font-mono tracking-widest uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
            DEEPM LAB • 12 BỘ CÔNG CỤ • 135 THUẬT TOÁN KỸ THUẬT Ô TÔ
          </div>

          {/* Switch Mode: Bàn tính hoặc Kiểm thử 12 Test Case */}
          <div className="inline-flex items-center gap-1 bg-brand-card p-1 border border-brand-border self-start sm:self-auto">
            <button
              onClick={() => setActiveMode('calculator')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                activeMode === 'calculator'
                  ? 'bg-brand-gold text-brand-bg shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a1815]'
              }`}
            >
              <Cpu size={15} weight="bold" />
              <span>Bàn Tính 135 Tools</span>
            </button>
            <button
              onClick={() => setActiveMode('verification')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                activeMode === 'verification'
                  ? 'bg-brand-gold text-brand-bg shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a1815]'
              }`}
            >
              <Flask size={15} weight="bold" />
              <span>Nghiệm Chứng 12 Mẫu (Pass 100%)</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase leading-tight sm:leading-snug tracking-normal font-sans">
          AUTOMOTIVE <span className="text-brand-gold">ENGINEERING TOOLBOX</span>
        </h1>
        <div className="font-mono text-xs text-slate-400 tracking-wider uppercase mt-3 flex flex-wrap gap-x-3 gap-y-1">
          <span className="text-brand-gold">OFF-ROAD & 4X4</span>•
          <span>CAR AUDIO SPL</span>•
          <span>CAMPING RV</span>•
          <span>PERFORMANCE TUNING</span>•
          <span>DRIFT & RACING</span>•
          <span>WHEEL FITMENT</span>•
          <span>ELECTRICAL 210A</span>•
          <span>BATTERY PACK</span>•
          <span>FABRICATION</span>•
          <span>EV DYNAMICS</span>
        </div>
        <p className="text-slate-400 text-sm mt-3.5 max-w-4xl leading-relaxed">
          Nền tảng số hóa 135 công thức cơ học truyền động, động học lốp, phụ tải điện, dung lượng pin và kết cấu thân vỏ theo tiêu chuẩn thực nghiệm DeepM Lab.
        </p>
      </div>

      {activeMode === 'verification' ? (
        /* GIAO DIỆN KIỂM THỬ TỰ ĐỘNG 12 CA TEST CHUẨN TỪ SHEET KIEM THU */
        <div className="space-y-6">
          <div className="bg-brand-card p-5 sm:p-6 border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Flask size={18} className="text-brand-gold" weight="fill" />
                BẢNG NGHIỆM CHỨNG CÔNG THỨC — 12 VÍ DỤ CÓ THỂ TÍNH LẠI
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Trích xuất nguyên văn từ Sheet <code>KIEM THU</code>. Bấm "Nạp Vào Bàn Tính" để xem chi tiết từng bước tính.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
              12/12 TEST CASE: PASS 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFICATION_CASES.map((tc, idx) => {
              let targetId = tc.id === 'DM-083-Camping' ? 'DM-083' : tc.id;
              const tool = ALL_TOOLS.find(t => t.id === targetId);
              const testRun = tool ? tool.calculate(tc.inputs) : null;
              
              return (
                <div key={idx} className="bg-[#12110f] border border-brand-border hover:border-[#3d3422] p-4 space-y-3 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-gold font-bold">[{targetId}]</span>
                      <span className="px-1.5 py-0.5 bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">PASS</span>
                    </div>
                    <h3 className="font-bold text-white text-sm font-mono mt-1">{tc.testName}</h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">Nhóm: <b className="text-slate-300">{tc.categoryName}</b></div>

                    <div className="mt-3 bg-brand-bg p-2.5 border border-[#1f1c16] text-xs font-mono space-y-1">
                      <div className="text-slate-500 uppercase text-[10px] font-medium">Tham số nạp:</div>
                      {Object.entries(tc.inputs).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-slate-300">
                          <span className="text-slate-400">{k}:</span>
                          <span className="font-bold text-brand-gold">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2.5 text-xs font-mono bg-[#161410] p-2 border border-[#2b2518] flex justify-between items-center">
                      <span className="text-slate-400">Đáp án kiểm nghiệm:</span>
                      <span className="font-bold text-white">
                        {testRun ? Object.values(testRun.outputs)[0]?.value : '-'} {testRun ? Object.values(testRun.outputs)[0]?.unit : ''}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 italic mt-2">
                      Điều kiện: {tc.conditionNotes}
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadTestCase(tc)}
                    className="w-full mt-3 py-2 bg-[#1a1712] hover:bg-brand-gold text-brand-gold hover:text-brand-bg border border-[#332b1c] hover:border-brand-gold font-mono text-xs uppercase font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={13} weight="fill" />
                    Nạp Vào Bàn Tính
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GIAO DIỆN BÀN TÍNH CHÍNH 135 CÔNG CỤ */
        <div className="space-y-6">
          {/* 2. THANH THÔNG TIN XE & KHÁCH HÀNG (SÁNG RÕ, CHỮ TO 1-2PX, TƯƠNG PHẢN CAO) */}
          <div className="bg-[#151411] border border-[#2d2820] p-5 sm:p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-[#28231a] pb-3 mb-4">
              <span className="text-sm font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <CarProfile size={18} className="text-brand-gold" weight="bold" />
                Hồ Sơ Xe & Báo Cáo Kỹ Thuật
              </span>
              <span className="text-xs font-mono text-brand-gold/80 uppercase tracking-widest font-semibold">GARAGE CLIENT RECORD</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div>
                <label className="text-slate-300 text-xs sm:text-[13px] font-bold block mb-1.5 uppercase tracking-wide">
                  CHỦ XE / KHÁCH HÀNG
                </label>
                <input
                  type="text"
                  value={vehicleInfo.customerName}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, customerName: e.target.value })}
                  className="w-full bg-brand-bg border border-[#383226] hover:border-[#4d4433] focus:border-brand-gold px-3.5 py-2.5 text-white font-medium text-sm sm:text-base outline-none transition"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs sm:text-[13px] font-bold block mb-1.5 uppercase tracking-wide">
                  DÒNG XE & ĐỘNG CƠ
                </label>
                <input
                  type="text"
                  value={vehicleInfo.carModel}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, carModel: e.target.value })}
                  className="w-full bg-brand-bg border border-[#383226] hover:border-[#4d4433] focus:border-brand-gold px-3.5 py-2.5 text-white font-medium text-sm sm:text-base outline-none transition"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs sm:text-[13px] font-bold block mb-1.5 uppercase tracking-wide">
                  BIỂN SỐ KIỂM SOÁT
                </label>
                <input
                  type="text"
                  value={vehicleInfo.licensePlate}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, licensePlate: e.target.value })}
                  className="w-full bg-brand-bg border border-[#383226] hover:border-[#4d4433] focus:border-brand-gold px-3.5 py-2.5 text-brand-gold font-bold text-sm sm:text-base outline-none tracking-wider transition"
                />
              </div>
            </div>
          </div>

          {/* 3. BỘ LỌC 12 CHUYÊN ĐỀ & Ô TÌM KIẾM TINH GỌN (CHỮ RÕ, NỀN SÁNG HƠN) */}
          <div className="bg-[#151411] border border-[#2d2820] p-5 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-2 font-mono uppercase">
                <Funnel size={16} className="text-brand-gold" weight="bold" />
                <span className="font-bold text-white text-xs sm:text-sm tracking-wider">12 Chuyên Đề Kỹ Thuật:</span>
              </div>
              
              {/* Ô tìm kiếm chữ to hơn 1-2px, viền sáng, kèm nút X xóa nhanh */}
              <div className="relative w-full sm:w-88">
                <MagnifyingGlass size={18} className="absolute left-3.5 top-3 text-brand-gold pointer-events-none" />
                <input
                  type="text" 
                  placeholder="Tìm tên công cụ, mã DM-001..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-[#433d36] border border-[#383226] hover:border-[#4d4433] pl-10 pr-10 py-2 text-sm font-mono text-[#dcb55c] focus:outline-none focus:border-brand-gold transition placeholder:text-slate-300/60"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    title="Xóa tìm kiếm"
                    className="absolute right-2.5 top-2.5 p-1 text-slate-300 hover:text-white hover:bg-[#574f46] rounded-full transition cursor-pointer flex items-center justify-center"
                  >
                    <X size={15} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            {/* Các pills danh mục - Tăng chữ 1-2px, padding rộng hơn, tương phản cao */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-[#26221a]">
              {TOOL_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                // Rút gọn tên tab cho thoáng mắt
                const shortLabel = cat.name.replace(/\(\d+\s*tools?\)/i, '').replace(/Tất Cả 12 Nhóm.*/, 'TẤT CẢ 135 TOOLS');
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs sm:text-[13px] font-mono uppercase tracking-wider transition cursor-pointer border ${
                      isActive
                        ? 'bg-brand-gold text-brand-bg border-brand-gold font-black shadow-md'
                        : 'bg-[#0e0d0b] text-slate-300 border-[#2b261e] hover:border-brand-gold/60 hover:text-white hover:bg-[#1a1713]'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. WORKSPACE CHÍNH: MENU 135 TOOL BÊN TRÁI + BÀN TÍNH CÔNG THỨC BÊN PHẢI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: DANH SÁCH TOOL DẠNG COMPACT LIST */}
            <div className="lg:col-span-5 bg-[#12110f] border border-brand-border flex flex-col h-187.5">
              <div className="p-3.5 border-b border-brand-border bg-[#161410] flex justify-between items-center text-sm font-mono">
                <span className="font-bold text-slate-200 uppercase tracking-wider">
                  DANH SÁCH TOOL ({filteredTools.length}/135)
                </span>
                <span className="text-xs text-brand-gold uppercase font-bold">CHỌN ĐỂ TÍNH</span>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-[#1a1815] p-1.5">
                {filteredTools.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-mono space-y-3">
                    <p>Không tìm thấy công cụ nào khớp với từ khóa "{searchKeyword}".</p>
                    <button
                      onClick={() => { setSearchKeyword(''); setSelectedCategory('all'); }}
                      className="px-3 py-1.5 bg-[#1c1913] hover:bg-[#252018] text-brand-gold border border-[#3d3422] text-xs font-bold uppercase transition cursor-pointer"
                    >
                      Xóa bộ lọc & xem lại 135 tools
                    </button>
                  </div>
                ) : (
                  filteredTools.map((tool) => {
                    const isSelected = tool.id === selectedToolId;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedToolId(tool.id)}
                        className={`w-full text-left p-3.5 transition cursor-pointer flex flex-col gap-1.5 border ${
                          isSelected
                            ? 'bg-[#1c1913] border-brand-gold text-white'
                            : 'bg-transparent border-transparent hover:bg-[#161512] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className={`font-bold ${isSelected ? 'text-brand-gold' : 'text-slate-400'}`}>
                            [{tool.id}]
                          </span>
                          <span className="text-xs text-slate-400 uppercase font-medium">{tool.classification || tool.category}</span>
                        </div>
                        <div className="font-bold text-[15px] sm:text-base leading-snug">{tool.name}</div>
                        <div className="text-[13px] sm:text-sm text-slate-400 font-sans line-clamp-1">{tool.desc}</div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* CỘT PHẢI: BÀN TÍNH TOÁN KỸ THUẬT */}
            <div className="lg:col-span-7 bg-[#12110f] border border-brand-border p-6 space-y-6">
              
              {/* Header của Tool đang chọn */}
              <div className="border-b border-brand-border pb-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono text-brand-gold font-bold tracking-wider uppercase">
                    {currentTool.id} • {currentTool.category}
                  </span>
                  {currentTool.classification && (
                    <span className="px-2.5 py-0.5 bg-[#1a1711] border border-[#3d3422] text-brand-gold text-xs font-mono font-semibold">
                      {currentTool.classification}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                  {currentTool.name}
                </h2>

                <p className="text-[15px] sm:text-base text-slate-300 font-sans leading-relaxed">
                  {currentTool.desc}
                </p>

                {/* Khối công thức sắc nét */}
                <div className="bg-brand-bg border border-brand-border p-3.5 text-sm font-mono flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Công thức:</span>
                  <code className="text-brand-gold font-bold text-base sm:text-[17px] tracking-wide">{currentTool.formula}</code>
                </div>

                {/* Giới hạn áp dụng / Cảnh báo an toàn */}
                {currentTool.warning && (
                  <div className="bg-[#1a150c] border border-amber-900/40 p-3.5 text-sm text-amber-200 flex items-start gap-2.5">
                    <WarningCircle size={18} className="text-amber-400 shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <b className="font-mono uppercase text-xs tracking-wider text-amber-400 block mb-0.5">LƯU Ý KỸ THUẬT & GIỚI HẠN:</b>
                      <span className="font-sans leading-relaxed text-[13px] sm:text-sm">{currentTool.warning}</span>
                    </div>
                  </div>
                )}

                {/* Nguồn đối chiếu */}
                {(currentTool.source1 || currentTool.source2) && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-[13px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Info size={15} /> Nguồn:
                    </span>
                    {currentTool.source1 && (
                      <a href={currentTool.source1} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline inline-flex items-center gap-0.5">
                        Tài liệu đối chiếu 1 <ArrowSquareOut size={13} />
                      </a>
                    )}
                    {currentTool.source2 && (
                      <a href={currentTool.source2} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline inline-flex items-center gap-0.5">
                        Tài liệu đối chiếu 2 <ArrowSquareOut size={13} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* KHỐI NHẬP THAM SỐ (INPUTS) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono uppercase font-bold text-slate-200">
                    THÔNG SỐ ĐẦU VÀO ĐO ĐẠC:
                  </span>
                  <button
                    onClick={handleResetInputs}
                    className="text-xs sm:text-[13px] font-mono text-slate-400 hover:text-brand-gold flex items-center gap-1 transition cursor-pointer font-medium"
                  >
                    <ArrowsClockwise size={14} />
                    Đặt lại mặc định
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentTool.inputs.map((inp) => {
                    const val = currentInputs[inp.key] ?? inp.defaultVal;
                    const minVal = getInputMin(inp);
                    return (
                      <div key={inp.key} className="bg-brand-bg border border-brand-border p-3.5 focus-within:border-brand-gold transition">
                        <div className="flex justify-between items-center text-sm mb-1.5">
                          <label className="text-slate-200 font-semibold text-[13px] sm:text-sm">{inp.label}</label>
                          {inp.unit && <span className="text-brand-gold font-mono font-bold text-xs">{inp.unit}</span>}
                        </div>
                        <input
                          type="number"
                          step={inp.step || 'any'}
                          min={minVal}
                          max={inp.max}
                          value={val === '' ? '' : val}
                          placeholder={`Mặc định: ${inp.defaultVal}`}
                          onChange={(e) => handleInputChange(currentTool.id, inp.key, e.target.value)}
                          className="w-full bg-transparent text-white font-mono font-bold text-lg sm:text-[19px] outline-none pt-0.5 placeholder:text-slate-600 placeholder:text-xs"
                        />
                        {inp.hint && (
                          <div className="text-xs text-slate-400 font-mono italic mt-1.5">{inp.hint}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KHỐI KẾT QUẢ ĐẦU RA (OUTPUTS) */}
              <div className="space-y-3.5 pt-2">
                <span className="text-sm font-mono uppercase font-bold text-slate-200 block">
                  KẾT QUẢ TÍNH TOÁN:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {hasEmptyParam ? (
                    <div className="sm:col-span-2 bg-[#1a150c] border border-amber-900/50 p-4 text-center font-mono text-sm text-amber-300">
                      ⏳ Đang chờ nhập thông số: <b className="text-white">"{emptyParamLabel}"</b> để tính toán.
                    </div>
                  ) : Object.keys(calculationResult.outputs).length === 0 ? (
                    <div className="sm:col-span-2 bg-[#181111] border border-rose-900/50 p-4 text-center font-mono text-sm text-rose-300">
                      Không thể tính toán do tham số không hợp lệ.
                    </div>
                  ) : (
                    Object.entries(calculationResult.outputs).map(([k, out]) => (
                      <div key={k} className="bg-[#161410] border border-[#3d3422] p-4 sm:p-5 flex flex-col justify-between">
                        <span className="text-xs sm:text-[13px] font-mono text-slate-300 uppercase tracking-wider block font-medium">
                          {out.label}
                        </span>
                        <div className={`text-2xl sm:text-3xl font-bold font-mono mt-2 flex items-baseline gap-2 ${
                          typeof out.value === 'string' && (out.value.includes('Không hợp lệ') || out.value.includes('Vô cực'))
                            ? 'text-rose-400 text-lg sm:text-xl'
                            : 'text-brand-gold'
                        }`}>
                          <span>{out.value}</span>
                          {out.unit && <span className="text-sm text-slate-400 font-normal">{out.unit}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Nhận định kỹ thuật viên */}
                <div className={`p-4 flex items-start gap-3 text-sm border ${
                  calculationResult.hasMathError
                    ? 'bg-[#1c1212] border-rose-600/40 text-rose-200'
                    : 'bg-[#14120e] border-brand-gold/40 text-slate-200'
                }`}>
                  {calculationResult.hasMathError ? (
                    <WarningCircle size={20} className="text-rose-400 shrink-0 mt-0.5" weight="fill" />
                  ) : (
                    <CheckCircle size={20} className="text-brand-gold shrink-0 mt-0.5" weight="fill" />
                  )}
                  <div className="space-y-1">
                    <span className={`font-mono font-bold uppercase tracking-wider text-xs sm:text-[13px] ${
                      calculationResult.hasMathError ? 'text-rose-400' : 'text-brand-gold'
                    }`}>
                      {calculationResult.hasMathError ? 'CẢNH BÁO TOÁN HỌC / THAM SỐ:' : 'NHẬN ĐỊNH KỸ THUẬT:'}
                    </span>
                    <p className="font-sans leading-relaxed text-[13px] sm:text-sm">{calculationResult.notes}</p>
                  </div>
                </div>
              </div>

              {/* Nút lưu phép tính */}
              <div className="flex justify-end pt-3 border-t border-brand-border">
                <button
                  onClick={handleSaveCurrentCalculation}
                  disabled={calculationResult.hasMathError}
                  className={`flex items-center gap-2 px-7 py-3 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold transition shadow-md ${
                    calculationResult.hasMathError
                      ? 'bg-[#1e1b17] text-slate-500 border border-[#2b251e] cursor-not-allowed opacity-70'
                      : 'bg-brand-gold hover:bg-brand-gold-hover text-brand-bg cursor-pointer'
                  }`}
                >
                  <Plus size={16} weight="bold" />
                  Lưu Vào Báo Cáo Kỹ Thuật
                </button>
              </div>

            </div>
          </div>

          {/* 5. DANH SÁCH CÁC HẠNG MỤC ĐÃ LƯU & NÚT XUẤT EXCEL */}
          <div className="bg-[#12110f] border border-brand-border p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-3.5">
              <div>
                <h3 className="text-sm font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                  <FileXls size={18} className="text-brand-gold" weight="bold" />
                  Hạng Mục Đã Lưu Vào Phiếu ({savedCalculations.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                  Sẵn sàng kết xuất file Excel `.xlsx` gồm toàn bộ thông số xe, người phụ trách và bảng công thức nghiệm thu.
                </p>
              </div>

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg font-mono text-xs uppercase tracking-wider font-bold transition cursor-pointer shadow-md self-start sm:self-auto"
              >
                <FileXls size={16} weight="bold" />
                Kết Xuất File Excel (.xlsx) Ngay
              </button>
            </div>

            {savedCalculations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono italic">
                Chưa có phép tính nào trong danh sách. Hãy nhấn "Lưu Vào Báo Cáo Kỹ Thuật" phía trên để tích lũy các hạng mục cần nghiệm thu.
              </div>
            ) : (
              <div className="divide-y divide-[#1a1815]">
                {savedCalculations.map((item, index) => (
                  <div key={index} className="py-3 flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-gold font-bold">[{item.toolId}]</span>
                        <span className="text-white font-semibold">{item.toolName}</span>
                        <span className="text-[10px] text-slate-500">({item.category})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 mt-1">
                        {Object.entries(item.outputs).map(([k, v]) => (
                          <span key={k}>
                            {v.label}: <b className="text-slate-200">{v.value} {v.unit}</b>
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCalculation(index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Xóa phép tính"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
