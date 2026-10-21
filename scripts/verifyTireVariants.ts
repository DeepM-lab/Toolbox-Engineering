/**
 * SCRIPT KIỂM ĐỊNH ĐỘC LẬP BỘ PHÂN TÍCH THÔNG SỐ LỐP (INDEPENDENT VERIFICATION SCRIPT)
 * DeepM Lab - Tire Parser Variant Verification
 * 
 * Thực thi kiểm tra và đối sánh toàn bộ các biến thể cách viết thông số lốp
 * Đối sánh: Kích thước chuẩn hóa, Bề rộng, Chiều cao hông, Mâm, Tải trọng, Vận tốc, DOT, Áp suất...
 */

import { describe, it, expect } from 'vitest';
import { parseFullTireString, type FullTireSpec } from '../src/utils/tireParser';

export interface TestCase {
  id: number;
  category: string;
  input: string;
  expected: {
    normalizedSize?: string;
    width?: number;
    aspectRatio?: number;
    rimDiameter?: number;
    construction?: string;
    loadIndex?: number;
    dualLoadIndex?: string;
    speedRating?: string;
    maxSpeedKmH?: number;
    dotCode?: string;
    maxPressurePsi?: number;
    maxLoadExplicitKg?: number;
    brand?: string;
    pattern?: string;
    isMotorcycle?: boolean;
    isCommercialTruck?: boolean;
    isFlotation?: boolean;
    vehicleType?: string;
    techFeaturesMustInclude?: string[];
  };
}

