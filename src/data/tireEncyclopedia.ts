// Dữ liệu tra cứu toàn diện theo tài liệu "Thông số lốp.md" của DeepM

// 9.1. Chỉ số tải trọng chuẩn quốc tế (Load Index - Li) từ 60 đến 130
export const LOAD_INDEX_TABLE: Record<number, number> = {
  60: 250, 61: 257, 62: 265, 63: 272, 64: 280,
  65: 290, 66: 300, 67: 307, 68: 315, 69: 325,
  70: 335, 71: 345, 72: 355, 73: 365, 74: 375,
  75: 387, 76: 397, 77: 412, 78: 425, 79: 437,
  80: 450, 81: 462, 82: 475, 83: 487, 84: 500,
  85: 515, 86: 530, 87: 545, 88: 560, 89: 580,
  90: 600, 91: 615, 92: 630, 93: 650, 94: 670,
  95: 690, 96: 710, 97: 730, 98: 750, 99: 775,
  100: 800, 101: 825, 102: 850, 103: 875, 104: 900,
  105: 925, 106: 950, 107: 975, 108: 1000, 109: 1030,
  110: 1060, 111: 1090, 112: 1120, 113: 1150, 114: 1180,
  115: 1215, 116: 1250, 117: 1285, 118: 1320, 119: 1360,
  120: 1400, 121: 1450, 122: 1500, 123: 1550, 124: 1600,
  125: 1650, 126: 1700, 127: 1750, 128: 1800, 129: 1850,
  130: 1900
};

// 9.2. Chỉ số giới hạn tốc độ chuẩn quốc tế (Speed Rating)
export const SPEED_RATING_TABLE: Record<string, { speedKmH: number; desc: string }> = {
  L: { speedKmH: 120, desc: 'Xe tải nhẹ chuyên dụng, xe công trình' },
  M: { speedKmH: 130, desc: 'Lốp dự phòng tạm thời (khuyến nghị chạy <= 80 km/h)' },
  N: { speedKmH: 140, desc: 'Lốp dự phòng, xe tải nhỏ' },
  P: { speedKmH: 150, desc: 'Xe đô thị cỡ nhỏ' },
  Q: { speedKmH: 160, desc: 'Xe địa hình 4x4, lốp mùa đông' },
  R: { speedKmH: 170, desc: 'Xe bán tải, xe địa hình SUV' },
  S: { speedKmH: 180, desc: 'Xe sedan / hatchback phổ thông' },
  T: { speedKmH: 190, desc: 'Sedan, MPV, Crossover gia đình' },
  U: { speedKmH: 200, desc: 'Xe sedan phân khúc tầm trung' },
  H: { speedKmH: 210, desc: 'Sedan / SUV hiệu năng vừa' },
  V: { speedKmH: 240, desc: 'Sedan / SUV công suất cao' },
  Z: { speedKmH: 240, desc: 'Lốp hiệu năng cao trên 240 km/h (Chuẩn ZR)' },
  W: { speedKmH: 270, desc: 'Xe thể thao hiệu năng cao' },
  Y: { speedKmH: 300, desc: 'Siêu xe thể thao cao cấp' },
  '(Y)': { speedKmH: 320, desc: 'Siêu xe đặc biệt vận tốc trên 300 km/h' }
};

// 3.1. Phân loại loại lốp
export const VEHICLE_TYPE_MAP: Record<string, string> = {
  P: 'Passenger (Xe du lịch, sedan, hatchback, crossover gia đình - P-Metric)',
  LT: 'Light Truck (Xe bán tải, SUV khung gầm rời, xe tải nhẹ)',
  ST: 'Special Trailer (Xe đầu kéo, rơ-moóc chuyên dụng)',
  T: 'Temporary (Lốp thay thế dự phòng khẩn cấp)',
  C: 'Commercial (Xe thương mại chở khách, xe tải van)',
  HL: 'High Load Capacity (Chuẩn lốp chịu tải cực cao dành riêng cho xe điện & SUV pin lớn)'
};

// Phân hạng tải trọng và số lớp bố (Load Range / Ply Rating)
export const LOAD_RANGE_TABLE: Record<string, { plyRating: string; desc: string }> = {
  B: { plyRating: '4 PR', desc: 'Tải nhẹ tiêu chuẩn (Standard Load, 4 lớp bố)' },
  C: { plyRating: '6 PR', desc: 'Tải trung bình, SUV nhẹ (6 lớp bố)' },
  D: { plyRating: '8 PR', desc: 'Tải nặng, bán tải & SUV việt dã (8 lớp bố)' },
  E: { plyRating: '10 PR', desc: 'Tải cực nặng (10 lớp bố / 10 PR), áp suất cao đến 80 PSI, thành hông gia cố chống chém đá sỏi' },
  F: { plyRating: '12 PR', desc: 'Tải thương mại siêu trọng (12 lớp bố)' }
};

