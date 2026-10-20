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
  { name: 'Michelin', pattern: /\b(?:MICHELIN|MICHE)\b/i, country: 'Pháp' },
  { name: 'Bridgestone', pattern: /\b(?:BRIDGESTONE|BS)\b/i, country: 'Nhật Bản' },
  { name: 'Goodyear', pattern: /\bGOODYEAR\b/i, country: 'Mỹ' },
  { name: 'Continental', pattern: /\b(?:CONTINENTAL|CONTI)\b/i, country: 'Đức' },
  { name: 'Pirelli', pattern: /\bPIRELLI\b/i, country: 'Ý' },
  { name: 'Dunlop', pattern: /\bDUNLOP\b/i, country: 'Anh/Nhật Bản' },
  { name: 'Yokohama', pattern: /\b(?:YOKOHAMA|YOKO)\b/i, country: 'Nhật Bản' },
  { name: 'Hankook', pattern: /\bHANKOOK\b/i, country: 'Hàn Quốc' },
  { name: 'Kumho', pattern: /\bKUMHO\b/i, country: 'Hàn Quốc' },
  { name: 'Nexen', pattern: /\bNEXEN\b/i, country: 'Hàn Quốc' },
  { name: 'Toyo', pattern: /\bTOYO\b/i, country: 'Nhật Bản' },
  { name: 'Maxxis', pattern: /\bMAXXIS\b/i, country: 'Đài Loan' },
  { name: 'BFGoodrich', pattern: /\b(?:BFGOODRICH|BF\s*GOODRICH|BFG)\b/i, country: 'Mỹ' },
  { name: 'Cooper', pattern: /\bCOOPER\b/i, country: 'Mỹ' },
  { name: 'Falken', pattern: /\bFALKEN\b/i, country: 'Nhật Bản' },
  { name: 'DRC', pattern: /\b(?:DRC|DA\s*NANG|ĐÀ\s*NẴNG)\b/i, country: 'Việt Nam (Cao Su Đà Nẵng)' },
  { name: 'Casumina', pattern: /\b(?:CASUMINA|CSM)\b/i, country: 'Việt Nam (Miền Nam)' },
  { name: 'SRC', pattern: /\b(?:SRC|SAO\s*VANG|SAO\s*VÀNG)\b/i, country: 'Việt Nam (Cao Su Sao Vàng)' },
  { name: 'Kenda', pattern: /\bKENDA\b/i, country: 'Đài Loan' },
  { name: 'Sailun', pattern: /\bSAILUN\b/i, country: 'Trung Quốc' },
  { name: 'Linglong', pattern: /\b(?:LINGLONG|LING\s*LONG)\b/i, country: 'Trung Quốc' },
  { name: 'Giti', pattern: /\bGITI\b/i, country: 'Singapore' },
  { name: 'Otani', pattern: /\bOTANI\b/i, country: 'Thái Lan' },
  { name: 'Deestone', pattern: /\bDEESTONE\b/i, country: 'Thái Lan' },
  { name: 'Milestar', pattern: /\bMILESTAR\b/i, country: 'Mỹ' },
  { name: 'IRC / Inoue', pattern: /\b(?:IRC|INOUE)\b/i, country: 'Nhật Bản/Việt Nam' },
  { name: 'Vee Rubber', pattern: /\bVEE\s*RUBBER\b/i, country: 'Thái Lan' }
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
 * Phân tích và giải mã chuỗi thông số lốp toàn diện
 * Hỗ trợ nhận diện thông minh đa thuộc tính (Smart Multi-attribute Extractor):
 * 1. Nhận diện thương hiệu & tên dòng gai lốp
 * 2. Kích thước tự do: dấu cách (205 55 16), gạch nối (205-55-16), mâm lẻ xe tải (11R22.5, 295/80R22.5, 7.50R16), xe máy (90/90-14)
 * 3. Bóc tách tự động mã DOT, UTQG (Treadwear/Traction/Temp), MAX PRESS, Tubeless, Runflat
 */
