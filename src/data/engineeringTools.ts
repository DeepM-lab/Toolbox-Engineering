// TOÀN BỘ 135 CÔNG CỤ TÍNH TOÁN KỸ THUẬT Ô TÔ (DM-001 -> DM-135)
// TỪ TÀI LIỆU EXCEL: DeepM_12_Bo_Cong_Cu_135_Thuat_Toan_Cong_Thuc_Nguon.xlsx

export interface ToolInputDef {
  key: string;
  label: string;
  unit: string;
  defaultVal: number;
  step?: number;
  hint?: string;
}

export interface ToolDefinition {
  id: string;
  categoryId: string;
  category: string;
  targetUser?: string;
  name: string;
  formula: string;
  desc: string;
  warning?: string;
  classification?: string;
  source1?: string;
  source2?: string;
  inputs: ToolInputDef[];
  calculate: (inputs: Record<string, number>) => {
    outputs: Record<string, { label: string; value: number | string; unit: string }>;
    notes: string;
  };
}

export const TOOL_CATEGORIES = [
  { id: 'all', name: 'Tất Cả 12 Nhóm (135 Tools)' },
  { id: '01', name: '01. Off-road & 4x4 (12 tools)' },
  { id: '02', name: '02. Car Audio & SPL (12 tools)' },
  { id: '03', name: '03. Camping & RV (12 tools)' },
  { id: '04', name: '04. Performance & Tuning (12 tools)' },
  { id: '05', name: '05. Drift & Racing (10 tools)' },
  { id: '06', name: '06. Wheel & Tire (10 tools)' },
  { id: '07', name: '07. Automotive Electrical (12 tools)' },
  { id: '08', name: '08. Battery & Storage (12 tools)' },
  { id: '09', name: '09. Mechanical & Fab (12 tools)' },
  { id: '10', name: '10. EV & Hybrid (10 tools)' },
  { id: '11', name: '11. Detailing & Body (11 tools)' },
  { id: '12', name: '12. Garage & Maint (10 tools)' },
];