// Ký hiệu hãng xe nguyên gốc (Original Equipment - OE Markings)
export const OE_MARKINGS: Record<string, { brand: string; note: string }> = {
  N0: { brand: 'Porsche', note: 'Thiết kế riêng cho Porsche thế hệ 1' },
  N1: { brand: 'Porsche', note: 'Thiết kế riêng cho Porsche thế hệ 2' },
  N2: { brand: 'Porsche', note: 'Thiết kế riêng cho Porsche thế hệ 3' },
  N3: { brand: 'Porsche', note: 'Thiết kế riêng cho Porsche thế hệ 4' },
  N4: { brand: 'Porsche', note: 'Thiết kế riêng cho Porsche thế hệ 5' },
  NA0: { brand: 'Porsche', note: 'Thiết kế OEM cho Porsche 911 (992) / Taycan' },
  NF0: { brand: 'Porsche', note: 'Thiết kế OEM cho Porsche Taycan EV' },
  N: { brand: 'Porsche', note: 'Dòng lốp OEM chuẩn cho Porsche' },
  K1: { brand: 'Ferrari', note: 'Dòng lốp OEM chuẩn cho Ferrari' },
  K2: { brand: 'Ferrari', note: 'Dòng lốp OEM chuẩn cho Ferrari thế hệ mới' },
  T0: { brand: 'Tesla', note: 'Lốp OEM chuẩn Tesla (tích hợp mút tiêu âm Acoustic Foam)' },
  T1: { brand: 'Tesla', note: 'Lốp OEM Tesla thế hệ tinh chỉnh thứ 2' },
  T2: { brand: 'Tesla', note: 'Lốp OEM Tesla thế hệ tinh chỉnh thứ 3' },
  MO: { brand: 'Mercedes-Benz', note: 'Mercedes Original - Tiêu chuẩn xuất xưởng Mercedes' },
  MOE: { brand: 'Mercedes-Benz', note: 'Mercedes Original Extended (Lốp Run-flat của Mercedes)' },
  '*': { brand: 'BMW / Mini', note: 'Dấu sao chứng nhận tiêu chuẩn hãng BMW' },
  STAR: { brand: 'BMW / Mini', note: 'Dấu sao chứng nhận tiêu chuẩn hãng BMW (ký hiệu chữ)' },
  RSC: { brand: 'BMW', note: 'Runflat System Component - Tiêu chuẩn lốp chống xịt chính hãng BMW' },
  AO: { brand: 'Audi', note: 'Audi Original - Tiêu chuẩn xuất xưởng Audi' },
  RO1: { brand: 'Audi Sport', note: 'Dành riêng cho các dòng Audi RS thể thao' },
  J: { brand: 'Jaguar', note: 'Thiết kế tiêu chuẩn riêng của Jaguar' },
  LR: { brand: 'Land Rover', note: 'Thiết kế tối ưu cho Range Rover & Land Rover' },
  VO: { brand: 'Volvo', note: 'Tiêu chuẩn OEM xe Volvo Thụy Điển' },
  FO: { brand: 'Ford', note: 'Tiêu chuẩn xuất xưởng Ford Performance' },
  TO: { brand: 'Toyota', note: 'Tiêu chuẩn xuất xưởng Toyota OEM' }
};

