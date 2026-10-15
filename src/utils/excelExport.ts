import * as XLSX from 'xlsx';

export interface CalculationResult {
  toolId: string;
  toolName: string;
  category: string;
  formula: string;
  inputs: Record<string, { label: string; value: number | string; unit: string }>;
  outputs: Record<string, { label: string; value: number | string; unit: string }>;
  notes: string;
  timestamp: string;
}

/**
 * Xuất file Excel chuẩn hóa dành cho thợ máy
 */
export function exportCalculationToExcel(results: CalculationResult[], vehicleInfo?: { customerName?: string; carModel?: string; licensePlate?: string }) {
  // 1. Tạo Workbook mới
  const wb = XLSX.utils.book_new();

  // 2. Định dạng dữ liệu cho Sheet
  const sheetData: (string | number)[][] = [
    ['PHIẾU TÍNH TOÁN KỸ THUẬT Ô TÔ - DEEP M AUTOMOTIVE LAB'],
    [`Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`],
    [],
    ['THÔNG TIN KHÁCH HÀNG & PHƯƠNG TIỆN'],
    ['Chủ xe / Khách hàng:', vehicleInfo?.customerName || 'Khách vãng lai'],
    ['Dòng xe:', vehicleInfo?.carModel || 'Chưa cập nhật'],
    ['Biển số xe:', vehicleInfo?.licensePlate || 'Chưa cập nhật'],
    [],
    ['KẾT QUẢ TÍNH TOÁN CHI TIẾT'],
    ['Mã Tool', 'Hạng Mục', 'Tên Phép Tính', 'Thông Số Đầu Vào', 'Kết Quả Đầu Ra', 'Công Thức / Tiêu Chuẩn', 'Ghi Chú Kỹ Thuật'],
  ];

  results.forEach((item) => {
    // Format input strings
    const inputsStr = Object.values(item.inputs)
      .map((v) => `${v.label}: ${v.value} ${v.unit}`)
      .join('\n');

    // Format output strings (bảo vệ kép: không để lọt Infinity hoặc NaN ra file Excel)
    const outputsStr = Object.values(item.outputs)
      .map((v) => {
        let displayVal = v.value;
        if (typeof displayVal === 'number') {
          if (isNaN(displayVal) || !isFinite(displayVal)) {
            displayVal = '[Lỗi tham số]';
          }
        } else if (typeof displayVal === 'string') {
          const lower = displayVal.toLowerCase();
          if (lower.includes('infinity') || lower.includes('nan') || lower.includes('vô cực')) {
            displayVal = '[Lỗi chia 0 / Căn số âm]';
          }
        }
        return `${v.label}: ${displayVal} ${v.unit}`;
      })
      .join('\n');

    sheetData.push([
      item.toolId,
      item.category,
      item.toolName,
      inputsStr,
      outputsStr,
      item.formula,
      item.notes,
    ]);
  });

  sheetData.push([]);
  sheetData.push(['Xác nhận thợ máy kỹ thuật', '', '', '', 'Ký duyệt xưởng trưởng']);
  sheetData.push(['(Ký và ghi rõ họ tên)', '', '', '', '(Ký và đóng dấu)']);

  // Tạo Worksheet
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Thiết lập độ rộng cột
  ws['!cols'] = [
    { wch: 12 }, // Mã Tool
    { wch: 22 }, // Hạng mục
    { wch: 28 }, // Tên phép tính
    { wch: 32 }, // Inputs
    { wch: 30 }, // Outputs
    { wch: 35 }, // Công thức
    { wch: 40 }, // Ghi chú
  ];

  // Gắn sheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Báo Cáo Kỹ Thuật');

  // Đặt tên file xuất ra
  const fileName = `Bao_Cao_Ky_Thuat_${vehicleInfo?.carModel ? vehicleInfo.carModel.replace(/\s+/g, '_') : 'Garage'}_${Date.now()}.xlsx`;

  // Tải file về máy tính người dùng
  XLSX.writeFile(wb, fileName);
}