export const VARIANT_TEST_CASES: TestCase[] = [
  // =========================================================================
  // NHÓM 1: Biến thể khoảng cách và định dạng phân cách
  // =========================================================================
  {
    id: 1,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '195/70 r14 91t',
    expected: {
      normalizedSize: '195/70R14',
      width: 195,
      aspectRatio: 70,
      rimDiameter: 14,
      construction: 'R',
      loadIndex: 91,
      speedRating: 'T',
      maxSpeedKmH: 190
    }
  },
  {
    id: 2,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205 55 16',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R'
    }
  },
  {
    id: 3,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205-55-16',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R'
    }
  },
  {
    id: 4,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205/55/16',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R'
    }
  },
  {
    id: 5,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205 / 55 R 16 91V',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R',
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 6,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205-55-R16 91V',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 7,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '205 / 55 / 16 91 V',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 8,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '215.60.16 95H',
    expected: {
      normalizedSize: '215/60R16',
      width: 215,
      aspectRatio: 60,
      rimDiameter: 16,
      loadIndex: 95,
      speedRating: 'H',
      maxSpeedKmH: 210
    }
  },

  // =========================================================================
  // NHÓM 2: Biến thể chữ hoa/chữ thường, thiếu hoặc thừa tiền tố
  // =========================================================================
  {
    id: 9,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'p205/55r16 91v',
    expected: {
      normalizedSize: 'P205/55R16',
      vehicleType: 'P',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R',
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 10,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'P 205/55R16 91V',
    expected: {
      normalizedSize: 'P205/55R16',
      vehicleType: 'P',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V'
    }
  },
  {
    id: 11,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'lt265/70r17 121s',
    expected: {
      normalizedSize: 'LT265/70R17',
      vehicleType: 'LT',
      width: 265,
      aspectRatio: 70,
      rimDiameter: 17,
      construction: 'R',
      loadIndex: 121,
      speedRating: 'S',
      maxSpeedKmH: 180
    }
  },
  {
    id: 12,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'LT 265/70R17 121/118S',
    expected: {
      normalizedSize: 'LT265/70R17',
      vehicleType: 'LT',
      width: 265,
      aspectRatio: 70,
      rimDiameter: 17,
      loadIndex: 121,
      dualLoadIndex: '121/118',
      speedRating: 'S'
    }
  },
  {
    id: 13,
    category: 'Chữ hoa/thường & Tiền tố',
    input: '265/70R17 121S LT',
    expected: {
      normalizedSize: '265/70R17',
      vehicleType: 'LT',
      width: 265,
      aspectRatio: 70,
      rimDiameter: 17,
      loadIndex: 121,
      speedRating: 'S'
    }
  },
  {
    id: 14,
    category: 'Chữ hoa/thường & Tiền tố',
    input: '225/45zr18',
    expected: {
      normalizedSize: '225/45ZR18',
      width: 225,
      aspectRatio: 45,
      rimDiameter: 18,
      construction: 'ZR',
      speedRating: 'Z',
      maxSpeedKmH: 240
    }
  },
  {
    id: 15,
    category: 'Chữ hoa/thường & Tiền tố',
    input: '225/45zr18 95w',
    expected: {
      normalizedSize: '225/45ZR18',
      width: 225,
      aspectRatio: 45,
      rimDiameter: 18,
      construction: 'ZR',
      loadIndex: 95,
      speedRating: 'W',
      maxSpeedKmH: 270
    }
  },
  {
    id: 16,
    category: 'Chữ hoa/thường & Tiền tố',
    input: '245/40ZR18 (97Y)',
    expected: {
      normalizedSize: '245/40ZR18',
      width: 245,
      aspectRatio: 40,
      rimDiameter: 18,
      construction: 'ZR',
      loadIndex: 97,
      speedRating: '(Y)',
      maxSpeedKmH: 320
    }
  },
  {
    id: 17,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'HL245/45R19 105Y',
    expected: {
      normalizedSize: 'HL245/45R19',
      vehicleType: 'HL',
      width: 245,
      aspectRatio: 45,
      rimDiameter: 19,
      loadIndex: 105,
      speedRating: 'Y',
      maxSpeedKmH: 300
    }
  },
  {
    id: 18,
    category: 'Chữ hoa/thường & Tiền tố',
    input: 'ST225/75R15 117/112N',
    expected: {
      normalizedSize: 'ST225/75R15',
      vehicleType: 'ST',
      width: 225,
      aspectRatio: 75,
      rimDiameter: 15,
      loadIndex: 117,
      dualLoadIndex: '117/112',
      speedRating: 'N',
      maxSpeedKmH: 140
    }
  },

  // =========================================================================
  // NHÓM 3: Kèm thương hiệu và tên dòng gai
  // =========================================================================
  {
    id: 19,
    category: 'Thương hiệu & Tên gai',
    input: 'Michelin Primacy 4 205/55R16 91V',
    expected: {
      brand: 'Michelin',
      pattern: 'Primacy 4',
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 20,
    category: 'Thương hiệu & Tên gai',
    input: 'Bridgestone 265/65R17 112T Dueler A/T',
    expected: {
      brand: 'Bridgestone',
      pattern: 'Dueler',
      normalizedSize: '265/65R17',
      width: 265,
      aspectRatio: 65,
      rimDiameter: 17,
      loadIndex: 112,
      speedRating: 'T',
      maxSpeedKmH: 190
    }
  },
  {
    id: 21,
    category: 'Thương hiệu & Tên gai',
    input: 'BFGoodrich 33X12.50R15 LT KO2',
    expected: {
      brand: 'BFGoodrich',
      pattern: 'KO2',
      isFlotation: true,
      normalizedSize: '33X12.50R15',
      width: 318,
      aspectRatio: 72,
      rimDiameter: 15,
      vehicleType: 'LT'
    }
  },
  {
    id: 22,
    category: 'Thương hiệu & Tên gai',
    input: 'Yokohama Geolandar A/T G015 265/70R16 112T',
    expected: {
      brand: 'Yokohama',
      pattern: 'Geolandar G015',
      normalizedSize: '265/70R16',
      width: 265,
      aspectRatio: 70,
      rimDiameter: 16,
      loadIndex: 112,
      speedRating: 'T'
    }
  },
  {
    id: 23,
    category: 'Thương hiệu & Tên gai',
    input: 'Continental UltraContact UC6 215/55R17 94V',
    expected: {
      brand: 'Continental',
      pattern: 'UltraContact UC6',
      normalizedSize: '215/55R17',
      width: 215,
      aspectRatio: 55,
      rimDiameter: 17,
      loadIndex: 94,
      speedRating: 'V'
    }
  },
  {
    id: 24,
    category: 'Thương hiệu & Tên gai',
    input: 'Goodyear Assurance TripleMax 2 205/55R16 91V',
    expected: {
      brand: 'Goodyear',
      pattern: 'Assurance TripleMax 2',
      normalizedSize: '205/55R16',
      loadIndex: 91,
      speedRating: 'V'
    }
  },

  // =========================================================================
  // NHÓM 4: Lốp xe tải nặng & mâm lẻ
  // =========================================================================
  {
    id: 25,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '11R22.5 16PR',
    expected: {
      normalizedSize: '11R22.5',
      width: 279,
      aspectRatio: 90,
      rimDiameter: 22.5,
      construction: 'R',
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      techFeaturesMustInclude: ['16PR']
    }
  },
  {
    id: 26,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '295/80R22.5 152/148M',
    expected: {
      normalizedSize: '295/80R22.5',
      width: 295,
      aspectRatio: 80,
      rimDiameter: 22.5,
      construction: 'R',
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      loadIndex: 152,
      dualLoadIndex: '152/148',
      speedRating: 'M',
      maxSpeedKmH: 130
    }
  },
  {
    id: 27,
    category: 'Xe tải nặng & Mâm lẻ',
    input: 'Casumina 7.50-16 14PR',
    expected: {
      brand: 'Casumina',
      normalizedSize: '7.50-16',
      width: 191,
      aspectRatio: 100,
      rimDiameter: 16,
      construction: '-',
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      techFeaturesMustInclude: ['14PR']
    }
  },
  {
    id: 28,
    category: 'Xe tải nặng & Mâm lẻ',
    input: 'DRC 11R22.5 16PR D600',
    expected: {
      brand: 'DRC',
      pattern: 'D600',
      normalizedSize: '11R22.5',
      width: 279,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      techFeaturesMustInclude: ['16PR']
    }
  },
  {
    id: 29,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '315/80R22.5 156/150L',
    expected: {
      normalizedSize: '315/80R22.5',
      width: 315,
      aspectRatio: 80,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      loadIndex: 156,
      dualLoadIndex: '156/150',
      speedRating: 'L',
      maxSpeedKmH: 120
    }
  },
  {
    id: 30,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '12R22.5 152/148L 16PR',
    expected: {
      normalizedSize: '12R22.5',
      width: 305,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      loadIndex: 152,
      dualLoadIndex: '152/148',
      speedRating: 'L',
      techFeaturesMustInclude: ['16PR']
    }
  },
  {
    id: 31,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '385/65R22.5 160K',
    expected: {
      normalizedSize: '385/65R22.5',
      width: 385,
      aspectRatio: 65,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      loadIndex: 160,
      speedRating: 'K',
      maxSpeedKmH: 110
    }
  },
  {
    id: 32,
    category: 'Xe tải nặng & Mâm lẻ',
    input: '10.00R20 18PR',
    expected: {
      normalizedSize: '10.00R20',
      width: 254,
      aspectRatio: 90,
      rimDiameter: 20,
      isCommercialTruck: true,
      techFeaturesMustInclude: ['18PR']
    }
  },

  // =========================================================================
  // NHÓM 5: Lốp xe máy / xe tay ga
  // =========================================================================
  {
    id: 33,
    category: 'Xe máy & Xe tay ga',
    input: '90/90-14 46P Tubeless',
    expected: {
      normalizedSize: '90/90-14',
      width: 90,
      aspectRatio: 90,
      rimDiameter: 14,
      construction: '-',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 46,
      speedRating: 'P',
      maxSpeedKmH: 150,
      techFeaturesMustInclude: ['Tubeless']
    }
  },
  {
    id: 34,
    category: 'Xe máy & Xe tay ga',
    input: '80/90-17 44P',
    expected: {
      normalizedSize: '80/90-17',
      width: 80,
      aspectRatio: 90,
      rimDiameter: 17,
      construction: '-',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 44,
      speedRating: 'P',
      maxSpeedKmH: 150
    }
  },
  {
    id: 35,
    category: 'Xe máy & Xe tay ga',
    input: '120/70ZR17 M/C (58W)',
    expected: {
      normalizedSize: '120/70ZR17',
      width: 120,
      aspectRatio: 70,
      rimDiameter: 17,
      construction: 'ZR',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 58,
      speedRating: '(W)',
      maxSpeedKmH: 270
    }
  },
  {
    id: 36,
    category: 'Xe máy & Xe tay ga',
    input: '70/90-17 38P TT',
    expected: {
      normalizedSize: '70/90-17',
      width: 70,
      aspectRatio: 90,
      rimDiameter: 17,
      construction: '-',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 38,
      speedRating: 'P',
      techFeaturesMustInclude: ['Tube Type']
    }
  },
  {
    id: 37,
    category: 'Xe máy & Xe tay ga',
    input: '110/70-12 47P TL',
    expected: {
      normalizedSize: '110/70-12',
      width: 110,
      aspectRatio: 70,
      rimDiameter: 12,
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 47,
      speedRating: 'P',
      techFeaturesMustInclude: ['Tubeless']
    }
  },
  {
    id: 38,
    category: 'Xe máy & Xe tay ga',
    input: '140/70-17 66S Tubeless',
    expected: {
      normalizedSize: '140/70-17',
      width: 140,
      aspectRatio: 70,
      rimDiameter: 17,
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 66,
      speedRating: 'S',
      maxSpeedKmH: 180,
      techFeaturesMustInclude: ['Tubeless']
    }
  },

  // =========================================================================
  // NHÓM 6: Chuỗi sao chép đầy đủ từ hông lốp
  // =========================================================================
  {
    id: 39,
    category: 'Sao chép hông lốp đầy đủ',
    input: 'Michelin 205/55R16 91V DOT 4721 TREADWEAR 400 TRACTION A TEMPERATURE A MAX LOAD 615 KG (1356 LBS) AT 44 PSI MAX PRESS TUBELESS',
    expected: {
      brand: 'Michelin',
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R',
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240,
      dotCode: '4721',
      maxPressurePsi: 44,
      maxLoadExplicitKg: 615,
      techFeaturesMustInclude: ['Tubeless']
    }
  },
  {
    id: 40,
    category: 'Sao chép hông lốp đầy đủ',
    input: 'Bridgestone 265/65R17 112T Dueler A/T DOT 2522 MAX PRESS 51 PSI MAX LOAD 1120 KG TUBELESS',
    expected: {
      brand: 'Bridgestone',
      pattern: 'Dueler',
      normalizedSize: '265/65R17',
      width: 265,
      aspectRatio: 65,
      rimDiameter: 17,
      loadIndex: 112,
      speedRating: 'T',
      dotCode: '2522',
      maxPressurePsi: 51,
      maxLoadExplicitKg: 1120,
      techFeaturesMustInclude: ['Tubeless']
    }
  },
  {
    id: 41,
    category: 'Sao chép hông lốp đầy đủ',
    input: 'Continental 225/45R17 91Y SSR Runflat MO DOT 1023 MAX PRESS 3.5 BAR TREADWEAR 280 TRACTION AA TEMPERATURE A',
    expected: {
      brand: 'Continental',
      normalizedSize: '225/45R17',
      width: 225,
      aspectRatio: 45,
      rimDiameter: 17,
      loadIndex: 91,
      speedRating: 'Y',
      dotCode: '1023',
      maxPressurePsi: 51
    }
  },
  {
    id: 42,
    category: 'Sao chép hông lốp đầy đủ',
    input: 'DOT B9UJ 4721 205/55R16 91V UTQG 400 AA A MAX PRESS 44 PSI MAX LOAD 1356 LBS TUBELESS',
    expected: {
      dotCode: '4721',
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      maxPressurePsi: 44,
      maxLoadExplicitKg: 615,
      techFeaturesMustInclude: ['Tubeless']
    }
  },

  // =========================================================================
  // NHÓM 7: Lốp xe tải van thương mại & ô tô cỡ nhỏ
  // =========================================================================
  {
    id: 43,
    category: 'Xe van thương mại & Xe mini',
    input: '195R15C 106/104R',
    expected: {
      normalizedSize: '195/80R15C',
      vehicleType: 'C',
      width: 195,
      aspectRatio: 80,
      rimDiameter: 15,
      loadIndex: 106,
      dualLoadIndex: '106/104',
      speedRating: 'R',
      maxSpeedKmH: 170
    }
  },
  {
    id: 44,
    category: 'Xe van thương mại & Xe mini',
    input: '215/75R16C 113/111R',
    expected: {
      normalizedSize: '215/75R16C',
      vehicleType: 'C',
      width: 215,
      aspectRatio: 75,
      rimDiameter: 16,
      loadIndex: 113,
      dualLoadIndex: '113/111',
      speedRating: 'R',
      maxSpeedKmH: 170
    }
  },
  {
    id: 45,
    category: 'Xe van thương mại & Xe mini',
    input: '135/80R12 68T',
    expected: {
      normalizedSize: '135/80R12',
      width: 135,
      aspectRatio: 80,
      rimDiameter: 12,
      isMotorcycle: false,
      vehicleType: 'P',
      loadIndex: 68,
      speedRating: 'T',
      maxSpeedKmH: 190
    }
  },
  {
    id: 46,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '2055516',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      construction: 'R'
    }
  },
  {
    id: 47,
    category: 'Khoảng cách & Ký tự phân cách',
    input: '20555R16 91V',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      maxSpeedKmH: 240
    }
  },
  {
    id: 48,
    category: 'Xe tải nặng & mâm lẻ',
    input: '8.25-16 14PR',
    expected: {
      normalizedSize: '8.25-16',
      width: 210,
      aspectRatio: 100,
      rimDiameter: 16,
      construction: '-',
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      techFeaturesMustInclude: ['14PR']
    }
  },
  {
    id: 49,
    category: 'Xe tải nặng & mâm lẻ',
    input: '11 R 22.5 16PR',
    expected: {
      normalizedSize: '11R22.5',
      width: 279,
      aspectRatio: 90,
      rimDiameter: 22.5,
      construction: 'R',
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      techFeaturesMustInclude: ['16PR']
    }
  },
  {
    id: 50,
    category: 'Lốp xe máy / xe tay ga',
    input: '100/90-10 56J',
    expected: {
      normalizedSize: '100/90-10',
      width: 100,
      aspectRatio: 90,
      rimDiameter: 10,
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 56,
      speedRating: 'J',
      maxSpeedKmH: 100
    }
  },
  {
    id: 51,
    category: 'Lốp xe máy / xe tay ga',
    input: '80/90 17 44P',
    expected: {
      normalizedSize: '80/90-17',
      width: 80,
      aspectRatio: 90,
      rimDiameter: 17,
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 44,
      speedRating: 'P',
      maxSpeedKmH: 150
    }
  },
  {
    id: 52,
    category: 'Lốp xe máy / xe tay ga',
    input: 'CST 80/90-17 44P',
    expected: {
      brand: 'Chengshin / CST',
      normalizedSize: '80/90-17',
      width: 80,
      aspectRatio: 90,
      rimDiameter: 17,
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 44,
      speedRating: 'P'
    }
  },
  {
    id: 53,
    category: 'Thương hiệu & Tiền tố tiếng Việt',
    input: 'Lốp 205/55R16 91V',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V'
    }
  },
  {
    id: 54,
    category: 'Xe tải nặng & mâm lẻ',
    input: 'DRC Đà Nẵng 11R22.5 16PR',
    expected: {
      brand: 'DRC',
      normalizedSize: '11R22.5',
      width: 279,
      aspectRatio: 90,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      techFeaturesMustInclude: ['16PR']
    }
  },
  {
    id: 55,
    category: 'Sao chép hông lốp đầy đủ',
    input: '205/55R16 91V DOT 4721 Barcode 9942',
    expected: {
      normalizedSize: '205/55R16',
      width: 205,
      aspectRatio: 55,
      rimDiameter: 16,
      loadIndex: 91,
      speedRating: 'V',
      dotCode: '4721'
    }
  },
  {
    id: 56,
    category: 'Lốp xe máy hệ inch',
    input: 'Casumina 2.50-17 38L',
    expected: {
      brand: 'Casumina',
      normalizedSize: '2.50-17',
      width: 64,
      aspectRatio: 100,
      rimDiameter: 17,
      construction: '-',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 38,
      speedRating: 'L',
      maxSpeedKmH: 120
    }
  },
  {
    id: 57,
    category: 'Lốp xe máy hệ inch',
    input: '3.50-10 51J',
    expected: {
      normalizedSize: '3.50-10',
      width: 89,
      aspectRatio: 100,
      rimDiameter: 10,
      construction: '-',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 51,
      speedRating: 'J',
      maxSpeedKmH: 100
    }
  },
  {
    id: 58,
    category: 'Lốp mô tô PKL không có M/C',
    input: '180/55ZR17 73W',
    expected: {
      normalizedSize: '180/55ZR17',
      width: 180,
      aspectRatio: 55,
      rimDiameter: 17,
      construction: 'ZR',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 73,
      speedRating: 'W',
      maxSpeedKmH: 270
    }
  },
  {
    id: 59,
    category: 'Lốp mô tô PKL không có M/C',
    input: '160/60ZR17 69W',
    expected: {
      normalizedSize: '160/60ZR17',
      width: 160,
      aspectRatio: 60,
      rimDiameter: 17,
      construction: 'ZR',
      isMotorcycle: true,
      vehicleType: 'MC',
      loadIndex: 69,
      speedRating: 'W',
      maxSpeedKmH: 270
    }
  },
  {
    id: 60,
    category: 'Tải kép dấu gạch ngang',
    input: '295/80R22.5 152-148M',
    expected: {
      normalizedSize: '295/80R22.5',
      width: 295,
      aspectRatio: 80,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      loadIndex: 152,
      dualLoadIndex: '152/148',
      speedRating: 'M',
      maxSpeedKmH: 130
    }
  },
  {
    id: 61,
    category: 'Lốp xe tải mâm lớn 24.5 inch',
    input: '285/75R24.5 144/141M',
    expected: {
      normalizedSize: '285/75R24.5',
      width: 285,
      aspectRatio: 75,
      rimDiameter: 24.5,
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      loadIndex: 144,
      dualLoadIndex: '144/141',
      speedRating: 'M',
      maxSpeedKmH: 130
    }
  },
  {
    id: 62,
    category: 'Sao chép hông lốp đầy đủ kép',
    input: 'Casumina 295/80R22.5 152/148M MAX LOAD SINGLE 3550 KG (7825 LBS) MAX LOAD DUAL 3150 KG (6945 LBS) AT 900 KPA (130 PSI) MAX PRESS',
    expected: {
      brand: 'Casumina',
      normalizedSize: '295/80R22.5',
      width: 295,
      aspectRatio: 80,
      rimDiameter: 22.5,
      isCommercialTruck: true,
      vehicleType: 'TRUCK',
      loadIndex: 152,
      dualLoadIndex: '152/148',
      speedRating: 'M',
      maxLoadExplicitKg: 3550,
      maxPressurePsi: 130
    }
  }
];