// Ký hiệu địa hình & công nghệ gai lốp
export const TERRAIN_TECH_SPECS: Record<string, { name: string; desc: string }> = {
  'H/T': { name: 'Highway Terrain', desc: 'Chuyên chạy đường nhựa cao tốc, êm ái, cách âm tốt, ít cản lăn.' },
  'HT': { name: 'Highway Terrain', desc: 'Chuyên chạy đường nhựa cao tốc, êm ái, cách âm tốt, ít cản lăn.' },
  'A/T': { name: 'All Terrain', desc: 'Đa địa hình (50% đường nhựa, 50% đường xấu, đèo dốc sỏi đá nhẹ).' },
  'AT': { name: 'All Terrain', desc: 'Đa địa hình (50% đường nhựa, 50% đường xấu, đèo dốc sỏi đá nhẹ).' },
  'M/T': { name: 'Mud Terrain', desc: 'Chuyên lội bùn sâu, rãnh gai to bản, chống trượt địa hình gồ ghề cực đoan.' },
  'MT': { name: 'Mud Terrain', desc: 'Chuyên lội bùn sâu, rãnh gai to bản, chống trượt địa hình gồ ghề cực đoan.' },
  'R/T': { name: 'Rugged Terrain', desc: 'Gai lai đa dụng (Rugged-Terrain), đệm êm hơn M/T nhưng bám địa hình tốt hơn A/T.' },
  'RT': { name: 'Rugged Terrain', desc: 'Gai lai đa dụng (Rugged-Terrain), đệm êm hơn M/T nhưng bám địa hình tốt hơn A/T.' },
  'M+S': { name: 'Mud & Snow', desc: 'Bám tốt hơn trên bề mặt bùn lầy hoặc tuyết mỏng (bắt buộc ở một số nước).' },
  'M/S': { name: 'Mud & Snow', desc: 'Bám tốt hơn trên bề mặt bùn lầy hoặc tuyết mỏng.' },
  'MS': { name: 'Mud & Snow', desc: 'Bám tốt hơn trên bề mặt bùn lầy hoặc tuyết mỏng.' },
  '3PMSF': { name: '3-Peak Mountain Snowflake', desc: 'Biểu tượng núi 3 đỉnh tuyết rơi — Đạt chuẩn khắt khe về độ bám đường băng tuyết.' },
  'Tubeless': { name: 'Lốp không săm', desc: 'Nhẹ hơn, tiết kiệm nhiên liệu, không xì hơi đột ngột khi cán đinh.' },
  'Tube Type': { name: 'Lốp có săm', desc: 'Phải dùng ruột săm bên trong, thường dùng xe tải nặng hoặc mâm nan hoa căm.' },
  'RFT': { name: 'Run-Flat (Chống xịt)', desc: 'Thành lốp tự chịu lực, cho phép chạy tiếp 80km ở tốc độ 80km/h khi mất áp hoàn toàn.' },
  'SSR': { name: 'Run-Flat Continental (SSR)', desc: 'Công nghệ Self-Supporting Runflat của Continental, giữ vững tay lái khi mất áp.' },
  'ZP': { name: 'Run-Flat Michelin (Zero Pressure)', desc: 'Công nghệ Zero Pressure của Michelin, chạy an toàn 80km khi xì hết hơi.' },
  'ROF': { name: 'Run-Flat Goodyear (RunOnFlat)', desc: 'Công nghệ RunOnFlat của Goodyear, hỗ trợ di chuyển an toàn khi thủng lốp.' },
  'DSST': { name: 'Run-Flat Dunlop (DSST)', desc: 'Dunlop Self-Supporting Technology lốp chống xịt gia cố hông.' },
  'Outside / Inside': { name: 'Gai bất đối xứng', desc: 'Mặt ngoài rãnh lớn bám cua, mặt trong thoát nước. Bắt buộc lắp chữ Outside hướng ra ngoài.' },
  'Rotation': { name: 'Gai lốp định hướng', desc: 'Có mũi tên xoay chỉ chiều quay — Phải lắp đúng hướng mũi tên quay tới khi xe tiến.' }
};

// Tiêu chuẩn UTQG (Mỹ)
export const UTQG_DATA = {
  treadwear: {
    desc: 'Chỉ số chống mài mòn gai lốp. Mức chuẩn là 100.',
    scale: 'Từ 200 (mềm, bám đường, nhanh mòn) đến 600+ (cứng, chịu tải, rất lâu mòn).'
  },
  traction: {
    desc: 'Khả năng bám đường ướt khi phanh thẳng.',
    levels: [
      { grade: 'AA', desc: 'Cao nhất - Bám đường nhựa và bê tông ướt vượt trội.' },
      { grade: 'A', desc: 'Rất tốt - Chuẩn phổ biến cho xe du lịch cao cấp.' },
      { grade: 'B', desc: 'Trung bình - Đáp ứng an toàn cơ bản.' },
      { grade: 'C', desc: 'Tối thiểu theo quy chuẩn giao thông Mỹ.' }
    ]
  },
  temperature: {
    desc: 'Khả năng tản nhiệt ở tốc độ cao liên tục.',
    levels: [
      { grade: 'A', desc: 'Chạy an toàn liên tục ở tốc độ > 185 km/h.' },
      { grade: 'B', desc: 'Chạy an toàn ở dải 160 - 185 km/h.' },
      { grade: 'C', desc: 'Tối thiểu luật định (137 - 160 km/h).' }
    ]
  }
};

