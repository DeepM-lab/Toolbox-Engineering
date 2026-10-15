// Dữ liệu 12 ca kiểm thử chuẩn hóa từ Sheet KIEM THU (Pass 100%)
export interface VerificationCase {
  id: string;
  categoryName: string;
  testName: string;
  inputs: Record<string, number>;
  expectedOutputs: Record<string, number>;
  tolerance: number;
  conditionNotes: string;
}

export const VERIFICATION_CASES: VerificationCase[] = [
  {
    id: 'DM-001',
    categoryName: 'Off-road',
    testName: 'Crawl 12.74.1',
    inputs: { i_1: 1, i_transfer: 2.7, i_diff: 4.1 },
    expectedOutputs: { crawlRatio: 11.07 },
    tolerance: 0.001,
    conditionNotes: 'Tỷ số thuần; không tính bám'
  },
  {
    id: 'DM-013',
    categoryName: 'Car Audio',
    testName: 'Thể tích thùng 100x80x8 cm (L)',
    inputs: { L_cm: 100, W_cm: 80, H_cm: 8 },
    expectedOutputs: { volumeL: 64 },
    tolerance: 0.001,
    conditionNotes: 'Kích thước trong'
  },
  {
    id: 'DM-083',
    categoryName: 'Battery',
    testName: '4S4P cell 3.2V 20Ah Wh',
    inputs: { Ns: 4, Np: 4, V_cell_nom: 3.2, Ah_cell: 20 },
    expectedOutputs: { energyWh: 1024 },
    tolerance: 0.001,
    conditionNotes: 'Cell 20Ah'
  },
  {
    id: 'DM-037',
    categoryName: 'Performance',
    testName: 'Động cơ 6x B=95mm S=85mm (L)',
    inputs: { B_mm: 95, S_mm: 85, Nc: 6 },
    expectedOutputs: { displacementL: 3.615 },
    tolerance: 0.005,
    conditionNotes: 'Giá trị gần đúng (3.61499... L)'
  },
  {
    id: 'DM-054',
    categoryName: 'Racing',
    testName: 'Drag rho=1.2 Cd=0.3 A=2.2 v=20',
    inputs: { rho_air: 1.2, Cd: 0.3, Afront: 2.2, v_mps: 20 },
    expectedOutputs: { dragForceN: 158.4 },
    tolerance: 0.01,
    conditionNotes: 'Tốc độ cố định v=20m/s'
  },
  {
    id: 'DM-059',
    categoryName: 'Wheel & Tire',
    testName: 'Đường kính 285/70R17 mm',
    inputs: { width_mm: 285, AR_percent: 70, rim_in: 17 },
    expectedOutputs: { diameterMm: 830.8 },
    tolerance: 0.01,
    conditionNotes: 'Đường kính danh nghĩa'
  },
  {
    id: 'DM-069',
    categoryName: 'Electrical',
    testName: 'Máy phát 14.4V 390A W',
    inputs: { Vout: 14.4, Iout: 390 },
    expectedOutputs: { pOutW: 5616 },
    tolerance: 0.01,
    conditionNotes: 'Đầu ra DC'
  },
  {
    id: 'DM-035',
    categoryName: 'Camping',
    testName: 'Máy lạnh RV 400W x 8h (Wh)',
    inputs: { P_avg_W: 400, t_h: 8 },
    expectedOutputs: { energy_Wh: 3200 },
    tolerance: 0.01,
    conditionNotes: 'Năng lượng điều hòa qua đêm'
  },
  {
    id: 'DM-101',
    categoryName: 'Mechanical',
    testName: 'Công suất 200bar x 10 L/min kW',
    inputs: { p_bar: 200, Q_Lmin: 10 },
    expectedOutputs: { pKw: 3.3333 },
    tolerance: 0.001,
    conditionNotes: 'Không chia hiệu suất'
  },
  {
    id: 'DM-105',
    categoryName: 'EV',
    testName: 'Motor 100Nm 3000rpm kW',
    inputs: { T_Nm: 100, n_rpm: 3000 },
    expectedOutputs: { pKw: 31.4159 },
    tolerance: 0.005,
    conditionNotes: 'Công suất cơ'
  },
  {
    id: 'DM-116',
    categoryName: 'Detailing',
    testName: 'Phủ 12m² x 0.5mm L',
    inputs: { A_m2: 12, t_wet_mm: 0.5 },
    expectedOutputs: { vWetL: 6 },
    tolerance: 0.001,
    conditionNotes: 'Thể tích lớp ướt'
  },
  {
    id: 'DM-134',
    categoryName: 'Garage',
    testName: 'Chi phí xăng 8L/100km 25000đ/L đ/km',
    inputs: { Lper100km: 8, price_per_L: 25000 },
    expectedOutputs: { costPerKm: 2000 },
    tolerance: 0.001,
    conditionNotes: 'Đơn giá minh họa'
  }
];
