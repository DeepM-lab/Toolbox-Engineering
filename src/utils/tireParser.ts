// Bảng tra cứu tải trọng Load Index (kg / 1 lốp) chuẩn quốc tế từ 60 đến 130
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

// Bảng tra cứu tốc độ Speed Rating (km/h) theo mục 9.2
export const SPEED_RATING_TABLE: Record<string, { speedKmH: number; desc: string }> = {
  L: { speedKmH: 120, desc: 'Xe tải nhẹ chuyên dụng, xe công trình' },
  M: { speedKmH: 130, desc: 'Lốp dự phòng tạm thời' },
  N: { speedKmH: 140, desc: 'Lốp dự phòng, xe tải nhỏ' },
  P: { speedKmH: 150, desc: 'Xe đô thị cỡ nhỏ' },
  Q: { speedKmH: 160, desc: 'Xe địa hình 4x4, lốp mùa đông' },
  R: { speedKmH: 170, desc: 'Xe bán tải, xe địa hình SUV' },
  S: { speedKmH: 180, desc: 'Xe sedan / hatchback phổ thông' },
  T: { speedKmH: 190, desc: 'Sedan, MPV, Crossover gia đình' },
  U: { speedKmH: 200, desc: 'Xe sedan phân khúc tầm trung' },
  H: { speedKmH: 210, desc: 'Sedan / SUV hiệu năng vừa' },
  V: { speedKmH: 240, desc: 'Sedan / SUV công suất cao' },
  W: { speedKmH: 270, desc: 'Xe thể thao hiệu năng cao' },
  Y: { speedKmH: 300, desc: 'Siêu xe thể thao cao cấp' },
  '(Y)': { speedKmH: 320, desc: 'Siêu xe đặc biệt vận tốc trên 300 km/h' }
};

export const VEHICLE_TYPE_MAP: Record<string, string> = {
  P: 'Passenger (Xe du lịch, sedan, hatchback, crossover gia đình)',
  LT: 'Light Truck (Xe bán tải, SUV khung gầm rời, xe tải nhẹ)',
  ST: 'Special Trailer (Xe đầu kéo, rơ-moóc chuyên dụng)',
  T: 'Temporary (Lốp dự phòng thay thế tạm thời)',
  C: 'Commercial (Xe thương mại chở khách, xe tải van)'
};

export interface FullTireSpec {
  rawString: string;
  vehicleType?: string; // P, LT, C, ST, T
  vehicleTypeDesc?: string;
  width: number; // 205
  aspectRatio: number; // 55
  construction: string; // R, ZR
  rimDiameter: number; // 16
  loadIndex?: number; // 91
  dualLoadIndex?: string; // ví dụ "104/102"
  maxLoadKg?: number; // 615 kg
  maxTotalLoadKg?: number; // 2460 kg (4 lốp)
  speedRating?: string; // V
  maxSpeedKmH?: number; // 240
  speedDesc?: string;
  extraLoad?: string; // XL, RF, HL
}

/**
 * Regex bóc tách chuỗi thông số lốp toàn diện theo Mục 10.2
 * Ví dụ: P205/55R16 91V, 265/65R17 112T, 285/70R17 121S XL, 225/45ZR18 95W, 195/70R15C 104/102R
 */
export function parseFullTireString(input: string): FullTireSpec | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, ' ');
  // Hỗ trợ cả tiền tố (P, LT, ST, T, C) và hậu tố thương mại C sau mâm (R15C), cũng như tải kép 104/102R
  const regex = /^(?<type>P|LT|ST|T|C)?\s*(?<width>\d{3})\/(?<ratio>\d{2})\s*(?<construction>ZR|R|B|D)?\s*(?<rim>\d{2})\s*(?<commSuffix>C)?(?:\s+(?<load>\d{2,3}(?:\/\d{2,3})?)(?<speed>\([A-Z]\)|[A-Z]))?(?:\s+(?<extra>XL|RF|HL|REINFORCED))?$/;
  
  const match = cleaned.match(regex);
  if (!match || !match.groups) return null;

  const width = parseInt(match.groups.width, 10);
  const aspectRatio = parseInt(match.groups.ratio, 10);
  const rimDiameter = parseInt(match.groups.rim, 10);
  const construction = match.groups.construction || 'R';
  const vehicleType = match.groups.type || (match.groups.commSuffix ? 'C' : undefined);
  
  const rawLoad = match.groups.load;
  let loadIndex: number | undefined;
  let dualLoadIndex: string | undefined;

  if (rawLoad) {
    if (rawLoad.includes('/')) {
      dualLoadIndex = rawLoad;
      loadIndex = parseInt(rawLoad.split('/')[0], 10);
    } else {
      loadIndex = parseInt(rawLoad, 10);
    }
  }

  const speedRating = match.groups.speed;
  const extraLoad = match.groups.extra;

  const maxLoadKg = loadIndex && LOAD_INDEX_TABLE[loadIndex] ? LOAD_INDEX_TABLE[loadIndex] : undefined;
  const maxTotalLoadKg = maxLoadKg ? maxLoadKg * 4 : undefined;
  const speedInfo = speedRating && SPEED_RATING_TABLE[speedRating] ? SPEED_RATING_TABLE[speedRating] : undefined;

  return {
    rawString: cleaned,
    vehicleType,
    vehicleTypeDesc: vehicleType ? VEHICLE_TYPE_MAP[vehicleType] : 'Euro-Metric (Chuẩn xe du lịch quốc tế)',
    width,
    aspectRatio,
    construction,
    rimDiameter,
    loadIndex,
    dualLoadIndex,
    maxLoadKg,
    maxTotalLoadKg,
    speedRating,
    maxSpeedKmH: speedInfo?.speedKmH,
    speedDesc: speedInfo?.desc,
    extraLoad
  };
}
