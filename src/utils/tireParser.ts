import { 
  LOAD_INDEX_TABLE, 
  SPEED_RATING_TABLE, 
  VEHICLE_TYPE_MAP, 
  LOAD_RANGE_TABLE, 
  OE_MARKINGS, 
  TERRAIN_TECH_SPECS,
  parseDotCode,
  type DotCodeResult
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

export interface KnownBrand {
  name: string;
  pattern: RegExp;
  country?: string;
}

export const KNOWN_TIRE_BRANDS: KnownBrand[] = [
  { name: 'Michelin', pattern: /(?<![\p{L}\p{N}])(?:MICHELIN|MICHE)(?![\p{L}\p{N}])/iu, country: 'Pháp' },
  { name: 'Bridgestone', pattern: /(?<![\p{L}\p{N}])(?:BRIDGESTONE|BS)(?![\p{L}\p{N}])/iu, country: 'Nhật Bản' },
  { name: 'Goodyear', pattern: /(?<![\p{L}\p{N}])GOODYEAR(?![\p{L}\p{N}])/iu, country: 'Mỹ' },
  { name: 'Continental', pattern: /(?<![\p{L}\p{N}])(?:CONTINENTAL|CONTI)(?![\p{L}\p{N}])/iu, country: 'Đức' },
  { name: 'Pirelli', pattern: /(?<![\p{L}\p{N}])PIRELLI(?![\p{L}\p{N}])/iu, country: 'Ý' },
  { name: 'Dunlop', pattern: /(?<![\p{L}\p{N}])DUNLOP(?![\p{L}\p{N}])/iu, country: 'Anh/Nhật Bản' },
  { name: 'Yokohama', pattern: /(?<![\p{L}\p{N}])(?:YOKOHAMA|YOKO)(?![\p{L}\p{N}])/iu, country: 'Nhật Bản' },
  { name: 'Hankook', pattern: /(?<![\p{L}\p{N}])HANKOOK(?![\p{L}\p{N}])/iu, country: 'Hàn Quốc' },
  { name: 'Kumho', pattern: /(?<![\p{L}\p{N}])KUMHO(?![\p{L}\p{N}])/iu, country: 'Hàn Quốc' },
  { name: 'Nexen', pattern: /(?<![\p{L}\p{N}])NEXEN(?![\p{L}\p{N}])/iu, country: 'Hàn Quốc' },
  { name: 'Toyo', pattern: /(?<![\p{L}\p{N}])TOYO(?![\p{L}\p{N}])/iu, country: 'Nhật Bản' },
  { name: 'Maxxis', pattern: /(?<![\p{L}\p{N}])MAXXIS(?![\p{L}\p{N}])/iu, country: 'Đài Loan' },
  { name: 'BFGoodrich', pattern: /(?<![\p{L}\p{N}])(?:BFGOODRICH|BF\s*GOODRICH|BFG)(?![\p{L}\p{N}])/iu, country: 'Mỹ' },
  { name: 'Cooper', pattern: /(?<![\p{L}\p{N}])COOPER(?![\p{L}\p{N}])/iu, country: 'Mỹ' },
  { name: 'Falken', pattern: /(?<![\p{L}\p{N}])FALKEN(?![\p{L}\p{N}])/iu, country: 'Nhật Bản' },
  { name: 'DRC', pattern: /(?<![\p{L}\p{N}])(?:DRC|DA\s*NANG|ĐÀ\s*NẴNG)(?![\p{L}\p{N}])/iu, country: 'Việt Nam (Cao Su Đà Nẵng)' },
  { name: 'Casumina', pattern: /(?<![\p{L}\p{N}])(?:CASUMINA|CSM)(?![\p{L}\p{N}])/iu, country: 'Việt Nam (Miền Nam)' },
  { name: 'SRC', pattern: /(?<![\p{L}\p{N}])(?:SRC|SAO\s*VANG|SAO\s*VÀNG)(?![\p{L}\p{N}])/iu, country: 'Việt Nam (Cao Su Sao Vàng)' },
  { name: 'Kenda', pattern: /(?<![\p{L}\p{N}])KENDA(?![\p{L}\p{N}])/iu, country: 'Đài Loan' },
  { name: 'Chengshin / CST', pattern: /(?<![\p{L}\p{N}])(?:CHENGSHIN|CHENG\s*SHIN|CST)(?![\p{L}\p{N}])/iu, country: 'Đài Loan/Việt Nam' },
  { name: 'Sailun', pattern: /(?<![\p{L}\p{N}])SAILUN(?![\p{L}\p{N}])/iu, country: 'Trung Quốc' },
  { name: 'Linglong', pattern: /(?<![\p{L}\p{N}])(?:LINGLONG|LING\s*LONG)(?![\p{L}\p{N}])/iu, country: 'Trung Quốc' },
  { name: 'Chaoyang', pattern: /(?<![\p{L}\p{N}])(?:CHAOYANG|CHAO\s*YANG)(?![\p{L}\p{N}])/iu, country: 'Trung Quốc' },
  { name: 'Giti', pattern: /(?<![\p{L}\p{N}])GITI(?![\p{L}\p{N}])/iu, country: 'Singapore' },
  { name: 'Otani', pattern: /(?<![\p{L}\p{N}])OTANI(?![\p{L}\p{N}])/iu, country: 'Thái Lan' },
  { name: 'Deestone', pattern: /(?<![\p{L}\p{N}])DEESTONE(?![\p{L}\p{N}])/iu, country: 'Thái Lan' },
  { name: 'Milestar', pattern: /(?<![\p{L}\p{N}])MILESTAR(?![\p{L}\p{N}])/iu, country: 'Mỹ' },
  { name: 'IRC / Inoue', pattern: /(?<![\p{L}\p{N}])(?:IRC|INOUE)(?![\p{L}\p{N}])/iu, country: 'Nhật Bản/Việt Nam' },
  { name: 'Metzeler', pattern: /(?<![\p{L}\p{N}])METZELER(?![\p{L}\p{N}])/iu, country: 'Đức' },
  { name: 'Vee Rubber', pattern: /(?<![\p{L}\p{N}])VEE\s*RUBBER(?![\p{L}\p{N}])/iu, country: 'Thái Lan' },
  { name: 'Apollo', pattern: /(?<![\p{L}\p{N}])APOLLO(?![\p{L}\p{N}])/iu, country: 'Ấn Độ' },
  { name: 'BKT', pattern: /(?<![\p{L}\p{N}])BKT(?![\p{L}\p{N}])/iu, country: 'Ấn Độ' }
];

export interface FullTireSpec {
  rawString: string;
  normalizedSize?: string; // ví dụ "205/55R16", "33X12.50R15", "11R22.5"
  brand?: string; // Tên thương hiệu
  brandCountry?: string;
  pattern?: string; // Tên dòng hoa lốp (Primacy 4, Dueler A/T, KO2...)
  isMotorcycle?: boolean;
  isCommercialTruck?: boolean;
  isFlotation?: boolean;
  isRunflat?: boolean;
  runflatTech?: string;
  flotationSpec?: { diameterInch: number; widthInch: number; rimInch: number };
  vehicleType?: string; // P, LT, C, ST, T, HL, MC, TRUCK
  vehicleTypeDesc?: string;
  width: number; // 205
  aspectRatio: number; // 55
  construction: string; // R, ZR, D, B, -
  rimDiameter: number; // 16 hoặc 22.5
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
  
  // Các thông số trích xuất thông minh từ chuỗi dán gộp:
  dotCode?: string; // 4 số, ví dụ "4721"
  dotAnalysis?: DotCodeResult;
  maxPressurePsi?: number;
  maxLoadExplicitKg?: number;
  utqg?: {
    treadwear?: number;
    traction?: string;
    temperature?: string;
  };
}

/**
 * Chuẩn hóa ký tự số trong cụm kích thước lốp (chỉ áp dụng cục bộ, tránh làm hỏng tên dòng lốp như KO2, RE004)
 */
function normalizeSizeDigits(val: string): string {
  return val.replace(/[Oo]/g, '0').replace(/[Il]/g, '1');
}

/**
 * Phân tích và giải mã chuỗi thông số lốp toàn diện
 * Hỗ trợ nhận diện thông minh đa thuộc tính (Smart Multi-attribute Extractor)
 * Kiến trúc tách 2 vùng Pre-Size / Post-Size tránh nuốt nhầm tên dòng lốp
 */
export function parseFullTireString(input: string): FullTireSpec | null {
  if (!input || !input.trim()) return null;

  // 1. Chuẩn hóa chuỗi đầu vào cơ bản (Sanitization Pipeline)
  let workingText = input.trim();

  // 1.1. Chuẩn hóa dấu phẩy số thập phân kiểu Việt/Châu Âu (ví dụ: "22,5" -> "22.5", "12,5" -> "12.5")
  workingText = workingText.replace(/(\d+),(\d+)/g, '$1.$2');

  // 1.2. Chuyển các dấu phẩy còn lại thành khoảng trắng
  workingText = workingText.replace(/,/g, ' ');

  // 1.3. Tách biệt dấu hoa thị * (OE Marking của BMW) thành token độc lập
  workingText = workingText.replace(/\s*\*\s*/g, ' * ');

  // 1.4. Chuẩn hóa khoảng trắng lặp lại
  workingText = workingText.replace(/\s+/g, ' ');

  // 1.5. Lọc bỏ mã tem barcode hoặc mã sản phẩm rác nếu có
  workingText = workingText.replace(/(?<![\p{L}\p{N}])(?:BARCODE|MÃ\s*SP|MÃ\s*TEM|MÃ\s*SẢN\s*PHẨM)\s*[:=]?\s*[A-Z0-9-]+\b/giu, ' ');

  let brand: string | undefined;
  let brandCountry: string | undefined;

  // 2. Tìm và bóc tách THƯƠNG HIỆU LỐP (Brand Extractor)
  for (const b of KNOWN_TIRE_BRANDS) {
    if (b.pattern.test(workingText)) {
      brand = b.name;
      brandCountry = b.country;
      const globalBrandPattern = new RegExp(b.pattern.source, b.pattern.flags.includes('g') ? b.pattern.flags : `${b.pattern.flags}g`);
      workingText = workingText.replace(globalBrandPattern, ' ');
      break;
    }
  }

  // 3. Tìm và bóc tách MÃ DOT (Date of Tire - 4 số tuần/năm, hỗ trợ cả mã DOT 3 cụm nhà máy và năm lặp lại)
  let dotCode: string | undefined;
  let dotAnalysis: DotCodeResult | undefined;
  const dotMatch = workingText.match(/\bDOT\b(?:\s+[A-Z0-9]{2,5}){0,3}\s+(\d{4})(?:\s*\(?20\d{2}\)?)?\b/i)
    || workingText.match(/\bDOT\s*[:=]?\s*(\d{4})(?:\s*\(?20\d{2}\)?)?\b/i)
    || workingText.match(/\bDOT\b[^\d]*(\d{4})(?:\s*\(?20\d{2}\)?)?\b/i);
  if (dotMatch) {
    const rawDot = dotMatch[1];
    if (rawDot && /^\d{4}$/.test(rawDot)) {
      dotCode = rawDot;
      const res = parseDotCode(dotCode);
      if (res) dotAnalysis = res;
      workingText = workingText.replace(dotMatch[0], ' ');
    }
  }

  // 4. Tìm và bóc tách MAX PRESS (Áp suất tối đa dập nổi mép tanh lốp)
  // Xử lý độc lập và nuốt trọn mệnh đề áp suất: AT ... KPA (... PSI) MAX PRESS, MAX PRESS ... PSI (kể cả COLD)
  let maxPressurePsi: number | undefined;
  const fullPressureRegex = /\b(?:AT\s+)?(?:MAX\s*PRESS(?:URE)?\.?\s*[:=]?\s*)?(\d+(?:\.\d+)?)\s*(PSI|KPA|BAR)\s*(?:\(\s*(\d+(?:\.\d+)?)\s*(PSI|KPA|BAR)\s*\))?\s*(?:MAX\s*PRESS(?:URE)?\.?)?(?:\s*COLD)?\b/i;
  const pressClauseMatch = workingText.match(fullPressureRegex);

  if (pressClauseMatch) {
    const val1 = parseFloat(pressClauseMatch[1]);
    const unit1 = pressClauseMatch[2].toUpperCase();
    const val2 = pressClauseMatch[3] ? parseFloat(pressClauseMatch[3]) : undefined;
    const unit2 = pressClauseMatch[4]?.toUpperCase();

    // Ưu tiên đơn vị PSI nếu có sẵn ở một trong hai vế
    if (unit1 === 'PSI') {
      maxPressurePsi = Math.round(val1);
    } else if (unit2 === 'PSI' && val2 !== undefined) {
      maxPressurePsi = Math.round(val2);
    } else if (unit1 === 'BAR') {
      maxPressurePsi = Math.round(val1 * 14.5038);
    } else if (unit2 === 'BAR' && val2 !== undefined) {
      maxPressurePsi = Math.round(val2 * 14.5038);
    } else if (unit1 === 'KPA') {
      maxPressurePsi = Math.round(val1 / 6.89476);
    } else if (unit2 === 'KPA' && val2 !== undefined) {
      maxPressurePsi = Math.round(val2 / 6.89476);
    } else {
      maxPressurePsi = Math.round(val1);
    }
    workingText = workingText.replace(pressClauseMatch[0], ' ');
  } else {
    // Fallback cho định dạng áp suất đơn lẻ hoặc MAX PRESS ở trước/sau
    const fallbackPressMatch = workingText.match(/\bMAX\s*PRESS(?:URE)?\.?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(PSI|KPA|BAR)?\b/i)
      || workingText.match(/\b(\d+(?:\.\d+)?)\s*(PSI|KPA|BAR)\s*(?:MAX\s*PRESS(?:URE)?\.?)?\b/i)
      || workingText.match(/\b(\d{2,3})\s*(PSI)\b/i)
      || workingText.match(/\b(\d{3})\s*(KPA)\b/i);

    if (fallbackPressMatch) {
      const val = parseFloat(fallbackPressMatch[1]);
      const unit = (fallbackPressMatch[2] || 'PSI').toUpperCase();
      if (unit === 'KPA' || (unit === 'PSI' && val > 120)) {
        maxPressurePsi = Math.round(val / 6.89476);
      } else if (unit === 'BAR') {
        maxPressurePsi = Math.round(val * 14.5038);
      } else {
        maxPressurePsi = Math.round(val);
      }
      workingText = workingText.replace(fallbackPressMatch[0], ' ');
    }
  }

  // Dọn sạch tàn dư MAX PRESS còn sót lại
  workingText = workingText.replace(/\bMAX\s*PRESS(?:URE)?\.?\b/gi, ' ');

  // 5. Tìm và bóc tách MAX LOAD (Tải trọng tối đa dập nổi mép lốp)
  // Phân định rõ ràng KG và LBS, quét sạch toàn bộ các mệnh đề kể cả SINGLE và DUAL
  let maxLoadExplicitKg: number | undefined;
  const loadExplicitRegex = /\bMAX\s*LOAD(?:\s*(?:SINGLE|DUAL))?\s*[:=]?\s*(\d{3,5})\s*(KG|KGS|LBS)?(?:\s*\(\s*(\d{3,5})\s*(LBS|KG|KGS)\s*\))?/gi;
  let loadMatch: RegExpExecArray | null;

  while ((loadMatch = loadExplicitRegex.exec(workingText)) !== null) {
    if (maxLoadExplicitKg === undefined) {
      const val1 = parseInt(loadMatch[1], 10);
      const unit1 = (loadMatch[2] || (loadMatch[0].toUpperCase().includes('LBS') && !loadMatch[0].toUpperCase().includes('KG') ? 'LBS' : 'KG')).toUpperCase();
      const val2 = loadMatch[3] ? parseInt(loadMatch[3], 10) : undefined;
      const unit2 = loadMatch[4]?.toUpperCase();

      if (unit1 === 'KG') {
        maxLoadExplicitKg = val1 < 20000 ? val1 : undefined;
      } else if (unit2 === 'KG' && val2 !== undefined) {
        maxLoadExplicitKg = val2 < 20000 ? val2 : undefined;
      } else if (unit1 === 'LBS') {
        maxLoadExplicitKg = Math.round(val1 / 2.20462);
      } else if (unit2 === 'LBS' && val2 !== undefined) {
        maxLoadExplicitKg = Math.round(val2 / 2.20462);
      }
    }
  }
  // Xóa sạch toàn bộ các mệnh đề MAX LOAD (kể cả SINGLE và DUAL)
  workingText = workingText.replace(/\bMAX\s*LOAD(?:\s*(?:SINGLE|DUAL))?\s*[:=]?\s*\d{3,5}\s*(?:KG|KGS|LBS)?(?:\s*\(\s*\d{3,5}\s*(?:LBS|KG|KGS)\s*\))?/gi, ' ');
  workingText = workingText.replace(/\bMAX\s*LOAD(?:\s*(?:SINGLE|DUAL))?\b/gi, ' ');

  // 6. Tìm và bóc tách TIÊU CHUẨN UTQG (Mỹ)
  let utqgTreadwear: number | undefined;
  let utqgTraction: string | undefined;
  let utqgTemperature: string | undefined;

  const utqgCombinedMatch = workingText.match(/\bUTQG\s*[:=]?\s*(\d{2,4})\s+(AA|A|B|C)\s+(A|B|C)\b/i);
  if (utqgCombinedMatch) {
    utqgTreadwear = parseInt(utqgCombinedMatch[1], 10);
    utqgTraction = utqgCombinedMatch[2].toUpperCase();
    utqgTemperature = utqgCombinedMatch[3].toUpperCase();
    workingText = workingText.replace(utqgCombinedMatch[0], ' ');
  }

  const twMatch = workingText.match(/\bTREADWEAR\s*[:=]?\s*(\d{2,4})\b/i);
  if (twMatch) {
    utqgTreadwear = parseInt(twMatch[1], 10);
    workingText = workingText.replace(twMatch[0], ' ');
  }

  const trMatch = workingText.match(/\bTRACTION\s*[:=]?\s*(AA|A|B|C)\b/i);
  if (trMatch) {
    utqgTraction = trMatch[1].toUpperCase();
    workingText = workingText.replace(trMatch[0], ' ');
  }

  const tempMatch = workingText.match(/\bTEMPERATURE\s*[:=]?\s*(A|B|C)\b/i);
  if (tempMatch) {
    utqgTemperature = tempMatch[1].toUpperCase();
    workingText = workingText.replace(tempMatch[0], ' ');
  }

  workingText = workingText.replace(/\bUTQG\b/gi, ' ');

  // 7. Bóc tách trước LOAD RANGE và ký hiệu M/C (để tránh nuốt từ khi split token)
  let loadRange: string | undefined;
  let loadRangeDesc: string | undefined;
  const lrMatch = workingText.match(/\b(?:LOAD\s*RANGE|LR)[\s\-:]*([B-H])\b/i);
  if (lrMatch) {
    loadRange = lrMatch[1].toUpperCase();
    loadRangeDesc = LOAD_RANGE_TABLE[loadRange]?.desc;
    workingText = workingText.replace(lrMatch[0], ' ');
  }

  let explicitMc = false;
  if (/\bM\/C\b/i.test(workingText)) {
    explicitMc = true;
    workingText = workingText.replace(/\bM\/C\b/gi, ' ');
  }

  // 8. Lọc bỏ các từ đệm/tiêu chuẩn thông dụng và trích xuất công nghệ
  const techFeatures: string[] = [];
  const terrainOrTech: { code: string; name: string; desc: string }[] = [];
  let isRunflat = false;
  let runflatTech: string | undefined;

  const checkAndExtractFeature = (pattern: RegExp, label: string) => {
    if (pattern.test(workingText)) {
      techFeatures.push(label);
      const gPattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
      workingText = workingText.replace(gPattern, ' ');
    }
  };

  // 8.1. Bóc tách Run-flat
  const runflatRegex = /\b(?:RFT|RUNFLAT|RUN-FLAT|RUN\s*FLAT|SSR|ROF|ZP|RSC|DRIVEGUARD)\b/i;
  const runflatMatch = workingText.match(runflatRegex);
  if (runflatMatch) {
    isRunflat = true;
    runflatTech = runflatMatch[0].toUpperCase().replace(/\s+/g, '');
    techFeatures.push(`Lốp chống xịt Run-flat (${runflatTech})`);
    workingText = workingText.replace(runflatRegex, ' ');
  }

  // 8.2. Tiêu âm / Công nghệ chống đinh tự vá
  const acousticRegex = /\b(?:ACOUSTIC|CONTISEAL|SEAL|B-SILENT|SOUNDCOMFORT|SILENT\s*DRIVE)\b/i;
  const acousticMatch = workingText.match(acousticRegex);
  if (acousticMatch) {
    techFeatures.push(`Công nghệ tiêu âm/tự vá (${acousticMatch[0].toUpperCase()})`);
    workingText = workingText.replace(acousticRegex, ' ');
  }

  // 8.3. Cấu trúc lớp bố dập nổi (Plies & Materials)
  const pliesMatch = workingText.match(/\bPLIES\s*:?[^;.\n]*(?:SIDEWALL[^;.\n]*)?/i);
  if (pliesMatch) {
    techFeatures.push(`Cấu trúc lớp bố: ${pliesMatch[0].trim()}`);
    workingText = workingText.replace(pliesMatch[0], ' ');
  }
  // Lọc sạch các từ vật liệu bố lốp để không bị lẫn vào tên gai
  workingText = workingText.replace(/\b(?:POLYESTER|RAYON|POLYAMIDE|ARAMID|KEVLAR|NYLON)\b/gi, ' ');
  workingText = workingText.replace(/\b\d+\s*PLIES\b/gi, ' ');
  workingText = workingText.replace(/\b(?:TREAD|SIDEWALL)\s*(?:\d+\s*PLIES)?\b/gi, ' ');

  // 8.4. Mã tiêu chuẩn an toàn quốc tế dập trên lốp (E-Mark Châu Âu, CCC, DOT, TWI, COLD...)
  workingText = workingText.replace(/\b\(?E\d{1,2}\)?\s*\d{5,7}(?:-S)?\b/gi, ' ');
  workingText = workingText.replace(/\b(?:CCC|INMETRO|BIS|SNI|JIS|NOM)\b/gi, ' ');
  workingText = workingText.replace(/\bTWI\b/gi, ' ');
  workingText = workingText.replace(/\bCOLD\b/gi, ' ');

  checkAndExtractFeature(/\b(?:TUBELESS|TL)\b/i, 'Lốp không săm (Tubeless)');
  checkAndExtractFeature(/\b(?:TUBE\s*TYPE|TT)\b/i, 'Lốp có săm (Tube Type)');
  checkAndExtractFeature(/\bRADIAL\b/i, 'Bố tỏa tròn Radial');
  checkAndExtractFeature(/\bSTEEL\s*BELTED\b/i, 'Bố thép chịu lực (Steel Belted)');
  checkAndExtractFeature(/\bOUTSIDE\b/i, 'Gai bất đối xứng (Mặt Outside)');
  checkAndExtractFeature(/\bINSIDE\b/i, 'Gai bất đối xứng (Mặt Inside)');
  checkAndExtractFeature(/\bROTATION\b/i, 'Gai lốp định hướng quay');

  // Lọc bỏ từ vựng tiếng Việt hoặc tiếng Anh thừa (sử dụng Unicode Boundary)
  workingText = workingText.replace(/(?<![\p{L}\p{N}])(?:LỐP|BÁNH|VỎ|XE|TIRE|TYRE|SIZE|CỠ|SPEC|CHÍNH\s*HÃNG|MỚI\s*100%|LƯỚT|BẢO\s*HÀNH|GIÁ\s*RẺ|CAO\s*SU|THƯƠNG\s*HIỆU|HÃNG)(?![\p{L}\p{N}])/giu, ' ');
  workingText = workingText.replace(/\bMADE\s+IN\s+[A-Z]+\b/gi, ' ');

  // Chuẩn hóa khoảng trắng quanh dấu gạch chéo và dấu x
  workingText = workingText.trim().replace(/\s+/g, ' ');
  workingText = workingText.replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2');
  workingText = workingText.replace(/(\d+)\s*[xX*]\s*(\d+)/g, '$1X$2');

  // 9. BÓC TÁCH KÍCH THƯỚC LỐP CHÍNH (TIRE SIZE EXTRACTOR - MULTI-TIER ENGINE)
  let width = 0;
  let aspectRatio = 80;
  let construction = 'R';
  let rimDiameter = 0;
  let vehicleType: string | undefined;
  let isFlotation = false;
  let isCommercialTruck = false;
  let isMotorcycle = false;
  let flotationSpec: { diameterInch: number; widthInch: number; rimInch: number } | undefined;
  let normalizedSize = '';
  let sizeMatchedSubstring = '';
  let sizeIndex = -1;

  // 9.1. TIER 1: Dạng Flotation (33X12.50R15, 35x12.5 R17, 31x10.5-15, LT33x12.50R15...)
  const flotationRegex = /\b(?<typePre>LT)?\s*(?<dia>\d{2}(?:\.\d{1,2})?)\s*[xX*]\s*(?<wInch>\d{1,2}(?:\.\d{1,2})?)\s*(?<construction>ZR|R|B|D|-)?\s*(?<rim>\d{2}(?:\.5)?)\s*(?<typePost>LT)?\b/i;
  const floatMatch = workingText.match(flotationRegex);

  if (floatMatch && floatMatch.groups && floatMatch.index !== undefined) {
    isFlotation = true;
    sizeMatchedSubstring = floatMatch[0];
    sizeIndex = floatMatch.index;
    const diaInch = parseFloat(floatMatch.groups.dia);
    const wInch = parseFloat(floatMatch.groups.wInch);
    rimDiameter = parseFloat(floatMatch.groups.rim);
    construction = (floatMatch.groups.construction || 'R').toUpperCase();
    if (construction === '-') construction = 'D'; // Bias
    vehicleType = (floatMatch.groups.typePre || floatMatch.groups.typePost || 'LT').toUpperCase();

    width = Math.round(wInch * 25.4);
    const sidewallMm = ((diaInch - rimDiameter) / 2) * 25.4;
    aspectRatio = Math.round((sidewallMm / width) * 100);

    flotationSpec = {
      diameterInch: diaInch,
      widthInch: wInch,
      rimInch: rimDiameter
    };
    const normDia = floatMatch.groups.dia;
    let normW = floatMatch.groups.wInch;
    if (normW.includes('.') && normW.split('.')[1].length === 1) {
      normW = `${normW}0`;
    }
    normalizedSize = `${normDia}X${normW}${construction}${rimDiameter}`;
  } else {
    // 9.2. TIER 2: Lốp Hệ Inch Không Tỷ Lệ (11R22.5, 12R22.5, 7.50R16, 8.25R16, 10.00R20, 7.50-16, 10-16.5... và lốp xe máy inch 2.50-17, 3.50-10...)
    const truckInchRegex = /\b(?<width>\d{1,2}(?:\.\d{1,2})?)\s*[/\s-]*(?<construction>ZR|R|B|D|-)\s*[/\s-]*(?<rim>\d{2}(?:\.5)?)\s*(?<commSuffix>C)?\b/i;
    const truckMatch = workingText.match(truckInchRegex);

    if (truckMatch && truckMatch.groups && truckMatch.index !== undefined && parseFloat(truckMatch.groups.width) <= 15) {
      sizeMatchedSubstring = truckMatch[0];
      sizeIndex = truckMatch.index;
      const wInch = parseFloat(truckMatch.groups.width);
      rimDiameter = parseFloat(truckMatch.groups.rim);
      construction = truckMatch.groups.construction.toUpperCase();

      width = Math.round(wInch * 25.4);
      let normTruckW = truckMatch.groups.width;
      if (normTruckW.includes('.') && normTruckW.split('.')[1].length === 1) {
        normTruckW = `${normTruckW}0`;
      }
      const normTruckSuffix = (truckMatch.groups.commSuffix || '').toUpperCase();

      if (wInch < 5.0) {
        // Lốp xe máy / xe tay ga hệ inch (Honda Cub 2.25-17, 2.50-17, 2.75-17, Vespa cổ 3.50-10...)
        isMotorcycle = true;
        vehicleType = 'MC';
        aspectRatio = 100;
        normalizedSize = `${normTruckW}${construction}${rimDiameter}${normTruckSuffix}`;
      } else {
        // Lốp xe tải nặng / xe chuyên dụng hệ inch (7.50-16, 8.25-16, 11R22.5, 10.00R20...)
        isCommercialTruck = true;
        vehicleType = 'TRUCK';
        aspectRatio = wInch >= 9 ? 90 : 100;
        normalizedSize = `${normTruckW}${construction}${rimDiameter}${normTruckSuffix}`;
      }
    } else {
      // 9.3. TIER 3: Viết Liền Không Dấu Phân Cách
      const contConstRegex = /\b(?<type>HL|LT|ST|P|T)?(?<width>[0-9Oo]{3})(?<ratio>[0-9Oo]{2})(?<construction>ZR|R|D)(?<rim>[0-9Oo]{2}(?:\.5)?)(?<commSuffix>C)?\b/i;
      const contConstMatch = workingText.match(contConstRegex);

      const contDigitsRegex = /\b(?<type>HL|LT|ST|P|T)?(?<width>[0-9Oo]{3})(?<ratio>[0-9Oo]{2})(?<rim>[0-9Oo]{2})(?<commSuffix>C)?\b/i;
      const contDigitsMatch = !contConstMatch ? workingText.match(contDigitsRegex) : null;

      if (contConstMatch && contConstMatch.groups && contConstMatch.index !== undefined) {
        sizeMatchedSubstring = contConstMatch[0];
        sizeIndex = contConstMatch.index;
        width = parseInt(normalizeSizeDigits(contConstMatch.groups.width), 10);
        aspectRatio = parseInt(normalizeSizeDigits(contConstMatch.groups.ratio), 10);
        construction = contConstMatch.groups.construction.toUpperCase();
        rimDiameter = parseFloat(normalizeSizeDigits(contConstMatch.groups.rim));
        vehicleType = (contConstMatch.groups.type || (contConstMatch.groups.commSuffix ? 'C' : undefined))?.toUpperCase();
        const normType = (contConstMatch.groups.type || '').toUpperCase();
        const normSuffix = (contConstMatch.groups.commSuffix || '').toUpperCase();
        normalizedSize = `${normType}${width}/${aspectRatio}${construction}${rimDiameter}${normSuffix}`.trim();
      } else if (contDigitsMatch && contDigitsMatch.groups && contDigitsMatch.index !== undefined) {
        sizeMatchedSubstring = contDigitsMatch[0];
        sizeIndex = contDigitsMatch.index;
        width = parseInt(normalizeSizeDigits(contDigitsMatch.groups.width), 10);
        aspectRatio = parseInt(normalizeSizeDigits(contDigitsMatch.groups.ratio), 10);
        construction = 'R';
        rimDiameter = parseFloat(normalizeSizeDigits(contDigitsMatch.groups.rim));
        vehicleType = (contDigitsMatch.groups.type || (contDigitsMatch.groups.commSuffix ? 'C' : undefined))?.toUpperCase();
        const normType = (contDigitsMatch.groups.type || '').toUpperCase();
        const normSuffix = (contDigitsMatch.groups.commSuffix || '').toUpperCase();
        normalizedSize = `${normType}${width}/${aspectRatio}${construction}${rimDiameter}${normSuffix}`.trim();
      } else {
        // 9.4. TIER 4: Metric Chuẩn & Mở Rộng
        // Hỗ trợ: 205/55R16, 205 55 R16, 205 55 16, 205-55-16, 195/55/16, 195-55-R16, 295/80R22.5, 195R15C, 90/90-14, 135/80R12...
        // Chú ý: C không phải là tiền tố chuẩn (chỉ có HL, LT, ST, P, T là tiền tố; C chỉ là hậu tố commercial sau mâm)
        const metricRegex = /\b(?<type>HL|LT|ST|P|T)?\s*(?<width>[0-9Oo]{2,3})(?:[/\s.-](?<ratio>[0-9Oo]{2}))?\s*[/\s.-]*(?<construction>ZR|R|B|D|-)?\s*[/\s.-]*(?<rim>[0-9Oo]{2}(?:\.5)?)\s*(?<commSuffix>C|LT)?\b/i;
        const metricMatch = workingText.match(metricRegex);

        if (metricMatch && metricMatch.groups && metricMatch.index !== undefined) {
          sizeMatchedSubstring = metricMatch[0];
          sizeIndex = metricMatch.index;
          width = parseInt(normalizeSizeDigits(metricMatch.groups.width), 10);
          aspectRatio = metricMatch.groups.ratio ? parseInt(normalizeSizeDigits(metricMatch.groups.ratio), 10) : 80;
          rimDiameter = parseFloat(normalizeSizeDigits(metricMatch.groups.rim));
          construction = (metricMatch.groups.construction || 'R').toUpperCase();
          vehicleType = (metricMatch.groups.type || (metricMatch.groups.commSuffix ? metricMatch.groups.commSuffix.toUpperCase() : undefined))?.toUpperCase();

          if (rimDiameter === 24.5 || rimDiameter === 22.5 || rimDiameter === 19.5 || rimDiameter === 17.5) {
            isCommercialTruck = true;
            if (!vehicleType) vehicleType = 'TRUCK';
          }

          const normType = (metricMatch.groups.type || '').toUpperCase();
          const normSuffix = (metricMatch.groups.commSuffix || '').toUpperCase();
          normalizedSize = `${normType}${width}/${aspectRatio}${construction}${rimDiameter}${normSuffix}`.trim();
        } else {
          // Không tìm thấy cụm kích thước lốp hợp lệ
          return null;
        }
      }
    }
  }

  // 10. PHÂN TÁCH VÙNG PRE-SIZE & POST-SIZE
  const preSizeText = workingText.slice(0, sizeIndex).trim();
  let postSizeText = workingText.slice(sizeIndex + sizeMatchedSubstring.length).trim();

  // Chuẩn hóa cặp tải trọng & tốc độ nếu bị gõ rời dấu cách hoặc dùng dấu gạch ngang (ví dụ "91 V" -> "91V", "121-118S" -> "121/118S", "112/109 Q" -> "112/109Q", "95 (Y)" -> "95(Y)")
  postSizeText = postSizeText.replace(/\b(\d{2,3})\s*[-/]\s*(\d{2,3})\b/g, '$1/$2');
  postSizeText = postSizeText.replace(/\b(\d{2,3}(?:\/\d{2,3})?)\s+([A-Z]|\([A-Z]\))\b/g, '$1$2');
  postSizeText = postSizeText.replace(/\b(\d{2,3}(?:\/\d{2,3})?)\s*\(\s*([A-Z])\s*\)\b/g, '$1($2)');

  let loadIndex: number | undefined;
  let dualLoadIndex: string | undefined;
  let dualLoadKg: { single: number; dual: number; singleTotal4: number } | undefined;
  let speedRating: string | undefined;
  let extraLoad: string | undefined;
  let oeMarking: { brand: string; note: string; code: string } | undefined;

  const TERRAIN_ALIAS: Record<string, string> = {
    HT: 'H/T',
    AT: 'A/T',
    MT: 'M/T',
    RT: 'R/T',
    'M/S': 'M+S',
    MS: 'M+S',
    '3PMSF': '3PMSF'
  };

  const OE_ALIAS: Record<string, string> = {
    STAR: '*'
  };

  // Quét các thông số kỹ thuật trong POST-SIZE
  const postTokens = postSizeText.split(/\s+/).filter(Boolean);
  const postUnrecognizedTokens: string[] = [];

  for (let i = 0; i < postTokens.length; i++) {
    const token = postTokens[i];
    let cleanUpper = token.toUpperCase();

    // 10.1. Nhận diện Tải trọng & Tốc độ
    if (!loadIndex && !speedRating && /^\d{2,3}(?:[/-]\d{2,3})?$/.test(cleanUpper) && i + 1 < postTokens.length) {
      const nextToken = postTokens[i + 1].toUpperCase();
      if (/^[A-Z]$|^\([A-Z]\)$/.test(nextToken)) {
        cleanUpper = `${cleanUpper}${nextToken}`;
        i++; // Bỏ qua token kế tiếp vì đã gộp
      }
    }

    const loadSpeedMatch = cleanUpper.match(/^(?:(?:\((?<loadA>\d{2,3}(?:[/-]\d{2,3})?)(?<speedA>[A-Z])\))|(?<loadB>\d{2,3}(?:[/-]\d{2,3})?)\s*\((?<speedB>[A-Z])\)|(?<loadC>\d{2,3}(?:[/-]\d{2,3})?)(?<speedC>[A-Z]))$/);

    if (loadSpeedMatch && !loadIndex && !speedRating) {
      const rawLoadMatched = loadSpeedMatch.groups?.loadA || loadSpeedMatch.groups?.loadB || loadSpeedMatch.groups?.loadC;
      const rawLoad = rawLoadMatched ? rawLoadMatched.replace('-', '/') : undefined;
      const rawSpeed = loadSpeedMatch.groups?.speedA || loadSpeedMatch.groups?.speedB || loadSpeedMatch.groups?.speedC;

      const testLoadIdx = rawLoad ? parseInt(rawLoad.split('/')[0], 10) : NaN;
      const isValidLoad = !isNaN(testLoadIdx) && Boolean(LOAD_INDEX_TABLE[testLoadIdx]);
      const isValidSpeed = Boolean(rawSpeed && (SPEED_RATING_TABLE[rawSpeed] || SPEED_RATING_TABLE[`(${rawSpeed})`]));

      // Chỉ chấp nhận nếu cả tải trọng và tốc độ đều nằm trong bảng quy chuẩn quốc tế
      if (isValidLoad && isValidSpeed && rawLoad) {
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

        if (rawSpeed) {
          const isBracketed = Boolean(loadSpeedMatch.groups?.speedA || loadSpeedMatch.groups?.speedB);
          speedRating = isBracketed ? `(${rawSpeed})` : rawSpeed;
        }
        continue;
      }
    }

    // 10.2. Nhận diện Ply Rating (Số lớp bố: 6PR, 8PR, 10PR, 14PR, 16PR...)
    if (/^\d{1,2}PR$/i.test(cleanUpper)) {
      techFeatures.push(`Số lớp bố ${cleanUpper}`);
      continue;
    }

    // 10.3. Nhận diện Extra Load (XL, RF, HL, REINFORCED)
    if (['XL', 'RF', 'HL', 'REINFORCED', 'SL'].includes(cleanUpper)) {
      extraLoad = cleanUpper === 'REINFORCED' ? 'XL' : cleanUpper;
      continue;
    }

    // 10.4. Nhận diện Load Range nếu chưa bóc tách trước đó
    if (!loadRange) {
      const isExplicitLrPrefix = cleanUpper.startsWith('LR-') || cleanUpper.startsWith('LOAD');
      const isStandaloneLrLetter = ['B', 'C', 'D', 'E', 'F'].includes(cleanUpper) && (vehicleType === 'LT' || isFlotation || isCommercialTruck);
      if (isExplicitLrPrefix || isStandaloneLrLetter) {
        const cleanLr = cleanUpper.replace(/^LR-?/, '').replace(/^LOAD\s*RANGE\s*/, '');
        if (LOAD_RANGE_TABLE[cleanLr]) {
          loadRange = cleanLr;
          loadRangeDesc = LOAD_RANGE_TABLE[cleanLr].desc;
          continue;
        }
      }
    }

    // 10.5. Nhận diện Ký hiệu địa hình từ TERRAIN_TECH_SPECS
    const normTerrain = TERRAIN_ALIAS[cleanUpper] || cleanUpper;
    if (TERRAIN_TECH_SPECS[normTerrain]) {
      const spec = TERRAIN_TECH_SPECS[normTerrain];
      terrainOrTech.push({ code: normTerrain, name: spec.name, desc: spec.desc });
      techFeatures.push(`${normTerrain} - ${spec.name}`);
      continue;
    }

    // 10.6. Nhận diện OE Marking hãng xe
    const normOe = OE_ALIAS[cleanUpper] || cleanUpper;
    if (OE_MARKINGS[normOe]) {
      oeMarking = {
        code: normOe,
        brand: OE_MARKINGS[normOe].brand,
        note: OE_MARKINGS[normOe].note
      };
      continue;
    }

    // Bỏ qua các dấu phân cách thừa
    if (/^[/\-:*]+$/.test(token)) {
      continue;
    }

    // Nhận diện hậu tố LT (Light Truck)
    if (cleanUpper === 'LT') {
      if (!vehicleType) vehicleType = 'LT';
      continue;
    }

    postUnrecognizedTokens.push(token);
  }

  // Quét các thông số trong PRE-SIZE (nếu có nhãn địa hình hay OE marking trước size)
  const preTokens = preSizeText.split(/\s+/).filter(Boolean);
  const preUnrecognizedTokens: string[] = [];

  for (const token of preTokens) {
    if (/^[/\-:*]+$/.test(token)) {
      continue;
    }
    const cleanUpper = token.toUpperCase();
    const normTerrain = TERRAIN_ALIAS[cleanUpper] || cleanUpper;
    if (TERRAIN_TECH_SPECS[normTerrain]) {
      const spec = TERRAIN_TECH_SPECS[normTerrain];
      terrainOrTech.push({ code: normTerrain, name: spec.name, desc: spec.desc });
      techFeatures.push(`${normTerrain} - ${spec.name}`);
      continue;
    }

    const normOe = OE_ALIAS[cleanUpper] || cleanUpper;
    if (OE_MARKINGS[normOe]) {
      oeMarking = {
        code: normOe,
        brand: OE_MARKINGS[normOe].brand,
        note: OE_MARKINGS[normOe].note
      };
      continue;
    }

    preUnrecognizedTokens.push(token);
  }

  // Bẫy 1: Ghép các token chưa nhận diện từ cả preSizeTokens và postSizeTokens để tạo thành Pattern hoàn chỉnh
  const patternTokens = [...preUnrecognizedTokens, ...postUnrecognizedTokens];
  const pattern = patternTokens.length > 0 ? patternTokens.join(' ') : undefined;
  const unrecognizedTokens = patternTokens.length > 0 ? patternTokens : undefined;

  // Nếu là tiền tố HL thì tự động gán kết cấu chịu tải HL nếu chưa có
  if (vehicleType === 'HL' && !extraLoad) {
    extraLoad = 'HL';
  }

  // Lỗi 7: Fallback mã tốc độ 'Z' nếu cấu trúc là 'ZR' mà không có ký hiệu tốc độ riêng ở đuôi
  if (!speedRating && construction === 'ZR') {
    speedRating = 'Z';
  }

  // Bẫy 2: Xác định loại xe và kiểm tra xe máy (isMotorcycle) ở cuối chuỗi sau khi đã có đầy đủ loadIndex, explicitMc
  if (explicitMc) {
    isMotorcycle = true;
    if (!vehicleType) vehicleType = 'MC';
  } else if (isMotorcycle) {
    // Đã được nhận diện từ TIER 2 (Lốp xe máy / scooter hệ inch 2.50-17, 3.50-10...)
    if (!vehicleType) vehicleType = 'MC';
  } else if (construction === '-' && rimDiameter >= 10 && rimDiameter <= 21 && width <= 140) {
    // Kết cấu bias xe máy
    isMotorcycle = true;
    if (!vehicleType) vehicleType = 'MC';
  } else if (!isCommercialTruck && !isFlotation) {
    // Nhận diện lốp mô tô phân khối lớn bánh sau (150/70R17, 160/60ZR17, 170/60R17, 180/55ZR17, 190/50ZR17, 190/55ZR17, 200/55ZR17...)
    const isBigBikeRearSize = [150, 160, 170, 180, 190, 200].includes(width) && [16, 17, 18, 19].includes(rimDiameter) && (loadIndex === undefined || loadIndex <= 78);
    if (isBigBikeRearSize) {
      isMotorcycle = true;
      if (!vehicleType) vehicleType = 'MC';
    } else if (width <= 140) {
      if (construction === 'R' || construction === 'ZR') {
        if (loadIndex !== undefined && loadIndex >= 68) {
          // Lốp ô tô du lịch cỡ nhỏ (Matiz, Morning) hoặc lốp dự phòng Space Saver
          isMotorcycle = false;
          if (!vehicleType || vehicleType === 'MC') vehicleType = 'P';
        } else if (loadIndex !== undefined && loadIndex < 68) {
          isMotorcycle = true;
          if (!vehicleType) vehicleType = 'MC';
        } else {
          // Chưa có loadIndex: xét hình học, mâm và bề rộng
          if (vehicleType === 'P' || vehicleType === 'T' || width >= 135) {
            isMotorcycle = false;
            if (!vehicleType) vehicleType = 'P';
          } else if (width <= 120 && [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21].includes(rimDiameter) && aspectRatio >= 60) {
            // Xe máy / xe tay ga thông dụng mâm từ 10 đến 21 inch (Honda Lead, Vision, Vespa...)
            isMotorcycle = true;
            if (!vehicleType) vehicleType = 'MC';
          } else if (rimDiameter <= 13) {
            isMotorcycle = false;
            if (!vehicleType) vehicleType = 'P';
          } else if ([14, 16, 17, 18, 19, 21].includes(rimDiameter) && [130, 140].includes(width) && aspectRatio >= 60) {
            isMotorcycle = true;
            if (!vehicleType) vehicleType = 'MC';
          }
        }
      } else {
        isMotorcycle = true;
        if (!vehicleType) vehicleType = 'MC';
      }
    }
  }

  // Tinh chỉnh kết cấu Bias cho lốp xe máy phổ thông nếu chuỗi gốc không có 'R' hoặc 'ZR' và không phải hệ inch có dấu chấm
  if (isMotorcycle && !sizeMatchedSubstring.includes('.') && !/\b(?:ZR|R)\b/i.test(sizeMatchedSubstring) && !/\b[0-9]+[RZ][0-9]+/i.test(sizeMatchedSubstring)) {
    construction = '-';
    normalizedSize = `${width}/${aspectRatio}-${rimDiameter}`;
  }

  let validationWarning: string | undefined;
  if (!isMotorcycle && !isCommercialTruck && !isFlotation) {
    if (width < 115 || width > 395 || aspectRatio < 20 || aspectRatio > 90 || rimDiameter < 10 || rimDiameter > 26) {
      validationWarning = `Cảnh báo: Kích thước lốp (${width}/${aspectRatio}${construction}${rimDiameter}) nằm ngoài dải quy chuẩn thông dụng thực tế.`;
    }
  }

  const maxLoadKg = maxLoadExplicitKg || (loadIndex && LOAD_INDEX_TABLE[loadIndex] ? LOAD_INDEX_TABLE[loadIndex] : undefined);
  const maxTotalLoadKg = dualLoadKg ? dualLoadKg.singleTotal4 : (maxLoadKg ? (isMotorcycle ? maxLoadKg * 2 : maxLoadKg * 4) : undefined);

  const cleanSpeedKey = speedRating?.replace(/[()]/g, '');
  const speedInfo = (speedRating && SPEED_RATING_TABLE[speedRating]) 
    || (cleanSpeedKey && SPEED_RATING_TABLE[cleanSpeedKey]) 
    || undefined;

  // Xác định mô tả loại xe
  let vehicleTypeDesc = 'Euro-Metric (Chuẩn xe du lịch quốc tế thông dụng)';
  if (isFlotation) {
    vehicleTypeDesc = 'Hệ Inch Flotation (Chuẩn xe bán tải / độ việt dã địa hình)';
  } else if (isMotorcycle) {
    vehicleTypeDesc = 'Motorcycle (Chuẩn lốp xe máy, mô tô, xe tay ga)';
  } else if (isCommercialTruck) {
    vehicleTypeDesc = 'Commercial Truck (Lốp xe tải nặng, xe buýt, xe chuyên dụng)';
  } else if (vehicleType && VEHICLE_TYPE_MAP[vehicleType]) {
    vehicleTypeDesc = VEHICLE_TYPE_MAP[vehicleType];
  }

  return {
    rawString: input.trim(),
    normalizedSize,
    brand,
    brandCountry,
    pattern,
    isMotorcycle,
    isCommercialTruck,
    isFlotation,
    isRunflat,
    runflatTech,
    flotationSpec,
    vehicleType,
    vehicleTypeDesc,
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
    unrecognizedTokens,
    validationWarning,
    dotCode,
    dotAnalysis,
    maxPressurePsi,
    maxLoadExplicitKg,
    utqg: (utqgTreadwear || utqgTraction || utqgTemperature) ? {
      treadwear: utqgTreadwear,
      traction: utqgTraction,
      temperature: utqgTemperature
    } : undefined
  };
}
