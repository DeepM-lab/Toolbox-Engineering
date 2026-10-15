import { 
  LOAD_INDEX_TABLE, 
  SPEED_RATING_TABLE, 
  VEHICLE_TYPE_MAP, 
  LOAD_RANGE_TABLE, 
  OE_MARKINGS, 
  TERRAIN_TECH_SPECS 
} from '../data/tireEncyclopedia';

// Re-export để các module khác vẫn tương thích khi import từ tireParser
export { 
  LOAD_INDEX_TABLE, 
  SPEED_RATING_TABLE, 
  VEHICLE_TYPE_MAP, 
  LOAD_RANGE_TABLE, 
  OE_MARKINGS, 
  TERRAIN_TECH_SPECS 
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
  speedRating?: string; // V, R, Y, Z...
  maxSpeedKmH?: number; // 240
  speedDesc?: string;
  extraLoad?: string; // XL, RF, HL, REINFORCED
  loadRange?: string; // E, D, C...
  loadRangeDesc?: string;
  oeMarking?: { brand: string; note: string; code: string };
  terrainOrTech?: { code: string; name: string; desc: string }[];
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

  let width = 0;
  let aspectRatio = 80; // Mặc định cho lốp khuyết tỷ lệ hông (như 195R15C)
  let construction = 'R';
  let rimDiameter = 0;
  let vehicleType: string | undefined;
  let restString = '';
  let isFlotation = false;
  let flotationSpec: { diameterInch: number; widthInch: number; rimInch: number } | undefined;

  // 2. Nhận diện Lốp Flotation hệ inch (Ví dụ: 33X12.50R15LT, LT35X12.5R17)
  const flotationRegex = /^(?<typePre>LT)?\s*(?<dia>\d{2}(?:\.\d{1,2})?)[xX](?<wInch>\d{1,2}(?:\.\d{1,2})?)\s*(?<construction>ZR|R|B|D)?\s*(?<rim>\d{2})\s*(?<typePost>LT)?(?:\s+(?<rest>.*))?$/;
  const floatMatch = cleaned.match(flotationRegex);

  if (floatMatch && floatMatch.groups) {
    isFlotation = true;
    const diaInch = parseFloat(floatMatch.groups.dia);
    const wInch = parseFloat(floatMatch.groups.wInch);
    rimDiameter = parseInt(floatMatch.groups.rim, 10);
    construction = floatMatch.groups.construction || 'R';
    vehicleType = floatMatch.groups.typePre || floatMatch.groups.typePost || 'LT';

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
  const terrainOrTech: { code: string; name: string; desc: string }[] = [];
  const techFeatures: string[] = [];
  const unrecognizedTokens: string[] = [];

  if (restString) {
    const tokens = restString.split(/\s+/).filter(Boolean);

    for (const token of tokens) {
      // 5.1. Nhận diện Tải trọng & Tốc độ
      // Bắt buộc phải có chữ số Load Index đi kèm Speed Rating (ví dụ 91V, 123/120R, (103Y), 103(Y))
      // Hoặc chỉ có mã tốc độ bọc ngoặc đặc thù siêu xe (Y)
      const loadSpeedMatch = token.match(/^(?:(?:\((?<loadA>\d{2,3}(?:\/\d{2,3})?)(?<speedA>[A-Z])\))|(?<loadB>\d{2,3}(?:\/\d{2,3})?)\s*\((?<speedB>[A-Z])\)|(?<loadC>\d{2,3}(?:\/\d{2,3})?)(?<speedC>[A-Z]))$/);
      
      if (loadSpeedMatch && !loadIndex && !speedRating) {
        const rawLoad = loadSpeedMatch.groups?.loadA || loadSpeedMatch.groups?.loadB || loadSpeedMatch.groups?.loadC;
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
          const isBracketed = Boolean(loadSpeedMatch.groups?.speedA || loadSpeedMatch.groups?.speedB);
          speedRating = isBracketed ? `(${rawSpeed})` : rawSpeed;
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

      // 5.5. Nhận diện Công nghệ lốp & Ký hiệu địa hình từ TERRAIN_TECH_SPECS (chuẩn hóa alias)
      const TERRAIN_ALIAS: Record<string, string> = {
        HT: 'H/T',
        AT: 'A/T',
        MT: 'M/T',
        RT: 'R/T',
        'M/S': 'M+S',
        MS: 'M+S'
      };
      const normTerrain = TERRAIN_ALIAS[token] || token;
      if (TERRAIN_TECH_SPECS[normTerrain]) {
        const spec = TERRAIN_TECH_SPECS[normTerrain];
        terrainOrTech.push({ code: normTerrain, name: spec.name, desc: spec.desc });
        techFeatures.push(`${normTerrain} - ${spec.name}`);
        continue;
      }

      // 5.6. Nhận diện OE Marking hãng xe (chuẩn hóa alias)
      const OE_ALIAS: Record<string, string> = {
        STAR: '*'
      };
      const normOe = OE_ALIAS[token] || token;
      if (OE_MARKINGS[normOe]) {
        oeMarking = {
          code: normOe,
          brand: OE_MARKINGS[normOe].brand,
          note: OE_MARKINGS[normOe].note
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
  const speedInfo = (speedRating && SPEED_RATING_TABLE[speedRating]) 
    || (cleanSpeedKey && SPEED_RATING_TABLE[cleanSpeedKey]) 
    || undefined;

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
    terrainOrTech: terrainOrTech.length > 0 ? terrainOrTech : undefined,
    techFeatures: techFeatures.length > 0 ? techFeatures : undefined,
    unrecognizedTokens: unrecognizedTokens.length > 0 ? unrecognizedTokens : undefined,
    validationWarning
  };
}