export interface VerificationResult {
  total: number;
  passed: number;
  failed: number;
  details: {
    id: number;
    input: string;
    category: string;
    pass: boolean;
    errors: string[];
    spec?: FullTireSpec | null;
  }[];
}

/**
 * Hàm thực thi kiểm thử đối sánh toàn diện
 */
export function runVerification(): VerificationResult {
  const details: VerificationResult['details'] = [];
  let passed = 0;
  let failed = 0;

  for (const tc of VARIANT_TEST_CASES) {
    const res = parseFullTireString(tc.input);
    const errors: string[] = [];

    if (!res) {
      errors.push(`parseFullTireString trả về NULL`);
    } else {
      const exp = tc.expected;

      if (exp.normalizedSize !== undefined && res.normalizedSize !== exp.normalizedSize) {
        errors.push(`normalizedSize: Kỳ vọng "${exp.normalizedSize}", nhận được "${res.normalizedSize}"`);
      }
      if (exp.width !== undefined && res.width !== exp.width) {
        errors.push(`width: Kỳ vọng ${exp.width}, nhận được ${res.width}`);
      }
      if (exp.aspectRatio !== undefined && res.aspectRatio !== exp.aspectRatio) {
        errors.push(`aspectRatio: Kỳ vọng ${exp.aspectRatio}, nhận được ${res.aspectRatio}`);
      }
      if (exp.rimDiameter !== undefined && res.rimDiameter !== exp.rimDiameter) {
        errors.push(`rimDiameter: Kỳ vọng ${exp.rimDiameter}, nhận được ${res.rimDiameter}`);
      }
      if (exp.construction && res.construction !== exp.construction) {
        errors.push(`construction: Kỳ vọng "${exp.construction}", nhận được "${res.construction}"`);
      }
      if (exp.loadIndex !== undefined && res.loadIndex !== exp.loadIndex) {
        errors.push(`loadIndex: Kỳ vọng ${exp.loadIndex}, nhận được ${res.loadIndex}`);
      }
      if (exp.dualLoadIndex !== undefined && res.dualLoadIndex !== exp.dualLoadIndex) {
        errors.push(`dualLoadIndex: Kỳ vọng "${exp.dualLoadIndex}", nhận được "${res.dualLoadIndex}"`);
      }
      if (exp.speedRating !== undefined && res.speedRating !== exp.speedRating) {
        errors.push(`speedRating: Kỳ vọng "${exp.speedRating}", nhận được "${res.speedRating}"`);
      }
      if (exp.maxSpeedKmH !== undefined && res.maxSpeedKmH !== exp.maxSpeedKmH) {
        errors.push(`maxSpeedKmH: Kỳ vọng ${exp.maxSpeedKmH}, nhận được ${res.maxSpeedKmH}`);
      }
      if (exp.dotCode !== undefined && res.dotCode !== exp.dotCode) {
        errors.push(`dotCode: Kỳ vọng "${exp.dotCode}", nhận được "${res.dotCode}"`);
      }
      if (exp.maxPressurePsi !== undefined && res.maxPressurePsi !== exp.maxPressurePsi) {
        errors.push(`maxPressurePsi: Kỳ vọng ${exp.maxPressurePsi}, nhận được ${res.maxPressurePsi}`);
      }
      if (exp.maxLoadExplicitKg !== undefined && res.maxLoadExplicitKg !== exp.maxLoadExplicitKg) {
        errors.push(`maxLoadExplicitKg: Kỳ vọng ${exp.maxLoadExplicitKg}, nhận được ${res.maxLoadExplicitKg}`);
      }
      if (exp.brand !== undefined && res.brand !== exp.brand) {
        errors.push(`brand: Kỳ vọng "${exp.brand}", nhận được "${res.brand}"`);
      }
      if (exp.pattern !== undefined && res.pattern !== exp.pattern) {
        errors.push(`pattern: Kỳ vọng "${exp.pattern}", nhận được "${res.pattern}"`);
      }
      if (exp.isMotorcycle !== undefined && res.isMotorcycle !== exp.isMotorcycle) {
        errors.push(`isMotorcycle: Kỳ vọng ${exp.isMotorcycle}, nhận được ${res.isMotorcycle}`);
      }
      if (exp.isCommercialTruck !== undefined && res.isCommercialTruck !== exp.isCommercialTruck) {
        errors.push(`isCommercialTruck: Kỳ vọng ${exp.isCommercialTruck}, nhận được ${res.isCommercialTruck}`);
      }
      if (exp.isFlotation !== undefined && res.isFlotation !== exp.isFlotation) {
        errors.push(`isFlotation: Kỳ vọng ${exp.isFlotation}, nhận được ${res.isFlotation}`);
      }
      if (exp.vehicleType !== undefined && res.vehicleType !== exp.vehicleType) {
        errors.push(`vehicleType: Kỳ vọng "${exp.vehicleType}", nhận được "${res.vehicleType}"`);
      }
      if (exp.techFeaturesMustInclude) {
        for (const feat of exp.techFeaturesMustInclude) {
          if (!res.techFeatures?.some(f => f.includes(feat))) {
            errors.push(`techFeatures: Kỳ vọng chứa "${feat}", thực tế: ${JSON.stringify(res.techFeatures)}`);
          }
        }
      }
    }

    const isPass = errors.length === 0;
    if (isPass) passed++;
    else failed++;

    details.push({
      id: tc.id,
      input: tc.input,
      category: tc.category,
      pass: isPass,
      errors,
      spec: res
    });
  }

  return {
    total: VARIANT_TEST_CASES.length,
    passed,
    failed,
    details
  };
}