// 4. Các dấu hiệu mòn bất thường & thời điểm thay lốp
export const TIRE_WEAR_GUIDE = [
  {
    type: 'Vạch báo mòn 1.6 mm (Tread Wear Indicator)',
    symptom: 'Độ sâu rãnh gai mòn ngang bằng các gờ cao su nhỏ 1.6 mm ẩn trong rãnh lốp.',
    action: 'Bắt buộc thay lốp mới ngay lập tức. (Gai lốp mới thông thường sâu 7.5 – 8.5 mm; lốp A/T, M/T sâu 10 – 14 mm. Khi mòn còn 3.0 mm là khả năng thoát nước chống trượt nước aquaplaning trên cao tốc mưa lớn đã giảm rõ rệt; đến 1.6 mm là giới hạn luật định và kiểm định đăng kiểm bắt buộc thay thế).'
  },
  {
    type: 'Mòn ở chính giữa mặt lốp',
    symptom: 'Phần giữa mặt gai lốp mòn nhanh hơn hẳn hai bên vai lốp.',
    cause: 'Do lốp bị bơm quá căng hơi trong thời gian dài.',
    action: 'Hạ bớt áp suất về mức khuyến cáo in trên tem bệ cửa xe (thường 2.2 - 2.5 bar / 32-36 PSI).'
  },
  {
    type: 'Mòn ở hai bên vai lốp (Mòn mép)',
    symptom: 'Hai mép ngoài và trong của lốp mòn nhẵn nhưng phần giữa vẫn còn rãnh sâu.',
    cause: 'Do lốp bị non hơi (thiếu áp suất) liên tục khi di chuyển.',
    action: 'Bơm đủ áp suất tiêu chuẩn và kiểm tra xem lốp có bị xì van hoặc dính đinh ngầm không.'
  },
  {
    type: 'Mòn vẹt lệch một bên / Mòn lượn sóng',
    symptom: 'Mặt lốp mòn vát hẳn về một bên, hoặc mặt gai mòn mấp mô gợn sóng.',
    cause: 'Lệch góc đặt bánh xe (thước lái, Camber/Toe), lệch độ chụm hoặc phuộc giảm xóc bị hỏng.',
    action: 'Cần đưa xe đi cân chỉnh thước lái 3D và kiểm tra lại hệ thống càng A, phuộc nhún.'
  },
  {
    type: 'Phồng rộp, chửa lốp (Bulge / Bubble)',
    symptom: 'Thành lốp sưng một cục u to do sụp ổ gà gãy lớp mành bố thép bên trong.',
    action: 'CỰC KỲ NGUY HIỂM! Có thể nổ lốp bất kỳ lúc nào ở tốc độ cao. Phải thay lốp ngay!'
  },
  {
    type: 'Rạn nứt chân chim / Quá 5-6 năm sử dụng',
    symptom: 'Thành lốp xuất hiện các vết nứt nhỏ do cao su bị oxy hóa và chai cứng theo năm tháng.',
    action: 'Dù gai lốp còn dày cũng nên thay nếu lốp đã sản xuất quá 5 - 6 năm (xem mã tuần/năm DOT).'
  }
];

export type DotStatus = 'fresh' | 'good' | 'warning' | 'expired' | 'future' | 'invalid';

export interface DotCodeResult {
  week: number;
  year: number;
  ageYears: number;
  years: number;
  months: number;
  ageFormatted: string;
  status: DotStatus;
  statusLabel: string;
  badgeClass: string;
  isExpired: boolean;
  message?: string;
}

/**
 * Phân tích mã ngày sản xuất DOT 4 số (Ví dụ: 4721 -> tuần 47 năm 2021)
 * Chuẩn DOT 4 số bắt đầu áp dụng từ năm 2000.
 */