export const ALL_TOOLS: ToolDefinition[] = [
  {
    id: "DM-001",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Crawl ratio tổng",
    formula: "CR = i_1 * i_transfer * i_diff",
    desc: "Tỷ số truyền bò tối đa hỗ trợ xe bò dốc đá, leo địa hình gồ ghề cực chậm mà không ngắt côn.",
    warning: "Không dự đoán độ bám và mô-men hữu ích thực tế.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "i_1",
            "label": "Tỷ số số 1 (i_1)",
            "unit": "",
            "defaultVal": 4.17,
            "step": 0.01
      },
      {
            "key": "i_transfer",
            "label": "Tỷ số hộp phụ chậm (i_transfer)",
            "unit": "",
            "defaultVal": 2.7,
            "step": 0.01
      },
      {
            "key": "i_diff",
            "label": "Tỷ số truyền cầu (i_diff)",
            "unit": "",
            "defaultVal": 4.1,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const cr = inp.i_1 * inp.i_transfer * inp.i_diff;
      return {
        outputs: {
          crawlRatio: { label: 'Tỷ số bò tổng (Crawl Ratio)', value: Number(cr.toFixed(2)), unit: ': 1' }
        },
        notes: cr > 40 ? 'Tỷ số bò rất khỏe (>40:1), lý tưởng vượt chướng ngại vật đá tảng.' : 'Tỷ số tiêu chuẩn dòng 4x4 đường phố thương mại.'
      };
    }
  },
  {
    id: "DM-002",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Vận tốc xe theo RPM",
    formula: "v_kmh = 0.06n_engineC_roll_m / i_total",
    desc: "Vận tốc di chuyển của xe ở tua máy cụ thể khi hộp số đang gài tỷ số truyền xác định.",
    warning: "Hộp số khóa truyền động; bỏ trượt lốp và biến mô.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "n_engine",
            "label": "Vòng tua máy",
            "unit": "RPM",
            "defaultVal": 2000,
            "step": 100
      },
      {
            "key": "C_roll_m",
            "label": "Chu vi lăn của bánh xe",
            "unit": "m",
            "defaultVal": 2.45,
            "step": 0.01
      },
      {
            "key": "i_total",
            "label": "Tỷ số truyền tổng (số x cầu)",
            "unit": "",
            "defaultVal": 3.55,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const v = (0.06 * inp.n_engine * inp.C_roll_m) / inp.i_total;
      return {
        outputs: {
          v_kmh: { label: 'Vận tốc di chuyển xe', value: Number(v.toFixed(2)), unit: 'km/h' }
        },
        notes: 'Giả định truyền động khóa cứng, lốp không bị trượt và biến mô đã lock-up.'
      };
    }
  },
  {
    id: "DM-003",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Lực kéo tiếp tuyến bánh",
    formula: "F_N = T_engine_Nmi_totaleta_drive/r_eff_m",
    desc: "Lực kéo tiếp tuyến thực tế tại vệt bánh xe truyền xuống mặt đường.",
    warning: "Giới hạn bởi độ bám và độ bền truyền động.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T_engine_Nm",
            "label": "Mô-men xoắn động cơ",
            "unit": "Nm",
            "defaultVal": 450,
            "step": 10
      },
      {
            "key": "i_total",
            "label": "Tỷ số truyền tổng cấp số",
            "unit": "",
            "defaultVal": 15.2,
            "step": 0.1
      },
      {
            "key": "eta_drive",
            "label": "Hiệu suất toàn hệ dẫn động",
            "unit": "0..1",
            "defaultVal": 0.85,
            "step": 0.01
      },
      {
            "key": "r_eff_m",
            "label": "Bán kính lăn hữu hiệu của lốp",
            "unit": "m",
            "defaultVal": 0.39,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const f = (inp.T_engine_Nm * inp.i_total * inp.eta_drive) / inp.r_eff_m;
      return {
        outputs: {
          force_N: { label: 'Lực kéo tiếp tuyến tại bánh', value: Math.round(f), unit: 'N' },
          force_kgf: { label: 'Lực kéo quy đổi', value: Math.round(f / 9.80665), unit: 'kgf' }
        },
        notes: 'Lực kéo thực tế tối đa không được vượt quá giới hạn bám của ma sát lốp/mặt đường.'
      };
    }
  },
  {
    id: "DM-004",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Khả năng leo dốc",
    formula: "F_required = mgsin(theta)+Crrmgcos(theta)+0.5rhoCdA*v^2",
    desc: "Tính toán tổng lực cản cần thiết để xe có thể duy trì leo dốc ở vận tốc ổn định.",
    warning: "Cần lực kéo khả dụng >= F_required; bỏ động lực học quá độ.",
    classification: "Mô hình ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "m",
            "label": "Tổng khối lượng xe",
            "unit": "kg",
            "defaultVal": 2200,
            "step": 50
      },
      {
            "key": "theta_deg",
            "label": "Độ dốc địa hình",
            "unit": "độ (°)",
            "defaultVal": 20,
            "step": 1
      },
      {
            "key": "Crr",
            "label": "Hệ số cản lăn mặt đường",
            "unit": "",
            "defaultVal": 0.03,
            "step": 0.005
      },
      {
            "key": "rho",
            "label": "Mật độ không khí",
            "unit": "kg/m³",
            "defaultVal": 1.2,
            "step": 0.05
      },
      {
            "key": "Cd",
            "label": "Hệ số cản khí động học",
            "unit": "",
            "defaultVal": 0.45,
            "step": 0.01
      },
      {
            "key": "A",
            "label": "Diện tích cản gió trực diện",
            "unit": "m²",
            "defaultVal": 2.8,
            "step": 0.1
      },
      {
            "key": "v_mps",
            "label": "Vận tốc xe khi leo dốc",
            "unit": "m/s",
            "defaultVal": 5,
            "step": 1
      }
],
    calculate: (inp) => {
      const g = 9.80665;
      const rad = (inp.theta_deg * Math.PI) / 180;
      const fGrade = inp.m * g * Math.sin(rad);
      const fRoll = inp.Crr * inp.m * g * Math.cos(rad);
      const fAero = 0.5 * inp.rho * inp.Cd * inp.A * Math.pow(inp.v_mps, 2);
      const fTotal = fGrade + fRoll + fAero;
      return {
        outputs: {
          fRequired_N: { label: 'Tổng lực kéo cần thiết', value: Math.round(fTotal), unit: 'N' },
          fGrade_N: { label: 'Thành phần cản leo dốc', value: Math.round(fGrade), unit: 'N' },
          fRoll_N: { label: 'Thành phần cản lăn lốp', value: Math.round(fRoll), unit: 'N' }
        },
        notes: 'Lực kéo tại bánh của xe phải lớn hơn hoặc bằng F_required để không bị trôi lùi.'
      };
    }
  },
  {
    id: "DM-005",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Góc tới",
    formula: "alpha = atan(h_front/overhang_front)",
    desc: "Góc tới hình học tối đa xe có thể tiếp cận dốc mà không bị chạm cản trước.",
    warning: "Mô hình hình học 2D; biên dạng thực xe phải đo.",
    classification: "Mô hình hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "h_front",
            "label": "Khoảng sáng mép cản trước thấp nhất",
            "unit": "m",
            "defaultVal": 0.38,
            "step": 0.01
      },
      {
            "key": "overhang_front",
            "label": "Chiều dài phần nhô đầu xe",
            "unit": "m",
            "defaultVal": 0.75,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const alphaRad = Math.atan(inp.h_front / inp.overhang_front);
      const deg = (alphaRad * 180) / Math.PI;
      return {
        outputs: {
          approachAngle: { label: 'Góc tới cản trước', value: Number(deg.toFixed(1)), unit: 'độ (°)' }
        },
        notes: deg >= 30 ? 'Góc tới đạt chuẩn off-road chuyên nghiệp.' : 'Nên chú ý góc dốc khi cản trước nhô dài.'
      };
    }
  },
  {
    id: "DM-006",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Góc thoát",
    formula: "beta = atan(h_rear/overhang_rear)",
    desc: "Góc thoát hình học cản sau tránh va đập khi xe rời khỏi dốc cao.",
    warning: "Không đại diện cho hình dạng cản/gầm phức tạp.",
    classification: "Mô hình hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "h_rear",
            "label": "Khoảng sáng mép cản sau",
            "unit": "m",
            "defaultVal": 0.42,
            "step": 0.01
      },
      {
            "key": "overhang_rear",
            "label": "Chiều dài phần nhô đuôi xe",
            "unit": "m",
            "defaultVal": 0.95,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const deg = (Math.atan(inp.h_rear / inp.overhang_rear) * 180) / Math.PI;
      return {
        outputs: {
          departureAngle: { label: 'Góc thoát cản sau', value: Number(deg.toFixed(1)), unit: 'độ (°)' }
        },
        notes: 'Lưu ý khi gắn thêm móc kéo rơ-moóc (tow hitch) sẽ làm giảm góc thoát này.'
      };
    }
  },
  {
    id: "DM-007",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Góc vượt đỉnh lý tưởng",
    formula: "breakover = 2atan(2h/Lwheelbase)",
    desc: "Góc vượt đỉnh dốc lý tưởng giữa 2 trục bánh xe chống cạ gầm.",
    warning: "Giả sử gầm phẳng, điểm thấp giữa trục; không xét nhún.",
    classification: "Mô hình hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "h",
            "label": "Khoảng sáng gầm xe thấp nhất giữa 2 trục",
            "unit": "m",
            "defaultVal": 0.25,
            "step": 0.01
      },
      {
            "key": "Lwheelbase",
            "label": "Chiều dài cơ sở xe",
            "unit": "m",
            "defaultVal": 3,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const deg = (2 * Math.atan((2 * inp.h) / inp.Lwheelbase) * 180) / Math.PI;
      return {
        outputs: {
          breakoverAngle: { label: 'Góc vượt đỉnh (Ramp Breakover)', value: Number(deg.toFixed(1)), unit: 'độ (°)' }
        },
        notes: 'Chiều dài cơ sở càng ngắn thì góc vượt đỉnh càng lớn, gầm ít cạ đỉnh gờ.'
      };
    }
  },
  {
    id: "DM-008",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Tời kéo trên dốc",
    formula: "F_winch >= (mgsin(theta)+mumg*cos(theta))*SF",
    desc: "Lực tời cứu hộ cần thiết để kéo xe vượt dốc hoặc lầy lún có tính hệ số an toàn.",
    warning: "Không dùng xác định tải neo, cáp, puly nếu thiếu hệ số động và tiêu chuẩn.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "m",
            "label": "Khối lượng xe kéo",
            "unit": "kg",
            "defaultVal": 2500,
            "step": 50
      },
      {
            "key": "theta_deg",
            "label": "Độ dốc sườn núi",
            "unit": "độ (°)",
            "defaultVal": 25,
            "step": 1
      },
      {
            "key": "mu",
            "label": "Hệ số ma sát kéo trượt (đất/bùn lầy)",
            "unit": "",
            "defaultVal": 0.4,
            "step": 0.05
      },
      {
            "key": "SF",
            "label": "Hệ số dự phòng an toàn (SF)",
            "unit": "",
            "defaultVal": 1.5,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const g = 9.80665;
      const rad = (inp.theta_deg * Math.PI) / 180;
      const fPull = (inp.m * g * Math.sin(rad) + inp.mu * inp.m * g * Math.cos(rad)) * inp.SF;
      const lbs = fPull / 4.44822;
      return {
        outputs: {
          fWinch_N: { label: 'Lực tời yêu cầu', value: Math.round(fPull), unit: 'N' },
          fWinch_lbs: { label: 'Sức kéo tời tương đương', value: Math.round(lbs), unit: 'Lbs' }
        },
        notes: `Nên chọn tời có sức kéo danh định tối thiểu ${Math.ceil(lbs / 500) * 500} lbs hoặc dùng puly tăng lực.`
      };
    }
  },
  {
    id: "DM-009",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Năng lượng pin cho tời",
    formula: "E_Wh = V_battI_avgt_h",
    desc: "Năng lượng tiêu hao từ ắc quy / bình pin trong suốt quá trình kéo tời.",
    warning: "Dòng/tụt áp thay đổi mạnh trong khi kéo; tính tham khảo.",
    classification: "Chuẩn cân bằng năng lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "V_batt",
            "label": "Điện áp hệ thống điện",
            "unit": "V",
            "defaultVal": 12.6,
            "step": 0.1
      },
      {
            "key": "I_avg",
            "label": "Dòng điện trung bình tời ăn",
            "unit": "A",
            "defaultVal": 300,
            "step": 10
      },
      {
            "key": "t_min",
            "label": "Thời gian tời kéo liên tục",
            "unit": "phút",
            "defaultVal": 5,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const tH = inp.t_min / 60;
      const eWh = inp.V_batt * inp.I_avg * tH;
      const ah = inp.I_avg * tH;
      return {
        outputs: {
          energy_Wh: { label: 'Tổng năng lượng tiêu hao', value: Number(eWh.toFixed(1)), unit: 'Wh' },
          consumed_Ah: { label: 'Dung lượng bình bị rút', value: Number(ah.toFixed(1)), unit: 'Ah' }
        },
        notes: 'Khi kéo tời tải nặng, nên nổ máy giữ ga để máy phát hỗ trợ cấp dòng tránh sụt áp bình.'
      };
    }
  },
  {
    id: "DM-010",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "So sánh đường kính lốp",
    formula: "D_mm = 25.4rim_in+2width_mm*aspect_ratio/100",
    desc: "Tính toán đường kính danh nghĩa của lốp theo thông số size quốc tế.",
    warning: "Đường kính danh nghĩa, khác bán kính lăn chịu tải.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "rim_in",
            "label": "Đường kính mâm (la-zăng)",
            "unit": "inch",
            "defaultVal": 17,
            "step": 1
      },
      {
            "key": "width_mm",
            "label": "Bề rộng mặt lốp",
            "unit": "mm",
            "defaultVal": 285,
            "step": 5
      },
      {
            "key": "aspect_ratio",
            "label": "Tỷ lệ chiều cao thành lốp",
            "unit": "%",
            "defaultVal": 70,
            "step": 5
      }
],
    calculate: (inp) => {
      const d = 25.4 * inp.rim_in + 2 * inp.width_mm * (inp.aspect_ratio / 100);
      const inch = d / 25.4;
      return {
        outputs: {
          diameter_mm: { label: 'Đường kính lốp', value: Number(d.toFixed(1)), unit: 'mm' },
          diameter_inch: { label: 'Quy đổi hệ inch', value: Number(inch.toFixed(1)), unit: 'inch' }
        },
        notes: 'Đường kính danh nghĩa hình học, thực tế có lún 2-3% khi chịu tải trọng xe.'
      };
    }
  },
  {
    id: "DM-011",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Mô-men qua hộp phụ",
    formula: "T_out = T_ini_transfereta_transfer",
    desc: "Mô-men xoắn đầu ra sau khi qua hộp số phụ 2 cấp (cầu chậm 4L).",
    warning: "Chưa xét tải xung và giới hạn linh kiện.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T_in",
            "label": "Mô-men xoắn vào hộp phụ",
            "unit": "Nm",
            "defaultVal": 1500,
            "step": 50
      },
      {
            "key": "i_transfer",
            "label": "Tỷ số truyền hộp phụ",
            "unit": "",
            "defaultVal": 2.72,
            "step": 0.01
      },
      {
            "key": "eta_transfer",
            "label": "Hiệu suất truyền động hộp phụ",
            "unit": "0..1",
            "defaultVal": 0.95,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const tOut = inp.T_in * inp.i_transfer * inp.eta_transfer;
      return {
        outputs: {
          tOut_Nm: { label: 'Mô-men xoắn ra các trục các-đăng', value: Math.round(tOut), unit: 'Nm' }
        },
        notes: 'Cần lưu ý giới hạn chịu lực của khớp chữ thập các-đăng và bán trục khi gài cầu chậm.'
      };
    }
  },
  {
    id: "DM-012",
    categoryId: "01",
    category: "01 Off-road & 4x4",
    targetUser: "Người chơi địa hình, xe thi đấu, overlanding",
    name: "Tải dọc trục khi kéo",
    formula: "F_axial = F_pull*cos(phi)",
    desc: "Thành phần lực kéo dọc trục khung gầm khi góc cáp kéo tời bị lệch.",
    warning: "Một thành phần lực; kết cấu khung cần tính tổ hợp tải.",
    classification: "Chuẩn phân tích lực",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "F_pull",
            "label": "Lực căng cáp kéo",
            "unit": "N",
            "defaultVal": 25000,
            "step": 1000
      },
      {
            "key": "phi_deg",
            "label": "Góc nghiêng cáp so với trục xe",
            "unit": "độ (°)",
            "defaultVal": 25,
            "step": 1
      }
],
    calculate: (inp) => {
      const rad = (inp.phi_deg * Math.PI) / 180;
      const fAxial = inp.F_pull * Math.cos(rad);
      const fSide = inp.F_pull * Math.sin(rad);
      return {
        outputs: {
          fAxial_N: { label: 'Thành phần lực kéo dọc trục xe', value: Math.round(fAxial), unit: 'N' },
          fSide_N: { label: 'Thành phần lực xé ngang khung', value: Math.round(fSide), unit: 'N' }
        },
        notes: 'Góc kéo cáp càng lớn thì lực xé ngang khung xe càng cao, dễ cong điểm neo.'
      };
    }
  },
  {
    id: "DM-013",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Thể tích thùng loa chữ nhật",
    formula: "V_L = L_cmW_cmH_cm/1000",
    desc: "Tính thể tích chứa bên trong thùng loa chữ nhật từ kích thước lọt lòng.",
    warning: "Trừ thể tích loa, giằng, cổng hơi để có Vnet.",
    classification: "Chuẩn hình học",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "L_cm",
            "label": "Chiều dài lọt lòng trong",
            "unit": "cm",
            "defaultVal": 100,
            "step": 1
      },
      {
            "key": "W_cm",
            "label": "Chiều rộng lọt lòng trong",
            "unit": "cm",
            "defaultVal": 80,
            "step": 1
      },
      {
            "key": "H_cm",
            "label": "Chiều cao lọt lòng trong",
            "unit": "cm",
            "defaultVal": 8,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const vol = (inp.L_cm * inp.W_cm * inp.H_cm) / 1000;
      return {
        outputs: {
          volumeL: { label: 'Thể tích thùng thô', value: Number(vol.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Cần trừ bớt thể tích củ loa (~2-4L) và giằng thùng gỗ để ra thể tích thực tế (Vnet).'
      };
    }
  },
  {
    id: "DM-014",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Thùng kín theo Qtc",
    formula: "Vb = Vas/((Qtc/Qts)^2-1)",
    desc: "Tính thể tích thùng kín yêu cầu từ hệ số chất lượng âm bass mục tiêu Qtc.",
    warning: "Chỉ khi Qtc>Qts; mô hình T/S tín hiệu nhỏ lý tưởng.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "Vas",
            "label": "Thể tích khí tương đương của loa (Vas)",
            "unit": "Lít",
            "defaultVal": 45,
            "step": 1
      },
      {
            "key": "Qts",
            "label": "Hệ số phẩm chất tổng của loa (Qts)",
            "unit": "",
            "defaultVal": 0.38,
            "step": 0.01
      },
      {
            "key": "Qtc",
            "label": "Hệ số phẩm chất thùng mục tiêu (Qtc)",
            "unit": "",
            "defaultVal": 0.707,
            "step": 0.01
      }
],
    calculate: (inp) => {
      if (inp.Qtc <= inp.Qts) {
        return {
          outputs: { vb_L: { label: 'Thể tích Vb', value: 'Không hợp lệ (Qtc phải > Qts)', unit: '' } },
          notes: 'Qtc mục tiêu bắt buộc phải lớn hơn hệ số Qts của củ loa.'
        };
      }
      const vb = inp.Vas / (Math.pow(inp.Qtc / inp.Qts, 2) - 1);
      return {
        outputs: {
          vb_L: { label: 'Thể tích thùng kín lý tưởng (Vb)', value: Number(vb.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Qtc = 0.707 (Butterworth) mang lại đáp tuyến phẳng và chất âm tròn trịa nhất.'
      };
    }
  },
  {
    id: "DM-015",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Qtc thùng kín",
    formula: "Qtc = Qts*sqrt(1+Vas/Vb)",
    desc: "Dự báo hệ số Qtc của hệ thống loa khi lắp vào một thể tích thùng kín xác định.",
    warning: "Bỏ rò rỉ, độ nhồi bông và tổn thất.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "Qts",
            "label": "Hệ số phẩm chất củ loa (Qts)",
            "unit": "",
            "defaultVal": 0.38,
            "step": 0.01
      },
      {
            "key": "Vas",
            "label": "Thể tích tương đương (Vas)",
            "unit": "Lít",
            "defaultVal": 45,
            "step": 1
      },
      {
            "key": "Vb",
            "label": "Thể tích thùng thực tế (Vb)",
            "unit": "Lít",
            "defaultVal": 28,
            "step": 1
      }
],
    calculate: (inp) => {
      const qtc = inp.Qts * Math.sqrt(1 + inp.Vas / inp.Vb);
      return {
        outputs: {
          qtc: { label: 'Hệ số chất lượng thùng (Qtc)', value: Number(qtc.toFixed(3)), unit: '' }
        },
        notes: qtc > 0.9 ? 'Âm bass sẽ bị gắt và punchy gồ ghề (phù hợp EDM/Rock mạnh).' : 'Âm bass êm dịu, dải trầm xuống sâu.'
      };
    }
  },
  {
    id: "DM-016",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Fc thùng kín",
    formula: "Fc = Fs*sqrt(1+Vas/Vb)",
    desc: "Tần số cộng hưởng của loa khi đặt trong thể tích thùng kín.",
    warning: "Mô hình T/S lý tưởng.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "Fs",
            "label": "Tần số cộng hưởng tự do của loa (Fs)",
            "unit": "Hz",
            "defaultVal": 32,
            "step": 1
      },
      {
            "key": "Vas",
            "label": "Thể tích tương đương (Vas)",
            "unit": "Lít",
            "defaultVal": 45,
            "step": 1
      },
      {
            "key": "Vb",
            "label": "Thể tích thùng kín (Vb)",
            "unit": "Lít",
            "defaultVal": 28,
            "step": 1
      }
],
    calculate: (inp) => {
      const fc = inp.Fs * Math.sqrt(1 + inp.Vas / inp.Vb);
      return {
        outputs: {
          fc_Hz: { label: 'Tần số cộng hưởng thùng kín (Fc)', value: Number(fc.toFixed(1)), unit: 'Hz' }
        },
        notes: 'Thùng kín càng nhỏ thì tần số Fc bị nâng lên càng cao.'
      };
    }
  },
  {
    id: "DM-017",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "F3 thùng kín",
    formula: "a = 1/Qtc^2-2; F3 = Fc*sqrt((a+sqrt(a^2+4))/2)",
    desc: "Điểm cắt tần số suy giảm -3dB ở dải trầm trong thùng loa kín.",
    warning: "Đáp tuyến high-pass bậc hai lý tưởng.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "Fc",
            "label": "Tần số cộng hưởng thùng (Fc)",
            "unit": "Hz",
            "defaultVal": 51.6,
            "step": 0.5
      },
      {
            "key": "Qtc",
            "label": "Hệ số phẩm chất thùng (Qtc)",
            "unit": "",
            "defaultVal": 0.707,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const a = 1 / Math.pow(inp.Qtc, 2) - 2;
      const f3 = inp.Fc * Math.sqrt((a + Math.sqrt(Math.pow(a, 2) + 4)) / 2);
      return {
        outputs: {
          f3_Hz: { label: 'Tần số suy giảm -3dB (F3)', value: Number(f3.toFixed(1)), unit: 'Hz' }
        },
        notes: 'Dưới tần số F3, năng lượng âm trầm suy giảm với độ dốc 12 dB/octave.'
      };
    }
  },
  {
    id: "DM-018",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Tần số Helmholtz thùng port",
    formula: "Fb = c/(2*pi)sqrt(Sp/(VbLeff))",
    desc: "Tính tần số cộng hưởng Helmholtz (Fb) của thùng loa có cổng thông hơi (Ported box).",
    warning: "Leff đã hiệu chỉnh hai đầu; không dự đoán SPL toàn dải.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "c",
            "label": "Vận tốc truyền âm trong không khí",
            "unit": "m/s",
            "defaultVal": 343,
            "step": 1
      },
      {
            "key": "Sp_cm2",
            "label": "Diện tích mặt cắt cổng hơi",
            "unit": "cm²",
            "defaultVal": 80,
            "step": 5
      },
      {
            "key": "Vb_L",
            "label": "Thể tích thùng loa",
            "unit": "Lít",
            "defaultVal": 50,
            "step": 2
      },
      {
            "key": "Leff_cm",
            "label": "Chiều dài hữu hiệu ống port",
            "unit": "cm",
            "defaultVal": 25,
            "step": 1
      }
],
    calculate: (inp) => {
      const sp = inp.Sp_cm2 / 10000;
      const vb = inp.Vb_L / 1000;
      const leff = inp.Leff_cm / 100;
      const fb = (inp.c / (2 * Math.PI)) * Math.sqrt(sp / (vb * leff));
      return {
        outputs: {
          fb_Hz: { label: 'Tần số cộng hưởng cổng (Fb)', value: Number(fb.toFixed(1)), unit: 'Hz' }
        },
        notes: 'Thường tuning cổng hơi ở dải 32 - 40 Hz cho các dòng loa Subwoofer ô tô.'
      };
    }
  },
  {
    id: "DM-019",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Chiều dài cổng hữu hiệu",
    formula: "Leff = Sp/(Vb*(2piFb/c)^2)",
    desc: "Chiều dài cổng thông hơi hữu hiệu để đạt đúng tần số cộng hưởng mong muốn.",
    warning: "Chiều dài vật lý = Leff - hiệu chỉnh đầu cổng.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "c",
            "label": "Vận tốc âm thanh",
            "unit": "m/s",
            "defaultVal": 343,
            "step": 1
      },
      {
            "key": "Fb_Hz",
            "label": "Tần số tuning mong muốn (Fb)",
            "unit": "Hz",
            "defaultVal": 35,
            "step": 1
      },
      {
            "key": "Vb_L",
            "label": "Thể tích buồng loa (Vb)",
            "unit": "Lít",
            "defaultVal": 50,
            "step": 2
      },
      {
            "key": "Sp_cm2",
            "label": "Diện tích ống thoát khí",
            "unit": "cm²",
            "defaultVal": 80,
            "step": 5
      }
],
    calculate: (inp) => {
      const sp = inp.Sp_cm2 / 10000;
      const vb = inp.Vb_L / 1000;
      const omega = 2 * Math.PI * inp.Fb_Hz;
      const leff_m = sp / (vb * Math.pow(omega / inp.c, 2));
      const leff_cm = leff_m * 100;
      return {
        outputs: {
          leff_cm: { label: 'Chiều dài hữu hiệu cổng (Leff)', value: Number(leff_cm.toFixed(1)), unit: 'cm' }
        },
        notes: 'Chiều dài thực tế cần trừ đi hệ số loe đầu cổng (~0.73 * bán kính ống).'
      };
    }
  },
  {
    id: "DM-020",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Trở kháng loa song song",
    formula: "Req = 1/sum(1/Ri)",
    desc: "Tổng trở kháng tương đương khi đấu nối song song nhiều củ loa.",
    warning: "Dùng giá trị danh định chỉ để gần đúng, loa là tải trở kháng phức.",
    classification: "Ước lượng",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "r1",
            "label": "Trở kháng loa 1",
            "unit": "Ohm",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "r2",
            "label": "Trở kháng loa 2",
            "unit": "Ohm",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "r3",
            "label": "Trở kháng loa 3 (nếu có, 0 bỏ qua)",
            "unit": "Ohm",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      let sumInv = 1 / inp.r1 + 1 / inp.r2;
      if (inp.r3 > 0) sumInv += 1 / inp.r3;
      const req = 1 / sumInv;
      return {
        outputs: {
          req_ohm: { label: 'Trở kháng tương đương', value: Number(req.toFixed(2)), unit: 'Ohm' }
        },
        notes: req < 2 ? 'Cần amply hỗ trợ tải 1-Ohm stable để không bị quá nhiệt ngắt relay.' : 'Trở kháng an toàn cho mọi dòng amply Class D/AB.'
      };
    }
  },
  {
    id: "DM-021",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Điện áp RMS amply",
    formula: "Vrms = sqrt(P_rms*R_load)",
    desc: "Điện áp xoay chiều RMS đo tại cọc loa khi căn chỉnh Gain amply.",
    warning: "Chỉ đúng tải trở thuần tương đương, không suy ra công suất thực ở phổ nhạc.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "P_rms",
            "label": "Công suất RMS mục tiêu của Amply",
            "unit": "W",
            "defaultVal": 500,
            "step": 50
      },
      {
            "key": "R_load",
            "label": "Trở kháng tải loa",
            "unit": "Ohm",
            "defaultVal": 4,
            "step": 1
      }
],
    calculate: (inp) => {
      const vRms = Math.sqrt(inp.P_rms * inp.R_load);
      return {
        outputs: {
          vRms_V: { label: 'Điện áp RMS đo cọc loa', value: Number(vRms.toFixed(2)), unit: 'V' }
        },
        notes: 'Dùng đồng hồ vạn năng chế độ AC kết hợp track test 50Hz (Sub) hoặc 1000Hz (Loa cánh).'
      };
    }
  },
  {
    id: "DM-022",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Dòng RMS amply",
    formula: "Irms = sqrt(P_rms/R_load)",
    desc: "Dòng điện xoay chiều cực đại chạy qua cuộn âm loa (Voice coil).",
    warning: "Giả thiết tải thuần trở.",
    classification: "Chuẩn mô hình",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "P_rms",
            "label": "Công suất âm thanh RMS",
            "unit": "W",
            "defaultVal": 500,
            "step": 50
      },
      {
            "key": "R_load",
            "label": "Trở kháng loa",
            "unit": "Ohm",
            "defaultVal": 4,
            "step": 1
      }
],
    calculate: (inp) => {
      const irms = Math.sqrt(inp.P_rms / inp.R_load);
      return {
        outputs: {
          iRms_A: { label: 'Dòng điện RMS qua loa', value: Number(irms.toFixed(2)), unit: 'A' }
        },
        notes: 'Dây dẫn loa phải có tiết diện đủ tải để tránh suy hao công suất ra nhiệt năng.'
      };
    }
  },
  {
    id: "DM-023",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Mức tăng SPL theo công suất",
    formula: "dB = 10*log10(P2/P1)",
    desc: "Mức tăng áp suất âm thanh SPL khi nâng cấp công suất amply.",
    warning: "Giữ nguyên độ nhạy, vị trí, không nén nhiệt.",
    classification: "Chuẩn lý tưởng",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "P1",
            "label": "Công suất cũ (P1)",
            "unit": "W",
            "defaultVal": 100,
            "step": 10
      },
      {
            "key": "P2",
            "label": "Công suất nâng cấp mới (P2)",
            "unit": "W",
            "defaultVal": 400,
            "step": 50
      }
],
    calculate: (inp) => {
      const db = 10 * Math.log10(inp.P2 / inp.P1);
      return {
        outputs: {
          delta_dB: { label: 'Mức tăng âm lượng', value: Number(db.toFixed(1)), unit: 'dB' }
        },
        notes: 'Tăng công suất gấp 2 lần chỉ giúp tăng thêm ~3 dB âm lượng lý thuyết.'
      };
    }
  },
  {
    id: "DM-024",
    categoryId: "02",
    category: "02 Car Audio & SPL",
    targetUser: "Người chơi SQ/SQL/SPL và lắp đặt âm thanh",
    name: "Dòng DC amply ước tính",
    formula: "I_dc = P_audio/(V_dc*eta_amp)",
    desc: "Ước lượng dòng điện 12V một chiều nuôi amply từ bình ắc quy.",
    warning: "Công suất nhạc biến động; hiệu suất tùy class và mức tải.",
    classification: "Ước lượng",
    source1: "https://speakerfoundry.com/cabinets/",
    source2: "https://www.diyaudioandvideo.com/Calculator/SpeakerBoxEnclosure/",
    inputs: [
      {
            "key": "P_audio",
            "label": "Tổng công suất âm thanh RMS",
            "unit": "W",
            "defaultVal": 1200,
            "step": 100
      },
      {
            "key": "V_dc",
            "label": "Điện áp nguồn bình",
            "unit": "V",
            "defaultVal": 13.8,
            "step": 0.1
      },
      {
            "key": "eta_amp",
            "label": "Hiệu suất amply (Class D: 0.85, AB: 0.55)",
            "unit": "0..1",
            "defaultVal": 0.85,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const iDc = inp.P_audio / (inp.V_dc * inp.eta_amp);
      return {
        outputs: {
          iDc_A: { label: 'Dòng điện DC đỉnh tiêu thụ', value: Math.round(iDc), unit: 'A' }
        },
        notes: `Cần dùng cầu chì bảo vệ chính cỡ ${Math.ceil(iDc * 1.25 / 10) * 10}A và nâng cấp dây nguồn cỡ 0AWG / 4AWG.`
      };
    }
  },
  {
    id: "DM-025",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Năng lượng tiêu thụ ngày",
    formula: "E_day_Wh = sum(Pi_W*ti_h)",
    desc: "Tổng năng lượng tiêu thụ dự tính cho toàn bộ thiết bị dã ngoại trong 1 ngày.",
    warning: "Tính duty cycle tải theo từng thiết bị.",
    classification: "Chuẩn cân bằng năng lượng",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_fridge",
            "label": "Tủ lạnh dã ngoại (W)",
            "unit": "W",
            "defaultVal": 45,
            "step": 5
      },
      {
            "key": "t_fridge",
            "label": "Thời gian chạy máy nén",
            "unit": "h",
            "defaultVal": 10,
            "step": 1
      },
      {
            "key": "P_light",
            "label": "Hệ thống đèn + quạt",
            "unit": "W",
            "defaultVal": 30,
            "step": 5
      },
      {
            "key": "t_light",
            "label": "Thời gian thắp sáng/quạt",
            "unit": "h",
            "defaultVal": 6,
            "step": 1
      },
      {
            "key": "P_other",
            "label": "Thiết bị khác (Bơm nước, sạc thiết bị)",
            "unit": "W",
            "defaultVal": 100,
            "step": 10
      },
      {
            "key": "t_other",
            "label": "Thời gian dùng thiết bị khác",
            "unit": "h",
            "defaultVal": 3,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const totalWh = inp.P_fridge * inp.t_fridge + inp.P_light * inp.t_light + inp.P_other * inp.t_other;
      const totalAh12V = totalWh / 12.8;
      return {
        outputs: {
          eDay_Wh: { label: 'Tổng năng lượng tiêu hao/ngày', value: Math.round(totalWh), unit: 'Wh' },
          ah_12V: { label: 'Điện tích tiêu thụ (hệ 12V)', value: Number(totalAh12V.toFixed(1)), unit: 'Ah' }
        },
        notes: 'Chưa tính mức tiêu hao khi đun nấu bằng bếp từ hoặc ấm siêu tốc.'
      };
    }
  },
  {
    id: "DM-026",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Dung lượng pin yêu cầu",
    formula: "C_Ah = E_day_WhNdays/(V_nomDoD*eta_system)",
    desc: "Dung lượng bình pin phụ lưu trữ yêu cầu để dự phòng cho số ngày dã ngoại.",
    warning: "Tính theo mức năng lượng danh định, cần giảm trừ lạnh/già hóa.",
    classification: "Ước lượng thiết kế",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "E_day_Wh",
            "label": "Năng lượng dùng mỗi ngày",
            "unit": "Wh",
            "defaultVal": 930,
            "step": 50
      },
      {
            "key": "Ndays",
            "label": "Số ngày tự lập không có nguồn sạc",
            "unit": "ngày",
            "defaultVal": 2,
            "step": 1
      },
      {
            "key": "V_nom",
            "label": "Điện áp hệ bình pin",
            "unit": "V",
            "defaultVal": 12.8,
            "step": 0.1
      },
      {
            "key": "DoD",
            "label": "Độ xả sâu an toàn (LiFePO4: 0.85, Chì: 0.5)",
            "unit": "0..1",
            "defaultVal": 0.85,
            "step": 0.05
      },
      {
            "key": "eta_system",
            "label": "Hiệu suất chuyển đổi hệ thống",
            "unit": "0..1",
            "defaultVal": 0.9,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const cAh = (inp.E_day_Wh * inp.Ndays) / (inp.V_nom * inp.DoD * inp.eta_system);
      return {
        outputs: {
          capacity_Ah: { label: 'Dung lượng pack pin yêu cầu', value: Math.round(cAh), unit: 'Ah' }
        },
        notes: `Nên lắp cụm pin LiFePO4 chuẩn ${Math.ceil(cAh / 50) * 50}Ah để xe sinh hoạt thoải mái.`
      };
    }
  },
  {
    id: "DM-027",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Thời gian dùng inverter",
    formula: "t_h = V_nomC_AhDoD*eta_inv/P_ac",
    desc: "Thời gian chạy liên tục của thiết bị 220V qua bộ kích điện Inverter.",
    warning: "Giữ điện áp danh định và công suất cố định.",
    classification: "Ước lượng",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "V_nom",
            "label": "Điện áp danh định pin",
            "unit": "V",
            "defaultVal": 12.8,
            "step": 0.1
      },
      {
            "key": "C_Ah",
            "label": "Dung lượng khả dụng của pin",
            "unit": "Ah",
            "defaultVal": 200,
            "step": 10
      },
      {
            "key": "DoD",
            "label": "Độ xả sâu pin (LiFePO4: 0.9)",
            "unit": "0..1",
            "defaultVal": 0.9,
            "step": 0.05
      },
      {
            "key": "eta_inv",
            "label": "Hiệu suất chuyển đổi Inverter",
            "unit": "0..1",
            "defaultVal": 0.88,
            "step": 0.02
      },
      {
            "key": "P_ac",
            "label": "Công suất thiết bị 220V",
            "unit": "W",
            "defaultVal": 1200,
            "step": 100
      }
],
    calculate: (inp) => {
      const tH = (inp.V_nom * inp.C_Ah * inp.DoD * inp.eta_inv) / inp.P_ac;
      const tMin = tH * 60;
      return {
        outputs: {
          hours: { label: 'Thời gian hoạt động', value: Number(tH.toFixed(2)), unit: 'giờ' },
          minutes: { label: 'Quy đổi thời gian', value: Math.round(tMin), unit: 'phút' }
        },
        notes: 'Các thiết bị có mô-tơ bơm / máy nén cần chú ý dòng khởi động surge cao gấp 2-3 lần.'
      };
    }
  },
  {
    id: "DM-028",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Dòng vào inverter",
    formula: "I_dc = P_ac/(V_dc*eta_inv)",
    desc: "Dòng điện DC từ bình pin cấp vào đầu ngõ Inverter khi chạy tải nặng.",
    warning: "Cần thêm dòng khởi động cho mô-tơ.",
    classification: "Chuẩn cân bằng công suất",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_ac",
            "label": "Công suất tải xoay chiều 220V",
            "unit": "W",
            "defaultVal": 2000,
            "step": 100
      },
      {
            "key": "V_dc",
            "label": "Điện áp bình pin DC",
            "unit": "V",
            "defaultVal": 12.5,
            "step": 0.1
      },
      {
            "key": "eta_inv",
            "label": "Hiệu suất Inverter",
            "unit": "0..1",
            "defaultVal": 0.88,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const iDc = inp.P_ac / (inp.V_dc * inp.eta_inv);
      return {
        outputs: {
          iDc_A: { label: 'Dòng DC kéo từ pin', value: Math.round(iDc), unit: 'A' }
        },
        notes: 'Dòng kéo rất cao (~180A), bắt buộc dùng cáp đồng tiết diện tối thiểu 35-50 mm².'
      };
    }
  },
  {
    id: "DM-029",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Sản lượng PV sơ bộ",
    formula: "E_PV_Wh = P_STC_WPSH_hPR",
    desc: "Ước tính sản lượng điện năng do giàn pin mặt trời nóc xe tạo ra trong 1 ngày.",
    warning: "Ước tính; cần thời tiết theo vị trí và PVWatts V8 để thiết kế.",
    classification: "Ước lượng",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_STC_W",
            "label": "Tổng công suất giàn pin mặt trời",
            "unit": "Wp",
            "defaultVal": 400,
            "step": 50
      },
      {
            "key": "PSH_h",
            "label": "Số giờ nắng đỉnh trung bình (Peak Sun Hours)",
            "unit": "giờ/ngày",
            "defaultVal": 4.5,
            "step": 0.5
      },
      {
            "key": "PR",
            "label": "Hệ số hiệu năng hệ thống (bụi, góc nghiêng, nhiệt)",
            "unit": "0..1",
            "defaultVal": 0.75,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const eWh = inp.P_STC_W * inp.PSH_h * inp.PR;
      return {
        outputs: {
          ePv_Wh: { label: 'Năng lượng thu được/ngày', value: Math.round(eWh), unit: 'Wh' },
          ah12V: { label: 'Tương đương bù vào bình 12V', value: Number((eWh / 13.2).toFixed(1)), unit: 'Ah' }
        },
        notes: 'Tấm pin đặt nằm phẳng trên nóc xe thường bị giảm 15-25% so với góc nghiêng lý tưởng.'
      };
    }
  },
  {
    id: "DM-030",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Số tấm PV",
    formula: "N = CEILING(P_required_W/P_panel_W,1)",
    desc: "Tính số lượng tấm pin mặt trời cần lắp đặt để đáp ứng nhu cầu điện sinh hoạt.",
    warning: "Cần kiểm tra điện áp Voc lạnh và dải MPPT.",
    classification: "Chuẩn làm tròn",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_required_W",
            "label": "Tổng công suất giàn PV cần thiết",
            "unit": "W",
            "defaultVal": 600,
            "step": 50
      },
      {
            "key": "P_panel_W",
            "label": "Công suất mỗi tấm pin chọn mua",
            "unit": "W",
            "defaultVal": 200,
            "step": 10
      }
],
    calculate: (inp) => {
      const n = Math.ceil(inp.P_required_W / inp.P_panel_W);
      return {
        outputs: {
          panelCount: { label: 'Số lượng tấm pin cần lắp', value: n, unit: 'Tấm' }
        },
        notes: 'Cần kiểm tra điện áp hở mạch Voc để chọn bộ điều khiển sạc MPPT phù hợp.'
      };
    }
  },
  {
    id: "DM-031",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Dòng sạc DC-DC",
    formula: "I_out = P_out/V_batt",
    desc: "Dòng điện nạp vào bình pin từ bộ sạc DC-DC Charger thông minh.",
    warning: "Giả thiết điện áp tại đầu ra cố định.",
    classification: "Chuẩn điện",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_out",
            "label": "Công suất đầu ra của bộ sạc DC-DC",
            "unit": "W",
            "defaultVal": 600,
            "step": 50
      },
      {
            "key": "V_batt",
            "label": "Điện áp cọc bình pin phụ",
            "unit": "V",
            "defaultVal": 14.4,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const iOut = inp.P_out / inp.V_batt;
      return {
        outputs: {
          iOut_A: { label: 'Dòng sạc thực tế cấp cho pin', value: Number(iOut.toFixed(1)), unit: 'A' }
        },
        notes: 'Bộ DC-DC giúp bảo vệ máy phát xe không bị quá tải khi sạc bình LiFePO4.'
      };
    }
  },
  {
    id: "DM-032",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Công suất sạc từ máy phát",
    formula: "P_input = V_batt*I_charge/eta_dcdc",
    desc: "Công suất điện máy phát xe phải gánh để cấp cho bộ sạc DC-DC phụ.",
    warning: "Tải cơ máy phát phải tính thêm hiệu suất máy phát.",
    classification: "Chuẩn mô hình",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "V_batt",
            "label": "Điện áp bình pin phụ",
            "unit": "V",
            "defaultVal": 14.4,
            "step": 0.1
      },
      {
            "key": "I_charge",
            "label": "Dòng sạc nạp cho bình pin",
            "unit": "A",
            "defaultVal": 50,
            "step": 5
      },
      {
            "key": "eta_dcdc",
            "label": "Hiệu suất bộ chuyển đổi DC-DC",
            "unit": "0..1",
            "defaultVal": 0.92,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const pIn = (inp.V_batt * inp.I_charge) / inp.eta_dcdc;
      return {
        outputs: {
          pInput_W: { label: 'Công suất điện kéo từ máy phát', value: Math.round(pIn), unit: 'W' }
        },
        notes: 'Máy phát xe cần có công suất dư tối thiểu 1000W để không bị sụt điện xe nguyên bản.'
      };
    }
  },
  {
    id: "DM-033",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Thời gian sạc CC gần đúng",
    formula: "t_h = deltaAh/(I_charge*eta_charge)",
    desc: "Thời gian sạc gần đúng trong giai đoạn sạc dòng không đổi (Constant Current).",
    warning: "Không áp dụng trực tiếp pha CV, SOC cao.",
    classification: "Ước lượng",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "deltaAh",
            "label": "Lượng dung lượng cần bù nạp",
            "unit": "Ah",
            "defaultVal": 150,
            "step": 10
      },
      {
            "key": "I_charge",
            "label": "Dòng nạp từ máy phát hoặc sạc",
            "unit": "A",
            "defaultVal": 50,
            "step": 5
      },
      {
            "key": "eta_charge",
            "label": "Hiệu suất tích điện hóa học",
            "unit": "0..1",
            "defaultVal": 0.96,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const tH = inp.deltaAh / (inp.I_charge * inp.eta_charge);
      return {
        outputs: {
          time_h: { label: 'Thời gian sạc CC', value: Number(tH.toFixed(2)), unit: 'giờ' }
        },
        notes: 'Chưa tính giai đoạn bão hòa CV ở 5% dung lượng cuối.'
      };
    }
  },
  {
    id: "DM-034",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Sụt áp dây DC",
    formula: "DeltaV = IrhoL_loop/A_mm2",
    desc: "Độ sụt áp một chiều trên đường dây cáp nguồn đi từ trước ra sau thùng xe.",
    warning: "L_loop là toàn đường đi-về; cần kiểm tra ampacity.",
    classification: "Chuẩn điện",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "I",
            "label": "Dòng điện tải chạy qua dây",
            "unit": "A",
            "defaultVal": 50,
            "step": 5
      },
      {
            "key": "rho",
            "label": "Điện trở suất đồng (ở nhiệt độ vận hành)",
            "unit": "Ohm.mm²/m",
            "defaultVal": 0.0175,
            "step": 0.001
      },
      {
            "key": "L_loop",
            "label": "Tổng chiều dài dây đi và về (vòng kín)",
            "unit": "m",
            "defaultVal": 10,
            "step": 1
      },
      {
            "key": "A_mm2",
            "label": "Tiết diện lõi đồng",
            "unit": "mm²",
            "defaultVal": 16,
            "step": 1
      }
],
    calculate: (inp) => {
      const dv = (inp.I * inp.rho * inp.L_loop) / inp.A_mm2;
      return {
        outputs: {
          deltaV: { label: 'Độ sụt áp trên đường dây', value: Number(dv.toFixed(2)), unit: 'V' }
        },
        notes: dv > 0.4 ? 'Sụt áp >3% trên hệ 12V, nên tăng tiết diện cáp để tránh tổn hao nhiệt.' : 'Sụt áp nằm trong ngưỡng tiêu chuẩn kỹ thuật an toàn.'
      };
    }
  },
  {
    id: "DM-035",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Năng lượng dùng điều hòa",
    formula: "E_Wh = P_avg_W*t_h",
    desc: "Năng lượng tiêu thụ của máy lạnh điều hòa dã ngoại 12V / 220V.",
    warning: "Cần đo công suất theo chu kỳ máy nén.",
    classification: "Chuẩn cân bằng năng lượng",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_avg_W",
            "label": "Công suất trung bình chu kỳ máy nén",
            "unit": "W",
            "defaultVal": 400,
            "step": 50
      },
      {
            "key": "t_h",
            "label": "Thời gian chạy điều hòa qua đêm",
            "unit": "giờ",
            "defaultVal": 8,
            "step": 1
      }
],
    calculate: (inp) => {
      const eWh = inp.P_avg_W * inp.t_h;
      return {
        outputs: {
          energy_Wh: { label: 'Năng lượng tiêu hao qua đêm', value: Math.round(eWh), unit: 'Wh' },
          ah12V: { label: 'Rút từ bình pin 12V', value: Math.round(eWh / 12.8), unit: 'Ah' }
        },
        notes: 'Cần bình LiFePO4 tối thiểu 300Ah để có thể chạy điều hòa ngủ qua đêm yên tâm.'
      };
    }
  },
  {
    id: "DM-036",
    categoryId: "03",
    category: "03 Camping & RV",
    targetUser: "Chủ xe camper, caravan, hệ điện dã ngoại",
    name: "Công suất dự phòng tải",
    formula: "P_margin = P_peak*SF",
    desc: "Công suất dự phòng an toàn khi thiết kế hệ thống điện RV chống quá tải.",
    warning: "SF do thiết kế quy định; không thay khả năng surge inverter.",
    classification: "Quy tắc thiết kế",
    source1: "https://developer.nlr.gov/docs/solar/pvwatts/v8/",
    source2: "https://samrepo.nlr.gov/help/pvwatts_system_design.html",
    inputs: [
      {
            "key": "P_peak",
            "label": "Tổng công suất đỉnh đồng thời các tải",
            "unit": "W",
            "defaultVal": 2200,
            "step": 100
      },
      {
            "key": "SF",
            "label": "Hệ số an toàn dự phòng thiết kế (SF)",
            "unit": "",
            "defaultVal": 1.25,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const pMargin = inp.P_peak * inp.SF;
      return {
        outputs: {
          pMargin_W: { label: 'Công suất định mức thiết bị cần chọn', value: Math.round(pMargin), unit: 'W' }
        },
        notes: 'Nên chọn Inverter hoặc nguồn có công suất tối thiểu bằng P_margin.'
      };
    }
  },
  {
    id: "DM-037",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Dung tích động cơ",
    formula: "Vd_L = pi/4*(B_mm^2)S_mmNc/1000000",
    desc: "Tính dung tích xi-lanh toàn phần của động cơ đốt trong (Engine Displacement).",
    warning: "Đo theo đường kính và hành trình thực.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "B_mm",
            "label": "Đường kính xi-lanh (Bore)",
            "unit": "mm",
            "defaultVal": 95,
            "step": 0.5
      },
      {
            "key": "S_mm",
            "label": "Hành trình piston (Stroke)",
            "unit": "mm",
            "defaultVal": 85,
            "step": 0.5
      },
      {
            "key": "Nc",
            "label": "Số lượng xi-lanh",
            "unit": "xi-lanh",
            "defaultVal": 6,
            "step": 1
      }
],
    calculate: (inp) => {
      const vL = (Math.PI / 4) * Math.pow(inp.B_mm, 2) * inp.S_mm * inp.Nc / 1000000;
      return {
        outputs: {
          displacement_L: { label: 'Dung tích động cơ', value: Number(vL.toFixed(3)), unit: 'Lít' },
          displacementL: { label: 'Dung tích Lít', value: Number(vL.toFixed(3)), unit: 'Lít' },
          displacement_cc: { label: 'Dung tích xi-lanh (cc)', value: Math.round(vL * 1000), unit: 'cc' }
        },
        notes: 'Căn cứ chính xác kích thước doa nòng hoặc hành trình trục khuỷu khi độ máy.'
      };
    }
  },
  {
    id: "DM-038",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Tỷ số nén tĩnh",
    formula: "CR = (Vs+Vc)/Vc",
    desc: "Tỷ số nén tĩnh hình học của buồng đốt động cơ.",
    warning: "Vc gồm khe hở piston, gioăng, chỏm v.v.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Vs",
            "label": "Thể tích quét của 1 piston (Vs)",
            "unit": "cc",
            "defaultVal": 500,
            "step": 10
      },
      {
            "key": "Vc",
            "label": "Thể tích buồng cháy nắp quy-lát (Vc)",
            "unit": "cc",
            "defaultVal": 52,
            "step": 1
      }
],
    calculate: (inp) => {
      const cr = (inp.Vs + inp.Vc) / inp.Vc;
      return {
        outputs: {
          compRatio: { label: 'Tỷ số nén tĩnh (CR)', value: Number(cr.toFixed(2)), unit: ': 1' }
        },
        notes: 'Xe tăng áp turbo thường có CR từ 9.0-10.0:1, xe hút khí tự nhiên đạt 11.5-13.0:1.'
      };
    }
  },
  {
    id: "DM-039",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Tốc độ piston trung bình",
    formula: "Up_mps = 2S_mn_rpm/60",
    desc: "Vận tốc trung bình của quả piston di chuyển trong lòng xi-lanh.",
    warning: "Tốc độ trung bình, không phải vận tốc đỉnh.",
    classification: "Chuẩn động học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "S_mm",
            "label": "Hành trình piston (Stroke)",
            "unit": "mm",
            "defaultVal": 88,
            "step": 1
      },
      {
            "key": "n_rpm",
            "label": "Vòng tua máy tối đa",
            "unit": "RPM",
            "defaultVal": 6500,
            "step": 100
      }
],
    calculate: (inp) => {
      const sM = inp.S_mm / 1000;
      const up = (2 * sM * inp.n_rpm) / 60;
      return {
        outputs: {
          up_mps: { label: 'Vận tốc trung bình piston', value: Number(up.toFixed(2)), unit: 'm/s' }
        },
        notes: up > 25 ? 'Nguy hiểm: Vượt ngưỡng bền giới hạn động cơ thương mại (thường <22 m/s).' : 'Vận tốc nằm trong dải an toàn cơ khí bền vững.'
      };
    }
  },
  {
    id: "DM-040",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Công suất từ mô-men",
    formula: "P_kW = T_Nm*n_rpm/9549.2966",
    desc: "Quy đổi chính xác công suất (kW) sinh ra từ mô-men xoắn ở tua máy cụ thể.",
    warning: "Cùng vị trí đo trục.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T_Nm",
            "label": "Mô-men xoắn động cơ",
            "unit": "Nm",
            "defaultVal": 400,
            "step": 10
      },
      {
            "key": "n_rpm",
            "label": "Tua máy đo tại dyno",
            "unit": "RPM",
            "defaultVal": 4500,
            "step": 100
      }
],
    calculate: (inp) => {
      const pKw = (inp.T_Nm * inp.n_rpm) / 9549.2966;
      const hp = pKw * 1.34102;
      return {
        outputs: {
          power_kW: { label: 'Công suất động cơ', value: Number(pKw.toFixed(1)), unit: 'kW' },
          power_HP: { label: 'Công suất mã lực', value: Number(hp.toFixed(1)), unit: 'HP' }
        },
        notes: 'Công suất và mô-men xoắn luôn cắt nhau tại mốc 5252 RPM (khi tính theo hệ Imperial).'
      };
    }
  },
  {
    id: "DM-041",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "BMEP động cơ 4 kỳ",
    formula: "BMEP_Pa = 4piT_Nm/Vd_m3",
    desc: "Áp suất chỉ thị hiệu dụng trung bình BMEP của động cơ 4 kỳ.",
    warning: "Chỉ 4 kỳ; 2 kỳ công thức khác.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T_Nm",
            "label": "Mô-men xoắn trục khuỷu",
            "unit": "Nm",
            "defaultVal": 450,
            "step": 10
      },
      {
            "key": "Vd_L",
            "label": "Dung tích động cơ",
            "unit": "Lít",
            "defaultVal": 2.4,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const vdM3 = inp.Vd_L / 1000;
      const bmepPa = (4 * Math.PI * inp.T_Nm) / vdM3;
      const bmepBar = bmepPa / 100000;
      return {
        outputs: {
          bmep_bar: { label: 'Áp suất BMEP', value: Number(bmepBar.toFixed(2)), unit: 'bar' }
        },
        notes: 'Động cơ Turbo tuned cao cấp thường đạt BMEP trên 20-25 bar.'
      };
    }
  },
  {
    id: "DM-042",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "AFR",
    formula: "AFR = m_air/m_fuel",
    desc: "Tỷ lệ hòa khí gió/xăng (Air-Fuel Ratio - AFR) thực tế động cơ đang vận hành.",
    warning: "Đúng theo dòng khối lượng hoặc khối lượng cùng khoảng thời gian.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "m_air",
            "label": "Lưu lượng khối lượng gió nạp",
            "unit": "g/s",
            "defaultVal": 180,
            "step": 5
      },
      {
            "key": "m_fuel",
            "label": "Lưu lượng khối lượng nhiên liệu phun",
            "unit": "g/s",
            "defaultVal": 14.5,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const afr = inp.m_air / inp.m_fuel;
      return {
        outputs: {
          afr: { label: 'Tỷ lệ hòa khí (AFR)', value: Number(afr.toFixed(2)), unit: ': 1' }
        },
        notes: afr < 12.5 ? 'Hòa khí giàu xăng (Rich) bảo vệ máy khi đạp hết ga WOT.' : 'Hòa khí nghèo (Lean), tiết kiệm nhiên liệu nhưng tăng nhiệt buồng đốt.'
      };
    }
  },
  {
    id: "DM-043",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Lambda",
    formula: "lambda = AFR/AFR_stoich",
    desc: "Hệ số tương đối Lambda so với điểm hòa khí lý tưởng cân bằng hóa học.",
    warning: "Không mặc định 14.7 với mọi nhiên liệu.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "AFR",
            "label": "Tỷ lệ AFR đo từ cảm biến Wideband",
            "unit": "",
            "defaultVal": 12.8,
            "step": 0.1
      },
      {
            "key": "AFR_stoich",
            "label": "AFR lý thuyết của nhiên liệu (Xăng 14.7, E85 9.8)",
            "unit": "",
            "defaultVal": 14.7,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const lambda = inp.AFR / inp.AFR_stoich;
      return {
        outputs: {
          lambda: { label: 'Hệ số Lambda (λ)', value: Number(lambda.toFixed(3)), unit: '' }
        },
        notes: 'Khi tune máy Turbo xăng đầy tải, Lambda mục tiêu thường là 0.82 - 0.86.'
      };
    }
  },
  {
    id: "DM-044",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Lưu lượng kim phun tối thiểu",
    formula: "flow_each_kgph = fuel_kgph/(N_injector*DC)",
    desc: "Lưu lượng phun tối thiểu của mỗi kim phun ở chu kỳ mở an toàn.",
    warning: "Phải quy đổi theo mật độ và chênh áp kim phun.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "fuel_kgph",
            "label": "Tổng lưu lượng xăng toàn máy",
            "unit": "kg/h",
            "defaultVal": 95,
            "step": 5
      },
      {
            "key": "N_injector",
            "label": "Số lượng kim phun",
            "unit": "cái",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "DC",
            "label": "Duty Cycle tối đa cho phép",
            "unit": "0..1",
            "defaultVal": 0.85,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const flow = inp.fuel_kgph / (inp.N_injector * inp.DC);
      const ccMin = (flow * 1000) / (0.75 * 60); // giả định mật độ xăng 0.75 kg/L
      return {
        outputs: {
          flow_kgph: { label: 'Lưu lượng kim yêu cầu', value: Number(flow.toFixed(2)), unit: 'kg/h' },
          flow_ccmin: { label: 'Kích cỡ kim tương đương', value: Math.round(ccMin), unit: 'cc/phút' }
        },
        notes: 'Không nên chạy kim phun ở Duty Cycle vượt quá 85-90% để tránh treo kim.'
      };
    }
  },
  {
    id: "DM-045",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Đổi lưu lượng theo chênh áp",
    formula: "q2 = q1*sqrt(dp2/dp1)",
    desc: "Quy đổi lưu lượng kim phun khi nâng hoặc hạ áp suất xăng trên đường rail.",
    warning: "Công thức orifice, chỉ khi hình học và hệ số xả gần như không đổi.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "q1",
            "label": "Lưu lượng danh định ở áp gốc (q1)",
            "unit": "cc/phút",
            "defaultVal": 550,
            "step": 20
      },
      {
            "key": "dp1",
            "label": "Áp suất rail tiêu chuẩn (dp1)",
            "unit": "bar",
            "defaultVal": 3,
            "step": 0.5
      },
      {
            "key": "dp2",
            "label": "Áp suất rail thực tế nâng cấp (dp2)",
            "unit": "bar",
            "defaultVal": 4,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const q2 = inp.q1 * Math.sqrt(inp.dp2 / inp.dp1);
      return {
        outputs: {
          q2: { label: 'Lưu lượng kim ở áp mới', value: Math.round(q2), unit: 'cc/phút' }
        },
        notes: 'Tăng áp xăng giúp tăng lưu lượng phun mà không cần thay kim lớn hơn.'
      };
    }
  },
  {
    id: "DM-046",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Tỷ số nén turbo",
    formula: "PR = p_discharge_abs/p_inlet_abs",
    desc: "Tỷ số nén tuyệt đối của máy nén khí Turbocharger (Pressure Ratio).",
    warning: "Không dùng boost áp suất tương đối trực tiếp.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "p_boost_bar",
            "label": "Áp suất nạp hiển thị đồng hồ (Boost gauge)",
            "unit": "bar",
            "defaultVal": 1.5,
            "step": 0.1
      },
      {
            "key": "p_atm_bar",
            "label": "Áp suất khí quyển cửa hút",
            "unit": "bar",
            "defaultVal": 1,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const pDischarge = inp.p_boost_bar + inp.p_atm_bar;
      const pr = pDischarge / inp.p_atm_bar;
      return {
        outputs: {
          pressureRatio: { label: 'Tỷ số nén Turbo (PR)', value: Number(pr.toFixed(2)), unit: '' }
        },
        notes: 'Áp dụng đối chiếu trên biểu đồ máy nén (Compressor Map) của Turbo.'
      };
    }
  },
  {
    id: "DM-047",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Nhiệt máy nén",
    formula: "T2_K = T1_K*(1+(PR^((gamma-1)/gamma)-1)/eta_c)",
    desc: "Nhiệt độ khí nạp sau khi bị nén qua Turbo trước khi vào két tản nhiệt Intercooler.",
    warning: "Mô hình khí lý tưởng, hiệu suất đẳng entropy.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T1_C",
            "label": "Nhiệt độ không khí cửa hút",
            "unit": "°C",
            "defaultVal": 30,
            "step": 1
      },
      {
            "key": "PR",
            "label": "Tỷ số nén Turbo (PR)",
            "unit": "",
            "defaultVal": 2.5,
            "step": 0.1
      },
      {
            "key": "gamma",
            "label": "Hệ số đoạn nhiệt không khí",
            "unit": "",
            "defaultVal": 1.4,
            "step": 0.01
      },
      {
            "key": "eta_c",
            "label": "Hiệu suất đoạn nhiệt máy nén",
            "unit": "0..1",
            "defaultVal": 0.72,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const t1K = inp.T1_C + 273.15;
      const exp = (inp.gamma - 1) / inp.gamma;
      const t2K = t1K * (1 + (Math.pow(inp.PR, exp) - 1) / inp.eta_c);
      const t2C = t2K - 273.15;
      return {
        outputs: {
          t2_C: { label: 'Nhiệt độ khí sau nén', value: Number(t2C.toFixed(1)), unit: '°C' }
        },
        notes: 'Khí nạp rất nóng (>120°C), cần két Intercooler hiệu quả để làm mát giảm nguy cơ kích nổ.'
      };
    }
  },
  {
    id: "DM-048",
    categoryId: "04",
    category: "04 Performance & Tuning",
    targetUser: "Người độ động cơ, turbo, ECU",
    name: "Suất tiêu hao riêng",
    formula: "BSFC = fuel_mass_flow_kgph/P_brake_kW",
    desc: "Suất tiêu hao nhiên liệu riêng của động cơ (Brake Specific Fuel Consumption).",
    warning: "Đơn vị kg/kWh, không tự suy ra hiệu suất nếu không có nhiệt trị.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "fuel_kgph",
            "label": "Lưu lượng xăng dầu tiêu thụ",
            "unit": "kg/h",
            "defaultVal": 48,
            "step": 2
      },
      {
            "key": "P_brake_kW",
            "label": "Công suất đo tại cốt máy",
            "unit": "kW",
            "defaultVal": 200,
            "step": 10
      }
],
    calculate: (inp) => {
      const bsfc = (inp.fuel_kgph / inp.P_brake_kW) * 1000;
      return {
        outputs: {
          bsfc_gkWh: { label: 'Suất tiêu hao (BSFC)', value: Math.round(bsfc), unit: 'g/kWh' }
        },
        notes: 'Động cơ Diesel hiệu suất cao thường có BSFC khoảng 200-220 g/kWh; máy xăng khoảng 250-290 g/kWh.'
      };
    }
  },
  {
    id: "DM-049",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Tỷ số truyền tổng",
    formula: "i_total = i_geari_finali_transfer",
    desc: "Tỷ số truyền động lực học tổng cộng từ động cơ đến trục bánh xe.",
    warning: "Tùy cấu hình AWD và hộp phụ.",
    classification: "Chuẩn hình học",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "i_gear",
            "label": "Tỷ số cấp số hộp số",
            "unit": "",
            "defaultVal": 1.35,
            "step": 0.01
      },
      {
            "key": "i_final",
            "label": "Tỷ số truyền cầu vi sai (Final Drive)",
            "unit": "",
            "defaultVal": 3.9,
            "step": 0.01
      },
      {
            "key": "i_transfer",
            "label": "Tỷ số truyền cầu phụ (nếu có)",
            "unit": "",
            "defaultVal": 1,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const iTotal = inp.i_gear * inp.i_final * inp.i_transfer;
      return {
        outputs: {
          iTotal: { label: 'Tỷ số truyền tổng', value: Number(iTotal.toFixed(3)), unit: ': 1' }
        },
        notes: 'Tỷ số truyền cầu càng lớn giúp xe đề pa bốc hơn nhưng giảm tốc độ tối đa.'
      };
    }
  },
  {
    id: "DM-050",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "RPM khi lên số",
    formula: "n_after = n_before*i_next/i_current",
    desc: "Vòng tua máy rơi lại sau khi lên số ở cùng một tốc độ xe tức thời.",
    warning: "Giả thiết vận tốc xe không đổi khi sang số.",
    classification: "Chuẩn động học",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "n_before",
            "label": "Tua máy trước khi sang số",
            "unit": "RPM",
            "defaultVal": 6800,
            "step": 100
      },
      {
            "key": "i_next",
            "label": "Tỷ số truyền số cao tiếp theo",
            "unit": "",
            "defaultVal": 1.25,
            "step": 0.01
      },
      {
            "key": "i_current",
            "label": "Tỷ số truyền số hiện tại",
            "unit": "",
            "defaultVal": 1.65,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const nAfter = (inp.n_before * inp.i_next) / inp.i_current;
      return {
        outputs: {
          nAfter_rpm: { label: 'Tua máy sau khi vào số', value: Math.round(nAfter), unit: 'RPM' },
          drop_rpm: { label: 'Mức sụt tua máy', value: Math.round(inp.n_before - nAfter), unit: 'RPM' }
        },
        notes: 'Hộp số Close-ratio thể thao có bước số hẹp giúp tua máy luôn nằm trong Powerband.'
      };
    }
  },
  {
    id: "DM-051",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Gia tốc từ lực dư",
    formula: "a = (F_drive-F_drag-F_roll-F_grade)/m_equiv",
    desc: "Gia tốc tức thời sinh ra từ lực kéo dư thừa sau khi trừ các thành phần cản.",
    warning: "m_equiv gồm quán tính quy đổi, giới hạn bám.",
    classification: "Mô hình ước lượng",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "F_drive",
            "label": "Lực kéo động cơ truyền xuống bánh",
            "unit": "N",
            "defaultVal": 6500,
            "step": 100
      },
      {
            "key": "F_drag",
            "label": "Lực cản khí động học",
            "unit": "N",
            "defaultVal": 600,
            "step": 50
      },
      {
            "key": "F_roll",
            "label": "Lực cản lăn bánh xe",
            "unit": "N",
            "defaultVal": 350,
            "step": 20
      },
      {
            "key": "F_grade",
            "label": "Lực cản dốc (nếu đường phẳng = 0)",
            "unit": "N",
            "defaultVal": 0,
            "step": 50
      },
      {
            "key": "m_equiv",
            "label": "Khối lượng tương đương của xe (gồm quán tính)",
            "unit": "kg",
            "defaultVal": 1550,
            "step": 50
      }
],
    calculate: (inp) => {
      const a = (inp.F_drive - inp.F_drag - inp.F_roll - inp.F_grade) / inp.m_equiv;
      const g = a / 9.80665;
      return {
        outputs: {
          accel_mps2: { label: 'Gia tốc xe', value: Number(a.toFixed(2)), unit: 'm/s²' },
          accel_g: { label: 'Gia tốc theo G-force', value: Number(g.toFixed(2)), unit: 'G' }
        },
        notes: 'Gia tốc thực tế bị chặn bởi hệ số bám cực đại của hợp chất lốp đua.'
      };
    }
  },
  {
    id: "DM-052",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Khoảng phanh lý tưởng",
    formula: "d = v0^2/(2mug)",
    desc: "Khoảng cách phanh dừng lý tưởng từ vận tốc ban đầu trên đường phẳng.",
    warning: "Đường phẳng, mu hằng, không gồm phản ứng.",
    classification: "Mô hình lý tưởng",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "v0_kmh",
            "label": "Tốc độ xe bắt đầu phanh",
            "unit": "km/h",
            "defaultVal": 100,
            "step": 5
      },
      {
            "key": "mu",
            "label": "Hệ số ma sát bám lốp (Đường khô: 0.8-1.0, Ướt: 0.5)",
            "unit": "",
            "defaultVal": 0.9,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const v0 = (inp.v0_kmh * 1000) / 3600;
      const g = 9.80665;
      const d = Math.pow(v0, 2) / (2 * inp.mu * g);
      return {
        outputs: {
          brakeDist_m: { label: 'Quãng đường phanh lý tưởng', value: Number(d.toFixed(1)), unit: 'm' }
        },
        notes: 'Chưa tính quãng đường xe trôi trong thời gian phản xạ của người lái (~1 giây).'
      };
    }
  },
  {
    id: "DM-053",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Chuyển tải dọc khi phanh",
    formula: "deltaF = mah_CG/Lwheelbase",
    desc: "Độ dịch chuyển tải trọng từ cầu sau dồn lên cầu trước khi đạp phanh gấp.",
    warning: "Mô hình quasi-static; chưa gồm khí động và hệ treo.",
    classification: "Mô hình ước lượng",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "m",
            "label": "Tổng khối lượng xe",
            "unit": "kg",
            "defaultVal": 1450,
            "step": 50
      },
      {
            "key": "a_mps2",
            "label": "Gia tốc hãm phanh",
            "unit": "m/s²",
            "defaultVal": 8.5,
            "step": 0.5
      },
      {
            "key": "h_CG",
            "label": "Độ cao trọng tâm xe so với mặt đất",
            "unit": "m",
            "defaultVal": 0.52,
            "step": 0.02
      },
      {
            "key": "Lwheelbase",
            "label": "Chiều dài cơ sở xe",
            "unit": "m",
            "defaultVal": 2.65,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const deltaF = (inp.m * inp.a_mps2 * inp.h_CG) / inp.Lwheelbase;
      const deltaKg = deltaF / 9.80665;
      return {
        outputs: {
          deltaF_N: { label: 'Lực chuyển tải trọng', value: Math.round(deltaF), unit: 'N' },
          delta_kg: { label: 'Tải trọng dồn về cầu trước', value: Math.round(deltaKg), unit: 'kg' }
        },
        notes: 'Trọng tâm hạ càng thấp thì hiện tượng chúi đầu (brake dive) càng giảm.'
      };
    }
  },
  {
    id: "DM-054",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Lực cản khí động",
    formula: "Fd = 0.5rho_airCdAfrontv^2",
    desc: "Lực cản khí động học cản trở chuyển động của xe khi chạy tốc độ cao.",
    warning: "Cd phụ thuộc cấu hình khí động.",
    classification: "Chuẩn mô hình",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "rho_air",
            "label": "Mật độ không khí",
            "unit": "kg/m³",
            "defaultVal": 1.2,
            "step": 0.05
      },
      {
            "key": "Cd",
            "label": "Hệ số cản khí động",
            "unit": "",
            "defaultVal": 0.3,
            "step": 0.01
      },
      {
            "key": "Afront",
            "label": "Diện tích cản gió trực diện",
            "unit": "m²",
            "defaultVal": 2.2,
            "step": 0.1
      },
      {
            "key": "v_mps",
            "label": "Vận tốc xe",
            "unit": "m/s",
            "defaultVal": 20,
            "step": 1
      }
],
    calculate: (inp) => {
      const fd = 0.5 * inp.rho_air * inp.Cd * inp.Afront * Math.pow(inp.v_mps, 2);
      return {
        outputs: {
          dragForceN: { label: 'Lực cản khí động', value: Number(fd.toFixed(1)), unit: 'N' }
        },
        notes: 'Lực cản tăng tỷ lệ thuận với bình phương tốc độ (v²).'
      };
    }
  },
  {
    id: "DM-055",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Công suất cản khí",
    formula: "P_drag_W = F_drag_N*v_mps",
    desc: "Công suất động cơ tiêu hao chỉ để thắng lực cản gió ở tốc độ hiện tại.",
    warning: "Chưa gồm cản lăn, tổn thất.",
    classification: "Chuẩn cơ học",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "F_drag_N",
            "label": "Lực cản không khí",
            "unit": "N",
            "defaultVal": 1200,
            "step": 50
      },
      {
            "key": "v_mps",
            "label": "Vận tốc xe chạy",
            "unit": "m/s",
            "defaultVal": 40,
            "step": 2
      }
],
    calculate: (inp) => {
      const pW = inp.F_drag_N * inp.v_mps;
      const pKw = pW / 1000;
      const hp = pKw * 1.34102;
      return {
        outputs: {
          pDrag_kW: { label: 'Công suất cản gió', value: Number(pKw.toFixed(1)), unit: 'kW' },
          pDrag_HP: { label: 'Quy đổi mã lực cản', value: Number(hp.toFixed(1)), unit: 'HP' }
        },
        notes: 'Ở tốc độ trên 160 km/h, hơn 80% công suất động cơ dùng để xé gió.'
      };
    }
  },
  {
    id: "DM-056",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Wheel rate",
    formula: "k_wheel = k_spring*(dx_spring/dx_wheel)^2",
    desc: "Độ cứng lò xo quy đổi tại tâm bánh xe (Wheel Rate) tính theo Motion Ratio.",
    warning: "Motion ratio định nghĩa rõ như trên; tuyến tính hóa vị trí chạy.",
    classification: "Chuẩn mô hình",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "k_spring",
            "label": "Độ cứng lò xo phuộc nhún",
            "unit": "N/mm",
            "defaultVal": 80,
            "step": 5
      },
      {
            "key": "motion_ratio",
            "label": "Tỷ lệ đòn bẩy hệ treo (dx_spring / dx_wheel)",
            "unit": "",
            "defaultVal": 0.75,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const kSpringNm = inp.k_spring * 1000;
      const kWheel = kSpringNm * Math.pow(inp.motion_ratio, 2);
      return {
        outputs: {
          kWheel_Nm: { label: 'Wheel Rate tại bánh', value: Math.round(kWheel), unit: 'N/m' },
          kWheel_Nmm: { label: 'Wheel Rate theo N/mm', value: Number((kWheel / 1000).toFixed(1)), unit: 'N/mm' }
        },
        notes: 'Treo MacPherson có motion ratio ~0.9-1.0; treo càng chữ A kép (Double wishbone) thường ~0.6-0.8.'
      };
    }
  },
  {
    id: "DM-057",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Tần số dao động hệ treo",
    formula: "f_Hz = sqrt(k_wheel/m_sprung_corner)/(2*pi)",
    desc: "Tần số dao động tự nhiên của hệ thống treo (Ride Frequency).",
    warning: "Bỏ giảm chấn và độ cứng lốp.",
    classification: "Chuẩn mô hình",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "k_wheel_Nm",
            "label": "Wheel Rate tại bánh",
            "unit": "N/m",
            "defaultVal": 45000,
            "step": 1000
      },
      {
            "key": "m_sprung_corner",
            "label": "Khối lượng được treo tại góc bánh",
            "unit": "kg",
            "defaultVal": 380,
            "step": 10
      }
],
    calculate: (inp) => {
      const fHz = Math.sqrt(inp.k_wheel_Nm / inp.m_sprung_corner) / (2 * Math.PI);
      return {
        outputs: {
          fRide_Hz: { label: 'Tần số dao động hệ treo', value: Number(fHz.toFixed(2)), unit: 'Hz' }
        },
        notes: 'Xe gia đình êm dịu: 1.0 - 1.4 Hz; xe thể thao đường đua: 2.0 - 2.8 Hz.'
      };
    }
  },
  {
    id: "DM-058",
    categoryId: "05",
    category: "05 Drift & Racing",
    targetUser: "Người chạy track, drift, drag",
    name: "Tỷ lệ công suất/trọng lượng",
    formula: "PWR = P_kW/m_ton",
    desc: "Tỷ số công suất trên trọng lượng xe phục vụ so sánh hiệu năng tăng tốc.",
    warning: "Không tương đương dự đoán thời gian 0-100.",
    classification: "Chuẩn định nghĩa",
    source1: "https://wrenchrig.com/wheel-rate-calculator/",
    source2: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/",
    inputs: [
      {
            "key": "P_kW",
            "label": "Công suất cực đại động cơ",
            "unit": "kW",
            "defaultVal": 250,
            "step": 10
      },
      {
            "key": "m_kg",
            "label": "Trọng lượng toàn tải của xe",
            "unit": "kg",
            "defaultVal": 1450,
            "step": 50
      }
],
    calculate: (inp) => {
      const mTon = inp.m_kg / 1000;
      const pwr = inp.P_kW / mTon;
      const hpTon = (inp.P_kW * 1.34102) / mTon;
      return {
        outputs: {
          pwr_kWton: { label: 'Tỷ lệ kW / tấn', value: Number(pwr.toFixed(1)), unit: 'kW/tấn' },
          pwr_HPton: { label: 'Tỷ lệ Mã lực / tấn', value: Number(hpTon.toFixed(1)), unit: 'HP/tấn' }
        },
        notes: 'Chỉ số vàng phản ánh khả năng bức tốc thuần túy của các dòng xe đua.'
      };
    }
  },
  {
    id: "DM-059",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Đường kính lốp danh nghĩa",
    formula: "D_mm = rim_in25.4+2width_mm*AR_percent/100",
    desc: "Đường kính ngoài danh nghĩa của lốp xe tính theo size hệ mét.",
    warning: "Không bằng đường kính lăn động.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "width_mm",
            "label": "Bề rộng lốp",
            "unit": "mm",
            "defaultVal": 285,
            "step": 5
      },
      {
            "key": "AR_percent",
            "label": "Tỷ lệ chiều cao thành lốp",
            "unit": "%",
            "defaultVal": 70,
            "step": 5
      },
      {
            "key": "rim_in",
            "label": "Đường kính mâm",
            "unit": "inch",
            "defaultVal": 17,
            "step": 1
      }
],
    calculate: (inp) => {
      const d = inp.rim_in * 25.4 + 2 * inp.width_mm * (inp.AR_percent / 100);
      return {
        outputs: {
          diameterMm: { label: 'Đường kính lốp danh nghĩa', value: Number(d.toFixed(1)), unit: 'mm' }
        },
        notes: 'Dùng so sánh khi nâng size lốp địa hình MT/AT.'
      };
    }
  },
  {
    id: "DM-060",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Chu vi lốp lý thuyết",
    formula: "C_mm = pi*D_mm",
    desc: "Chu vi lăn lý thuyết của lốp xe sau mỗi một vòng quay hoàn chỉnh.",
    warning: "Áp suất, tải và lốp thực ảnh hưởng C_roll.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "D_mm",
            "label": "Đường kính lốp danh nghĩa",
            "unit": "mm",
            "defaultVal": 830.8,
            "step": 5
      }
],
    calculate: (inp) => {
      const c = Math.PI * inp.D_mm;
      return {
        outputs: {
          circumference_mm: { label: 'Chu vi lốp', value: Number(c.toFixed(1)), unit: 'mm' },
          circumference_m: { label: 'Chu vi tính theo mét', value: Number((c / 1000).toFixed(3)), unit: 'm' }
        },
        notes: 'Căn cứ để thiết lập lại cảm biến tốc độ ODO của xe.'
      };
    }
  },
  {
    id: "DM-061",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Sai số tốc độ vì lốp",
    formula: "v_actual = v_indicated*(C_new/C_old)",
    desc: "Vận tốc thực tế của xe so với đồng hồ hiển thị (Speedometer) sau khi độ lốp to hơn.",
    warning: "Áp dụng nếu đồng hồ hiệu chuẩn từ lốp cũ và cùng tỷ số truyền.",
    classification: "Mô hình ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "v_indicated",
            "label": "Tốc độ kim đồng hồ ODO hiển thị",
            "unit": "km/h",
            "defaultVal": 100,
            "step": 5
      },
      {
            "key": "C_old",
            "label": "Chu vi lốp nguyên bản (zin)",
            "unit": "mm",
            "defaultVal": 2360,
            "step": 20
      },
      {
            "key": "C_new",
            "label": "Chu vi lốp mới nâng cấp",
            "unit": "mm",
            "defaultVal": 2610,
            "step": 20
      }
],
    calculate: (inp) => {
      const vActual = inp.v_indicated * (inp.C_new / inp.C_old);
      const diff = vActual - inp.v_indicated;
      return {
        outputs: {
          vActual_kmh: { label: 'Tốc độ thực tế đang chạy', value: Number(vActual.toFixed(1)), unit: 'km/h' },
          diff_kmh: { label: 'Sai số chạy nhanh hơn ODO', value: Number(diff.toFixed(1)), unit: 'km/h' }
        },
        notes: 'Lắp lốp to làm đồng hồ báo thấp hơn thực tế, tài xế dễ bị bắn tốc độ nếu không căn chỉnh.'
      };
    }
  },
  {
    id: "DM-062",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Tỷ lệ thay đường kính",
    formula: "delta_percent = 100*(D_new/D_old-1)",
    desc: "Tỷ lệ phần trăm chênh lệch đường kính giữa lốp mới và lốp cũ.",
    warning: "So sánh danh nghĩa.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "D_old",
            "label": "Đường kính lốp cũ nguyên bản",
            "unit": "mm",
            "defaultVal": 750,
            "step": 5
      },
      {
            "key": "D_new",
            "label": "Đường kính lốp mới dự kiến lắp",
            "unit": "mm",
            "defaultVal": 830,
            "step": 5
      }
],
    calculate: (inp) => {
      const delta = 100 * (inp.D_new / inp.D_old - 1);
      return {
        outputs: {
          deltaPercent: { label: 'Độ thay đổi đường kính', value: Number(delta.toFixed(2)), unit: '%' }
        },
        notes: Math.abs(delta) > 3 ? 'Cảnh báo: Sai lệch >3% so với nguyên bản, cần kiểm tra cạ hốc bánh và đăng kiểm.' : 'Nằm trong ngưỡng an toàn cho phép.'
      };
    }
  },
  {
    id: "DM-063",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Vị trí mép ngoài mâm",
    formula: "x_outer_mm = W_rim_mm/2-ET_mm",
    desc: "Khoảng cách từ mặt bích lắp mâm ra mép ngoài cùng của vành mâm.",
    warning: "Bỏ gờ bead; dựa tâm mâm.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "W_rim_in",
            "label": "Độ rộng mâm (Rim width)",
            "unit": "inch",
            "defaultVal": 9,
            "step": 0.5
      },
      {
            "key": "ET_mm",
            "label": "Độ lệch mâm Offset (ET)",
            "unit": "mm",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      const wMm = inp.W_rim_in * 25.4;
      const xOuter = wMm / 2 - inp.ET_mm;
      return {
        outputs: {
          xOuter_mm: { label: 'Vị trí mép ngoài mâm', value: Number(xOuter.toFixed(1)), unit: 'mm' }
        },
        notes: 'Chỉ số càng lớn thì bánh xe nhô ra ngoài cua lốp càng nhiều.'
      };
    }
  },
  {
    id: "DM-064",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Vị trí mép trong mâm",
    formula: "x_inner_mm = W_rim_mm/2+ET_mm",
    desc: "Khoảng cách từ mặt bích lắp mâm vào mép trong cùng hướng về phuộc.",
    warning: "Xét vị trí so với mặt bích lắp mâm.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "W_rim_in",
            "label": "Độ rộng mâm (Rim width)",
            "unit": "inch",
            "defaultVal": 9,
            "step": 0.5
      },
      {
            "key": "ET_mm",
            "label": "Độ lệch Offset (ET)",
            "unit": "mm",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      const wMm = inp.W_rim_in * 25.4;
      const xInner = wMm / 2 + inp.ET_mm;
      return {
        outputs: {
          xInner_mm: { label: 'Vị trí mép trong mâm', value: Number(xInner.toFixed(1)), unit: 'mm' }
        },
        notes: 'Nếu ăn quá sâu vào phía trong dễ cọ vào cây phuộc nhún hoặc thanh rotuyn lái.'
      };
    }
  },
  {
    id: "DM-065",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Backspacing danh nghĩa",
    formula: "BS_mm = W_rim_mm/2+ET_mm",
    desc: "Khoảng cách lọt lòng từ mặt bích lắp đến vành sau của mâm (Backspacing).",
    warning: "Backspacing thực đến vành ngoài còn mép flange.",
    classification: "Mô hình hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "W_rim_in",
            "label": "Bề rộng mâm",
            "unit": "inch",
            "defaultVal": 8.5,
            "step": 0.5
      },
      {
            "key": "ET_mm",
            "label": "Offset ET",
            "unit": "mm",
            "defaultVal": 20,
            "step": 1
      }
],
    calculate: (inp) => {
      const wMm = inp.W_rim_in * 25.4;
      const bsMm = wMm / 2 + inp.ET_mm;
      const bsIn = bsMm / 25.4;
      return {
        outputs: {
          bs_mm: { label: 'Backspacing danh nghĩa', value: Number(bsMm.toFixed(1)), unit: 'mm' },
          bs_inch: { label: 'Backspacing hệ inch', value: Number(bsIn.toFixed(2)), unit: 'inch' }
        },
        notes: 'Backspacing thực tế của mâm còn cộng thêm khoảng ~0.5 inch mép gờ giữ lốp.'
      };
    }
  },
  {
    id: "DM-066",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Độ thay đổi nhô mép ngoài",
    formula: "deltaOuter = (Wnew-Wold)/2-(ETnew-ETold)",
    desc: "Mức độ thò ra ngoài hốc dè của bánh xe khi đổi sang combo mâm mới.",
    warning: "Mép ngoài tăng dương.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "W_old_in",
            "label": "Bề rộng mâm cũ",
            "unit": "inch",
            "defaultVal": 7.5,
            "step": 0.5
      },
      {
            "key": "ET_old",
            "label": "Offset mâm cũ (ET)",
            "unit": "mm",
            "defaultVal": 38,
            "step": 1
      },
      {
            "key": "W_new_in",
            "label": "Bề rộng mâm mới",
            "unit": "inch",
            "defaultVal": 9,
            "step": 0.5
      },
      {
            "key": "ET_new",
            "label": "Offset mâm mới (ET)",
            "unit": "mm",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      const wOld = inp.W_old_in * 25.4;
      const wNew = inp.W_new_in * 25.4;
      const deltaOuter = (wNew - wOld) / 2 - (inp.ET_new - inp.ET_old);
      return {
        outputs: {
          deltaOuter_mm: { label: 'Mép ngoài nhô thêm', value: Number(deltaOuter.toFixed(1)), unit: 'mm' }
        },
        notes: deltaOuter > 30 ? 'Bánh nhô ra ngoài nhiều (>30mm), cần gắn thêm ốp cua lốp (fender flares).' : 'Bánh xe vừa vặn tương đối với mép dè xe.'
      };
    }
  },
  {
    id: "DM-067",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Độ thay đổi ăn sâu mép trong",
    formula: "deltaInner = (Wnew-Wold)/2+(ETnew-ETold)",
    desc: "Mức độ lấn sâu vào phía trong gầm hốc bánh của bộ mâm mới.",
    warning: "Không đảm bảo hết cọ vè/phuộc trong hành trình treo.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "W_old_in",
            "label": "Bề rộng mâm cũ",
            "unit": "inch",
            "defaultVal": 7.5,
            "step": 0.5
      },
      {
            "key": "ET_old",
            "label": "Offset cũ (ET)",
            "unit": "mm",
            "defaultVal": 38,
            "step": 1
      },
      {
            "key": "W_new_in",
            "label": "Bề rộng mâm mới",
            "unit": "inch",
            "defaultVal": 9,
            "step": 0.5
      },
      {
            "key": "ET_new",
            "label": "Offset mới (ET)",
            "unit": "mm",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      const wOld = inp.W_old_in * 25.4;
      const wNew = inp.W_new_in * 25.4;
      const deltaInner = (wNew - wOld) / 2 + (inp.ET_new - inp.ET_old);
      return {
        outputs: {
          deltaInner_mm: { label: 'Mép trong lấn sâu', value: Number(deltaInner.toFixed(1)), unit: 'mm' }
        },
        notes: deltaInner > 15 ? 'Cảnh báo cạ phuộc nhún khi đánh hết lái hoặc khi nhún kịch hành trình.' : 'Khoảng sáng mép trong thông thoáng.'
      };
    }
  },
  {
    id: "DM-068",
    categoryId: "06",
    category: "06 Wheel & Tire",
    targetUser: "Người nâng cấp mâm, lốp, fitment",
    name: "Độ nâng gầm do bán kính lốp",
    formula: "deltaH = (D_new-D_old)/2",
    desc: "Độ nâng sáng gầm xe thực tế thu được nhờ vào việc tăng bán kính lốp.",
    warning: "Bỏ lún lốp và thay đổi hình học hệ treo.",
    classification: "Mô hình hình học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "D_old",
            "label": "Đường kính lốp cũ zin",
            "unit": "mm",
            "defaultVal": 750,
            "step": 5
      },
      {
            "key": "D_new",
            "label": "Đường kính lốp địa hình mới",
            "unit": "mm",
            "defaultVal": 830,
            "step": 5
      }
],
    calculate: (inp) => {
      const deltaH = (inp.D_new - inp.D_old) / 2;
      return {
        outputs: {
          deltaH_mm: { label: 'Khoảng sáng gầm nâng thêm', value: Number(deltaH.toFixed(1)), unit: 'mm' },
          deltaH_cm: { label: 'Quy đổi nâng gầm', value: Number((deltaH / 10).toFixed(1)), unit: 'cm' }
        },
        notes: 'Đây là cách duy nhất nâng trực tiếp khoảng sáng gầm của vỏ cầu vi sai trục cứng.'
      };
    }
  },
  {
    id: "DM-069",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Công suất máy phát DC",
    formula: "Pout_W = Vout*Iout",
    desc: "Công suất điện một chiều phát ra tại cọc B+ của máy phát điện xoay chiều ô tô.",
    warning: "Điểm vận hành thực tế; dòng định mức không luôn đạt ở idle.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "Vout",
            "label": "Điện áp nạp thực tế",
            "unit": "V",
            "defaultVal": 14.4,
            "step": 0.1
      },
      {
            "key": "Iout",
            "label": "Dòng điện máy phát cấp",
            "unit": "A",
            "defaultVal": 390,
            "step": 10
      }
],
    calculate: (inp) => {
      const p = inp.Vout * inp.Iout;
      return {
        outputs: {
          pOutW: { label: 'Công suất DC phát ra', value: Math.round(p), unit: 'W' },
          pOutKw: { label: 'Quy đổi kW', value: Number((p / 1000).toFixed(2)), unit: 'kW' }
        },
        notes: 'Máy phát công suất khủng chuyên dụng cho xe độ âm thanh SPL hoặc xe Mobihome.'
      };
    }
  },
  {
    id: "DM-070",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Công suất cơ trục máy phát",
    formula: "Pin_W = Pout_W/eta_alt",
    desc: "Công suất cơ học động cơ phải truyền qua dây curoa để kéo trục máy phát.",
    warning: "Tổn hao dây đai tính riêng.",
    classification: "Chuẩn cân bằng năng lượng",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "Pout_W",
            "label": "Công suất điện đầu ra",
            "unit": "W",
            "defaultVal": 5616,
            "step": 100
      },
      {
            "key": "eta_alt",
            "label": "Hiệu suất chuyển đổi máy phát",
            "unit": "0..1",
            "defaultVal": 0.65,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const pIn = inp.Pout_W / inp.eta_alt;
      const hp = (pIn / 1000) * 1.34102;
      return {
        outputs: {
          pIn_W: { label: 'Công suất cơ tiêu hao', value: Math.round(pIn), unit: 'W' },
          pIn_HP: { label: 'Mã lực động cơ bị ghì', value: Number(hp.toFixed(1)), unit: 'HP' }
        },
        notes: 'Khi bật full tải điện, máy phát ăn khoảng 10-12 mã lực của động cơ.'
      };
    }
  },
  {
    id: "DM-071",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Mô-men trục máy phát",
    formula: "T_Nm = 60Pin_W/(2pi*n_alt_rpm)",
    desc: "Mô-men xoắn cản trên trục pulley của máy phát điện.",
    warning: "Không bao gồm đỉnh động lực học.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "Pin_W",
            "label": "Công suất cơ trục máy phát",
            "unit": "W",
            "defaultVal": 8640,
            "step": 100
      },
      {
            "key": "n_alt_rpm",
            "label": "Tốc độ quay của trục máy phát",
            "unit": "RPM",
            "defaultVal": 6000,
            "step": 200
      }
],
    calculate: (inp) => {
      const t = (60 * inp.Pin_W) / (2 * Math.PI * inp.n_alt_rpm);
      return {
        outputs: {
          torque_Nm: { label: 'Mô-men xoắn trục máy phát', value: Number(t.toFixed(2)), unit: 'Nm' }
        },
        notes: 'Cần tăng độ căng dây đai curoa để tránh trượt rít khi tải nặng.'
      };
    }
  },
  {
    id: "DM-072",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Tỷ số pulley",
    formula: "ratio = D_crank_eff/D_alt_eff",
    desc: "Tỷ số truyền tốc độ giữa puly trục khuỷu động cơ và puly máy phát điện.",
    warning: "D hiệu dụng dây đai, có thể lệch đường kính ngoài.",
    classification: "Chuẩn động học",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "D_crank_eff",
            "label": "Đường kính puly trục khuỷu",
            "unit": "mm",
            "defaultVal": 150,
            "step": 5
      },
      {
            "key": "D_alt_eff",
            "label": "Đường kính puly máy phát",
            "unit": "mm",
            "defaultVal": 50,
            "step": 2
      }
],
    calculate: (inp) => {
      const ratio = inp.D_crank_eff / inp.D_alt_eff;
      return {
        outputs: {
          ratio: { label: 'Tỷ số truyền puly', value: Number(ratio.toFixed(2)), unit: ': 1' }
        },
        notes: 'Tỷ số truyền ~3.0 giúp máy phát đạt đủ vòng tua sạc lớn ngay cả khi động cơ chạy garanti 800 RPM.'
      };
    }
  },
  {
    id: "DM-073",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "RPM rotor",
    formula: "n_alt = n_engineratio(1-slip_fraction)",
    desc: "Vận tốc quay thực tế của rotor máy phát có tính độ trượt dây đai curoa.",
    warning: "Trượt khác nhau theo tải/tốc độ.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "n_engine",
            "label": "Tua máy động cơ",
            "unit": "RPM",
            "defaultVal": 2000,
            "step": 100
      },
      {
            "key": "ratio",
            "label": "Tỷ số truyền puly",
            "unit": "",
            "defaultVal": 3,
            "step": 0.1
      },
      {
            "key": "slip_fraction",
            "label": "Tỷ lệ trượt đai (0.02 - 0.05)",
            "unit": "0..1",
            "defaultVal": 0.03,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const nAlt = inp.n_engine * inp.ratio * (1 - inp.slip_fraction);
      return {
        outputs: {
          nAlt_rpm: { label: 'Tốc độ quay rotor máy phát', value: Math.round(nAlt), unit: 'RPM' }
        },
        notes: 'Không để rotor vượt quá 18.000 RPM ở tua máy đỏ Redline để bảo vệ vòng bi.'
      };
    }
  },
  {
    id: "DM-074",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Tần số điện stator",
    formula: "f_Hz = pole_count*n_alt/120",
    desc: "Tần số dòng điện xoay chiều sinh ra trong các cuộn dây stator máy phát.",
    warning: "Phụ thuộc số cực, không phải số pha.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "pole_count",
            "label": "Số cực từ trên rotor (thường 12 hoặc 16 cực)",
            "unit": "cực",
            "defaultVal": 12,
            "step": 2
      },
      {
            "key": "n_alt",
            "label": "Tốc độ quay rotor",
            "unit": "RPM",
            "defaultVal": 5820,
            "step": 100
      }
],
    calculate: (inp) => {
      const f = (inp.pole_count * inp.n_alt) / 120;
      return {
        outputs: {
          freq_Hz: { label: 'Tần số điện stator', value: Math.round(f), unit: 'Hz' }
        },
        notes: 'Tần số cao yêu cầu diode chỉnh lưu có tốc độ đáp ứng chuyển mạch nhanh.'
      };
    }
  },
  {
    id: "DM-075",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Công suất ba pha cân bằng",
    formula: "P_W = sqrt(3)V_lineI_line*PF",
    desc: "Công suất điện xoay chiều 3 pha đối xứng trước khi qua cầu diode nắn dòng.",
    warning: "Phải đo trước chỉnh lưu; dòng không sin cần tính công suất thực bằng tích phân.",
    classification: "Chuẩn AC cân bằng",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "V_line",
            "label": "Điện áp hiệu dụng dây",
            "unit": "V",
            "defaultVal": 11.5,
            "step": 0.2
      },
      {
            "key": "I_line",
            "label": "Dòng điện hiệu dụng dây",
            "unit": "A",
            "defaultVal": 180,
            "step": 5
      },
      {
            "key": "PF",
            "label": "Hệ số công suất cosφ",
            "unit": "0..1",
            "defaultVal": 0.9,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const p = Math.sqrt(3) * inp.V_line * inp.I_line * inp.PF;
      return {
        outputs: {
          power_W: { label: 'Công suất 3 pha stator', value: Math.round(p), unit: 'W' }
        },
        notes: 'Công suất AC đo trước giàn diode cầu nắn sang một chiều.'
      };
    }
  },
  {
    id: "DM-076",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Tổn hao đồng stator",
    formula: "P_cu = sum(I_phase_rms^2*R_phase_hot)",
    desc: "Tổn hao nhiệt trên điện trở đồng cuộn dây stator khi chạy hết công suất.",
    warning: "Dùng các pha thực, stator 6 pha phải tính cả 6.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "I_phase_rms",
            "label": "Dòng điện chạy qua mỗi pha stator",
            "unit": "A",
            "defaultVal": 100,
            "step": 5
      },
      {
            "key": "R_phase_hot",
            "label": "Điện trở cuộn dây ở nhiệt độ nóng",
            "unit": "Ohm",
            "defaultVal": 0.015,
            "step": 0.001
      },
      {
            "key": "num_phases",
            "label": "Số pha cuộn dây (3 pha hoặc 6 pha)",
            "unit": "pha",
            "defaultVal": 3,
            "step": 1
      }
],
    calculate: (inp) => {
      const pCu = inp.num_phases * Math.pow(inp.I_phase_rms, 2) * inp.R_phase_hot;
      return {
        outputs: {
          pCu_W: { label: 'Tổn hao nhiệt cuộn stator', value: Math.round(pCu), unit: 'W' }
        },
        notes: 'Nhiệt lượng này được quạt gió tích hợp trên trục máy phát thổi làm mát liên tục.'
      };
    }
  },
  {
    id: "DM-077",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Tổn hao chỉnh lưu xấp xỉ",
    formula: "P_diode_approx = 2VfIdc",
    desc: "Ước tính công suất sinh nhiệt đốt nóng cầu diode chỉnh lưu nắn dòng.",
    warning: "Cầu 3 pha 6 diode, bỏ biến thiên Vf và chuyển mạch.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "Vf",
            "label": "Sụt áp thuận trên mỗi diode (Silicon: ~0.8-1.0V)",
            "unit": "V",
            "defaultVal": 0.85,
            "step": 0.05
      },
      {
            "key": "Idc",
            "label": "Dòng điện DC tổng cấp ra tải",
            "unit": "A",
            "defaultVal": 250,
            "step": 10
      }
],
    calculate: (inp) => {
      const pDiode = 2 * inp.Vf * inp.Idc;
      return {
        outputs: {
          pDiode_W: { label: 'Nhiệt lượng tỏa ra ở cầu diode', value: Math.round(pDiode), unit: 'W' }
        },
        notes: 'Cầu diode tỏa nhiệt hơn 400W rất nóng, cần tấm nhôm tản nhiệt đối lưu tốt.'
      };
    }
  },
  {
    id: "DM-078",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Sụt áp dây chính",
    formula: "dV = IrhoL_loop/A",
    desc: "Sụt áp trên sợi cáp sạc chính từ máy phát về cọc dương ắc quy (Big 3 Upgrade).",
    warning: "Phải chọn ampacity/cầu chì theo điều kiện lắp.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "I",
            "label": "Dòng điện nạp qua cáp",
            "unit": "A",
            "defaultVal": 200,
            "step": 10
      },
      {
            "key": "rho",
            "label": "Điện trở suất đồng",
            "unit": "Ohm.mm²/m",
            "defaultVal": 0.0175,
            "step": 0.001
      },
      {
            "key": "L_loop",
            "label": "Chiều dài dây sạc",
            "unit": "m",
            "defaultVal": 2.5,
            "step": 0.1
      },
      {
            "key": "A",
            "label": "Tiết diện lõi cáp sạc",
            "unit": "mm²",
            "defaultVal": 35,
            "step": 5
      }
],
    calculate: (inp) => {
      const dv = (inp.I * inp.rho * inp.L_loop) / inp.A;
      return {
        outputs: {
          dropVolt: { label: 'Sụt áp trên cáp sạc', value: Number(dv.toFixed(3)), unit: 'V' }
        },
        notes: dv > 0.25 ? 'Nên nâng cấp cáp Big 3 lên 50 mm² (0 AWG) để sạc bình nhanh và mát dây.' : 'Sụt áp cực thấp, tối ưu truyền dẫn dòng lớn.'
      };
    }
  },
  {
    id: "DM-079",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Nhiệt dây điện",
    formula: "P_heat_W = I^2*R_cable",
    desc: "Công suất nhiệt tỏa ra trên thân cáp điện do hiệu ứng Joule.",
    warning: "Không thể suy ra nhiệt độ nếu thiếu truyền nhiệt.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "I",
            "label": "Dòng điện chạy qua dây",
            "unit": "A",
            "defaultVal": 150,
            "step": 10
      },
      {
            "key": "R_cable",
            "label": "Điện trở thuần của đoạn cáp",
            "unit": "Ohm",
            "defaultVal": 0.003,
            "step": 0.0005
      }
],
    calculate: (inp) => {
      const pHeat = Math.pow(inp.I, 2) * inp.R_cable;
      return {
        outputs: {
          pHeat_W: { label: 'Nhiệt sinh ra trên dây', value: Number(pHeat.toFixed(1)), unit: 'W' }
        },
        notes: 'Nhiệt lượng cao kéo dài có thể làm mềm vỏ bọc cách điện gây chập cháy.'
      };
    }
  },
  {
    id: "DM-080",
    categoryId: "07",
    category: "07 Automotive Electrical",
    targetUser: "Thợ điện ô tô, máy phát, cải tạo hệ thống điện",
    name: "Tổng tải điện",
    formula: "I_total_A = sum(P_device_W/eta_device/V_bus)",
    desc: "Tổng dòng điện tiêu thụ toàn tải của các thiết bị gắn thêm trên xe.",
    warning: "Định mức khởi động cao phải tính riêng.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "P_lights",
            "label": "Hệ thống đèn LED bar + Cos pha",
            "unit": "W",
            "defaultVal": 360,
            "step": 20
      },
      {
            "key": "P_audio",
            "label": "Hệ thống âm thanh amply",
            "unit": "W",
            "defaultVal": 800,
            "step": 50
      },
      {
            "key": "P_fridge",
            "label": "Tủ lạnh dã ngoại",
            "unit": "W",
            "defaultVal": 60,
            "step": 5
      },
      {
            "key": "V_bus",
            "label": "Điện áp hệ thống",
            "unit": "V",
            "defaultVal": 13.8,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const totalW = inp.P_lights + inp.P_audio + inp.P_fridge;
      const iTotal = totalW / inp.V_bus;
      return {
        outputs: {
          totalWatts: { label: 'Tổng công suất phụ tải', value: Math.round(totalW), unit: 'W' },
          totalAmps: { label: 'Tổng dòng điện tiêu thụ', value: Number(iTotal.toFixed(1)), unit: 'A' }
        },
        notes: 'Cần đảm bảo máy phát xe cung cấp dòng lớn hơn tổng tải điện này.'
      };
    }
  },
  {
    id: "DM-081",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Điện áp pack S",
    formula: "V_pack = Ns*V_cell_nom",
    desc: "Điện áp danh định của pack pin đóng theo số chuỗi nối tiếp (Series).",
    warning: "Chỉ điện áp danh định, không thay giới hạn BMS.",
    classification: "Chuẩn cấu hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Ns",
            "label": "Số cell nối tiếp (S)",
            "unit": "cell",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "V_cell_nom",
            "label": "Điện áp danh định mỗi cell (LiFePO4: 3.2V, LTO: 2.3V)",
            "unit": "V",
            "defaultVal": 3.2,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const vPack = inp.Ns * inp.V_cell_nom;
      return {
        outputs: {
          vPack_nom: { label: 'Điện áp danh định pack', value: Number(vPack.toFixed(1)), unit: 'V' }
        },
        notes: 'Hệ 4S LiFePO4 cho điện áp 12.8V, tương thích hoàn toàn hệ điện ô tô 12V.'
      };
    }
  },
  {
    id: "DM-082",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Dung lượng pack P",
    formula: "Capacity_Ah = Np*Ah_cell",
    desc: "Tổng dung lượng tích lũy của pack pin đóng theo số nhánh song song (Parallel).",
    warning: "Giả sử cell đồng nhất, cùng SOC.",
    classification: "Chuẩn cấu hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Np",
            "label": "Số cell đấu song song (P)",
            "unit": "nhánh",
            "defaultVal": 2,
            "step": 1
      },
      {
            "key": "Ah_cell",
            "label": "Dung lượng mỗi cell lẻ",
            "unit": "Ah",
            "defaultVal": 100,
            "step": 10
      }
],
    calculate: (inp) => {
      const cap = inp.Np * inp.Ah_cell;
      return {
        outputs: {
          capacityAh: { label: 'Tổng dung lượng pack', value: cap, unit: 'Ah' }
        },
        notes: 'Đấu song song giúp chia tải đều dòng xả cho từng cell pin.'
      };
    }
  },
  {
    id: "DM-083",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Năng lượng danh định pack",
    formula: "E_Wh = NsNpV_cell_nom*Ah_cell",
    desc: "Tổng năng lượng lưu trữ danh định của khối pin đóng theo cấu hình NsNp.",
    warning: "Dựa điện áp danh định, không phản ánh đường cong xả.",
    classification: "Chuẩn cấu hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Ns",
            "label": "Số cell nối tiếp (Ns)",
            "unit": "",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "Np",
            "label": "Số cell song song (Np)",
            "unit": "",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "V_cell_nom",
            "label": "Điện áp danh định cell",
            "unit": "V",
            "defaultVal": 3.2,
            "step": 0.1
      },
      {
            "key": "Ah_cell",
            "label": "Dung lượng cell pin",
            "unit": "Ah",
            "defaultVal": 20,
            "step": 5
      }
],
    calculate: (inp) => {
      const eWh = inp.Ns * inp.Np * inp.V_cell_nom * inp.Ah_cell;
      return {
        outputs: {
          energyWh: { label: 'Tổng năng lượng pack pin', value: Math.round(eWh), unit: 'Wh' },
          energyKwh: { label: 'Quy đổi năng lượng', value: Number((eWh / 1000).toFixed(2)), unit: 'kWh' }
        },
        notes: 'Cấu hình chuẩn phục vụ lưu trữ năng lượng trên ô tô.'
      };
    }
  },
  {
    id: "DM-084",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Dòng xả từ C-rate",
    formula: "I_A = C_rate*Capacity_Ah",
    desc: "Dòng điện xả tối đa cho phép tính từ chỉ số C-rate nhà sản xuất công bố.",
    warning: "Phải rõ continuous/peak và thời gian công bố.",
    classification: "Chuẩn định nghĩa",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "C_rate",
            "label": "Tốc độ xả định mức (C-rate)",
            "unit": "C",
            "defaultVal": 1,
            "step": 0.1
      },
      {
            "key": "Capacity_Ah",
            "label": "Dung lượng pack pin",
            "unit": "Ah",
            "defaultVal": 200,
            "step": 10
      }
],
    calculate: (inp) => {
      const iA = inp.C_rate * inp.Capacity_Ah;
      return {
        outputs: {
          iDischarge_A: { label: 'Dòng xả định mức cho phép', value: Math.round(iA), unit: 'A' }
        },
        notes: 'Xả vượt quá khuyến cáo C-rate sẽ làm sụt áp mạnh và suy giảm tuổi thọ cell.'
      };
    }
  },
  {
    id: "DM-085",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Nội trở pack lý tưởng",
    formula: "Rpack = Rcell*Ns/Np",
    desc: "Tổng nội trở thuần tương đương lý thuyết của khối pack pin đóng.",
    warning: "Bổ sung busbar, tiếp điểm, dây, BMS.",
    classification: "Chuẩn mô hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Rcell_mOhm",
            "label": "Nội trở mỗi cell đơn (mOhm)",
            "unit": "mΩ",
            "defaultVal": 0.35,
            "step": 0.05
      },
      {
            "key": "Ns",
            "label": "Số chuỗi nối tiếp (Ns)",
            "unit": "",
            "defaultVal": 4,
            "step": 1
      },
      {
            "key": "Np",
            "label": "Số nhánh song song (Np)",
            "unit": "",
            "defaultVal": 2,
            "step": 1
      }
],
    calculate: (inp) => {
      const rPackMOhm = (inp.Rcell_mOhm * inp.Ns) / inp.Np;
      return {
        outputs: {
          rPack_mOhm: { label: 'Nội trở lý tưởng pack', value: Number(rPackMOhm.toFixed(3)), unit: 'mΩ' }
        },
        notes: 'Thực tế cần cộng thêm trở kháng tiếp xúc của thanh đồng busbar và mạch BMS (~1-2 mΩ).'
      };
    }
  },
  {
    id: "DM-086",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Sụt áp pack",
    formula: "dV = I*R_total",
    desc: "Độ sụt điện áp trên cọc bình pin khi xả dòng tải tức thời.",
    warning: "Nội trở phụ thuộc SOC, T, xung.",
    classification: "Chuẩn mô hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "I",
            "label": "Dòng điện tải đang kéo",
            "unit": "A",
            "defaultVal": 150,
            "step": 10
      },
      {
            "key": "R_total_mOhm",
            "label": "Tổng nội trở khối pin",
            "unit": "mΩ",
            "defaultVal": 2.5,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const rOhm = inp.R_total_mOhm / 1000;
      const dv = inp.I * rOhm;
      return {
        outputs: {
          deltaV: { label: 'Độ sụt áp tức thời', value: Number(dv.toFixed(2)), unit: 'V' }
        },
        notes: 'Khi kéo dòng lớn, nếu điện áp sụt dưới ngưỡng cắt (Cut-off) thì BMS sẽ ngắt bảo vệ.'
      };
    }
  },
  {
    id: "DM-087",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Công suất sinh nhiệt nội trở",
    formula: "P_heat = I^2*R_total",
    desc: "Công suất sinh nhiệt nội bộ bên trong các cell pin khi xả dòng lớn.",
    warning: "Chưa tính entropy heat và tỏa nhiệt.",
    classification: "Chuẩn mô hình",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "I",
            "label": "Dòng điện xả pin",
            "unit": "A",
            "defaultVal": 120,
            "step": 10
      },
      {
            "key": "R_total_mOhm",
            "label": "Nội trở khối pin",
            "unit": "mΩ",
            "defaultVal": 2,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const rOhm = inp.R_total_mOhm / 1000;
      const pHeat = Math.pow(inp.I, 2) * rOhm;
      return {
        outputs: {
          pHeat_W: { label: 'Công suất tỏa nhiệt nội bộ', value: Number(pHeat.toFixed(1)), unit: 'W' }
        },
        notes: 'Pin đóng trong hộp kín cần có khe đối lưu thông gió để tránh tăng nhiệt độ lõi cell.'
      };
    }
  },
  {
    id: "DM-088",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Thời gian xả dung lượng",
    formula: "t_h = Ah_available/I_mean",
    desc: "Thời gian khối pin duy trì hoạt động ở dòng xả tải trung bình liên tục.",
    warning: "Dòng cao giảm dung lượng sử dụng; BMS cắt trước.",
    classification: "Ước lượng",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Ah_available",
            "label": "Dung lượng khả dụng của pin",
            "unit": "Ah",
            "defaultVal": 180,
            "step": 10
      },
      {
            "key": "I_mean",
            "label": "Dòng điện xả trung bình",
            "unit": "A",
            "defaultVal": 25,
            "step": 5
      }
],
    calculate: (inp) => {
      const tH = inp.Ah_available / inp.I_mean;
      return {
        outputs: {
          time_hours: { label: 'Thời gian xả liên tục', value: Number(tH.toFixed(1)), unit: 'giờ' }
        },
        notes: 'Dòng xả càng cao thì dung lượng thực thu hồi được càng giảm nhẹ theo định luật Peukert.'
      };
    }
  },
  {
    id: "DM-089",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Năng lượng có thể dùng",
    formula: "Eusable = EnomDoDeta_system",
    desc: "Năng lượng thực tế có thể khai thác an toàn sau khi trừ hao tổn hệ thống.",
    warning: "Tính hiệu suất và reserve theo nhiệm vụ.",
    classification: "Ước lượng",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "Enom_Wh",
            "label": "Năng lượng danh định pack pin",
            "unit": "Wh",
            "defaultVal": 2560,
            "step": 100
      },
      {
            "key": "DoD",
            "label": "Độ xả sâu khuyến cáo (DoD)",
            "unit": "0..1",
            "defaultVal": 0.85,
            "step": 0.05
      },
      {
            "key": "eta_system",
            "label": "Hiệu suất chuyển đổi biến tần/dây dẫn",
            "unit": "0..1",
            "defaultVal": 0.92,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const eUsable = inp.Enom_Wh * inp.DoD * inp.eta_system;
      return {
        outputs: {
          eUsable_Wh: { label: 'Năng lượng khả dụng thực tế', value: Math.round(eUsable), unit: 'Wh' },
          eUsable_kWh: { label: 'Quy đổi kWh', value: Number((eUsable / 1000).toFixed(2)), unit: 'kWh' }
        },
        notes: 'Không nên xả cạn 100% dung lượng thường xuyên để giữ tuổi thọ chu kỳ nạp xả.'
      };
    }
  },
  {
    id: "DM-090",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Giới hạn dòng pack",
    formula: "Ilimit = MIN(Icells,I_BMS,I_busbar,I_wire,I_connector)",
    desc: "Xác định giới hạn dòng điện xả an toàn của toàn bộ hệ thống pin (Điểm thắt cổ chai).",
    warning: "Không thay phép tính ngắn mạch và phối hợp bảo vệ.",
    classification: "Quy tắc thiết kế",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "I_cells",
            "label": "Dòng xả tối đa của dàn cell",
            "unit": "A",
            "defaultVal": 300,
            "step": 10
      },
      {
            "key": "I_BMS",
            "label": "Dòng xả định mức của mạch BMS",
            "unit": "A",
            "defaultVal": 200,
            "step": 10
      },
      {
            "key": "I_busbar",
            "label": "Dòng tải tối đa của thanh đồng busbar",
            "unit": "A",
            "defaultVal": 250,
            "step": 10
      },
      {
            "key": "I_wire",
            "label": "Dòng định mức cáp ra cọc",
            "unit": "A",
            "defaultVal": 220,
            "step": 10
      },
      {
            "key": "I_connector",
            "label": "Dòng định mức rắc cắm / cọc nối",
            "unit": "A",
            "defaultVal": 200,
            "step": 10
      }
],
    calculate: (inp) => {
      const iLimit = Math.min(inp.I_cells, inp.I_BMS, inp.I_busbar, inp.I_wire, inp.I_connector);
      return {
        outputs: {
          iLimit_A: { label: 'Giới hạn dòng xả an toàn của pack', value: iLimit, unit: 'A' }
        },
        notes: 'Toàn bộ hệ thống bị giới hạn bởi linh kiện có thông số thấp nhất.'
      };
    }
  },
  {
    id: "DM-091",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Diện tích busbar sơ bộ",
    formula: "A_mm2 = I_design/J_design",
    desc: "Tiết diện thanh đồng busbar tối thiểu dựa trên mật độ dòng điện an toàn.",
    warning: "J không cố định, phải giải bài nhiệt và hệ số lắp đặt.",
    classification: "Ước lượng",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "I_design",
            "label": "Dòng điện xả thiết kế liên tục",
            "unit": "A",
            "defaultVal": 200,
            "step": 10
      },
      {
            "key": "J_design",
            "label": "Mật độ dòng cho phép (Đồng: 3 - 4 A/mm²)",
            "unit": "A/mm²",
            "defaultVal": 3.5,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const a = inp.I_design / inp.J_design;
      return {
        outputs: {
          busbarArea_mm2: { label: 'Tiết diện thanh đồng tối thiểu', value: Number(a.toFixed(1)), unit: 'mm²' }
        },
        notes: 'Ví dụ thanh đồng dày 3mm x rộng 20mm (tiết diện 60 mm²) tải an toàn dòng 200A.'
      };
    }
  },
  {
    id: "DM-092",
    categoryId: "08",
    category: "08 Battery & Storage",
    targetUser: "Người thiết kế pack LiFePO4/Sodium-ion",
    name: "Thời gian sạc CC",
    formula: "t_CC_h = deltaAh/(I_charge*eta_charge)",
    desc: "Thời gian sạc đầy pin trong giai đoạn nạp dòng không đổi CC.",
    warning: "Không gồm pha CV và cân bằng cell.",
    classification: "Ước lượng",
    source1: "https://batteryuniversity.com/learn/article/what_is_the_c_rate",
    source2: "https://www.batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations/",
    inputs: [
      {
            "key": "deltaAh",
            "label": "Dung lượng cần nạp bù",
            "unit": "Ah",
            "defaultVal": 160,
            "step": 10
      },
      {
            "key": "I_charge",
            "label": "Dòng sạc cấp vào",
            "unit": "A",
            "defaultVal": 40,
            "step": 5
      },
      {
            "key": "eta_charge",
            "label": "Hiệu suất nạp",
            "unit": "0..1",
            "defaultVal": 0.95,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const tH = inp.deltaAh / (inp.I_charge * inp.eta_charge);
      return {
        outputs: {
          chargeTime_h: { label: 'Thời gian nạp CC', value: Number(tH.toFixed(1)), unit: 'giờ' }
        },
        notes: 'Giai đoạn CC nạp từ 0% lên khoảng 90-95% dung lượng pin.'
      };
    }
  },
  {
    id: "DM-093",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Ứng suất kéo nén",
    formula: "sigma_Pa = F_N/A_m2",
    desc: "Ứng suất kéo hoặc nén thuần túy sinh ra trong kết cấu cơ khí chịu tải đúng tâm.",
    warning: "Vật liệu tuyến tính, tải đúng tâm.",
    classification: "Chuẩn sức bền",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "F_N",
            "label": "Lực kéo hoặc nén tác dụng",
            "unit": "N",
            "defaultVal": 45000,
            "step": 1000
      },
      {
            "key": "A_mm2",
            "label": "Tiết diện chịu lực",
            "unit": "mm²",
            "defaultVal": 350,
            "step": 10
      }
],
    calculate: (inp) => {
      const aM2 = inp.A_mm2 / 1000000;
      const sigmaPa = inp.F_N / aM2;
      const sigmaMpa = sigmaPa / 1000000;
      return {
        outputs: {
          sigma_MPa: { label: 'Ứng suất kéo/nén', value: Number(sigmaMpa.toFixed(1)), unit: 'MPa' }
        },
        notes: 'Thép SS400 có giới hạn chảy ~235 MPa, thép hợp kim Chromoly 4130 đạt ~460 MPa.'
      };
    }
  },
  {
    id: "DM-094",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Ứng suất uốn",
    formula: "sigma = M*y/I",
    desc: "Ứng suất uốn lớn nhất trên thớ xa nhất của dầm theo mô hình Euler-Bernoulli.",
    warning: "Dầm Euler-Bernoulli; bỏ tập trung ứng suất.",
    classification: "Chuẩn sức bền",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "M_Nm",
            "label": "Mô-men uốn tác dụng",
            "unit": "Nm",
            "defaultVal": 3500,
            "step": 100
      },
      {
            "key": "y_mm",
            "label": "Khoảng cách từ trục trung hòa ra thớ ngoài cùng",
            "unit": "mm",
            "defaultVal": 30,
            "step": 1
      },
      {
            "key": "I_cm4",
            "label": "Mô-men quán tính diện tích mặt cắt (I)",
            "unit": "cm⁴",
            "defaultVal": 45,
            "step": 1
      }
],
    calculate: (inp) => {
      const yM = inp.y_mm / 1000;
      const iM4 = inp.I_cm4 / 100000000;
      const sigmaPa = (inp.M_Nm * yM) / iM4;
      const sigmaMpa = sigmaPa / 1000000;
      return {
        outputs: {
          sigmaBend_MPa: { label: 'Ứng suất uốn lớn nhất', value: Number(sigmaMpa.toFixed(1)), unit: 'MPa' }
        },
        notes: 'Cần giữ hệ số an toàn (Yield Strength / Ứng suất) tối thiểu từ 1.5 - 2.0.'
      };
    }
  },
  {
    id: "DM-095",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Độ võng dầm 2 gối tải giữa",
    formula: "delta = FL^3/(48E*I)",
    desc: "Độ võng uốn lớn nhất tại tâm của dầm gối 2 đầu chịu tải trọng tập trung ở giữa.",
    warning: "Chỉ dầm đơn giản gối hai đầu, tải điểm ở giữa.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "F_N",
            "label": "Tải trọng điểm đặt ở giữa dầm",
            "unit": "N",
            "defaultVal": 8000,
            "step": 500
      },
      {
            "key": "L_m",
            "label": "Chiều dài nhịp dầm",
            "unit": "m",
            "defaultVal": 1.8,
            "step": 0.1
      },
      {
            "key": "E_GPa",
            "label": "Mô-đun đàn hồi vật liệu (Thép: 200 - 210 GPa)",
            "unit": "GPa",
            "defaultVal": 205,
            "step": 5
      },
      {
            "key": "I_cm4",
            "label": "Mô-men quán tính diện tích (I)",
            "unit": "cm⁴",
            "defaultVal": 55,
            "step": 2
      }
],
    calculate: (inp) => {
      const ePa = inp.E_GPa * 1000000000;
      const iM4 = inp.I_cm4 / 100000000;
      const deltaM = (inp.F_N * Math.pow(inp.L_m, 3)) / (48 * ePa * iM4);
      const deltaMm = deltaM * 1000;
      return {
        outputs: {
          deflection_mm: { label: 'Độ võng tại tâm dầm', value: Number(deltaMm.toFixed(2)), unit: 'mm' }
        },
        notes: 'Tiêu chuẩn dầm cơ khí thường khống chế độ võng tối đa < L / 500.'
      };
    }
  },
  {
    id: "DM-096",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Mô-men quán tính ống tròn",
    formula: "I = pi*(D^4-d^4)/64",
    desc: "Mô-men quán tính diện tích mặt cắt ngang ống tròn (dùng chế tạo khung Roll cage).",
    warning: "Mô-men quán tính diện tích quanh tâm.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "D_outer_mm",
            "label": "Đường kính ngoài của ống",
            "unit": "mm",
            "defaultVal": 48,
            "step": 1
      },
      {
            "key": "t_wall_mm",
            "label": "Độ dày thành ống",
            "unit": "mm",
            "defaultVal": 3.2,
            "step": 0.2
      }
],
    calculate: (inp) => {
      const dInner = inp.D_outer_mm - 2 * inp.t_wall_mm;
      const iMm4 = (Math.PI * (Math.pow(inp.D_outer_mm, 4) - Math.pow(dInner, 4))) / 64;
      const iCm4 = iMm4 / 10000;
      return {
        outputs: {
          i_cm4: { label: 'Mô-men quán tính (I)', value: Number(iCm4.toFixed(2)), unit: 'cm⁴' }
        },
        notes: 'Ống đường kính lớn chịu uốn và xoắn vượt trội so với ống nhỏ đặc ruột cùng khối lượng.'
      };
    }
  },
  {
    id: "DM-097",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Khối lượng ống tròn",
    formula: "m = rhopi(D^2-d^2)/4*L",
    desc: "Tính khối lượng ống thép tròn kết cấu dựa trên quy cách và chiều dài.",
    warning: "Ống đồng đều, không trừ lỗ/cắt hàn.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "D_outer_mm",
            "label": "Đường kính ngoài ống",
            "unit": "mm",
            "defaultVal": 48,
            "step": 1
      },
      {
            "key": "t_wall_mm",
            "label": "Độ dày thành ống",
            "unit": "mm",
            "defaultVal": 3.2,
            "step": 0.2
      },
      {
            "key": "L_m",
            "label": "Chiều dài đoạn ống",
            "unit": "m",
            "defaultVal": 6,
            "step": 0.5
      },
      {
            "key": "rho_kgm3",
            "label": "Khối lượng riêng kim loại (Thép: 7850 kg/m³)",
            "unit": "kg/m³",
            "defaultVal": 7850,
            "step": 50
      }
],
    calculate: (inp) => {
      const dInner = inp.D_outer_mm - 2 * inp.t_wall_mm;
      const aM2 = (Math.PI * (Math.pow(inp.D_outer_mm / 1000, 2) - Math.pow(dInner / 1000, 2))) / 4;
      const mKg = inp.rho_kgm3 * aM2 * inp.L_m;
      return {
        outputs: {
          weight_kg: { label: 'Tổng khối lượng ống', value: Number(mKg.toFixed(2)), unit: 'kg' },
          kg_per_meter: { label: 'Khối lượng trên mỗi mét', value: Number((mKg / inp.L_m).toFixed(2)), unit: 'kg/m' }
        },
        notes: 'Phục vụ dự toán trọng lượng tăng thêm khi hàn giàn khung chống lật cho xe đua.'
      };
    }
  },
  {
    id: "DM-098",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Ổn định Euler",
    formula: "Fcr = pi^2EI/(K*L)^2",
    desc: "Tải trọng nén tới hạn gây mất ổn định uốn dọc cột mảnh theo công thức Euler.",
    warning: "Chỉ cột mảnh đàn hồi, không dùng cho cột ngắn.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "E_GPa",
            "label": "Mô-đun đàn hồi vật liệu",
            "unit": "GPa",
            "defaultVal": 205,
            "step": 5
      },
      {
            "key": "I_cm4",
            "label": "Mô-men quán tính diện tích mặt cắt",
            "unit": "cm⁴",
            "defaultVal": 15,
            "step": 1
      },
      {
            "key": "L_m",
            "label": "Chiều dài thanh giằng chống nén",
            "unit": "m",
            "defaultVal": 1.2,
            "step": 0.05
      },
      {
            "key": "K",
            "label": "Hệ số liên kết (2 đầu khớp K=1.0, 1 ngàm 1 khớp K=0.7)",
            "unit": "",
            "defaultVal": 1,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const ePa = inp.E_GPa * 1000000000;
      const iM4 = inp.I_cm4 / 100000000;
      const fCr = (Math.pow(Math.PI, 2) * ePa * iM4) / Math.pow(inp.K * inp.L_m, 2);
      return {
        outputs: {
          fCritical_N: { label: 'Lực nén tới hạn gây cong (Fcr)', value: Math.round(fCr), unit: 'N' },
          fCritical_ton: { label: 'Tương đương tải trọng', value: Number((fCr / 9806.65).toFixed(2)), unit: 'tấn' }
        },
        notes: 'Chỉ áp dụng với thanh có độ mảnh lớn (Slenderness ratio λ > 100).'
      };
    }
  },
  {
    id: "DM-099",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Lực xi lanh thủy lực",
    formula: "F_N = p_PapiD_m^2/4*eta_mech",
    desc: "Lực đẩy thuận ra của xi-lanh thủy lực tác động lên toàn bộ diện tích piston.",
    warning: "Tính phía piston không ty.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "p_bar",
            "label": "Áp suất dầu thủy lực",
            "unit": "bar",
            "defaultVal": 180,
            "step": 5
      },
      {
            "key": "D_piston_mm",
            "label": "Đường kính lòng xi-lanh (Bore)",
            "unit": "mm",
            "defaultVal": 80,
            "step": 5
      },
      {
            "key": "eta_mech",
            "label": "Hiệu suất cơ khí ma sát phốt",
            "unit": "0..1",
            "defaultVal": 0.95,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const pPa = inp.p_bar * 100000;
      const dM = inp.D_piston_mm / 1000;
      const fN = (pPa * Math.PI * Math.pow(dM, 2) / 4) * inp.eta_mech;
      return {
        outputs: {
          forcePush_N: { label: 'Lực đẩy xi-lanh', value: Math.round(fN), unit: 'N' },
          forcePush_ton: { label: 'Sức nâng tương đương', value: Number((fN / 9806.65).toFixed(2)), unit: 'tấn' }
        },
        notes: 'Áp dụng cho ty nâng kích ben thủy lực thùng hàng xe bán tải.'
      };
    }
  },
  {
    id: "DM-100",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Lực phía ty xi lanh",
    formula: "F_N = p_Papi(D_m^2-drod_m^2)/4*eta_mech",
    desc: "Lực kéo lùi về của xi-lanh thủy lực phía có ty (bị trừ bớt diện tích ty cần).",
    warning: "Giả định áp phía đối diện = 0 (gauge).",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "p_bar",
            "label": "Áp suất dầu thủy lực",
            "unit": "bar",
            "defaultVal": 180,
            "step": 5
      },
      {
            "key": "D_piston_mm",
            "label": "Đường kính lòng xi-lanh",
            "unit": "mm",
            "defaultVal": 80,
            "step": 5
      },
      {
            "key": "d_rod_mm",
            "label": "Đường kính cần ty xi-lanh",
            "unit": "mm",
            "defaultVal": 45,
            "step": 2
      },
      {
            "key": "eta_mech",
            "label": "Hiệu suất cơ khí phốt cần",
            "unit": "0..1",
            "defaultVal": 0.95,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const pPa = inp.p_bar * 100000;
      const dM = inp.D_piston_mm / 1000;
      const drodM = inp.d_rod_mm / 1000;
      const fPull = (pPa * Math.PI * (Math.pow(dM, 2) - Math.pow(drodM, 2)) / 4) * inp.eta_mech;
      return {
        outputs: {
          forcePull_N: { label: 'Lực kéo thu xi-lanh', value: Math.round(fPull), unit: 'N' },
          forcePull_ton: { label: 'Sức kéo tương đương', value: Number((fPull / 9806.65).toFixed(2)), unit: 'tấn' }
        },
        notes: 'Lực kéo thu về luôn nhỏ hơn lực đẩy ra do mất diện tích tiết diện ty cần.'
      };
    }
  },
  {
    id: "DM-101",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Công suất thủy lực",
    formula: "P_kW = p_bar*Q_Lmin/600",
    desc: "Công suất cơ thủy lực thuần sinh ra từ áp suất và lưu lượng dòng dầu bơm.",
    warning: "Công suất thủy lực thuần, chia eta để lấy công suất trục.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "p_bar",
            "label": "Áp suất hệ thống thủy lực",
            "unit": "bar",
            "defaultVal": 200,
            "step": 10
      },
      {
            "key": "Q_Lmin",
            "label": "Lưu lượng bơm cấp",
            "unit": "L/phút",
            "defaultVal": 10,
            "step": 1
      }
],
    calculate: (inp) => {
      const pKw = (inp.p_bar * inp.Q_Lmin) / 600;
      return {
        outputs: {
          pKw: { label: 'Công suất thủy lực', value: Number(pKw.toFixed(4)), unit: 'kW' }
        },
        notes: 'Chia thêm cho hiệu suất bơm (~0.85) để tính công suất mô-tơ điện hoặc trích lực PTO kéo bơm.'
      };
    }
  },
  {
    id: "DM-102",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Tốc độ xi lanh",
    formula: "v_mps = Q_m3ps/A_m2",
    desc: "Vận tốc di chuyển của piston xi-lanh thủy lực theo lưu lượng dầu bơm cấp.",
    warning: "Dòng rò giảm tốc độ thực.",
    classification: "Chuẩn liên tục",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "Q_Lmin",
            "label": "Lưu lượng dầu cấp vào xi-lanh",
            "unit": "L/phút",
            "defaultVal": 15,
            "step": 1
      },
      {
            "key": "D_piston_mm",
            "label": "Đường kính lòng xi-lanh",
            "unit": "mm",
            "defaultVal": 63,
            "step": 5
      }
],
    calculate: (inp) => {
      const qM3s = (inp.Q_Lmin / 1000) / 60;
      const aM2 = (Math.PI * Math.pow(inp.D_piston_mm / 1000, 2)) / 4;
      const vMps = qM3s / aM2;
      return {
        outputs: {
          velocity_mps: { label: 'Tốc độ đẩy xi-lanh', value: Number(vMps.toFixed(3)), unit: 'm/s' },
          velocity_mmps: { label: 'Quy đổi tốc độ', value: Number((vMps * 1000).toFixed(1)), unit: 'mm/s' }
        },
        notes: 'Lưu lượng dầu càng cao thì cơ cấu ben nâng hạ càng nhanh.'
      };
    }
  },
  {
    id: "DM-103",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Tuổi thọ vòng bi L10",
    formula: "L10_h = 1e6/(60n_rpm)(C_dyn/P_equiv)^exponent",
    desc: "Tuổi thọ cơ sở L10 của vòng bi trục bánh xe theo chuẩn độ tin cậy ISO 281.",
    warning: "Tuổi thọ 90% reliability ISO 281; thực tế do bôi trơn/nhiễm bẩn.",
    classification: "Chuẩn ISO 281 cơ bản",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "C_dyn_kN",
            "label": "Tải trọng động định mức của vòng bi (C)",
            "unit": "kN",
            "defaultVal": 48,
            "step": 2
      },
      {
            "key": "P_equiv_kN",
            "label": "Tải trọng tương đương tác dụng thực tế (P)",
            "unit": "kN",
            "defaultVal": 12,
            "step": 1
      },
      {
            "key": "n_rpm",
            "label": "Tốc độ quay của moay-ơ trục bánh",
            "unit": "RPM",
            "defaultVal": 850,
            "step": 50
      },
      {
            "key": "is_roller",
            "label": "Loại vòng bi (0: Bi cầu exp=3, 1: Bi đũa/con lăn exp=10/3)",
            "unit": "",
            "defaultVal": 0,
            "step": 1
      }
],
    calculate: (inp) => {
      const p = inp.is_roller === 1 ? 10 / 3 : 3;
      const l10RevMillions = Math.pow(inp.C_dyn_kN / inp.P_equiv_kN, p);
      const l10Hours = (1000000 / (60 * inp.n_rpm)) * l10RevMillions;
      return {
        outputs: {
          l10_hours: { label: 'Tuổi thọ vận hành L10', value: Math.round(l10Hours), unit: 'giờ' },
          l10_km: { label: 'Quãng đường xe chạy ước tính (~70km/h)', value: Math.round(l10Hours * 70), unit: 'km' }
        },
        notes: 'Độ tin cậy 90% trong điều kiện bôi trơn tốt và không bị nước rỉ xâm nhập.'
      };
    }
  },
  {
    id: "DM-104",
    categoryId: "09",
    category: "09 Mechanical & Fabrication",
    targetUser: "Xưởng cơ khí, chế tạo máy, hàn khung",
    name: "Tổn thất áp ống Darcy",
    formula: "dp_Pa = f_D*(L/D_h)(rhov^2/2)",
    desc: "Tổn thất áp suất ma sát thủy lực trong đường ống dẫn chất lỏng theo Darcy-Weisbach.",
    warning: "Dòng ổn định, không nén; thêm tổn thất cục bộ.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/hydraulic-force-calculator-d_1369.html",
    source2: "https://www.engineeringtoolbox.com/hydraulic-pumps-horsepower-d_1464.html",
    inputs: [
      {
            "key": "f_D",
            "label": "Hệ số ma sát Darcy (ống thép nhẵn: 0.02 - 0.03)",
            "unit": "",
            "defaultVal": 0.025,
            "step": 0.005
      },
      {
            "key": "L_m",
            "label": "Chiều dài đoạn ống dẫn dầu",
            "unit": "m",
            "defaultVal": 4.5,
            "step": 0.5
      },
      {
            "key": "D_inner_mm",
            "label": "Đường kính trong lòng ống",
            "unit": "mm",
            "defaultVal": 12,
            "step": 1
      },
      {
            "key": "v_mps",
            "label": "Vận tốc dòng chảy trong ống",
            "unit": "m/s",
            "defaultVal": 3.5,
            "step": 0.5
      },
      {
            "key": "rho_oil",
            "label": "Mật độ khối lượng dầu nhớt",
            "unit": "kg/m³",
            "defaultVal": 870,
            "step": 10
      }
],
    calculate: (inp) => {
      const dM = inp.D_inner_mm / 1000;
      const dpPa = inp.f_D * (inp.L_m / dM) * (inp.rho_oil * Math.pow(inp.v_mps, 2) / 2);
      const dpBar = dpPa / 100000;
      return {
        outputs: {
          drop_bar: { label: 'Tổn thất áp lực đường ống', value: Number(dpBar.toFixed(2)), unit: 'bar' }
        },
        notes: 'Vận tốc đường ống dầu thủy lực cao áp nên giữ dưới 4 - 5 m/s để hạn chế tạo nhiệt.'
      };
    }
  },
  {
    id: "DM-105",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Công suất mô-tơ",
    formula: "P_kW = T_Nm*n_rpm/9549.2966",
    desc: "Tính toán công suất cơ học tại trục mô-tơ điện từ mô-men xoắn và vòng tua.",
    warning: "Công suất cơ tại trục.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "T_Nm",
            "label": "Mô-men xoắn mô-tơ điện",
            "unit": "Nm",
            "defaultVal": 100,
            "step": 5
      },
      {
            "key": "n_rpm",
            "label": "Vòng tua rotor mô-tơ",
            "unit": "RPM",
            "defaultVal": 3000,
            "step": 100
      }
],
    calculate: (inp) => {
      const pKw = (inp.T_Nm * inp.n_rpm) / 9549.2966;
      return {
        outputs: {
          pKw: { label: 'Công suất cơ học trục mô-tơ', value: Number(pKw.toFixed(4)), unit: 'kW' }
        },
        notes: 'Mô-tơ điện đạt mô-men xoắn cực đại ngay từ 0 RPM giúp xe đề pa cực nhanh.'
      };
    }
  },
  {
    id: "DM-106",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Mô-men mô-tơ",
    formula: "T_Nm = 9549.2966*P_kW/n_rpm",
    desc: "Mô-men xoắn sinh ra trên trục mô-tơ điện ở mức công suất và tốc độ xác định.",
    warning: "n>0; mô-men ở 0 rpm cần đường đặc tính riêng.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "P_kW",
            "label": "Công suất mô-tơ điện",
            "unit": "kW",
            "defaultVal": 150,
            "step": 10
      },
      {
            "key": "n_rpm",
            "label": "Tốc độ quay hiện tại",
            "unit": "RPM",
            "defaultVal": 4500,
            "step": 100
      }
],
    calculate: (inp) => {
      const t = (9549.2966 * inp.P_kW) / inp.n_rpm;
      return {
        outputs: {
          torque_Nm: { label: 'Mô-men xoắn đầu ra', value: Number(t.toFixed(1)), unit: 'Nm' }
        },
        notes: 'Ở dải tua cao trên tốc độ cơ bản (Field Weakening), mô-men xoắn sẽ giảm dần theo tốc độ.'
      };
    }
  },
  {
    id: "DM-107",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Công suất DC inverter vào",
    formula: "Pdc_W = Pmech_W/eta_drivetrain",
    desc: "Công suất điện một chiều từ khối pin cao áp kéo vào Inverter điều khiển biến tần.",
    warning: "Gộp inverter + motor theo định nghĩa eta.",
    classification: "Chuẩn cân bằng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Pmech_W",
            "label": "Công suất cơ học đầu ra tại bánh/mô-tơ",
            "unit": "W",
            "defaultVal": 120000,
            "step": 5000
      },
      {
            "key": "eta_drivetrain",
            "label": "Hiệu suất tổng chuỗi (Inverter + Motor + Hộp giảm tốc)",
            "unit": "0..1",
            "defaultVal": 0.91,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const pDc = inp.Pmech_W / inp.eta_drivetrain;
      return {
        outputs: {
          pDc_kW: { label: 'Công suất DC pin phải cấp', value: Number((pDc / 1000).toFixed(1)), unit: 'kW' }
        },
        notes: 'Hiệu suất hệ truyền động điện vượt trội so với động cơ đốt trong (~30-40%).'
      };
    }
  },
  {
    id: "DM-108",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Dòng DC bus",
    formula: "Idc_A = Pdc_W/Vdc",
    desc: "Dòng điện DC chạy trên thanh cái Busbar cao áp giữa Pack pin và Inverter.",
    warning: "Giá trị trung bình, dòng ripple phải xét riêng.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Pdc_kW",
            "label": "Công suất DC Inverter tiêu thụ",
            "unit": "kW",
            "defaultVal": 130,
            "step": 5
      },
      {
            "key": "Vdc",
            "label": "Điện áp danh định DC Bus",
            "unit": "V",
            "defaultVal": 400,
            "step": 10
      }
],
    calculate: (inp) => {
      const pDcW = inp.Pdc_kW * 1000;
      const iDc = pDcW / inp.Vdc;
      return {
        outputs: {
          iDc_A: { label: 'Dòng điện DC Bus cao áp', value: Math.round(iDc), unit: 'A' }
        },
        notes: 'Hệ kiến trúc 800V giúp giảm 1 nửa cường độ dòng điện so với hệ 400V, dây dẫn nhỏ mát hơn.'
      };
    }
  },
  {
    id: "DM-109",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Năng lượng pack",
    formula: "E_kWh = Vnom*Capacity_Ah/1000",
    desc: "Tổng năng lượng danh định lưu trữ của pack pin cao áp xe điện (Traction Battery).",
    warning: "Năng lượng danh định.",
    classification: "Chuẩn cấu hình",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Vnom",
            "label": "Điện áp danh định pack pin",
            "unit": "V",
            "defaultVal": 384,
            "step": 10
      },
      {
            "key": "Capacity_Ah",
            "label": "Dung lượng pack pin",
            "unit": "Ah",
            "defaultVal": 180,
            "step": 10
      }
],
    calculate: (inp) => {
      const eKwh = (inp.Vnom * inp.Capacity_Ah) / 1000;
      return {
        outputs: {
          energy_kWh: { label: 'Tổng năng lượng pack pin', value: Number(eKwh.toFixed(1)), unit: 'kWh' }
        },
        notes: 'Dung lượng pin tiêu chuẩn cho quãng đường di chuyển ~400 - 500 km.'
      };
    }
  },
  {
    id: "DM-110",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Tiêu hao điện",
    formula: "EC_Whkm = E_used_Wh/distance_km",
    desc: "Mức tiêu thụ năng lượng điện năng bình quân trên mỗi km di chuyển.",
    warning: "So sánh cùng chu trình chạy.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "E_used_kWh",
            "label": "Năng lượng điện tiêu thụ trong chuyến đi",
            "unit": "kWh",
            "defaultVal": 18.5,
            "step": 0.5
      },
      {
            "key": "distance_km",
            "label": "Quãng đường xe đã đi",
            "unit": "km",
            "defaultVal": 110,
            "step": 5
      }
],
    calculate: (inp) => {
      const whKm = (inp.E_used_kWh * 1000) / inp.distance_km;
      const kwh100km = inp.E_used_kWh * (100 / inp.distance_km);
      return {
        outputs: {
          ec_Whkm: { label: 'Tiêu hao năng lượng', value: Number(whKm.toFixed(1)), unit: 'Wh/km' },
          ec_kWh100km: { label: 'Quy đổi theo 100km', value: Number(kwh100km.toFixed(1)), unit: 'kWh/100km' }
        },
        notes: 'Xe điện sedan cỡ vừa thường tiêu hao khoảng 140 - 170 Wh/km trong đô thị.'
      };
    }
  },
  {
    id: "DM-111",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Tầm chạy lý thuyết",
    formula: "Range_km = Eusable_Wh/EC_Whkm",
    desc: "Tầm hoạt động lý thuyết còn lại của xe điện theo dung lượng pin khả dụng.",
    warning: "Không coi là WLTP/EPA.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Eusable_kWh",
            "label": "Năng lượng pin còn lại trong bình",
            "unit": "kWh",
            "defaultVal": 60,
            "step": 2
      },
      {
            "key": "EC_Whkm",
            "label": "Mức tiêu hao bình quân của phong cách lái",
            "unit": "Wh/km",
            "defaultVal": 165,
            "step": 5
      }
],
    calculate: (inp) => {
      const eUsableWh = inp.Eusable_kWh * 1000;
      const range = eUsableWh / inp.EC_Whkm;
      return {
        outputs: {
          range_km: { label: 'Quãng đường xe đi được', value: Math.round(range), unit: 'km' }
        },
        notes: 'Bật điều hòa lạnh sâu hoặc chạy tốc độ cao trên cao tốc sẽ làm giảm tầm chạy thực tế.'
      };
    }
  },
  {
    id: "DM-112",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Thời gian sạc công suất cố định",
    formula: "t_h = deltaE_kWh/(P_charge_kW*eta_charge)",
    desc: "Thời gian sạc pin xe điện ở trạm sạc nhanh DC công suất cố định.",
    warning: "Thực tế có taper, giới hạn nhiệt, SOC.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "deltaE_kWh",
            "label": "Lượng điện cần sạc bù (ví dụ từ 20% lên 80%)",
            "unit": "kWh",
            "defaultVal": 42,
            "step": 2
      },
      {
            "key": "P_charge_kW",
            "label": "Công suất trụ sạc DC",
            "unit": "kW",
            "defaultVal": 60,
            "step": 10
      },
      {
            "key": "eta_charge",
            "label": "Hiệu suất truyền tải và chuyển đổi",
            "unit": "0..1",
            "defaultVal": 0.93,
            "step": 0.01
      }
],
    calculate: (inp) => {
      const tH = inp.deltaE_kWh / (inp.P_charge_kW * inp.eta_charge);
      const tMin = tH * 60;
      return {
        outputs: {
          time_hours: { label: 'Thời gian sạc', value: Number(tH.toFixed(2)), unit: 'giờ' },
          time_minutes: { label: 'Thời gian sạc tính theo phút', value: Math.round(tMin), unit: 'phút' }
        },
        notes: 'Gần đầy 80-90% trạm sạc sẽ tự động hạ dòng sạc (Taper charge) để bảo vệ cell.'
      };
    }
  },
  {
    id: "DM-113",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Công suất phanh tái sinh",
    formula: "Pregen_W = F_brake_Nv_mpseta_regen",
    desc: "Công suất thu hồi điện năng chuyển đổi về pin khi phanh tái sinh (Regenerative braking).",
    warning: "Bị giới hạn bởi độ bám, motor/inverter, SOC.",
    classification: "Mô hình ước lượng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "F_brake_N",
            "label": "Lực hãm phanh điện từ mô-tơ",
            "unit": "N",
            "defaultVal": 3200,
            "step": 100
      },
      {
            "key": "v_mps",
            "label": "Vận tốc xe khi bắt đầu giảm tốc",
            "unit": "m/s",
            "defaultVal": 18,
            "step": 1
      },
      {
            "key": "eta_regen",
            "label": "Hiệu suất thu hồi điện năng",
            "unit": "0..1",
            "defaultVal": 0.82,
            "step": 0.02
      }
],
    calculate: (inp) => {
      const pRegenW = inp.F_brake_N * inp.v_mps * inp.eta_regen;
      const pKw = pRegenW / 1000;
      return {
        outputs: {
          pRegen_kW: { label: 'Công suất nạp tái sinh', value: Number(pKw.toFixed(1)), unit: 'kW' }
        },
        notes: 'Phanh tái sinh bị hạn chế nếu pin đang ở trạng thái 100% đầy hoặc quá lạnh.'
      };
    }
  },
  {
    id: "DM-114",
    categoryId: "10",
    category: "10 EV & Hybrid",
    targetUser: "Người thiết kế xe điện, hybrid retrofit",
    name: "Nhiệt cần thải hệ truyền động",
    formula: "Qdot_W = Pin_W-Pout_W",
    desc: "Lượng nhiệt tổn hao cần giải tỏa ra môi trường của toàn bộ cụm truyền động điện.",
    warning: "Không tự suy ra diện tích radiator nếu thiếu điều kiện trao đổi nhiệt.",
    classification: "Chuẩn cân bằng",
    source1: "https://www.engineeringtoolbox.com/angular-velocity-acceleration-power-torque-d_1397.html",
    source2: "https://www.engineeringtoolbox.com/electrical-motors-hp-torque-rpm-d_1503.html",
    inputs: [
      {
            "key": "Pin_kW",
            "label": "Công suất điện đầu vào Inverter",
            "unit": "kW",
            "defaultVal": 120,
            "step": 5
      },
      {
            "key": "Pout_kW",
            "label": "Công suất cơ học đầu ra tại bánh",
            "unit": "kW",
            "defaultVal": 105,
            "step": 5
      }
],
    calculate: (inp) => {
      const qDotKw = inp.Pin_kW - inp.Pout_kW;
      return {
        outputs: {
          heatLoss_kW: { label: 'Nhiệt lượng cần tản nhiệt', value: Number(qDotKw.toFixed(1)), unit: 'kW' }
        },
        notes: 'Căn cứ để tính toán lưu lượng bơm nước làm mát và kích thước két tản nhiệt két nước xe điện.'
      };
    }
  },
  {
    id: "DM-115",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Diện tích tấm hình chữ nhật",
    formula: "A_m2 = L_m*W_m",
    desc: "Tính toán diện tích bề mặt tấm kim loại hoặc chi tiết thân vỏ xe hình chữ nhật.",
    warning: "Với bề mặt cong cần đo triển khai/3D.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "L_m",
            "label": "Chiều dài chi tiết",
            "unit": "m",
            "defaultVal": 2.1,
            "step": 0.1
      },
      {
            "key": "W_m",
            "label": "Chiều rộng chi tiết",
            "unit": "m",
            "defaultVal": 1.4,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const a = inp.L_m * inp.W_m;
      return {
        outputs: {
          area_m2: { label: 'Diện tích bề mặt', value: Number(a.toFixed(2)), unit: 'm²' }
        },
        notes: 'Với các bề mặt uốn lượn cong 3D (nắp capo, vè lồi), nên cộng thêm 10-15% diện tích.'
      };
    }
  },
  {
    id: "DM-116",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Thể tích lớp phủ ướt",
    formula: "Vwet_L = A_m2*t_wet_mm",
    desc: "Thể tích màng sơn phủ ướt khi vừa phun xịt lên bề mặt chi tiết xe.",
    warning: "1 m2 x 1 mm = 1 L.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "A_m2",
            "label": "Diện tích cần sơn phủ",
            "unit": "m²",
            "defaultVal": 12,
            "step": 0.5
      },
      {
            "key": "t_wet_mm",
            "label": "Độ dày màng sơn ướt (WFT)",
            "unit": "mm",
            "defaultVal": 0.5,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const vWetL = inp.A_m2 * inp.t_wet_mm;
      return {
        outputs: {
          vWetL: { label: 'Thể tích màng ướt', value: Number(vWetL.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Quy tắc vàng vật lý chất phủ: 1 m² phủ dày 1 mm tương đương đúng 1 Lít sơn.'
      };
    }
  },
  {
    id: "DM-117",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Thể tích lớp khô",
    formula: "Vdry_L = A_m2*t_dry_mm",
    desc: "Thể tích lớp phủ còn lại sau khi dung môi bay hơi hoàn toàn khô cứng.",
    warning: "Không tính mất mát do xịt.",
    classification: "Chuẩn hình học",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "A_m2",
            "label": "Diện tích phủ",
            "unit": "m²",
            "defaultVal": 12,
            "step": 0.5
      },
      {
            "key": "t_dry_mm",
            "label": "Độ dày màng khô yêu cầu (DFT)",
            "unit": "mm",
            "defaultVal": 0.35,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const vDryL = inp.A_m2 * inp.t_dry_mm;
      return {
        outputs: {
          vDry_L: { label: 'Thể tích màng khô', value: Number(vDryL.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Lớp bảo vệ thực tế chống ăn mòn và chống trầy xước đá văng trên thân xe.'
      };
    }
  },
  {
    id: "DM-118",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Độ dày màng khô",
    formula: "DFT_mm = WFT_mm*VS_fraction",
    desc: "Độ dày màng khô thu được tính từ độ dày màng ướt và hàm lượng chất rắn thể tích.",
    warning: "Chỉ khi hàm lượng thể tích rắn VS được nhà sản xuất xác nhận.",
    classification: "Chuẩn vật liệu",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "WFT_mm",
            "label": "Độ dày màng ướt khi đo bằng lược đo",
            "unit": "mm",
            "defaultVal": 0.4,
            "step": 0.05
      },
      {
            "key": "VS_fraction",
            "label": "Hàm lượng thể tích chất rắn rắn (Volume Solids 0..1)",
            "unit": "0..1",
            "defaultVal": 0.65,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const dft = inp.WFT_mm * inp.VS_fraction;
      const dftMicron = dft * 1000;
      return {
        outputs: {
          dft_mm: { label: 'Độ dày màng khô (DFT)', value: Number(dft.toFixed(3)), unit: 'mm' },
          dft_micron: { label: 'Độ dày theo micron', value: Math.round(dftMicron), unit: 'µm' }
        },
        notes: 'Chất phủ Polyurea nguyên chất 100% solids thì màng khô bằng 100% màng ướt.'
      };
    }
  },
  {
    id: "DM-119",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Lượng vật liệu cần mua",
    formula: "Vbuy_L = A_m2DFT_mm/(VS_fractiontransfer_eff)",
    desc: "Khối lượng hoặc thể tích sơn phủ cần mua có tính đến hao hụt khi xịt sơn (Overspray).",
    warning: "Nếu sản phẩm không có dung môi thì VS khác 100% theo công bố.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "A_m2",
            "label": "Diện tích bề mặt cần sơn phủ",
            "unit": "m²",
            "defaultVal": 15,
            "step": 1
      },
      {
            "key": "DFT_mm",
            "label": "Độ dày màng khô mong muốn",
            "unit": "mm",
            "defaultVal": 0.25,
            "step": 0.05
      },
      {
            "key": "VS_fraction",
            "label": "Hàm lượng chất rắn sản phẩm (VS)",
            "unit": "0..1",
            "defaultVal": 0.6,
            "step": 0.05
      },
      {
            "key": "transfer_eff",
            "label": "Hiệu suất súng phun (HVLP: 0.65 - 0.75, Phun gió thường: 0.45)",
            "unit": "0..1",
            "defaultVal": 0.7,
            "step": 0.05
      }
],
    calculate: (inp) => {
      const vBuy = (inp.A_m2 * inp.DFT_mm) / (inp.VS_fraction * inp.transfer_eff);
      return {
        outputs: {
          vBuy_L: { label: 'Lượng sơn cần mua thực tế', value: Number(vBuy.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Nên mua dư thêm 10% phòng trường hợp dặm vá hoặc bám vào mép gờ gầm xe.'
      };
    }
  },
  {
    id: "DM-120",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Pha hai thành phần theo thể tích",
    formula: "VA = Vtotal*rV/(rV+1); VB = Vtotal/(rV+1)",
    desc: "Định lượng thể tích pha trộn keo sơn hai thành phần A và B (Epoxy/Polyurethane/Sơn bóng).",
    warning: "Không dùng nếu hãng quy định tỷ lệ theo khối lượng.",
    classification: "Chuẩn tỷ lệ",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "Vtotal_L",
            "label": "Tổng thể tích hỗn hợp cần pha",
            "unit": "Lít",
            "defaultVal": 5,
            "step": 0.5
      },
      {
            "key": "rV",
            "label": "Tỷ lệ pha theo thể tích (Thành phần A / Thành phần B)",
            "unit": "",
            "defaultVal": 4,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const vb = inp.Vtotal_L / (inp.rV + 1);
      const va = inp.Vtotal_L * (inp.rV / (inp.rV + 1));
      return {
        outputs: {
          va_L: { label: 'Thể tích Thành phần A (Sơn gốc)', value: Number(va.toFixed(2)), unit: 'Lít' },
          vb_L: { label: 'Thể tích Thành phần B (Chất đóng rắn Hardener)', value: Number(vb.toFixed(2)), unit: 'Lít' }
        },
        notes: 'Pha sai tỷ lệ sẽ dẫn đến sơn không đóng rắn hoặc bị giòn nứt bề mặt.'
      };
    }
  },
  {
    id: "DM-121",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Pha theo khối lượng",
    formula: "mA = mtotal*rM/(rM+1); mB = mtotal/(rM+1)",
    desc: "Cân khối lượng thành phần A và B chính xác bằng cân tiểu ly điện tử.",
    warning: "Cần kiểm tra độ nhớt và thời gian pot life.",
    classification: "Chuẩn tỷ lệ",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "mtotal_g",
            "label": "Tổng khối lượng mẻ pha",
            "unit": "gam",
            "defaultVal": 1000,
            "step": 50
      },
      {
            "key": "rM",
            "label": "Tỷ lệ khối lượng A : B",
            "unit": "",
            "defaultVal": 2.5,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const mb = inp.mtotal_g / (inp.rM + 1);
      const ma = inp.mtotal_g * (inp.rM / (inp.rM + 1));
      return {
        outputs: {
          ma_g: { label: 'Khối lượng Thành phần A', value: Math.round(ma), unit: 'gam' },
          mb_g: { label: 'Khối lượng Thành phần B', value: Math.round(mb), unit: 'gam' }
        },
        notes: 'Cân bằng khối lượng chuẩn xác hơn đo thể tích đối với các loại nhựa độ nhớt cao.'
      };
    }
  },
  {
    id: "DM-122",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Khối lượng lớp phủ",
    formula: "m_kg = rho_kgL*Vwet_L",
    desc: "Khối lượng lớp chất lỏng phủ lên thân xe tính từ mật độ thể tích.",
    warning: "Nếu bay hơi chất mang cần mật độ màng khô để tính sau khô.",
    classification: "Chuẩn khối lượng",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "rho_kgL",
            "label": "Khối lượng riêng của sơn lót/phủ",
            "unit": "kg/L",
            "defaultVal": 1.25,
            "step": 0.05
      },
      {
            "key": "Vwet_L",
            "label": "Thể tích sơn ướt phun lên xe",
            "unit": "Lít",
            "defaultVal": 8.5,
            "step": 0.5
      }
],
    calculate: (inp) => {
      const mKg = inp.rho_kgL * inp.Vwet_L;
      return {
        outputs: {
          weight_kg: { label: 'Khối lượng lớp phủ ướt', value: Number(mKg.toFixed(2)), unit: 'kg' }
        },
        notes: 'Sau khi khô một phần khối lượng sẽ bay hơi cùng dung môi hữu cơ VOC.'
      };
    }
  },
  {
    id: "DM-123",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Khối lượng lớp cách âm",
    formula: "m_kg = A_m2*areal_mass_kgm2",
    desc: "Tổng khối lượng tăng thêm sau khi dán các tấm tiêu âm chống ồn (Sound Deadening).",
    warning: "Chưa gồm keo, gá đỡ.",
    classification: "Chuẩn khối lượng",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "A_m2",
            "label": "Diện tích tôn xe được dán tiêu âm (sàn, cửa, nóc)",
            "unit": "m²",
            "defaultVal": 8.5,
            "step": 0.5
      },
      {
            "key": "areal_mass_kgm2",
            "label": "Định lượng khối lượng tấm cách âm (Butyl + foil nhôm)",
            "unit": "kg/m²",
            "defaultVal": 3.8,
            "step": 0.2
      }
],
    calculate: (inp) => {
      const mKg = inp.A_m2 * inp.areal_mass_kgm2;
      return {
        outputs: {
          deadeningWeight_kg: { label: 'Khối lượng dán thêm vào xe', value: Number(mKg.toFixed(1)), unit: 'kg' }
        },
        notes: 'Dán full xe thường làm tăng thêm từ 30 - 45 kg, cần lưu ý tải trọng nếu dán xe đua.'
      };
    }
  },
  {
    id: "DM-124",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Dẫn nhiệt qua tấm",
    formula: "P_W = k_WmKA_m2deltaT_K/L_m",
    desc: "Dòng nhiệt dẫn truyền qua vách kim loại hoặc tấm cách nhiệt thân xe.",
    warning: "Bỏ đối lưu bề mặt và bức xạ.",
    classification: "Chuẩn mô hình",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "k_WmK",
            "label": "Hệ số dẫn nhiệt vật liệu (Bông gốm: 0.04, Nhôm: 205)",
            "unit": "W/m·K",
            "defaultVal": 0.045,
            "step": 0.005
      },
      {
            "key": "A_m2",
            "label": "Diện tích vách truyền nhiệt",
            "unit": "m²",
            "defaultVal": 4.2,
            "step": 0.2
      },
      {
            "key": "deltaT_K",
            "label": "Chênh lệch nhiệt độ giữa ngoài nắng và trong khoang",
            "unit": "°C (K)",
            "defaultVal": 35,
            "step": 2
      },
      {
            "key": "L_m",
            "label": "Độ dày lớp cách nhiệt",
            "unit": "m",
            "defaultVal": 0.025,
            "step": 0.005
      }
],
    calculate: (inp) => {
      const pW = (inp.k_WmK * inp.A_m2 * inp.deltaT_K) / inp.L_m;
      return {
        outputs: {
          heatTransfer_W: { label: 'Dòng nhiệt truyền qua vách', value: Math.round(pW), unit: 'W' }
        },
        notes: 'Vật liệu cách nhiệt tốt làm giảm đáng kể công suất hoạt động của điều hòa ô tô.'
      };
    }
  },
  {
    id: "DM-125",
    categoryId: "11",
    category: "11 Detailing & Bodywork",
    targetUser: "Người sơn phủ, polyurea, cách âm, thân vỏ",
    name: "Giá vật liệu phủ",
    formula: "Cost = volume_L*price_per_L+labor+consumables",
    desc: "Dự toán tổng chi phí vật tư và nhân công thực hiện phủ gầm / dán bảo vệ xe.",
    warning: "Định mức thi công phụ thuộc độ nhám và hao hụt.",
    classification: "Chuẩn kế toán",
    source1: "https://www.engineeringtoolbox.com/conductive-heat-transfer-d_428.html",
    source2: "https://www.engineeringtoolbox.com/heat-transfer-coefficients-exchangers-d_450.html",
    inputs: [
      {
            "key": "volume_L",
            "label": "Lượng sơn / hóa chất tiêu thụ",
            "unit": "Lít",
            "defaultVal": 10,
            "step": 1
      },
      {
            "key": "price_per_L",
            "label": "Đơn giá vật tư trên mỗi Lít",
            "unit": "VNĐ",
            "defaultVal": 450000,
            "step": 10000
      },
      {
            "key": "labor",
            "label": "Chi phí nhân công thợ thi công",
            "unit": "VNĐ",
            "defaultVal": 1800000,
            "step": 100000
      },
      {
            "key": "consumables",
            "label": "Vật tư phụ (Băng keo nilon che chắn, nhám, cồn lau)",
            "unit": "VNĐ",
            "defaultVal": 500000,
            "step": 50000
      }
],
    calculate: (inp) => {
      const cost = inp.volume_L * inp.price_per_L + inp.labor + inp.consumables;
      return {
        outputs: {
          totalCost: { label: 'Tổng chi phí thực hiện', value: cost.toLocaleString('vi-VN'), unit: 'VNĐ' }
        },
        notes: 'Bảng báo giá dự toán tham khảo cho xưởng thi công dịch vụ xe.'
      };
    }
  },
  {
    id: "DM-126",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Quy đổi mô-men",
    formula: "T_Nm = T_lbft*1.3558179483",
    desc: "Quy đổi lực siết bu-lông ốc moay-ơ từ đơn vị lbf.ft (Hệ Anh) sang N.m (Hệ SI).",
    warning: "Không thay hướng dẫn siết theo góc và quy trình hãng.",
    classification: "Chuẩn chuyển đổi",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "T_lbft",
            "label": "Mô-men siết theo tài liệu hãng (lbf.ft)",
            "unit": "lbf·ft",
            "defaultVal": 100,
            "step": 5
      }
],
    calculate: (inp) => {
      const tNm = inp.T_lbft * 1.3558179483;
      return {
        outputs: {
          t_Nm: { label: 'Lực siết quy đổi chuẩn', value: Number(tNm.toFixed(2)), unit: 'N·m' }
        },
        notes: 'Dùng để cài đặt cần siết lực cân lực (Torque wrench) chính xác theo cẩm nang bảo trì.'
      };
    }
  },
  {
    id: "DM-127",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Định luật Ohm",
    formula: "V = I*R",
    desc: "Định luật Ohm cơ bản tính điện áp trên tải điện một chiều.",
    warning: "Nguồn DC/trạng thái ổn định.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "I",
            "label": "Cường độ dòng điện qua tải",
            "unit": "A",
            "defaultVal": 15,
            "step": 1
      },
      {
            "key": "R",
            "label": "Điện trở của thiết bị",
            "unit": "Ohm",
            "defaultVal": 0.8,
            "step": 0.1
      }
],
    calculate: (inp) => {
      const v = inp.I * inp.R;
      return {
        outputs: {
          voltage_V: { label: 'Điện áp rơi trên tải', value: Number(v.toFixed(2)), unit: 'V' }
        },
        notes: 'Công thức nền tảng kiểm tra ngắn mạch hoặc sụt áp chập chờn trên xe.'
      };
    }
  },
  {
    id: "DM-128",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Điện trở tương đương song song",
    formula: "Req = 1/sum(1/Ri)",
    desc: "Tính điện trở tương đương của mạch gồm 3 nhánh phụ tải mắc song song.",
    warning: "Mạch điện trở thuần.",
    classification: "Chuẩn điện",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "r1",
            "label": "Điện trở nhánh 1 (R1)",
            "unit": "Ohm",
            "defaultVal": 10,
            "step": 1
      },
      {
            "key": "r2",
            "label": "Điện trở nhánh 2 (R2)",
            "unit": "Ohm",
            "defaultVal": 15,
            "step": 1
      },
      {
            "key": "r3",
            "label": "Điện trở nhánh 3 (R3)",
            "unit": "Ohm",
            "defaultVal": 30,
            "step": 1
      }
],
    calculate: (inp) => {
      const sumInv = 1 / inp.r1 + 1 / inp.r2 + 1 / inp.r3;
      const req = 1 / sumInv;
      return {
        outputs: {
          req_Ohm: { label: 'Điện trở tương đương toàn mạch', value: Number(req.toFixed(2)), unit: 'Ohm' }
        },
        notes: 'Mạch song song có tổng trở luôn nhỏ hơn điện trở nhánh nhỏ nhất.'
      };
    }
  },
  {
    id: "DM-129",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Lực nâng lý tưởng",
    formula: "F_N = m_kg*9.80665",
    desc: "Lực nâng thẳng đứng tối thiểu cần thiết để kích nhấc khối lượng xe.",
    warning: "Chọn kích theo từng điểm nâng và hệ số an toàn.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "m_kg",
            "label": "Khối lượng phần xe cần nâng",
            "unit": "kg",
            "defaultVal": 1800,
            "step": 50
      }
],
    calculate: (inp) => {
      const fN = inp.m_kg * 9.80665;
      return {
        outputs: {
          liftForce_N: { label: 'Lực nâng cần thiết', value: Math.round(fN), unit: 'N' },
          liftForce_ton: { label: 'Quy đổi tấn lực', value: Number((inp.m_kg / 1000).toFixed(2)), unit: 'tấn' }
        },
        notes: 'Luôn dùng mễ kê phụ (Jack stands) sau khi kích nâng để đảm bảo an toàn tuyệt đối cho thợ.'
      };
    }
  },
  {
    id: "DM-130",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Áp lực xi lanh kích",
    formula: "p_Pa = F_N/A_piston_m2",
    desc: "Áp lực dầu thủy lực sinh ra trong buồng xi-lanh của cầu nâng hoặc con đội.",
    warning: "Chưa kể hiệu suất và ma sát cơ cấu.",
    classification: "Chuẩn thủy lực",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "F_N",
            "label": "Tải trọng nâng trên đầu ty",
            "unit": "N",
            "defaultVal": 25000,
            "step": 1000
      },
      {
            "key": "A_piston_cm2",
            "label": "Diện tích mặt piston kích",
            "unit": "cm²",
            "defaultVal": 38.5,
            "step": 1
      }
],
    calculate: (inp) => {
      const aM2 = inp.A_piston_cm2 / 10000;
      const pPa = inp.F_N / aM2;
      const pBar = pPa / 100000;
      return {
        outputs: {
          pressure_bar: { label: 'Áp suất dầu trong xi-lanh', value: Number(pBar.toFixed(1)), unit: 'bar' }
        },
        notes: 'Kiểm tra van an toàn xả áp (Relief valve) của kích xem có chịu được áp suất này không.'
      };
    }
  },
  {
    id: "DM-131",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Công suất trục",
    formula: "P_kW = T_Nm*n_rpm/9549.2966",
    desc: "Tính toán công suất cơ hữu ích của động cơ hoặc hộp số tại trục đo kiểm dynamo.",
    warning: "Đúng nếu cùng điểm đo.",
    classification: "Chuẩn cơ học",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "T_Nm",
            "label": "Mô-men xoắn ghi nhận",
            "unit": "Nm",
            "defaultVal": 520,
            "step": 10
      },
      {
            "key": "n_rpm",
            "label": "Tốc độ vòng quay trục đo",
            "unit": "RPM",
            "defaultVal": 3200,
            "step": 100
      }
],
    calculate: (inp) => {
      const pKw = (inp.T_Nm * inp.n_rpm) / 9549.2966;
      const hp = pKw * 1.34102;
      return {
        outputs: {
          power_kW: { label: 'Công suất trục', value: Number(pKw.toFixed(1)), unit: 'kW' },
          power_HP: { label: 'Mã lực trục', value: Number(hp.toFixed(1)), unit: 'HP' }
        },
        notes: 'Được áp dụng để kiểm tra công suất xe trên bàn chạy thử nghiệm Dyno bánh xe.'
      };
    }
  },
  {
    id: "DM-132",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Tiêu hao nhiên liệu",
    formula: "Lper100km = 100*liters_used/distance_km",
    desc: "Mức tiêu hao nhiên liệu trung bình của xe sau hành trình chạy thực tế.",
    warning: "Không tính sai số đồng hồ nhiên liệu.",
    classification: "Chuẩn định nghĩa",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "liters_used",
            "label": "Số lít xăng/dầu tiêu thụ",
            "unit": "Lít",
            "defaultVal": 65,
            "step": 1
      },
      {
            "key": "distance_km",
            "label": "Quãng đường xe đã đi được",
            "unit": "km",
            "defaultVal": 720,
            "step": 10
      }
],
    calculate: (inp) => {
      const l100 = (100 * inp.liters_used) / inp.distance_km;
      const kmPerL = inp.distance_km / inp.liters_used;
      return {
        outputs: {
          lPer100km: { label: 'Mức tiêu hao', value: Number(l100.toFixed(2)), unit: 'L/100km' },
          kmPerLiter: { label: 'Số km đi được mỗi lít', value: Number(kmPerL.toFixed(2)), unit: 'km/L' }
        },
        notes: 'Phương pháp đo chuẩn xác nhất bằng cách đổ đầy bình xăng (Full-to-full test).'
      };
    }
  },
  {
    id: "DM-133",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Phạm vi chạy còn lại",
    formula: "Range_km = tank_usable_L*100/Lper100km",
    desc: "Phạm vi hành trình ước tính xe còn có thể đi tiếp trước khi cạn bình xăng.",
    warning: "Điều kiện lái không đổi.",
    classification: "Ước lượng",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "tank_usable_L",
            "label": "Số lít nhiên liệu còn lại trong thùng",
            "unit": "Lít",
            "defaultVal": 45,
            "step": 2
      },
      {
            "key": "Lper100km",
            "label": "Mức ăn xăng bình quân của xe",
            "unit": "L/100km",
            "defaultVal": 8.5,
            "step": 0.2
      }
],
    calculate: (inp) => {
      const range = (inp.tank_usable_L * 100) / inp.Lper100km;
      return {
        outputs: {
          remainingRange_km: { label: 'Tầm hoạt động còn lại', value: Math.round(range), unit: 'km' }
        },
        notes: 'Nên trừ hao 50 km an toàn để kịp ghé cây xăng tiếp theo trên quốc lộ.'
      };
    }
  },
  {
    id: "DM-134",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Phí nhiên liệu/km",
    formula: "cost_per_km = Lper100km/100*price_per_L",
    desc: "Chi phí tiền xăng hoặc dầu trên mỗi 1 km xe di chuyển trên đường.",
    warning: "Chưa bao gồm dầu, sửa chữa và khấu hao.",
    classification: "Chuẩn kế toán",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "Lper100km",
            "label": "Mức tiêu hao nhiên liệu của xe",
            "unit": "L/100km",
            "defaultVal": 8,
            "step": 0.5
      },
      {
            "key": "price_per_L",
            "label": "Đơn giá xăng/dầu tại trụ bơm",
            "unit": "VNĐ/Lít",
            "defaultVal": 25000,
            "step": 500
      }
],
    calculate: (inp) => {
      const costKm = (inp.Lper100km / 100) * inp.price_per_L;
      return {
        outputs: {
          costPerKm: { label: 'Chi phí tiền xăng trên mỗi km', value: Math.round(costKm), unit: 'đ / km' },
          costPer1000Km: { label: 'Chi phí cho 1.000 km', value: (Math.round(costKm) * 1000).toLocaleString('vi-VN'), unit: 'VNĐ' }
        },
        notes: 'Căn cứ quan trọng để tính toán chi phí công tác hoặc hạch toán chạy xe dịch vụ.'
      };
    }
  },
  {
    id: "DM-135",
    categoryId: "12",
    category: "12 Garage & Maintenance",
    targetUser: "Thợ máy, bảo trì, quản lý vận hành",
    name: "Chi phí bảo dưỡng/km",
    formula: "maint_cost_per_km = sum(service_cost)/distance_interval_km",
    desc: "Chi phí bảo trì, thay nhớt bảo dưỡng định kỳ tính bình quân trên mỗi km.",
    warning: "Không tính sửa chữa đột xuất.",
    classification: "Chuẩn kế toán",
    source1: "https://www.engineeringtoolbox.com/voltage-drop-d_1550.html",
    source2: "https://www.engineeringtoolbox.com/electrical-power-d_1570.html",
    inputs: [
      {
            "key": "total_service_cost",
            "label": "Tổng hóa đơn bảo dưỡng kỳ này (nhớt, lọc, bảo dưỡng)",
            "unit": "VNĐ",
            "defaultVal": 2800000,
            "step": 100000
      },
      {
            "key": "distance_interval_km",
            "label": "Chu kỳ bảo dưỡng khuyến cáo",
            "unit": "km",
            "defaultVal": 10000,
            "step": 1000
      }
],
    calculate: (inp) => {
      const costKm = inp.total_service_cost / inp.distance_interval_km;
      return {
        outputs: {
          maintCostPerKm: { label: 'Phí bảo dưỡng bình quân', value: Math.round(costKm), unit: 'đ / km' }
        },
        notes: 'Giúp chủ xe lên kế hoạch dự trù chi phí vận hành xe dài hạn minh bạch.'
      };
    }
  }
];
