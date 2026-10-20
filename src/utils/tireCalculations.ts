export interface TireParams {
  width: number; // Chiều rộng lốp (mm), ví dụ 265
  aspectRatio: number; // Tỷ lệ chiều cao thành lốp (%), ví dụ 65
  rimDiameter: number; // Đường kính mâm (inch), ví dụ 17
}

export interface TireCalculation {
  sidewallHeightMm: number; // Chiều cao thành lốp (mm)
  totalDiameterMm: number; // Đường kính tổng (mm)
  totalDiameterInch: number; // Đường kính tổng (inch)
  circumferenceMm: number; // Chu vi lăn (mm)
  revsPerKm: number; // Số vòng quay / km
}

/**
 * Tính toán các thông số hình học của lốp xe
 * Công thức chuẩn:
 * D_mm = rim_in * 25.4 + 2 * width_mm * AR / 100
 * C_mm = pi * D_mm
 */
export function calculateTire(params: TireParams): TireCalculation {
  const sidewallHeightMm = (params.width * params.aspectRatio) / 100;
  const totalDiameterMm = params.rimDiameter * 25.4 + 2 * sidewallHeightMm;
  const totalDiameterInch = totalDiameterMm / 25.4;
  const circumferenceMm = Math.PI * totalDiameterMm;
  const revsPerKm = circumferenceMm > 0 ? 1000000 / circumferenceMm : 0;

  return {
    sidewallHeightMm: Math.round(sidewallHeightMm * 10) / 10,
    totalDiameterMm: Math.round(totalDiameterMm * 10) / 10,
    totalDiameterInch: Math.round(totalDiameterInch * 100) / 100,
    circumferenceMm: Math.round(circumferenceMm * 10) / 10,
    revsPerKm: Math.round(revsPerKm),
  };
}

/**
 * So sánh 2 cỡ lốp (Zin vs Độ)
 */
export interface TireComparison {
  diameterDiffMm: number;
  diameterDiffPercent: number;
  rideHeightDiffMm: number; // Độ nâng/hạ gầm (bán kính)
  speedometerErrorAt100Kmh: number; // Khi đồng hồ chỉ 100km/h, tốc độ thực là bao nhiêu
}

export function compareTires(oldTire: TireCalculation, newTire: TireCalculation): TireComparison {
  const diameterDiffMm = newTire.totalDiameterMm - oldTire.totalDiameterMm;
  const diameterDiffPercent = oldTire.totalDiameterMm > 0 
    ? (diameterDiffMm / oldTire.totalDiameterMm) * 100 
    : 0;
  const rideHeightDiffMm = diameterDiffMm / 2;
  // v_actual = v_indicated * (C_new / C_old)
  const speedometerErrorAt100Kmh = oldTire.circumferenceMm > 0
    ? 100 * (newTire.circumferenceMm / oldTire.circumferenceMm)
    : 100;

  return {
    diameterDiffMm: Math.round(diameterDiffMm * 10) / 10,
    diameterDiffPercent: Math.round(diameterDiffPercent * 100) / 100,
    rideHeightDiffMm: Math.round(rideHeightDiffMm * 10) / 10,
    speedometerErrorAt100Kmh: Math.round(speedometerErrorAt100Kmh * 10) / 10,
  };
}

/**
 * Phân tích chuỗi định dạng lốp linh hoạt (hỗ trợ 265/65R17, 265 65 17, 265-65-17, 295/80R22.5, 33x12.5R15, 90/90-14...)
 */
export function parseTireString(str: string): TireParams | null {
  if (!str || !str.trim()) return null;
  let cleaned = str.trim().toUpperCase().replace(/,/g, '.').replace(/\s+/g, ' ');

  // 1. Dạng Flotation (ví dụ 33x12.5R15 hoặc 35 12.5 17)
  const floatMatch = cleaned.match(/\b(?:\d{2}(?:\.\d{1,2})?)\s*[X*X\s]\s*(\d{1,2}(?:\.\d{1,2})?)\s*[A-Z-]?\s*(\d{2}(?:\.5)?)\b/i);
  if (floatMatch) {
    const diaInch = parseFloat(cleaned.match(/\b(\d{2}(?:\.\d{1,2})?)/)?.[1] || '0');
    const wInch = parseFloat(floatMatch[1]);
    const rim = parseFloat(floatMatch[2]);
    const widthMm = Math.round(wInch * 25.4);
    const sidewallMm = ((diaInch - rim) / 2) * 25.4;
    const ratio = Math.round((sidewallMm / widthMm) * 100);
    return { width: widthMm, aspectRatio: ratio, rimDiameter: rim };
  }

  // 2. Dạng viết liền không dấu (19555R16, 1955516, 22545ZR18)
  const contMatch = cleaned.match(/\b(?:HL|LT|ST|P|T)?(\d{3})(\d{2})[A-Z-]?(\d{2}(?:\.5)?)\b/i);
  if (contMatch) {
    return {
      width: parseInt(contMatch[1], 10),
      aspectRatio: parseInt(contMatch[2], 10),
      rimDiameter: parseFloat(contMatch[3]),
    };
  }

  // 3. Dạng Metric chuẩn và mở rộng (205/55R16, 205 55 16, 205-55-16, 195/55/16, 295/80R22.5, 90/90-14)
  const metricMatch = cleaned.match(/\b(?:HL|LT|ST|P|T|C)?\s*(\d{2,3})[\/\s-](\d{2})[\/\s-]*[A-Z-]?[\/\s-]*(\d{2}(?:\.5)?)\b/i);
  if (metricMatch) {
    return {
      width: parseInt(metricMatch[1], 10),
      aspectRatio: parseInt(metricMatch[2], 10),
      rimDiameter: parseFloat(metricMatch[3]),
    };
  }

  // 4. Dạng khuyết tỷ lệ hông (như 195R15C, 11R22.5, 7.50R16)
  const noRatioMatch = cleaned.match(/\b(\d{1,3}(?:\.\d{1,2})?)\s*[A-Z-]\s*(\d{2}(?:\.5)?)\b/i);
  if (noRatioMatch) {
    const rawW = parseFloat(noRatioMatch[1]);
    const width = rawW <= 15 ? Math.round(rawW * 25.4) : Math.round(rawW);
    const rim = parseFloat(noRatioMatch[2]);
    return {
      width,
      aspectRatio: rawW <= 15 ? (rawW >= 9 ? 90 : 100) : 80,
      rimDiameter: rim,
    };
  }

  return null;
}
