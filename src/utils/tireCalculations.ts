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
 * Phân tích chuỗi định dạng lốp dạng 265/65R17
 */
export function parseTireString(str: string): TireParams | null {
  const cleaned = str.trim().toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^(\d{3})\/(\d{2})R?(\d{2})$/);
  if (!match) return null;
  return {
    width: parseInt(match[1], 10),
    aspectRatio: parseInt(match[2], 10),
    rimDiameter: parseInt(match[3], 10),
  };
}
