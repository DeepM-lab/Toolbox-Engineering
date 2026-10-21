import { describe, it, expect } from 'vitest';
import { parseFullTireString } from './tireParser';

describe('tireParser - 7 Logic/Regex Bugs & 3 Data Traps Verification', () => {

  describe('Bug 1: Cú pháp & Ký hiệu địa hình (9.5)', () => {
    it('nhận diện ký hiệu AT/HT/MT mà không bị lỗi cú pháp/xuống dòng', () => {
      const res = parseFullTireString('Michelin 265/65R17 112T AT');
      expect(res).not.toBeNull();
      expect(res?.terrainOrTech).toBeDefined();
      expect(res?.terrainOrTech?.[0]?.code).toBe('A/T');
      expect(res?.techFeatures?.some(f => f.includes('A/T -'))).toBe(true);
    });
  });

  describe('Bug 2 & Trap 1: Nuốt nhầm tên dòng lốp vào Load/Speed & Ghép Pattern Pre/Post', () => {
    it('không nuốt nhầm "PS71" của Kumho Ecsta PS71 thành Load/Speed', () => {
      const res = parseFullTireString('Kumho Ecsta PS71 225/45R17 91V');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Kumho');
      expect(res?.pattern).toBe('Ecsta PS71');
      expect(res?.normalizedSize).toBe('225/45R17');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });

    it('không nuốt nhầm "G015" của Yokohama Geolandar A/T G015', () => {
      const res = parseFullTireString('Yokohama Geolandar A/T G015 265/70R16 112T');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Yokohama');
      expect(res?.pattern).toBe('Geolandar G015');
      expect(res?.loadIndex).toBe(112);
      expect(res?.speedRating).toBe('T');
    });

    it('nhận diện tên dòng gai KO2 nằm ở Post-Size (BFGoodrich 33X12.50R15 LT KO2)', () => {
      const res = parseFullTireString('BFGoodrich 33X12.50R15 LT KO2');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('BFGoodrich');
      expect(res?.isFlotation).toBe(true);
      expect(res?.pattern).toBe('KO2');
    });

    it('nhận diện mã gai D600 nằm ở Post-Size (DRC 11R22.5 16PR D600)', () => {
      const res = parseFullTireString('DRC 11R22.5 16PR D600');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('DRC');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.pattern).toBe('D600');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('nhận diện tên gai nằm ở cuối chuỗi thương mại điện tử (Michelin 205/55R16 91V Primacy 4 ST)', () => {
      const res = parseFullTireString('Lốp Michelin 205/55R16 91V Primacy 4 ST');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Michelin');
      expect(res?.pattern).toBe('Primacy 4 ST');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });
  });

  describe('Bug 3: Quy đổi đơn vị LBS sang KG ở MAX LOAD (Mục 5)', () => {
    it('quy đổi chính xác khi chỉ ghi LBS (MAX LOAD 1356 LBS -> ~615 KG, không phải 1356 KG)', () => {
      const res = parseFullTireString('205/55R16 91V MAX LOAD 1356 LBS');
      expect(res).not.toBeNull();
      expect(res?.maxLoadExplicitKg).toBe(615); // 1356 / 2.20462 ≈ 615
    });

    it('nhận diện chính xác khi có cả KG và LBS trong ngoặc', () => {
      const res = parseFullTireString('205/55R16 91V MAX LOAD 615 KG (1356 LBS)');
      expect(res).not.toBeNull();
      expect(res?.maxLoadExplicitKg).toBe(615);
    });
  });

  describe('Bug 4: Bóc tách MAX PRESS với các đơn vị PSI, KPA, BAR', () => {
    it('nhận diện khi chữ MAX PRESS nằm ở cuối câu', () => {
      const res = parseFullTireString('205/55R16 MAX LOAD 615 KG (1356 LBS) AT 300 KPA (44 PSI) MAX PRESS');
      expect(res).not.toBeNull();
      expect(res?.maxPressurePsi).toBe(44);
      expect(res?.pattern).toBeUndefined();
      expect(res?.terrainOrTech).toBeUndefined();
    });

    it('nhận diện và quy đổi số thập phân BAR sang PSI (3.5 BAR -> 51 PSI)', () => {
      const res = parseFullTireString('205/55R16 91V MAX PRESS 3.5 BAR');
      expect(res).not.toBeNull();
      expect(res?.maxPressurePsi).toBe(51); // 3.5 * 14.5038 ≈ 51
    });

    it('nhận diện KPA độc lập và quy đổi chuẩn xác sang PSI', () => {
      const res = parseFullTireString('205/55R16 91V 300 KPA');
      expect(res).not.toBeNull();
      expect(res?.maxPressurePsi).toBe(44); // 300 / 6.89476 ≈ 44
    });
  });

  describe('Bug 5: Nhận diện LOAD RANGE không nuốt chữ cái của dòng lốp', () => {
    it('bóc tách chuẩn LOAD RANGE E cho lốp bán tải', () => {
      const res = parseFullTireString('LT265/75R16 LOAD RANGE E');
      expect(res).not.toBeNull();
      expect(res?.loadRange).toBe('E');
      expect(res?.loadRangeDesc).toBeDefined();
    });

    it('không biến chữ C trong tên dòng lốp sedan thành Load Range C', () => {
      const res = parseFullTireString('Goodyear Assurance TripleMax C 205/55R16 91V');
      expect(res).not.toBeNull();
      expect(res?.loadRange).toBeUndefined();
      expect(res?.pattern).toContain('Assurance TripleMax C');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });
  });

  describe('Bug 6 & Trap 2: Phân định lốp ô tô cỡ nhỏ/dự phòng vs xe máy', () => {
    it('không nhầm lốp ô tô Daewoo Matiz (135/80R12 68T) thành lốp xe máy', () => {
      const res = parseFullTireString('135/80R12 68T');
      expect(res).not.toBeNull();
      expect(res?.isMotorcycle).toBe(false);
      expect(res?.vehicleType).toBe('P');
    });

    it('không nhầm lốp dự phòng ô tô Space Saver (125/70R16 96M) thành xe máy', () => {
      const res = parseFullTireString('125/70R16 96M');
      expect(res).not.toBeNull();
      expect(res?.isMotorcycle).toBe(false);
    });

    it('nhận diện chính xác lốp xe máy khi có ký hiệu M/C (120/70ZR17 M/C (58W))', () => {
      const res = parseFullTireString('120/70ZR17 M/C (58W)');
      expect(res).not.toBeNull();
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(58);
      expect(res?.speedRating).toBe('(W)');
    });

    it('nhận diện lốp xe máy kết cấu Bias (90/90-14 46P)', () => {
      const res = parseFullTireString('90/90-14 46P');
      expect(res).not.toBeNull();
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(46);
      expect(res?.speedRating).toBe('P');
    });
  });

  describe('Bug 7: Xử lý ký hiệu tốc độ ZR', () => {
    it('tự động fallback speedRating = "Z" khi có ZR mà không có mã tốc độ ở đuôi', () => {
      const res = parseFullTireString('245/40ZR18');
      expect(res).not.toBeNull();
      expect(res?.construction).toBe('ZR');
      expect(res?.speedRating).toBe('Z');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('giữ nguyên mã tốc độ riêng khi lốp ZR đi kèm 97W', () => {
      const res = parseFullTireString('245/40ZR18 97W');
      expect(res).not.toBeNull();
      expect(res?.construction).toBe('ZR');
      expect(res?.loadIndex).toBe(97);
      expect(res?.speedRating).toBe('W');
      expect(res?.maxSpeedKmH).toBe(270);
    });

    it('giữ nguyên mã tốc độ riêng khi lốp ZR đi kèm (97Y)', () => {
      const res = parseFullTireString('245/40ZR18 (97Y)');
      expect(res).not.toBeNull();
      expect(res?.construction).toBe('ZR');
      expect(res?.loadIndex).toBe(97);
      expect(res?.speedRating).toBe('(Y)');
      expect(res?.maxSpeedKmH).toBe(320);
    });
  });

  describe('Trap 3: Không làm biến dạng chữ O và I trong tên dòng gai lốp', () => {
    it('bảo toàn nguyên vẹn chữ O trong BFGoodrich KO2 (không bị đổi thành K02)', () => {
      const res = parseFullTireString('BFGoodrich 33X12.50R15 KO2');
      expect(res).not.toBeNull();
      expect(res?.pattern).toBe('KO2');
    });

    it('bảo toàn các mã có số và chữ như Potenza RE004', () => {
      const res = parseFullTireString('Bridgestone 225/45R17 94W Potenza RE004');
      expect(res).not.toBeNull();
      expect(res?.pattern).toContain('Potenza RE004');
    });
  });

});