export function parseDotCode(dotStr: string): DotCodeResult | null {
  const cleaned = dotStr.trim();
  // Bắt buộc đúng 4 chữ số
  if (!/^\d{4}$/.test(cleaned)) return null;

  const week = parseInt(cleaned.slice(0, 2), 10);
  const rawYear = parseInt(cleaned.slice(2, 4), 10);
  const fullYear = 2000 + rawYear;

  // Kiểm tra tuần hợp lệ (1 đến 53)
  if (week < 1 || week > 53) {
    return {
      week,
      year: fullYear,
      ageYears: 0,
      years: 0,
      months: 0,
      ageFormatted: 'Mã không hợp lệ',
      status: 'invalid',
      statusLabel: 'MÃ KHÔNG HỢP LỆ (TUẦN SAI)',
      badgeClass: 'bg-rose-900/40 text-rose-400 border border-rose-500/40',
      isExpired: false,
      message: `Một năm chỉ có tối đa 52-53 tuần. Tuần "${week}" không tồn tại.`
    };
  }

  const now = new Date();
  // Ước tính ngày sản xuất: Ngày 1/1 của năm + (tuần - 0.5) * 7 ngày
  const mfgDate = new Date(fullYear, 0, 1);
  mfgDate.setDate(mfgDate.getDate() + Math.round((week - 0.5) * 7));

  // Kiểm tra nếu thời điểm sản xuất nằm ở tương lai
  const diffMs = now.getTime() - mfgDate.getTime();
  if (diffMs < 0) {
    return {
      week,
      year: fullYear,
      ageYears: 0,
      years: 0,
      months: 0,
      ageFormatted: 'Thời điểm tương lai',
      status: 'future',
      statusLabel: 'CHƯA SẢN XUẤT (TƯƠNG LAI)',
      badgeClass: 'bg-rose-900/40 text-rose-400 border border-rose-500/40',
      isExpired: false,
      message: `Tuần ${week} năm ${fullYear} chưa diễn ra so với hiện tại. Vui lòng kiểm tra lại 4 chữ số cạnh ký hiệu DOT trên thành lốp.`
    };
  }

  // Tính tuổi chính xác theo năm (làm tròn 1 chữ số thập phân)
  const ageYears = Math.round((diffMs / (365.25 * 24 * 3600 * 1000)) * 10) / 10;

  // Tính năm và tháng tuổi chính xác theo lịch
  let years = now.getFullYear() - mfgDate.getFullYear();
  let months = now.getMonth() - mfgDate.getMonth();
  if (now.getDate() < mfgDate.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years < 0) {
    years = 0;
    months = 0;
  }

  const ageFormatted = years > 0 
    ? `${years} năm ${months} tháng tuổi` 
    : months > 0 
      ? `${months} tháng tuổi` 
      : 'Dưới 1 tháng tuổi';

  // Phân loại mức độ an toàn theo tiêu chuẩn quốc tế:
  // < 3 năm: Mới sản xuất, tối ưu
  // 3 - 5 năm: Đã qua sử dụng, còn tốt
  // 5 - 6 năm: Cần theo dõi định kỳ, chuẩn bị thay
  // >= 6 năm: Hết hạn sử dụng kỹ thuật (lão hóa cao su)
  if (ageYears < 3) {
    return {
      week,
      year: fullYear,
      ageYears,
      years,
      months,
      ageFormatted,
      status: 'fresh',
      statusLabel: 'MỚI SẢN XUẤT (TỐI ƯU)',
      badgeClass: 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/40',
      isExpired: false
    };
  } else if (ageYears < 5) {
    return {
      week,
      year: fullYear,
      ageYears,
      years,
      months,
      ageFormatted,
      status: 'good',
      statusLabel: 'CÒN HẠN (CHẤT LƯỢNG TỐT)',
      badgeClass: 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/40',
      isExpired: false
    };
  } else if (ageYears < 6) {
    return {
      week,
      year: fullYear,
      ageYears,
      years,
      months,
      ageFormatted,
      status: 'warning',
      statusLabel: 'CẦN THEO DÕI (5 - 6 NĂM TUỔI)',
      badgeClass: 'bg-amber-900/40 text-amber-400 border border-amber-500/40',
      isExpired: false,
      message: 'Lốp đã đạt 5-6 năm tuổi. Dù gai lốp còn dày, hợp chất cao su đã bắt đầu chai cứng, nên kiểm tra định kỳ hàng năm.'
    };
  } else {
    return {
      week,
      year: fullYear,
      ageYears,
      years,
      months,
      ageFormatted,
      status: 'expired',
      statusLabel: 'HẾT HẠN (QUÁ 6 NĂM)',
      badgeClass: 'bg-rose-900/40 text-rose-400 border border-rose-500/40',
      isExpired: true,
      message: 'Lốp đã quá 6 năm tuổi kể từ ngày sản xuất. Cao su đã lão hóa và mất độ đàn hồi, khuyến cáo nên thay thế để đảm bảo an toàn.'
    };
  }
}

// Alias tương thích
export const checkDotDate = parseDotCode;