/**
 * Hiển thị báo cáo kết quả trên terminal
 */
export function printVerificationReport(): boolean {
  console.log('\n================================================================================');
  console.log('       BÁO CÁO KIỂM THỬ ĐỘC LẬP BỘ PHÂN TÍCH BIẾN THỂ THÔNG SỐ LỐP (DEEPM LAB)');
  console.log('================================================================================\n');

  const result = runVerification();

  for (const item of result.details) {
    const status = item.pass ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
    console.log(`${status} #${item.id.toString().padStart(2, ' ')} [${item.category}] "${item.input}"`);
    if (item.pass && item.spec) {
      console.log(`       -> Size: ${item.spec.normalizedSize} | Dài/Rộng: ${item.spec.width}/${item.spec.aspectRatio}R${item.spec.rimDiameter} | Li/Speed: ${item.spec.loadIndex ?? '-'}${item.spec.speedRating ?? ''}${item.spec.dotCode ? ` | DOT: ${item.spec.dotCode}` : ''}`);
    } else {
      for (const err of item.errors) {
        console.log(`       \x1b[31m-> LỖI: ${err}\x1b[0m`);
      }
    }
  }

  const passRate = ((result.passed / result.total) * 100).toFixed(1);
  console.log('\n================================================================================');
  console.log(` TỔNG KẾT: ${result.passed}/${result.total} ca thành công (${passRate}%) - Thất bại: ${result.failed}`);
  console.log('================================================================================\n');

  return result.failed === 0;
}

// Tự động chạy khi được gọi trực tiếp qua Node CLI
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('verifyTireVariants')) {
  const success = printVerificationReport();
  if (!success && typeof process.exit === 'function') {
    process.exit(1);
  }
}

// Tương thích Vitest Runner: Thực thi và in toàn bộ báo cáo đối sánh khách quan
describe('Bộ Kiểm Định Độc Lập Biến Thể Thông Số Lốp (Independent Tire Variant Verification)', () => {
  it('Tất cả 55+ ca kiểm thử phải vượt qua đối sánh 100% (Pass Rate = 100%)', () => {
    const success = printVerificationReport();
    expect(success).toBe(true);
  });
});
