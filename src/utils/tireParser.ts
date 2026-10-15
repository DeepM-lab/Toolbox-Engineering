import { OE_MARKINGS } from '../data/tireEncyclopedia';

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
  W: { speedKmH: 270, desc: 'Xe thể thao hiệu năng cao' },
  Y: { speedKmH: 300, desc: 'Siêu xe thể thao cao cấp' },
  '(Y)': { speedKmH: 320, desc: 'Siêu xe đặc biệt vận tốc trên 300 km/h' }
};

export const VEHICLE_TYPE_MAP: Record<string, string> = {
  P: 'Passenger (Xe du lịch, sedan, hatchback, crossover gia đình - P-Metric)',
  LT: 'Light Truck (Xe bán tải, SUV khung gầm rời, xe tải nhẹ)',
  ST: 'Special Trailer (Xe đầu kéo, rơ-moóc chuyên dụng)',
  T: 'Temporary (Lốp thay thế dự phòng khẩn cấp)',
  C: 'Commercial (Xe thương mại chở khách, xe tải van)',
  HL: 'High Load Capacity (Chuẩn lốp chịu tải cực cao dành riêng cho xe điện & SUV pin lớn)'
};

export const LOAD_RANGE_TABLE: Record<string, { plyRating: string; desc: string }> = {
  B: { plyRating: '4 PR', desc: 'Tải nhẹ tiêu chuẩn (Standard Load, 4 lớp bố)' },
  C: { plyRating: '6 PR', desc: 'Tải trung bình, SUV nhẹ (6 lớp bố)' },
  D: { plyRating: '8 PR', desc: 'Tải nặng, bán tải & SUV việt dã (8 lớp bố)' },
  E: { plyRating: '10 PR', desc: 'Tải cực nặng (10 lớp bố / 10 PR), áp suất cao đến 80 PSI, thành hông gia cố chống chém đá sỏi' },
  F: { plyRating: '12 PR', desc: 'Tải thương mại siêu trọng (12 lớp bố)' }
};

export interface FullTireSpec {
  rawString: string;
  isFlotation?: boolean;
  flotationSpec?: { diameterInch: number; widthInch: number; rimInch: number };
  vehicleType?: string; // P, LT, C, ST, T, HL
  vehicleTypeDesc?: string;
  width: number; // 205
  aspectRatio: number; // 55
  construction: string; // R, ZR, D, B
  rimDiameter: number; // 16
  loadIndex?: number; // 91 hoặc bánh đơn 123
  dualLoadIndex?: string; // ví dụ "123/120"
  dualLoadKg?: { single: number; dual: number; singleTotal4: number };
  maxLoadKg?: number; // 615 kg
  maxTotalLoadKg?: number; // 2460 kg (4 lốp)
  speedRating?: string; // V, R, Y...
  maxSpeedKmH?: number; // 240
  speedDesc?: string;
  extraLoad?: string; // XL, RF, HL, REINFORCED
  loadRange?: string; // E, D, C...
  loadRangeDesc?: string;
  oeMarking?: { brand: string; note: string; code: string };
  techFeatures?: string[];
  unrecognizedTokens?: string[];
  validationWarning?: string;
}

/**
 * Phân tích và giải mã chuỗi thông số lốp toàn diện
 * Hỗ trợ các chuẩn quốc tế: ISO-Metric, Euro-Metric, P-Metric, LT, HL, Flotation (inch), Dual Load, Load Range, Run-Flat, Terrain, OEM Brands
 */
