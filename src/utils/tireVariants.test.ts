import { describe, it, expect } from 'vitest';
import { parseFullTireString } from './tireParser';

/**
 * BỘ KIỂM THỬ ĐA BIẾN THỂ CÁCH VIẾT THÔNG SỐ LỐP (VARIANT TEST SUITE)
 * Bao phủ toàn diện các thói quen nhập liệu khác nhau của người dùng và thợ máy:
 * - Khoảng cách & ký hiệu phân cách
 * - Chữ hoa/thường, tiền tố/hậu tố
 * - Kèm tên hãng và dòng gai
 * - Lốp xe tải nặng & mâm lẻ
 * - Lốp xe máy & xe tay ga
 * - Chuỗi sao chép đầy đủ từ hông lốp (DOT, UTQG, Press, Load)
 * - Lốp xe van thương mại & ô tô cỡ nhỏ
 */
describe('Tire Variant Test Suite - Đa Biến Thể Cách Viết Thông Số Lốp', () => {

  // =========================================================================
  // GROUP 1: Biến thể khoảng cách và ký hiệu phân cách (Spacing & Delimiters)
  // =========================================================================
  describe('Nhóm 1: Biến thể khoảng cách và định dạng phân cách', () => {
    it('1.1. Chuỗi có dấu cách quanh r và chữ thường: "195/70 r14 91t"', () => {
      const res = parseFullTireString('195/70 r14 91t');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('195/70R14');
      expect(res?.width).toBe(195);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(14);
      expect(res?.construction).toBe('R');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('T');
      expect(res?.maxSpeedKmH).toBe(190);
    });

    it('1.2. Chuỗi chỉ dùng dấu cách, không có gạch chéo hay ký tự R: "205 55 16"', () => {
      const res = parseFullTireString('205 55 16');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
    });

    it('1.3. Chuỗi chỉ dùng dấu gạch ngang: "205-55-16"', () => {
      const res = parseFullTireString('205-55-16');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
    });

    it('1.4. Chuỗi dùng 2 dấu gạch chéo: "205/55/16"', () => {
      const res = parseFullTireString('205/55/16');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
    });

    it('1.5. Chuỗi cách rời rạc các thành phần: "205 / 55 R 16 91V"', () => {
      const res = parseFullTireString('205 / 55 R 16 91V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('1.6. Chuỗi gạch ngang kèm ký tự R: "205-55-R16 91V"', () => {
      const res = parseFullTireString('205-55-R16 91V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });

    it('1.7. Chuỗi 2 gạch chéo có dấu cách và tách rời chỉ số tải/tốc độ: "205 / 55 / 16 91 V"', () => {
      const res = parseFullTireString('205 / 55 / 16 91 V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });

    it('1.8. Chuỗi sử dụng dấu chấm phân cách: "215.60.16 95H"', () => {
      const res = parseFullTireString('215.60.16 95H');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('215/60R16');
      expect(res?.width).toBe(215);
      expect(res?.aspectRatio).toBe(60);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(95);
      expect(res?.speedRating).toBe('H');
      expect(res?.maxSpeedKmH).toBe(210);
    });
  });

  // =========================================================================
  // GROUP 2: Chữ hoa/thường, tiền tố/hậu tố (Case, Prefix/Suffix Variants)
  // =========================================================================
  describe('Nhóm 2: Biến thể chữ hoa/chữ thường, thiếu hoặc thừa tiền tố', () => {
    it('2.1. Tiền tố p chữ thường và toàn bộ chữ thường: "p205/55r16 91v"', () => {
      const res = parseFullTireString('p205/55r16 91v');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('P205/55R16');
      expect(res?.vehicleType).toBe('P');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('2.2. Tiền tố P cách rời kích thước: "P 205/55R16 91V"', () => {
      const res = parseFullTireString('P 205/55R16 91V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('P205/55R16');
      expect(res?.vehicleType).toBe('P');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });

    it('2.3. Tiền tố lt chữ thường bán tải: "lt265/70r17 121s"', () => {
      const res = parseFullTireString('lt265/70r17 121s');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('LT265/70R17');
      expect(res?.vehicleType).toBe('LT');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('R');
      expect(res?.loadIndex).toBe(121);
      expect(res?.speedRating).toBe('S');
      expect(res?.maxSpeedKmH).toBe(180);
    });

    it('2.4. Tiền tố LT có khoảng trắng và tải kép: "LT 265/70R17 121/118S"', () => {
      const res = parseFullTireString('LT 265/70R17 121/118S');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('LT265/70R17');
      expect(res?.vehicleType).toBe('LT');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.loadIndex).toBe(121);
      expect(res?.dualLoadIndex).toBe('121/118');
      expect(res?.speedRating).toBe('S');
    });

    it('2.5. Hậu tố LT nằm ở đuôi kích thước: "265/70R17 121S LT"', () => {
      const res = parseFullTireString('265/70R17 121S LT');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('265/70R17');
      expect(res?.vehicleType).toBe('LT');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.loadIndex).toBe(121);
      expect(res?.speedRating).toBe('S');
    });

    it('2.6. Cấu trúc zr chữ thường không có mã tốc độ rời: "225/45zr18"', () => {
      const res = parseFullTireString('225/45zr18');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('225/45ZR18');
      expect(res?.width).toBe(225);
      expect(res?.aspectRatio).toBe(45);
      expect(res?.rimDiameter).toBe(18);
      expect(res?.construction).toBe('ZR');
      expect(res?.speedRating).toBe('Z');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('2.7. Cấu trúc zr chữ thường có chỉ số tải và tốc độ riêng: "225/45zr18 95w"', () => {
      const res = parseFullTireString('225/45zr18 95w');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('225/45ZR18');
      expect(res?.width).toBe(225);
      expect(res?.aspectRatio).toBe(45);
      expect(res?.rimDiameter).toBe(18);
      expect(res?.construction).toBe('ZR');
      expect(res?.loadIndex).toBe(95);
      expect(res?.speedRating).toBe('W');
      expect(res?.maxSpeedKmH).toBe(270);
    });

    it('2.8. Tốc độ cao đặc biệt trong ngoặc đơn: "245/40ZR18 (97Y)"', () => {
      const res = parseFullTireString('245/40ZR18 (97Y)');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('245/40ZR18');
      expect(res?.width).toBe(245);
      expect(res?.aspectRatio).toBe(40);
      expect(res?.rimDiameter).toBe(18);
      expect(res?.construction).toBe('ZR');
      expect(res?.loadIndex).toBe(97);
      expect(res?.speedRating).toBe('(Y)');
      expect(res?.maxSpeedKmH).toBe(320);
    });

    it('2.9. Tiền tố HL (High Load) cho xe điện: "HL245/45R19 105Y"', () => {
      const res = parseFullTireString('HL245/45R19 105Y');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('HL245/45R19');
      expect(res?.vehicleType).toBe('HL');
      expect(res?.extraLoad).toBe('HL');
      expect(res?.width).toBe(245);
      expect(res?.aspectRatio).toBe(45);
      expect(res?.rimDiameter).toBe(19);
      expect(res?.loadIndex).toBe(105);
      expect(res?.speedRating).toBe('Y');
      expect(res?.maxSpeedKmH).toBe(300);
    });

    it('2.10. Tiền tố ST (Special Trailer) xe rơ-moóc: "ST225/75R15 117/112N"', () => {
      const res = parseFullTireString('ST225/75R15 117/112N');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('ST225/75R15');
      expect(res?.vehicleType).toBe('ST');
      expect(res?.width).toBe(225);
      expect(res?.aspectRatio).toBe(75);
      expect(res?.rimDiameter).toBe(15);
      expect(res?.loadIndex).toBe(117);
      expect(res?.dualLoadIndex).toBe('117/112');
      expect(res?.speedRating).toBe('N');
      expect(res?.maxSpeedKmH).toBe(140);
    });
  });

  // =========================================================================
  // GROUP 3: Thương hiệu & Tên dòng hoa lốp (Brand & Tread Pattern Integration)
  // =========================================================================
  describe('Nhóm 3: Kèm thương hiệu và tên dòng gai', () => {
    it('3.1. Michelin Primacy 4 đặt trước kích cỡ: "Michelin Primacy 4 205/55R16 91V"', () => {
      const res = parseFullTireString('Michelin Primacy 4 205/55R16 91V');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Michelin');
      expect(res?.pattern).toBe('Primacy 4');
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('3.2. Bridgestone với tên gai và ký hiệu địa hình ở đuôi: "Bridgestone 265/65R17 112T Dueler A/T"', () => {
      const res = parseFullTireString('Bridgestone 265/65R17 112T Dueler A/T');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Bridgestone');
      expect(res?.pattern).toBe('Dueler');
      expect(res?.normalizedSize).toBe('265/65R17');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(65);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.loadIndex).toBe(112);
      expect(res?.speedRating).toBe('T');
      expect(res?.maxSpeedKmH).toBe(190);
      expect(res?.terrainOrTech?.some(t => t.code === 'A/T')).toBe(true);
    });

    it('3.3. BFGoodrich hệ Inch Flotation và tên gai KO2: "BFGoodrich 33X12.50R15 LT KO2"', () => {
      const res = parseFullTireString('BFGoodrich 33X12.50R15 LT KO2');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('BFGoodrich');
      expect(res?.pattern).toBe('KO2');
      expect(res?.isFlotation).toBe(true);
      expect(res?.normalizedSize).toBe('33X12.50R15');
      expect(res?.width).toBe(318);
      expect(res?.rimDiameter).toBe(15);
      expect(res?.vehicleType).toBe('LT');
      expect(res?.flotationSpec).toEqual({
        diameterInch: 33,
        widthInch: 12.5,
        rimInch: 15
      });
    });

    it('3.4. Yokohama Geolandar A/T G015 đặt trước kích cỡ: "Yokohama Geolandar A/T G015 265/70R16 112T"', () => {
      const res = parseFullTireString('Yokohama Geolandar A/T G015 265/70R16 112T');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Yokohama');
      expect(res?.pattern).toBe('Geolandar G015');
      expect(res?.normalizedSize).toBe('265/70R16');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(112);
      expect(res?.speedRating).toBe('T');
    });

    it('3.5. Continental UltraContact UC6: "Continental UltraContact UC6 215/55R17 94V"', () => {
      const res = parseFullTireString('Continental UltraContact UC6 215/55R17 94V');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Continental');
      expect(res?.pattern).toBe('UltraContact UC6');
      expect(res?.normalizedSize).toBe('215/55R17');
      expect(res?.width).toBe(215);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.loadIndex).toBe(94);
      expect(res?.speedRating).toBe('V');
    });

    it('3.6. Goodyear Assurance TripleMax 2: "Goodyear Assurance TripleMax 2 205/55R16 91V"', () => {
      const res = parseFullTireString('Goodyear Assurance TripleMax 2 205/55R16 91V');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Goodyear');
      expect(res?.pattern).toBe('Assurance TripleMax 2');
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
    });
  });

  // =========================================================================
  // GROUP 4: Lốp xe tải nặng & mâm lẻ (Heavy Commercial Truck & Odd Rim Sizes)
  // =========================================================================
  describe('Nhóm 4: Lốp xe tải nặng & mâm lẻ', () => {
    it('4.1. Lốp xe tải nặng hệ inch mâm lẻ 22.5 kèm số lớp bố: "11R22.5 16PR"', () => {
      const res = parseFullTireString('11R22.5 16PR');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('11R22.5');
      expect(res?.width).toBe(279);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.construction).toBe('R');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('4.2. Lốp xe tải nặng hệ metric tải kép: "295/80R22.5 152/148M"', () => {
      const res = parseFullTireString('295/80R22.5 152/148M');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('295/80R22.5');
      expect(res?.width).toBe(295);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.construction).toBe('R');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.loadIndex).toBe(152);
      expect(res?.dualLoadIndex).toBe('152/148');
      expect(res?.speedRating).toBe('M');
      expect(res?.maxSpeedKmH).toBe(130);
      expect(res?.dualLoadKg).toEqual({
        single: 3550,
        dual: 3150,
        singleTotal4: 14200
      });
    });

    it('4.3. Lốp xe tải có săm bố nilon Casumina: "Casumina 7.50-16 14PR"', () => {
      const res = parseFullTireString('Casumina 7.50-16 14PR');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Casumina');
      expect(res?.normalizedSize).toBe('7.50-16');
      expect(res?.width).toBe(191);
      expect(res?.aspectRatio).toBe(100);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('-');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('14PR'))).toBe(true);
    });

    it('4.4. DRC kèm mã gai và số lớp bố: "DRC 11R22.5 16PR D600"', () => {
      const res = parseFullTireString('DRC 11R22.5 16PR D600');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('DRC');
      expect(res?.pattern).toBe('D600');
      expect(res?.normalizedSize).toBe('11R22.5');
      expect(res?.width).toBe(279);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('4.5. Lốp container siêu trọng: "315/80R22.5 156/150L"', () => {
      const res = parseFullTireString('315/80R22.5 156/150L');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('315/80R22.5');
      expect(res?.width).toBe(315);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.loadIndex).toBe(156);
      expect(res?.dualLoadIndex).toBe('156/150');
      expect(res?.speedRating).toBe('L');
      expect(res?.maxSpeedKmH).toBe(120);
    });

    it('4.6. Lốp tải 12R22.5 với tải kép và số lớp bố: "12R22.5 152/148L 16PR"', () => {
      const res = parseFullTireString('12R22.5 152/148L 16PR');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('12R22.5');
      expect(res?.width).toBe(305);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.loadIndex).toBe(152);
      expect(res?.dualLoadIndex).toBe('152/148');
      expect(res?.speedRating).toBe('L');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('4.7. Lốp mooc Super Single mâm 22.5: "385/65R22.5 160K"', () => {
      const res = parseFullTireString('385/65R22.5 160K');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('385/65R22.5');
      expect(res?.width).toBe(385);
      expect(res?.aspectRatio).toBe(65);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.loadIndex).toBe(160);
      expect(res?.speedRating).toBe('K');
      expect(res?.maxSpeedKmH).toBe(110);
    });

    it('4.8. Lốp xe tải mâm 20 inch có săm: "10.00R20 18PR"', () => {
      const res = parseFullTireString('10.00R20 18PR');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('10.00R20');
      expect(res?.width).toBe(254);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(20);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.techFeatures?.some(f => f.includes('18PR'))).toBe(true);
    });
  });

  // =========================================================================
  // GROUP 5: Lốp xe máy & xe tay ga (Motorcycle & Scooter Tires)
  // =========================================================================
  describe('Nhóm 5: Lốp xe máy / xe tay ga', () => {
    it('5.1. Lốp xe tay ga Air Blade / Vision mâm 14: "90/90-14 46P Tubeless"', () => {
      const res = parseFullTireString('90/90-14 46P Tubeless');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('90/90-14');
      expect(res?.width).toBe(90);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(14);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(46);
      expect(res?.speedRating).toBe('P');
      expect(res?.maxSpeedKmH).toBe(150);
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
    });

    it('5.2. Lốp xe số phổ thông Wave / Future mâm 17: "80/90-17 44P"', () => {
      const res = parseFullTireString('80/90-17 44P');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('80/90-17');
      expect(res?.width).toBe(80);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(44);
      expect(res?.speedRating).toBe('P');
      expect(res?.maxSpeedKmH).toBe(150);
    });

    it('5.3. Lốp mô tô phân khối lớn có ký hiệu M/C và tốc độ trong ngoặc: "120/70ZR17 M/C (58W)"', () => {
      const res = parseFullTireString('120/70ZR17 M/C (58W)');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('120/70ZR17');
      expect(res?.width).toBe(120);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('ZR');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(58);
      expect(res?.speedRating).toBe('(W)');
      expect(res?.maxSpeedKmH).toBe(270);
    });

    it('5.4. Lốp xe số bánh trước có săm (Tube Type / TT): "70/90-17 38P TT"', () => {
      const res = parseFullTireString('70/90-17 38P TT');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('70/90-17');
      expect(res?.width).toBe(70);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(38);
      expect(res?.speedRating).toBe('P');
      expect(res?.techFeatures?.some(f => f.includes('Tube Type'))).toBe(true);
    });

    it('5.5. Lốp xe ga Vespa mâm 12 không săm (TL): "110/70-12 47P TL"', () => {
      const res = parseFullTireString('110/70-12 47P TL');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('110/70-12');
      expect(res?.width).toBe(110);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(12);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(47);
      expect(res?.speedRating).toBe('P');
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
    });

    it('5.6. Lốp bánh sau mô tô 150cc: "140/70-17 66S Tubeless"', () => {
      const res = parseFullTireString('140/70-17 66S Tubeless');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('140/70-17');
      expect(res?.width).toBe(140);
      expect(res?.aspectRatio).toBe(70);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(66);
      expect(res?.speedRating).toBe('S');
      expect(res?.maxSpeedKmH).toBe(180);
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
    });
  });

  // =========================================================================
  // GROUP 6: Chuỗi sao chép đầy đủ từ hông lốp (Full Sidewall Dump)
  // =========================================================================
  describe('Nhóm 6: Chuỗi sao chép đầy đủ từ hông lốp', () => {
    it('6.1. Chuỗi hoàn chỉnh với DOT 4 số, UTQG, MAX LOAD, MAX PRESS và Tubeless', () => {
      const input = 'Michelin 205/55R16 91V DOT 4721 TREADWEAR 400 TRACTION A TEMPERATURE A MAX LOAD 615 KG (1356 LBS) AT 44 PSI MAX PRESS TUBELESS';
      const res = parseFullTireString(input);
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Michelin');
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.maxSpeedKmH).toBe(240);
      expect(res?.dotCode).toBe('4721');
      expect(res?.dotAnalysis?.week).toBe(47);
      expect(res?.dotAnalysis?.year).toBe(2021);
      expect(res?.utqg).toEqual({
        treadwear: 400,
        traction: 'A',
        temperature: 'A'
      });
      expect(res?.maxPressurePsi).toBe(44);
      expect(res?.maxLoadExplicitKg).toBe(615);
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
      expect(res?.terrainOrTech).toBeUndefined();
      expect(res?.pattern).toBeUndefined();
    });

    it('6.2. Bridgestone bán tải kèm DOT, áp suất và tải trọng KG', () => {
      const input = 'Bridgestone 265/65R17 112T Dueler A/T DOT 2522 MAX PRESS 51 PSI MAX LOAD 1120 KG TUBELESS';
      const res = parseFullTireString(input);
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Bridgestone');
      expect(res?.pattern).toBe('Dueler');
      expect(res?.normalizedSize).toBe('265/65R17');
      expect(res?.width).toBe(265);
      expect(res?.aspectRatio).toBe(65);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.loadIndex).toBe(112);
      expect(res?.speedRating).toBe('T');
      expect(res?.dotCode).toBe('2522');
      expect(res?.maxPressurePsi).toBe(51);
      expect(res?.maxLoadExplicitKg).toBe(1120);
      expect(res?.terrainOrTech?.some(t => t.code === 'A/T')).toBe(true);
    });

    it('6.3. Continental Runflat MO kèm áp suất quy đổi từ BAR: 3.5 BAR', () => {
      const input = 'Continental 225/45R17 91Y SSR Runflat MO DOT 1023 MAX PRESS 3.5 BAR TREADWEAR 280 TRACTION AA TEMPERATURE A';
      const res = parseFullTireString(input);
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Continental');
      expect(res?.normalizedSize).toBe('225/45R17');
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('Y');
      expect(res?.isRunflat).toBe(true);
      expect(res?.oeMarking?.code).toBe('MO');
      expect(res?.dotCode).toBe('1023');
      expect(res?.maxPressurePsi).toBe(51); // 3.5 * 14.5038 ≈ 51 PSI
      expect(res?.utqg).toEqual({
        treadwear: 280,
        traction: 'AA',
        temperature: 'A'
      });
    });

    it('6.4. Chuỗi có mã DOT 3 cụm nhà máy và UTQG gộp', () => {
      const input = 'DOT B9UJ 4721 205/55R16 91V UTQG 400 AA A MAX PRESS 44 PSI MAX LOAD 1356 LBS TUBELESS';
      const res = parseFullTireString(input);
      expect(res).not.toBeNull();
      expect(res?.dotCode).toBe('4721');
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.utqg).toEqual({
        treadwear: 400,
        traction: 'AA',
        temperature: 'A'
      });
      expect(res?.maxPressurePsi).toBe(44);
      expect(res?.maxLoadExplicitKg).toBe(615); // 1356 LBS -> 615 KG
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
    });
  });

  // =========================================================================
  // GROUP 7: Xe thương mại / Van / Ô tô mini (Commercial Van & Small Cars)
  // =========================================================================
  describe('Nhóm 7: Lốp xe tải van thương mại & ô tô cỡ nhỏ', () => {
    it('7.1. Lốp xe van Toyota Hiace 195R15C (ngầm định tỷ lệ 80): "195R15C 106/104R"', () => {
      const res = parseFullTireString('195R15C 106/104R');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('195/80R15C');
      expect(res?.vehicleType).toBe('C');
      expect(res?.width).toBe(195);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(15);
      expect(res?.loadIndex).toBe(106);
      expect(res?.dualLoadIndex).toBe('106/104');
      expect(res?.speedRating).toBe('R');
      expect(res?.maxSpeedKmH).toBe(170);
    });

    it('7.2. Lốp Ford Transit 16 chỗ: "215/75R16C 113/111R"', () => {
      const res = parseFullTireString('215/75R16C 113/111R');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('215/75R16C');
      expect(res?.vehicleType).toBe('C');
      expect(res?.width).toBe(215);
      expect(res?.aspectRatio).toBe(75);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(113);
      expect(res?.dualLoadIndex).toBe('113/111');
      expect(res?.speedRating).toBe('R');
    });

    it('7.3. Lốp ô tô mini Daewoo Matiz (không nhầm thành xe máy): "135/80R12 68T"', () => {
      const res = parseFullTireString('135/80R12 68T');
      expect(res).not.toBeNull();
      expect(res?.isMotorcycle).toBe(false);
      expect(res?.vehicleType).toBe('P');
      expect(res?.normalizedSize).toBe('135/80R12');
      expect(res?.width).toBe(135);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(12);
      expect(res?.loadIndex).toBe(68);
      expect(res?.speedRating).toBe('T');
      expect(res?.maxSpeedKmH).toBe(190);
    });
  });

  // =========================================================================
  // GROUP 8: Biến thể mở rộng nâng cao (Adversarial Edge Cases)
  // =========================================================================
  describe('Nhóm 8: Biến thể mở rộng nâng cao (Adversarial Robustness)', () => {
    it('8.1. Viết liền hoàn toàn 7 chữ số: "2055516"', () => {
      const res = parseFullTireString('2055516');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('R');
    });

    it('8.2. Viết liền có chữ R và chỉ số tải/tốc độ: "20555R16 91V"', () => {
      const res = parseFullTireString('20555R16 91V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.maxSpeedKmH).toBe(240);
    });

    it('8.3. Lốp xe tải mâm 16 có săm: "8.25-16 14PR"', () => {
      const res = parseFullTireString('8.25-16 14PR');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('8.25-16');
      expect(res?.width).toBe(210);
      expect(res?.aspectRatio).toBe(100);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.construction).toBe('-');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('14PR'))).toBe(true);
    });

    it('8.4. Lốp xe tải mâm 22.5 cách rời ký tự R: "11 R 22.5 16PR"', () => {
      const res = parseFullTireString('11 R 22.5 16PR');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('11R22.5');
      expect(res?.width).toBe(279);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.construction).toBe('R');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('8.5. Lốp xe ga Lead mâm 10 inch: "100/90-10 56J"', () => {
      const res = parseFullTireString('100/90-10 56J');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('100/90-10');
      expect(res?.width).toBe(100);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(10);
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(56);
      expect(res?.speedRating).toBe('J');
      expect(res?.maxSpeedKmH).toBe(100);
    });

    it('8.6. Lốp xe máy gõ dấu cách không gõ gạch ngang: "80/90 17 44P"', () => {
      const res = parseFullTireString('80/90 17 44P');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('80/90-17');
      expect(res?.width).toBe(80);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(44);
      expect(res?.speedRating).toBe('P');
      expect(res?.maxSpeedKmH).toBe(150);
    });

    it('8.7. Hãng lốp xe máy phổ biến CST Chengshin: "CST 80/90-17 44P"', () => {
      const res = parseFullTireString('CST 80/90-17 44P');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Chengshin / CST');
      expect(res?.normalizedSize).toBe('80/90-17');
      expect(res?.width).toBe(80);
      expect(res?.aspectRatio).toBe(90);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(44);
      expect(res?.speedRating).toBe('P');
    });

    it('8.8. Chuỗi có tiền tố từ tiếng Việt có dấu: "Lốp 205/55R16 91V"', () => {
      const res = parseFullTireString('Lốp 205/55R16 91V');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.pattern).toBeUndefined(); // Không bị nuốt chữ "Lốp" vào pattern
    });

    it('8.9. Chuỗi thương hiệu Cao Su Đà Nẵng có dấu: "DRC Đà Nẵng 11R22.5 16PR"', () => {
      const res = parseFullTireString('DRC Đà Nẵng 11R22.5 16PR');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('DRC');
      expect(res?.pattern).toBeUndefined(); // Không bị rò rỉ "Đà Nẵng" vào pattern
      expect(res?.normalizedSize).toBe('11R22.5');
      expect(res?.width).toBe(279);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });

    it('8.10. Chuỗi có mã DOT kèm Barcode rác: "205/55R16 91V DOT 4721 Barcode 9942"', () => {
      const res = parseFullTireString('205/55R16 91V DOT 4721 Barcode 9942');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('205/55R16');
      expect(res?.width).toBe(205);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(16);
      expect(res?.loadIndex).toBe(91);
      expect(res?.speedRating).toBe('V');
      expect(res?.dotCode).toBe('4721');
      expect(res?.pattern).toBeUndefined(); // Không bị nuốt "Barcode 9942" vào pattern
    });

    it('8.11. Lốp xe máy hệ inch Honda Cub: "Casumina 2.50-17 38L"', () => {
      const res = parseFullTireString('Casumina 2.50-17 38L');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Casumina');
      expect(res?.normalizedSize).toBe('2.50-17');
      expect(res?.width).toBe(64);
      expect(res?.aspectRatio).toBe(100);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(38);
      expect(res?.speedRating).toBe('L');
      expect(res?.maxSpeedKmH).toBe(120);
    });

    it('8.12. Lốp xe tay ga Vespa hệ inch: "3.50-10 51J"', () => {
      const res = parseFullTireString('3.50-10 51J');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('3.50-10');
      expect(res?.width).toBe(89);
      expect(res?.aspectRatio).toBe(100);
      expect(res?.rimDiameter).toBe(10);
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(51);
      expect(res?.speedRating).toBe('J');
      expect(res?.maxSpeedKmH).toBe(100);
    });

    it('8.13. Lốp mô tô phân khối lớn không có ký hiệu M/C: "180/55ZR17 73W"', () => {
      const res = parseFullTireString('180/55ZR17 73W');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('180/55ZR17');
      expect(res?.width).toBe(180);
      expect(res?.aspectRatio).toBe(55);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('ZR');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(73);
      expect(res?.speedRating).toBe('W');
      expect(res?.maxSpeedKmH).toBe(270);
    });

    it('8.14. Lốp mô tô PKL tầm trung: "160/60ZR17 69W"', () => {
      const res = parseFullTireString('160/60ZR17 69W');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('160/60ZR17');
      expect(res?.width).toBe(160);
      expect(res?.aspectRatio).toBe(60);
      expect(res?.rimDiameter).toBe(17);
      expect(res?.construction).toBe('ZR');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(69);
      expect(res?.speedRating).toBe('W');
      expect(res?.maxSpeedKmH).toBe(270);
    });

    it('8.15. Tải kép dùng dấu gạch ngang phân cách: "295/80R22.5 152-148M"', () => {
      const res = parseFullTireString('295/80R22.5 152-148M');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('295/80R22.5');
      expect(res?.width).toBe(295);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.loadIndex).toBe(152);
      expect(res?.dualLoadIndex).toBe('152/148');
      expect(res?.speedRating).toBe('M');
      expect(res?.maxSpeedKmH).toBe(130);
    });

    it('8.16. Lốp xe tải mâm lớn 24.5 inch đầu kéo Mỹ: "285/75R24.5 144/141M"', () => {
      const res = parseFullTireString('285/75R24.5 144/141M');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('285/75R24.5');
      expect(res?.width).toBe(285);
      expect(res?.aspectRatio).toBe(75);
      expect(res?.rimDiameter).toBe(24.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.loadIndex).toBe(144);
      expect(res?.dualLoadIndex).toBe('144/141');
      expect(res?.speedRating).toBe('M');
      expect(res?.maxSpeedKmH).toBe(130);
    });

    it('8.17. Sao chép hông lốp đầy đủ kép (SINGLE & DUAL MAX LOAD, AT 900 KPA MAX PRESS): không ô nhiễm pattern', () => {
      const input = 'Casumina 295/80R22.5 152/148M MAX LOAD SINGLE 3550 KG (7825 LBS) MAX LOAD DUAL 3150 KG (6945 LBS) AT 900 KPA (130 PSI) MAX PRESS';
      const res = parseFullTireString(input);
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('Casumina');
      expect(res?.normalizedSize).toBe('295/80R22.5');
      expect(res?.width).toBe(295);
      expect(res?.aspectRatio).toBe(80);
      expect(res?.rimDiameter).toBe(22.5);
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.loadIndex).toBe(152);
      expect(res?.dualLoadIndex).toBe('152/148');
      expect(res?.speedRating).toBe('M');
      expect(res?.maxLoadExplicitKg).toBe(3550);
      expect(res?.maxPressurePsi).toBe(130);
      expect(res?.pattern).toBeUndefined(); // Không bị nuốt rác MAX LOAD hay AT vào pattern!
      expect(res?.terrainOrTech).toBeUndefined(); // Từ "AT" không biến thành gai All-Terrain!
    });

    it('8.18. Tiêu đề thương mại điện tử dán gộp có từ Tubeless lặp lại: không ô nhiễm pattern', () => {
      const res = parseFullTireString('Vỏ lốp Tubeless Lead 90/90-14 46P Tubeless');
      expect(res).not.toBeNull();
      expect(res?.normalizedSize).toBe('90/90-14');
      expect(res?.construction).toBe('-');
      expect(res?.isMotorcycle).toBe(true);
      expect(res?.vehicleType).toBe('MC');
      expect(res?.loadIndex).toBe(46);
      expect(res?.speedRating).toBe('P');
      expect(res?.techFeatures?.some(f => f.includes('Tubeless'))).toBe(true);
      expect(res?.pattern).toBe('Lead'); // Chỉ còn lại model xe Lead, không bị lẫn "Tubeless"
    });

    it('8.19. Chuỗi có cụm "Cao Su Đà Nẵng": không bị rò rỉ "Cao Su" vào pattern', () => {
      const res = parseFullTireString('Lốp Cao Su Đà Nẵng 11R22.5 16PR');
      expect(res).not.toBeNull();
      expect(res?.brand).toBe('DRC');
      expect(res?.pattern).toBeUndefined();
      expect(res?.normalizedSize).toBe('11R22.5');
      expect(res?.isCommercialTruck).toBe(true);
      expect(res?.vehicleType).toBe('TRUCK');
      expect(res?.techFeatures?.some(f => f.includes('16PR'))).toBe(true);
    });
  });

});