export function parseFullTireString(input: string): FullTireSpec | null {
  if (!input || !input.trim()) return null;

  // 1. Chuẩn hóa chuỗi đầu vào cơ bản (Sanitization Pipeline)
  let workingText = input.trim();

  // 1.1. Chuẩn hóa dấu phẩy số thập phân kiểu Việt/Châu Âu (ví dụ: "22,5" -> "22.5", "12,5" -> "12.5")
  workingText = workingText.replace(/(\d+),(\d+)/g, '$1.$2');

  // 1.2. Chuyển các dấu phẩy còn lại thành khoảng trắng
  workingText = workingText.replace(/,/g, ' ');

  // 1.3. Sửa lỗi gõ nhầm O/o thành 0 trong cụm số kích thước hoặc tải trọng
  workingText = workingText.replace(/(?<=\d)[Oo](?=\d)/g, '0');
  workingText = workingText.replace(/(?<=[\/\s\-])[Oo](?=\d)/g, '0');
  workingText = workingText.replace(/(?<=\d)[Oo](?=[\/\s\-]|$)/g, '0');

  // 1.4. Sửa lỗi gõ nhầm I/l thành 1 trong cụm số
  workingText = workingText.replace(/(?<=[A-Z\/\s\-])[Il](?=\d)/g, '1');
  workingText = workingText.replace(/(?<=\d)[Il](?=\d)/g, '1');
  workingText = workingText.replace(/(?<=\d)[Il](?=[A-Z\/\s\-]|$)/g, '1');

  // 1.5. Tách biệt dấu hoa thị * (OE Marking của BMW) thành token độc lập
  workingText = workingText.replace(/\s*\*\s*/g, ' * ');

  // 1.6. Chuẩn hóa cụm Tải trọng & Tốc độ nếu bị gõ rời khoảng trắng ("87 V" -> "87V", "112/109 Q" -> "112/109Q", "95 (Y)" -> "95(Y)")
  workingText = workingText.replace(/\b(\d{2,3}(?:\/\d{2,3})?)\s+([A-Z]|\([A-Z]\))\b/g, '$1$2');
  workingText = workingText.replace(/\b(\d{2,3}(?:\/\d{2,3})?)\s*\(\s*([A-Z])\s*\)\b/g, '$1($2)');

  // 1.7. Chuẩn hóa khoảng trắng lặp lại
  workingText = workingText.replace(/\s+/g, ' ');

  let brand: string | undefined;
  let brandCountry: string | undefined;

  // 2. Tìm và bóc tách THƯƠNG HIỆU LỐP (Brand Extractor)
  for (const b of KNOWN_TIRE_BRANDS) {
    if (b.pattern.test(workingText)) {
      brand = b.name;
      brandCountry = b.country;
      workingText = workingText.replace(b.pattern, ' ');
      break;
    }
  }

  // 3. Tìm và bóc tách MÃ DOT (Date of Tire - 4 số tuần/năm, hỗ trợ cả mã DOT 3 cụm nhà máy)
  let dotCode: string | undefined;
  let dotAnalysis: DotCodeResult | undefined;
  // Hỗ trợ: "DOT 4721", "DOT 4B08 4721", "DOT B9V3 JCMR 3422", "DOT: 1223"
  const dotMatch = workingText.match(/\bDOT\b(?:\s+[A-Z0-9]{2,5}){0,3}\s+(\d{4})\b/i)
    || workingText.match(/\bDOT\s*[:=]?\s*(\d{4})\b/i)
    || workingText.match(/\bDOT\b[^\d]*(\d{4})\b/i);
  if (dotMatch) {
    const rawDot = dotMatch[1];
    if (rawDot && /^\d{4}$/.test(rawDot)) {
      dotCode = rawDot;
      const res = parseDotCode(dotCode);
      if (res) dotAnalysis = res;
      workingText = workingText.replace(dotMatch[0], ' ');
    }
  }

  // 4. Tìm và bóc tách MAX PRESS (Áp suất tối đa dập nổi mép mép tanh lốp)
  // Hỗ trợ: "MAX PRESS 44 PSI", "MAX PRESSURE 50 PSI (340 KPA)", "300 KPA (44 PSI) MAX PRESS"
  let maxPressurePsi: number | undefined;
  const pressMatch = workingText.match(/\bMAX\s*PRESS(?:URE)?\s*[:=]?\s*(\d{2,3})\s*(?:PSI|KPA|BAR)?\b/i)
    || workingText.match(/\b(\d{2,3})\s*PSI\b/i)
    || workingText.match(/\b(\d{3})\s*KPA\b/i);
  if (pressMatch) {
    const val = parseInt(pressMatch[1], 10);
    // Nếu đơn vị là KPa thì quy đổi sang PSI (1 PSI ≈ 6.895 KPa)
    maxPressurePsi = pressMatch[0].toUpperCase().includes('KPA') && val > 100 
      ? Math.round(val / 6.89476) 
      : val;
    workingText = workingText.replace(pressMatch[0], ' ');
  }

  // 5. Tìm và bóc tách MAX LOAD (Tải trọng tối đa dập nổi dạng: MAX LOAD 615 KG (1356 LBS))
  let maxLoadExplicitKg: number | undefined;
  const loadExplicitMatch = workingText.match(/\bMAX\s*LOAD(?:\s*(?:SINGLE|DUAL))?\s*[:=]?\s*(\d{3,5})\s*(?:KG|KGS)?(?:\s*\(\s*(\d{3,5})\s*LBS\s*\))?/i)
    || workingText.match(/\bMAX\s*LOAD\s*[:=]?\s*(\d{3,5})\s*LBS/i);
  if (loadExplicitMatch) {
    if (loadExplicitMatch[1]) {
      const val = parseInt(loadExplicitMatch[1], 10);
      maxLoadExplicitKg = val < 20000 ? val : undefined;
    }
    workingText = workingText.replace(loadExplicitMatch[0], ' ');
  }

  // 6. Tìm và bóc tách TIÊU CHUẨN UTQG (Mỹ)
  let utqgTreadwear: number | undefined;
  let utqgTraction: string | undefined;
  let utqgTemperature: string | undefined;

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

  // 7. Lọc bỏ các từ đệm/tiêu chuẩn thông dụng và trích xuất công nghệ
  const techFeatures: string[] = [];
  const terrainOrTech: { code: string; name: string; desc: string }[] = [];
  let isRunflat = false;
  let runflatTech: string | undefined;

  const checkAndExtractFeature = (pattern: RegExp, label: string) => {
    if (pattern.test(workingText)) {
      techFeatures.push(label);
      workingText = workingText.replace(pattern, ' ');
    }
  };

  // 7.1. Bóc tách Run-flat
  const runflatRegex = /\b(?:RFT|RUNFLAT|RUN-FLAT|RUN\s*FLAT|SSR|ROF|ZP|RSC|DRIVEGUARD)\b/i;
  const runflatMatch = workingText.match(runflatRegex);
  if (runflatMatch) {
    isRunflat = true;
    runflatTech = runflatMatch[0].toUpperCase().replace(/\s+/g, '');
    techFeatures.push(`Lốp chống xịt Run-flat (${runflatTech})`);
    workingText = workingText.replace(runflatRegex, ' ');
  }

  // 7.2. Tiêu âm / Công nghệ chống đinh tự vá
  const acousticRegex = /\b(?:ACOUSTIC|CONTISEAL|SEAL|B-SILENT|SOUNDCOMFORT|SILENT\s*DRIVE)\b/i;
  const acousticMatch = workingText.match(acousticRegex);
  if (acousticMatch) {
    techFeatures.push(`Công nghệ tiêu âm/tự vá (${acousticMatch[0].toUpperCase()})`);
    workingText = workingText.replace(acousticRegex, ' ');
  }

  // 7.3. Cấu trúc lớp bố dập nổi (Plies & Materials: Tread 2 Polyester + 2 Steel + 1 Nylon...)
  const pliesMatch = workingText.match(/\bPLIES\s*:?[^;.\n]*(?:SIDEWALL[^;.\n]*)?/i);
  if (pliesMatch) {
    techFeatures.push(`Cấu trúc lớp bố: ${pliesMatch[0].trim()}`);
    workingText = workingText.replace(pliesMatch[0], ' ');
  }
  // Lọc sạch các từ vật liệu bố lốp để không bị lẫn vào tên gai
  workingText = workingText.replace(/\b(?:POLYESTER|RAYON|POLYAMIDE|ARAMID|KEVLAR|NYLON)\b/gi, ' ');
  workingText = workingText.replace(/\b\d+\s*PLIES\b/gi, ' ');
  workingText = workingText.replace(/\b(?:TREAD|SIDEWALL)\s*(?:\d+\s*PLIES)?\b/gi, ' ');

  // 7.4. Mã tiêu chuẩn an toàn quốc tế dập trên lốp (E-Mark Châu Âu, CCC, DOT, TWI, COLD...)
  workingText = workingText.replace(/\b\(?E\d{1,2}\)?\s*\d{5,7}(?:-S)?\b/gi, ' '); // E4 0212345
  workingText = workingText.replace(/\b(?:CCC|INMETRO|BIS|SNI|JIS|NOM)\b/gi, ' ');
  workingText = workingText.replace(/\bTWI\b/gi, ' '); // Gờ báo mòn
  workingText = workingText.replace(/\bCOLD\b/gi, ' '); // At cold pressure

  checkAndExtractFeature(/\bTUBELESS\b/i, 'Lốp không săm (Tubeless)');
  checkAndExtractFeature(/\bTUBE\s*TYPE\b/i, 'Lốp có săm (Tube Type)');
  checkAndExtractFeature(/\bRADIAL\b/i, 'Bố tỏa tròn Radial');
  checkAndExtractFeature(/\bSTEEL\s*BELTED\b/i, 'Bố thép chịu lực (Steel Belted)');
  checkAndExtractFeature(/\bOUTSIDE\b/i, 'Gai bất đối xứng (Mặt Outside)');
  checkAndExtractFeature(/\bINSIDE\b/i, 'Gai bất đối xứng (Mặt Inside)');
  checkAndExtractFeature(/\bROTATION\b/i, 'Gai lốp định hướng quay');

  // Lọc bỏ từ vựng tiếng Việt hoặc tiếng Anh thừa
  workingText = workingText.replace(/\b(?:LỐP|BÁNH|VỎ|XE|TIRE|TYRE|SIZE|CỠ|SPEC)\b/gi, ' ');
  workingText = workingText.replace(/\bMADE\s+IN\s+[A-Z]+\b/gi, ' ');

  // Chuẩn hóa dấu cách quanh dấu gạch chéo và dấu x
  workingText = workingText.trim().replace(/\s+/g, ' ');
  workingText = workingText.replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2');
  workingText = workingText.replace(/(\d+)\s*[xX*]\s*(\d+)/g, '$1X$2');

  // 8. BÓC TÁCH KÍCH THƯỚC LỐP CHÍNH (TIRE SIZE EXTRACTOR - MULTI-TIER ENGINE)
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

  // 8.1. TIER 1: Dạng Flotation (33X12.50R15, 35x12.5 R17, 31x10.5-15, LT33x12.50R15, 37x12.50R16.5...)
  const flotationRegex = /\b(?<typePre>LT)?\s*(?<dia>\d{2}(?:\.\d{1,2})?)\s*[xX*]\s*(?<wInch>\d{1,2}(?:\.\d{1,2})?)\s*(?<construction>ZR|R|B|D|-)?\s*(?<rim>\d{2}(?:\.5)?)\s*(?<typePost>LT)?\b/i;
  const floatMatch = workingText.match(flotationRegex);

  if (floatMatch && floatMatch.groups) {
    isFlotation = true;
    sizeMatchedSubstring = floatMatch[0];
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
    normalizedSize = `${diaInch}X${wInch}${construction}${rimDiameter}`;
  } else {
    // 8.2. TIER 2: Lốp Xe Tải Nặng Hệ Inch Không Tỷ Lệ (11R22.5, 12R22.5, 7.50R16, 8.25R16, 10.00R20, 7.50-16, 10-16.5...)
    const truckInchRegex = /\b(?<width>\d{1,2}(?:\.\d{2})?)\s*(?<construction>ZR|R|B|D|-)\s*(?<rim>\d{2}(?:\.5)?)\s*(?<commSuffix>C)?\b/i;
    const truckMatch = workingText.match(truckInchRegex);

    if (truckMatch && truckMatch.groups && parseFloat(truckMatch.groups.width) <= 15) {
      isCommercialTruck = true;
      sizeMatchedSubstring = truckMatch[0];
      const wInch = parseFloat(truckMatch.groups.width);
      rimDiameter = parseFloat(truckMatch.groups.rim);
      construction = truckMatch.groups.construction.toUpperCase();
      vehicleType = 'TRUCK';

      width = Math.round(wInch * 25.4);
      // Lốp tải hệ inch truyền thống có tỷ lệ hông mặc định:
      // Dạng 11R22.5, 12R22.5 thường có tỷ lệ hông 88-90%
      // Dạng 7.50R16, 8.25R16, 7.50-16 thường có tỷ lệ hông 100%
      aspectRatio = wInch >= 9 ? 90 : 100;
      normalizedSize = `${truckMatch.groups.width}${construction}${rimDiameter}`;
    } else {
      // 8.3. TIER 3: Viết Liền Không Dấu Phân Cách (Continuous Digits - người dùng gõ phím số)
      // Dạng 3.1: Viết liền có ký tự cấu trúc (19555R16, 22545ZR18, 19570R15C...)
      const contConstRegex = /\b(?<type>HL|LT|ST|P|T)?(?<width>\d{3})(?<ratio>\d{2})(?<construction>ZR|R|D)(?<rim>\d{2}(?:\.5)?)(?<commSuffix>C)?\b/i;
      const contConstMatch = workingText.match(contConstRegex);

      // Dạng 3.2: Viết liền hoàn toàn 7 chữ số (1955516, 2056016...)
      const contDigitsRegex = /\b(?<type>HL|LT|ST|P|T)?(?<width>\d{3})(?<ratio>\d{2})(?<rim>\d{2})(?<commSuffix>C)?\b/i;
      const contDigitsMatch = !contConstMatch ? workingText.match(contDigitsRegex) : null;

      if (contConstMatch && contConstMatch.groups) {
        sizeMatchedSubstring = contConstMatch[0];
        width = parseInt(contConstMatch.groups.width, 10);
        aspectRatio = parseInt(contConstMatch.groups.ratio, 10);
        construction = contConstMatch.groups.construction.toUpperCase();
        rimDiameter = parseFloat(contConstMatch.groups.rim);
        vehicleType = (contConstMatch.groups.type || (contConstMatch.groups.commSuffix ? 'C' : undefined))?.toUpperCase();
        normalizedSize = `${contConstMatch.groups.type || ''}${width}/${aspectRatio}${construction}${rimDiameter}${contConstMatch.groups.commSuffix || ''}`.trim();
      } else if (contDigitsMatch && contDigitsMatch.groups) {
        sizeMatchedSubstring = contDigitsMatch[0];
        width = parseInt(contDigitsMatch.groups.width, 10);
        aspectRatio = parseInt(contDigitsMatch.groups.ratio, 10);
        construction = 'R'; // Mặc định là kết cấu Radial
        rimDiameter = parseFloat(contDigitsMatch.groups.rim);
        vehicleType = (contDigitsMatch.groups.type || (contDigitsMatch.groups.commSuffix ? 'C' : undefined))?.toUpperCase();
        normalizedSize = `${contDigitsMatch.groups.type || ''}${width}/${aspectRatio}${construction}${rimDiameter}${contDigitsMatch.groups.commSuffix || ''}`.trim();
      } else {
        // 8.4. TIER 4: Metric Chuẩn & Mở Rộng
        // Hỗ trợ: 205/55R16, 205 55 R16, 205 55 16, 205-55-16, 195/55/16, 195-55-R16, 295/80R22.5, 195R15C, 90/90-14...
        const metricRegex = /\b(?<type>HL|LT|ST|P|T|C)?\s*(?<width>\d{2,3})(?:[\/\s-](?<ratio>\d{2}))?\s*[\/\s-]*(?<construction>ZR|R|B|D|-)?\s*[\/\s-]*(?<rim>\d{2}(?:\.5)?)\s*(?<commSuffix>C)?\b/i;
        const metricMatch = workingText.match(metricRegex);

        if (metricMatch && metricMatch.groups) {
          sizeMatchedSubstring = metricMatch[0];
          width = parseInt(metricMatch.groups.width, 10);
          aspectRatio = metricMatch.groups.ratio ? parseInt(metricMatch.groups.ratio, 10) : 80;
          rimDiameter = parseFloat(metricMatch.groups.rim);
          construction = (metricMatch.groups.construction || 'R').toUpperCase();
          vehicleType = (metricMatch.groups.type || (metricMatch.groups.commSuffix ? 'C' : undefined))?.toUpperCase();

          if (rimDiameter === 22.5 || rimDiameter === 19.5 || rimDiameter === 17.5) {
            isCommercialTruck = true;
            if (!vehicleType) vehicleType = 'TRUCK';
          }

          // Kiểm tra xem có phải lốp xe máy không (thường bề rộng <= 140, mâm 10-21, hoặc có dấu '-')
          if (width <= 140 && (construction === '-' || !metricMatch.groups.type) && rimDiameter >= 10 && rimDiameter <= 21) {
            if (width <= 140 && (aspectRatio >= 60 || construction === '-')) {
              isMotorcycle = true;
              if (!vehicleType) vehicleType = 'MC';
            }
          }

          normalizedSize = `${metricMatch.groups.type || ''}${width}/${aspectRatio}${construction}${rimDiameter}${metricMatch.groups.commSuffix || ''}`.trim();
        } else {
          // Không tìm thấy cụm kích thước lốp hợp lệ
          return null;
        }
      }
    }
  }

  // 9. Bóc tách phần chuỗi còn lại để tìm Tải trọng, Tốc độ, OE Marking, Công nghệ, Tên Gai Lốp
  // Xóa cụm kích thước đã bóc tách ra khỏi workingText
  if (sizeMatchedSubstring) {
    workingText = workingText.replace(sizeMatchedSubstring, ' ');
  }

  let validationWarning: string | undefined;
  if (!isMotorcycle && !isCommercialTruck && !isFlotation) {
    if (width < 125 || width > 395 || aspectRatio < 20 || aspectRatio > 90 || rimDiameter < 10 || rimDiameter > 26) {
      validationWarning = `Cảnh báo: Kích thước lốp (${width}/${aspectRatio}${construction}${rimDiameter}) nằm ngoài dải quy chuẩn thông dụng thực tế.`;
    }
  }

  let loadIndex: number | undefined;
  let dualLoadIndex: string | undefined;
  let dualLoadKg: { single: number; dual: number; singleTotal4: number } | undefined;
  let speedRating: string | undefined;
  let extraLoad: string | undefined;
  let loadRange: string | undefined;
  let loadRangeDesc: string | undefined;
  let oeMarking: { brand: string; note: string; code: string } | undefined;
  const unrecognizedTokens: string[] = [];

  const remainingTokens = workingText.trim().split(/\s+/).filter(Boolean);

  for (let i = 0; i < remainingTokens.length; i++) {
    const token = remainingTokens[i];
    let cleanUpper = token.toUpperCase();

    // 9.1. Nhận diện Tải trọng & Tốc độ
    // Nếu token hiện tại là số tải trọng (\d{2,3}) và token kế tiếp là chữ cái tốc độ đơn lẻ ([A-Z] hoặc ([A-Z]))
    if (!loadIndex && !speedRating && /^\d{2,3}(?:\/\d{2,3})?$/.test(cleanUpper) && i + 1 < remainingTokens.length) {
      const nextToken = remainingTokens[i + 1].toUpperCase();
      if (/^[A-Z]$|^\([A-Z]\)$/.test(nextToken)) {
        cleanUpper = `${cleanUpper}${nextToken}`;
        i++; // Bỏ qua token kế tiếp vì đã gộp
      }
    }

    // Hỗ trợ: 91V, 123/120R, (103Y), 103(Y), (58W), 58W, 46P...
    const loadSpeedMatch = cleanUpper.match(/^(?:(?:\((?<loadA>\d{2,3}(?:\/\d{2,3})?)(?<speedA>[A-Z])\))|(?<loadB>\d{2,3}(?:\/\d{2,3})?)\s*\((?<speedB>[A-Z])\)|(?<loadC>\d{2,3}(?:\/\d{2,3})?)(?<speedC>[A-Z]))$/);

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

    // 9.2. Nhận diện Ply Rating (Số lớp bố: 6PR, 8PR, 10PR, 14PR, 16PR...)
    if (/^\d{1,2}PR$/i.test(cleanUpper)) {
      techFeatures.push(`Số lớp bố ${cleanUpper}`);
      continue;
    }

    // 9.3. Nhận diện Extra Load (XL, RF, HL, REINFORCED)
    if (['XL', 'RF', 'HL', 'REINFORCED', 'SL'].includes(cleanUpper)) {
      extraLoad = cleanUpper === 'REINFORCED' ? 'XL' : cleanUpper;
      continue;
    }

    // 9.4. Nhận diện Load Range (B, C, D, E, F)
    if (['B', 'C', 'D', 'E', 'F'].includes(cleanUpper) || cleanUpper.startsWith('LR-') || cleanUpper.startsWith('LOAD')) {
      const cleanLr = cleanUpper.replace(/^LR-?/, '').replace(/^LOAD\s*RANGE\s*/, '');
      if (LOAD_RANGE_TABLE[cleanLr]) {
        loadRange = cleanLr;
        loadRangeDesc = LOAD_RANGE_TABLE[cleanLr].desc;
      } else {
        loadRange = cleanLr;
      }
      continue;
    }

    // 9.5. Nhận diện Ký hiệu địa hình từ TERRAIN_TECH_SPECS
    const TERRAIN_ALIAS: Record<string, string> = {
      HT: 'H/T',
      AT: 'A/T',
      MT: 'M/T',
      RT: 'R/T',
      'M/S': 'M+S',
      MS: 'M+S',
      '3PMSF': '3PMSF'
    };
    const normTerrain = TERRAIN_ALIAS[cleanUpper] || cleanUpper;
    if (TERRAIN_TECH_SPECS[normTerrain]) {
      const spec = TERRAIN_TECH_SPECS[normTerrain];
      terrainOrTech.push({ code: normTerrain, name: spec.name, desc: spec.desc });
      techFeatures.push(`${normTerrain} - ${spec.name}`);
      continue;
    }

    // 9.6. Nhận diện OE Marking hãng xe
    const OE_ALIAS: Record<string, string> = {
      STAR: '*'
    };
    const normOe = OE_ALIAS[cleanUpper] || cleanUpper;
    if (OE_MARKINGS[normOe]) {
      oeMarking = {
        code: normOe,
        brand: OE_MARKINGS[normOe].brand,
        note: OE_MARKINGS[normOe].note
      };
      continue;
    }

    // Những từ còn lại có thể là Tên dòng gai lốp (Pattern) hoặc từ chưa nhận diện
    unrecognizedTokens.push(token);
  }

  // Nếu là tiền tố HL thì tự động gán kết cấu chịu tải HL nếu chưa có
  if (vehicleType === 'HL' && !extraLoad) {
    extraLoad = 'HL';
  }

  const maxLoadKg = maxLoadExplicitKg || (loadIndex && LOAD_INDEX_TABLE[loadIndex] ? LOAD_INDEX_TABLE[loadIndex] : undefined);
  const maxTotalLoadKg = dualLoadKg ? dualLoadKg.singleTotal4 : (maxLoadKg ? (isMotorcycle ? maxLoadKg * 2 : maxLoadKg * 4) : undefined);
  const cleanSpeedKey = speedRating?.replace(/[()]/g, '');
  const speedInfo = (speedRating && SPEED_RATING_TABLE[speedRating]) 
    || (cleanSpeedKey && SPEED_RATING_TABLE[cleanSpeedKey]) 
    || undefined;

  // Gom các token chưa nhận diện thành Tên Dòng Gai Lốp nếu hợp lý
  let pattern: string | undefined;
  if (unrecognizedTokens.length > 0) {
    pattern = unrecognizedTokens.join(' ');
  }

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
    unrecognizedTokens: unrecognizedTokens.length > 0 ? unrecognizedTokens : undefined,
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