export function parseFullTireString(input: string): FullTireSpec | null {
  if (!input || !input.trim()) return null;

  // 1. Chuẩn hóa chuỗi đầu vào
  let cleaned = input.trim().toUpperCase().replace(/\s+/g, ' ');
  // Gộp khoảng trắng quanh dấu gạch chéo ví dụ "205 / 55" -> "205/55"
  cleaned = cleaned.replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2');
  // Gộp khoảng trắng quanh dấu x ví dụ "33 x 12.5" -> "33X12.5"
  cleaned = cleaned.replace(/(\d+)\s*[xX]\s*(\d+)/g, '$1X$2');
  // Gộp khoảng trắng trước/sau ký hiệu mâm ví dụ "55 R 16" -> "55R16", "55 ZR 19" -> "55ZR19"
  cleaned = cleaned.replace(/(\d+)\s+(ZR|R|B|D)\s*(\d+)/g, '$1$2$3');
  cleaned = cleaned.replace(/(\d+)(ZR|R|B|D)\s+(\d+)/g, '$1$2$3');

  let width = 0;
  let aspectRatio = 80; // Mặc định cho lốp khuyết tỷ lệ hông (như 195R15C)
  let construction = 'R';
  let rimDiameter = 0;
  let vehicleType: string | undefined;
  let restString = '';
  let isFlotation = false;
  let flotationSpec: { diameterInch: number; widthInch: number; rimInch: number } | undefined;

  // 2. Nhận diện Lốp Flotation hệ inch (Ví dụ: 33X12.50R15LT, 35X12.5R17)
  const flotationRegex = /^(?<dia>\d{2}(?:\.\d{1,2})?)[xX](?<wInch>\d{1,2}(?:\.\d{1,2})?)\s*(?<construction>ZR|R|B|D)?\s*(?<rim>\d{2})\s*(?<type>LT)?(?:\s+(?<rest>.*))?$/;
  const floatMatch = cleaned.match(flotationRegex);

  if (floatMatch && floatMatch.groups) {
    isFlotation = true;
    const diaInch = parseFloat(floatMatch.groups.dia);
    const wInch = parseFloat(floatMatch.groups.wInch);
    rimDiameter = parseInt(floatMatch.groups.rim, 10);
    construction = floatMatch.groups.construction || 'R';
    vehicleType = floatMatch.groups.type || 'LT';

    // Quy đổi từ inch sang hệ Metric (mm) để tính toán hình học
    width = Math.round(wInch * 25.4);
    const sidewallMm = ((diaInch - rimDiameter) / 2) * 25.4;
    aspectRatio = Math.round((sidewallMm / width) * 100);

    flotationSpec = {
      diameterInch: diaInch,
      widthInch: wInch,
      rimInch: rimDiameter
    };
    restString = floatMatch.groups.rest || '';
  } else {
    // 3. Nhận diện Lốp hệ Metric (bao gồm cả chuẩn khuyết tỷ lệ hông như 195R15C)
    const metricRegex = /^(?<type>HL|LT|ST|P|T|C)?\s*(?<width>\d{2,3})(?:\/(?<ratio>\d{2}))?\s*(?<construction>ZR|R|B|D)?\s*(?<rim>\d{2})\s*(?<commSuffix>C)?(?:\s+(?<rest>.*))?$/;
    const match = cleaned.match(metricRegex);
    if (!match || !match.groups) return null;

    width = parseInt(match.groups.width, 10);
    aspectRatio = match.groups.ratio ? parseInt(match.groups.ratio, 10) : 80;
    rimDiameter = parseInt(match.groups.rim, 10);
    construction = match.groups.construction || 'R';
    vehicleType = match.groups.type || (match.groups.commSuffix ? 'C' : undefined);
    restString = match.groups.rest || '';
  }

  // 4. Kiểm tra tính khả thi của kích thước thực tế (Validation bounds)
  let validationWarning: string | undefined;
  if (width < 125 || width > 395 || aspectRatio < 20 || aspectRatio > 90 || rimDiameter < 10 || rimDiameter > 26) {
    validationWarning = `Cảnh báo: Kích thước lốp (${width}/${aspectRatio}${construction}${rimDiameter}) nằm ngoài dải quy chuẩn thông dụng thực tế.`;
  }

  // 5. Bóc tách phần tải trọng, tốc độ và các công nghệ phụ trợ
  let loadIndex: number | undefined;
  let dualLoadIndex: string | undefined;
  let dualLoadKg: { single: number; dual: number; singleTotal4: number } | undefined;
  let speedRating: string | undefined;
  let extraLoad: string | undefined;
  let loadRange: string | undefined;
  let loadRangeDesc: string | undefined;
  let oeMarking: { brand: string; note: string; code: string } | undefined;
  const techFeatures: string[] = [];
  const unrecognizedTokens: string[] = [];

  const RUNFLAT_CODES = ['RFT', 'SSR', 'ZP', 'ROF', 'DSST', 'RUNFLAT', 'RUN-FLAT'];
  const TERRAIN_CODES = ['A/T', 'AT', 'M/T', 'MT', 'H/T', 'HT', 'R/T', 'RT', 'M+S', '3PMSF'];

  if (restString) {
    const tokens = restString.split(/\s+/).filter(Boolean);

    for (const token of tokens) {
      // 5.1. Nhận diện Tải trọng & Tốc độ (Hỗ trợ cả dạng bọc ngoặc siêu xe như (103Y), 103(Y), (Y))
      const loadSpeedMatch = token.match(/^(?:(?:\((?<loadA>\d{2,3}(?:\/\d{2,3})?)(?<speedA>[A-Z])\))|(?<loadB>\d{2,3}(?:\/\d{2,3})?)?\s*(?:\((?<speedB>[A-Z])\)|(?<speedC>[A-Z])))$/);
      
      if (loadSpeedMatch && !loadIndex && !speedRating) {
        const rawLoad = loadSpeedMatch.groups?.loadA || loadSpeedMatch.groups?.loadB;
        const rawSpeed = loadSpeedMatch.groups?.speedA || loadSpeedMatch.groups?.speedB || loadSpeedMatch.groups?.speedC;

        if (rawLoad) {
          if (rawLoad.includes('/')) {
            dualLoadIndex = rawLoad;
            const parts = rawLoad.split('/');
            const singleIdx = parseInt(parts[0], 10);
            const dualIdx = parseInt(parts[1], 10);
            loadIndex = singleIdx;

            const singleKg = LOAD_INDEX_TABLE[singleIdx] || 0;
            const dualKg = LOAD_INDEX_TABLE[dualIdx] || 0;
            dualLoadKg = {
              single: singleKg,
              dual: dualKg,
              singleTotal4: singleKg * 4
            };
          } else {
            loadIndex = parseInt(rawLoad, 10);
          }
        }

        if (rawSpeed) {
          speedRating = loadSpeedMatch.groups?.speedB ? `(${rawSpeed})` : rawSpeed;
        }
        continue;
      }

      // 5.2. Nhận diện Ply Rating (Số lớp bố: 6PR, 8PR, 10PR...)
      if (/^\d{1,2}PR$/.test(token)) {
        techFeatures.push(`Số lớp bố ${token}`);
        continue;
      }

      // 5.3. Nhận diện Extra Load
      if (['XL', 'RF', 'HL', 'REINFORCED', 'SL'].includes(token)) {
        extraLoad = token === 'REINFORCED' ? 'XL' : token;
        continue;
      }

      // 5.4. Nhận diện Load Range (B, C, D, E, F)
      if (['B', 'C', 'D', 'E', 'F'].includes(token) || token.startsWith('LR-') || token.startsWith('LOAD')) {
        const cleanLr = token.replace(/^LR-?/, '').replace(/^LOAD\s*RANGE\s*/, '');
        if (LOAD_RANGE_TABLE[cleanLr]) {
          loadRange = cleanLr;
          loadRangeDesc = LOAD_RANGE_TABLE[cleanLr].desc;
        } else {
          loadRange = cleanLr;
        }
        continue;
      }

      // 5.5. Nhận diện Công nghệ Run-Flat (chống xịt)
      if (RUNFLAT_CODES.includes(token)) {
        techFeatures.push(`Lốp chống xịt Run-Flat (${token})`);
        continue;
      }

      // 5.6. Nhận diện Ký hiệu gai địa hình (A/T, M/T, H/T, M+S, 3PMSF...)
      if (TERRAIN_CODES.includes(token)) {
        const terrainDesc = token === 'A/T' || token === 'AT' ? 'Gai All-Terrain (đa địa hình)'
          : token === 'M/T' || token === 'MT' ? 'Gai Mud-Terrain (chuyên lội bùn lầy)'
          : token === 'H/T' || token === 'HT' ? 'Gai Highway-Terrain (chuyên cao tốc)'
          : token === 'R/T' || token === 'RT' ? 'Gai Rugged-Terrain (lai việt dã)'
          : token === 'M+S' ? 'Bám bùn tuyết Mud & Snow'
          : 'Chuẩn 3 đỉnh núi bông tuyết 3PMSF';
        techFeatures.push(`${token} - ${terrainDesc}`);
        continue;
      }

      // 5.7. Nhận diện OE Marking hãng xe
      if (OE_MARKINGS[token]) {
        oeMarking = {
          code: token,
          brand: OE_MARKINGS[token].brand,
          note: OE_MARKINGS[token].note
        };
        continue;
      }

      unrecognizedTokens.push(token);
    }
  }

  // Nếu là tiền tố HL thì tự động gán kết cấu chịu tải HL nếu chưa có
  if (vehicleType === 'HL' && !extraLoad) {
    extraLoad = 'HL';
  }

  const maxLoadKg = loadIndex && LOAD_INDEX_TABLE[loadIndex] ? LOAD_INDEX_TABLE[loadIndex] : undefined;
  const maxTotalLoadKg = dualLoadKg ? dualLoadKg.singleTotal4 : (maxLoadKg ? maxLoadKg * 4 : undefined);
  const cleanSpeedKey = speedRating?.replace(/[()]/g, '');
  const speedInfo = cleanSpeedKey && SPEED_RATING_TABLE[cleanSpeedKey] ? SPEED_RATING_TABLE[cleanSpeedKey] : undefined;

  return {
    rawString: cleaned,
    isFlotation,
    flotationSpec,
    vehicleType,
    vehicleTypeDesc: isFlotation 
      ? 'Hệ Inch Flotation (Chuẩn xe bán tải / độ việt dã địa hình)' 
      : (vehicleType ? VEHICLE_TYPE_MAP[vehicleType] : 'Euro-Metric (Chuẩn xe du lịch quốc tế thông dụng)'),
    width,
    aspectRatio,
    construction,
    rimDiameter,
    loadIndex,
    dualLoadIndex,
    dualLoadKg,
    maxLoadKg,
    maxTotalLoadKg,
    speedRating,
    maxSpeedKmH: speedInfo?.speedKmH,
    speedDesc: speedInfo?.desc,
    extraLoad,
    loadRange,
    loadRangeDesc,
    oeMarking,
    techFeatures: techFeatures.length > 0 ? techFeatures : undefined,
    unrecognizedTokens: unrecognizedTokens.length > 0 ? unrecognizedTokens : undefined,
    validationWarning
  };
}

