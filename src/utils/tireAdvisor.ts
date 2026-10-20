import { type FullTireSpec } from './tireParser';

export interface ChecklistItem {
  label: string;
  status: 'ok' | 'warn' | 'error';
  note: string;
}

export interface InsightItem {
  topic: string;
  content: string;
  type: 'info' | 'tip' | 'warning';
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ExpertAdvice {
  safetyScore: number; // 0-100
  safetyLabel: 'AN TOÀN' | 'CẦN LƯU Ý' | 'KIỂM TRA NGAY';
  safetyColor: 'emerald' | 'amber' | 'rose';
  summary: string;
  checklist: ChecklistItem[];
  insights: InsightItem[];
  faqs: FaqItem[];
}

/**
 * Sinh nhận định chuyên môn tự động dựa trên thông số kỹ thuật lốp xe
 * Đóng vai trò như chuyên gia thợ máy DeepM Lab tư vấn trực tiếp cho khách hàng.
 */
export function generateExpertAdvice(spec: FullTireSpec): ExpertAdvice {
  let score = 100;
  const sidewallHeight = Math.round((spec.width * spec.aspectRatio) / 100);

  // ==========================================
  // A. TÍNH TOÁN ĐIỂM AN TOÀN (SAFETY SCORE)
  // ==========================================
  const hasFullRating = Boolean(spec.loadIndex || spec.speedRating);

  if (hasFullRating) {
    // 1. Đánh giá Load Index khi có nhập
    if (!spec.loadIndex) {
      score -= 15;
    } else if (!spec.maxLoadKg) {
      score -= 30; // Chỉ số tải không tồn tại trong quy chuẩn
    } else if (spec.isMotorcycle) {
      if (spec.loadIndex < 35) {
        score -= 20; // Lốp xe máy quá yếu
      }
    } else {
      if (spec.loadIndex < 70) {
        score -= 25; // Quá thấp đối với ô tô
      } else if (spec.loadIndex >= 70 && spec.loadIndex <= 78) {
        score -= 10; // Chỉ hợp xe siêu nhỏ
      }
    }

    // 2. Đánh giá Speed Rating khi có nhập
    if (!spec.speedRating) {
      score -= 10;
    } else if (!spec.maxSpeedKmH) {
      score -= 20; // Mã tốc độ không xác định
    } else {
      const sr = spec.speedRating.replace(/[()]/g, '').toUpperCase();
      if (!spec.isCommercialTruck && (sr === 'L' || sr === 'M')) {
        score -= 15; // Không phù hợp chạy cao tốc với xe du lịch
      } else if (!spec.isMotorcycle && (sr === 'N' || sr === 'P')) {
        score -= 10;
      }
    }
  } else {
    // Người dùng chỉ nhập kích thước hình học thuần túy (ví dụ 205/55R16)
    // Không trừ oan 50 điểm, chỉ trừ nhẹ 10 điểm để nhắc nhở bổ sung
    score -= 10;
  }

  // 3. Đánh giá Tỷ lệ chiều cao hông lốp (Aspect Ratio)
  if (spec.aspectRatio < 45) {
    score -= 15; // Ultra-low profile, nguy cơ cấn móp vành cao
  } else if (spec.aspectRatio >= 45 && spec.aspectRatio <= 49) {
    score -= 5;
  }

  // 4. Đánh giá xe bán tải / tải nhẹ (LT)
  if (spec.vehicleType === 'LT' && !spec.extraLoad && spec.aspectRatio < 65) {
    score -= 5;
  }

  // 5. Đánh giá lốp dự phòng tạm thời (T)
  if (spec.vehicleType === 'T') {
    score = Math.min(score, 65); // Khống chế tối đa 65 điểm: chỉ là lốp tạm thời khẩn cấp
  }

  // 6. Đánh giá cấu trúc Bias / Diagonal (D hoặc B hoặc -)
  if (!spec.isMotorcycle && (spec.construction === 'D' || spec.construction === 'B' || spec.construction === '-')) {
    score -= 15;
  }

  // 7. Cảnh báo thông số vượt ngưỡng quy chuẩn thực tế
  if (spec.validationWarning) {
    score -= 40;
  }

  // Giới hạn điểm từ 0 đến 100
  const safetyScore = Math.max(0, Math.min(100, score));

  // Phân loại nhãn và màu sắc
  let safetyLabel: 'AN TOÀN' | 'CẦN LƯU Ý' | 'KIỂM TRA NGAY';
  let safetyColor: 'emerald' | 'amber' | 'rose';

  if (safetyScore >= 80) {
    safetyLabel = 'AN TOÀN';
    safetyColor = 'emerald';
  } else if (safetyScore >= 60) {
    safetyLabel = 'CẦN LƯU Ý';
    safetyColor = 'amber';
  } else {
    safetyLabel = 'KIỂM TRA NGAY';
    safetyColor = 'rose';
  }

  // ==========================================
  // B. TỔNG KẾT CHUYÊN GIA (SUMMARY)
  // ==========================================
  const specText = spec.rawString || `${spec.width}/${spec.aspectRatio}R${spec.rimDiameter}`;
  let summary = '';

  if (spec.validationWarning) {
    summary = `Thông số lốp ${specText} có kích thước bất thường, vượt ngoài dải quy chuẩn thông dụng của các nhà sản xuất ô tô quốc tế. Cần kiểm tra lại dãy ký tự dập nổi trên thành lốp thực tế.`;
  } else if (spec.isFlotation && spec.flotationSpec) {
    summary = `Lốp ${specText} thuộc hệ Inch Flotation (Đường kính ${spec.flotationSpec.diameterInch}" x Bản rộng ${spec.flotationSpec.widthInch}" mâm R${spec.flotationSpec.rimInch}"), tương đương cỡ Metric ~${spec.width}/${spec.aspectRatio}R${spec.rimDiameter}. Thiết kế chuyên dụng cho xe bán tải, SUV off-road gầm cao leo dốc và lội bùn lầy.`;
  } else if (spec.isMotorcycle) {
    summary = `Lốp ${specText} thuộc quy chuẩn lốp xe máy, mô tô và xe tay ga (Bề rộng ${spec.width}mm, tỷ lệ hông ${spec.aspectRatio}%, mâm ${spec.rimDiameter} inch). Kết cấu tối ưu cho độ linh hoạt góc nghiêng khi vào cua.`;
  } else if (spec.isCommercialTruck) {
    summary = `Lốp ${specText} thuộc phân khúc xe thương mại, xe tải nặng và vận tải hành khách (Mâm ${spec.rimDiameter}"). Thiết kế chịu tải trọng cao, hông lốp gia cố nhiều lớp bố thép vận hành bền bỉ trên các tuyến đường dài.`;
  } else if (spec.vehicleType === 'T') {
    summary = `Lốp ${specText} là lốp dự phòng thay thế tạm thời (Temporary Spare). Chỉ sử dụng trong tình huống khẩn cấp để di chuyển quãng đường ngắn về garage/xưởng dịch vụ, khuyến nghị tốc độ tối đa không quá 80 km/h, tuyệt đối không chạy đường dài.`;
  } else if (!hasFullRating) {
    summary = `Lốp ${specText} có kích thước hình học hợp lệ. Bạn nên nhập thêm chỉ số tải trọng và mã tốc độ (ví dụ 91V, 112T) để DeepM Lab thẩm định sức chịu tải và giới hạn tốc độ chi tiết hơn.`;
  } else if (safetyScore >= 80) {
    summary = `Lốp ${specText} có thông số đầy đủ và rất hợp lý. Đảm bảo an toàn kỹ thuật cao trên các cung đường tiêu chuẩn và cao tốc.`;
  } else if (safetyScore >= 60) {
    summary = `Lốp ${specText} có một số điểm kỹ thuật cần lưu ý trước khi vận hành (độ dày thành lốp, giới hạn vận tốc hoặc tính chất lốp chuyên dụng).`;
  } else {
    summary = `Lốp ${specText} thiếu thông số kỹ thuật quan trọng hoặc có chỉ số không phù hợp với điều kiện vận hành an toàn. Cần kiểm tra kỹ trước khi lắp lên xe.`;
  }

  // ==========================================
  // C. CHECKLIST AN TOÀN KỸ THUẬT (5-6 ITEMS)
  // ==========================================
  const checklist: ChecklistItem[] = [];

  // 1. Chỉ số tải trọng
  if (spec.loadIndex !== undefined) {
    if (!spec.maxLoadKg) {
      checklist.push({
        label: 'Chỉ số tải trọng',
        status: 'error',
        note: `Chỉ số tải ${spec.loadIndex} không tồn tại trong bảng quy chuẩn quốc tế (60–130).`
      });
    } else {
      const loadKg = `${spec.maxLoadKg} kg/lốp`;
      if (spec.loadIndex >= 82) {
        checklist.push({
          label: 'Chỉ số tải trọng',
          status: 'ok',
          note: `Chỉ số ${spec.loadIndex} (${loadKg}) — đủ tải cho hầu hết xe du lịch và SUV gia đình.`
        });
      } else if (spec.loadIndex >= 75) {
        checklist.push({
          label: 'Chỉ số tải trọng',
          status: 'warn',
          note: `Chỉ số ${spec.loadIndex} (${loadKg}) — chỉ phù hợp xe đô thị cỡ nhỏ dưới 1.2 tấn.`
        });
      } else {
        checklist.push({
          label: 'Chỉ số tải trọng',
          status: 'error',
          note: `Chỉ số ${spec.loadIndex} (${loadKg}) — tải trọng quá thấp, nguy hiểm khi tải nặng hoặc chạy tốc độ cao.`
        });
      }
    }
  } else {
    checklist.push({
      label: 'Chỉ số tải trọng',
      status: 'warn',
      note: 'Không đọc được chỉ số tải. Kiểm tra lại chuỗi ký hiệu đầy đủ trên thành lốp.'
    });
  }

  // 2. Giới hạn tốc độ cao tốc
  if (spec.maxSpeedKmH !== undefined && spec.speedRating) {
    if (spec.maxSpeedKmH >= 130) {
      checklist.push({
        label: 'Giới hạn tốc độ cao tốc',
        status: 'ok',
        note: `Mã ${spec.speedRating} cho phép ${spec.maxSpeedKmH} km/h — an toàn cho cao tốc VN (tối đa 120 km/h).`
      });
    } else if (spec.maxSpeedKmH >= 100) {
      checklist.push({
        label: 'Giới hạn tốc độ cao tốc',
        status: 'warn',
        note: `Mã ${spec.speedRating} giới hạn ${spec.maxSpeedKmH} km/h — sát trần tốc độ cao tốc VN, nên chạy cẩn trọng.`
      });
    } else {
      checklist.push({
        label: 'Giới hạn tốc độ cao tốc',
        status: 'error',
        note: `Mã ${spec.speedRating} chỉ đạt ${spec.maxSpeedKmH} km/h — không an toàn khi lưu thông trên cao tốc.`
      });
    }
  } else if (spec.speedRating) {
    checklist.push({
      label: 'Giới hạn tốc độ cao tốc',
      status: 'error',
      note: `Mã tốc độ "${spec.speedRating}" không nằm trong bảng quy chuẩn quốc tế. Cần kiểm tra lại ký hiệu.`
    });
  } else {
    checklist.push({
      label: 'Giới hạn tốc độ cao tốc',
      status: 'error',
      note: 'Chưa xác định được mã tốc độ giới hạn. Cần kiểm tra ký hiệu chữ cái sau chỉ số tải.'
    });
  }

  // 3. Độ dày hông lốp
  if (spec.aspectRatio >= 50) {
    checklist.push({
      label: 'Độ dày hông lốp',
      status: 'ok',
      note: `Tỷ lệ ${spec.aspectRatio}% (hông ${sidewallHeight}mm) — đủ đệm khí bảo vệ vành trên đường xấu.`
    });
  } else if (spec.aspectRatio >= 45) {
    checklist.push({
      label: 'Độ dày hông lốp',
      status: 'warn',
      note: `Hông lốp ${sidewallHeight}mm (tỷ lệ ${spec.aspectRatio}%). Cẩn thận ổ gà, gờ giảm tốc cao. Nguy cơ bong mép vành.`
    });
  } else {
    checklist.push({
      label: 'Độ dày hông lốp',
      status: 'error',
      note: `Tỷ lệ ${spec.aspectRatio}% (hông ${sidewallHeight}mm) — hông siêu mỏng, rất dễ cấn móp mép vành khi sụp ổ gà tốc độ cao.`
    });
  }

  // 4. Cấu trúc Radial
  if (spec.construction === 'R' || spec.construction === 'ZR') {
    checklist.push({
      label: 'Cấu trúc lốp',
      status: 'ok',
      note: `Cấu trúc Radial bố thép tỏa tròn (${spec.construction}) — tản nhiệt tối ưu, chống mài mòn và bám đường ổn định.`
    });
  } else {
    checklist.push({
      label: 'Cấu trúc lốp',
      status: 'warn',
      note: `Cấu trúc bố chéo ${spec.construction || 'Bias'} — sinh nhiệt nhiều, không tối ưu cho xe hiện đại vận hành tốc độ cao.`
    });
  }

  // 5. Lốp gia cường / Load Range
  if (spec.loadRange) {
    checklist.push({
      label: 'Phân hạng tải Load Range',
      status: 'ok',
      note: `Hạng ${spec.loadRange} (${spec.loadRangeDesc || ''}) — thành hông gia cường chịu va đập đá sỏi, áp suất lốp cao.`
    });
  } else if (spec.extraLoad) {
    checklist.push({
      label: 'Kết cấu chịu tải',
      status: 'ok',
      note: `Có ký hiệu ${spec.extraLoad} — lốp gia cường, chịu tải trọng và áp suất bơm cao hơn lốp tiêu chuẩn.`
    });
  } else if (spec.vehicleType === 'LT') {
    checklist.push({
      label: 'Kết cấu chịu tải',
      status: 'warn',
      note: 'Xe bán tải / SUV tải nhẹ nên ưu tiên lốp XL hoặc Load Range E chuyên dụng để tăng khả năng chở nặng an toàn.'
    });
  } else {
    checklist.push({
      label: 'Kết cấu chịu tải',
      status: 'ok',
      note: 'Lốp tiêu chuẩn (Standard Load - SL) phù hợp cho xe du lịch sử dụng hàng ngày.'
    });
  }

  // 6. Tiêu chuẩn OEM của hãng xe (nếu có)
  if (spec.oeMarking) {
    checklist.push({
      label: 'Chuẩn hãng OEM',
      status: 'ok',
      note: `Ký hiệu ${spec.oeMarking.code} (${spec.oeMarking.brand}): ${spec.oeMarking.note}`
    });
  }

  // 7. Lốp dự phòng khẩn cấp
  if (spec.vehicleType === 'T') {
    checklist.push({
      label: 'Lốp dự phòng tạm thời',
      status: 'warn',
      note: 'Chỉ dùng tạm thời di chuyển về xưởng, giới hạn tốc độ <= 80 km/h, tuyệt đối không chạy đường dài.'
    });
  }

  // 8. Các công nghệ & tính năng đặc thù (Run-flat, Gai địa hình, Số lớp bố)
  if (spec.techFeatures && spec.techFeatures.length > 0) {
    for (const feat of spec.techFeatures) {
      checklist.push({
        label: 'Tính năng công nghệ',
        status: 'ok',
        note: feat
      });
    }
  }

  // 9. Cảnh báo thông số bất thường (nếu có)
  if (spec.validationWarning) {
    checklist.push({
      label: 'Kích thước bất thường',
      status: 'error',
      note: spec.validationWarning
    });
  }

  // 10. Kiểm tra DOT năm sản xuất (luôn warn)
  checklist.push({
    label: 'Hạn sử dụng theo mã DOT',
    status: 'warn',
    note: 'Nhớ kiểm tra 4 số cuối ký hiệu DOT trên thành lốp. Lốp trên 6 năm nên thay dù gai còn nhiều.'
  });

  // ==========================================
  // D. GÓC NHÌN KỸ THUẬT CHUYÊN SÂU (INSIGHTS)
  // ==========================================
  const insights: InsightItem[] = [];

  // Insight 1: Về hông lốp (luôn có)
  if (spec.aspectRatio < 45) {
    insights.push({
      topic: 'Hông lốp ultra-low',
      type: 'warning',
      content: `Thành lốp chỉ dày ${sidewallHeight}mm — cực mỏng. Trên đường Việt Nam nhiều ổ gà và gờ giảm tốc cao, nguy cơ bong vành và phồng hông lốp khá cao. Nên hạn chế qua ổ gà với tốc độ cao và kiểm tra vành định kỳ.`
    });
  } else if (spec.aspectRatio >= 45 && spec.aspectRatio <= 49) {
    insights.push({
      topic: 'Hông lốp low-profile',
      type: 'tip',
      content: `Hông lốp ${sidewallHeight}mm đem lại cảm giác lái đầm chắc và phản hồi lái tức thì, nhưng khả năng triệt tiêu xung lực giảm. Khi đi vào đường xấu cần giữ khoảng cách và quan sát mép ổ gà để bảo vệ lốp.`
    });
  } else if (spec.aspectRatio >= 50 && spec.aspectRatio <= 65) {
    insights.push({
      topic: 'Hông lốp tiêu chuẩn',
      type: 'info',
      content: `Thành lốp ${sidewallHeight}mm nằm trong vùng tối ưu cho xe gia đình tại Việt Nam. Vừa đủ đệm khí để hấp thụ rung chấn từ mặt đường, vừa hạn chế vặn xoắn thân lốp khi vào cua.`
    });
  } else {
    insights.push({
      topic: 'Hông lốp cao',
      type: 'info',
      content: `Thành lốp ${sidewallHeight}mm rất lý tưởng cho xe bán tải, SUV gầm cao và vượt địa hình gồ ghề. Hấp thụ xung lực tốt từ mặt đường, tuy nhiên độ nghiêng thân xe khi vào cua gắt sẽ cảm nhận rõ hơn.`
    });
  }

  // Insight 2: Về Load Index & Dual Load (nếu có)
  if (spec.dualLoadIndex && spec.dualLoadKg) {
    insights.push({
      topic: `Tải trọng kép (${spec.dualLoadIndex})`,
      type: 'info',
      content: `Khi lắp bánh đơn (cầu trước hoặc xe 4 bánh), tải trọng tối đa là ${spec.dualLoadKg.single} kg/lốp (tổng tải 4 bánh: ${(spec.dualLoadKg.singleTotal4).toLocaleString('vi-VN')} kg). Khi lắp bánh đôi (dual rear wheels), chỉ số giảm xuống ${spec.dualLoadKg.dual} kg/lốp để dự phòng bù trừ cân bằng mặt đường.`
    });
  } else if (spec.loadIndex !== undefined && spec.maxLoadKg !== undefined) {
    if (spec.loadIndex >= 100) {
      insights.push({
        topic: 'Chỉ số tải trọng cao',
        type: 'info',
        content: `Chỉ số tải ${spec.loadIndex} (${spec.maxLoadKg ? `${spec.maxLoadKg} kg/lốp` : ''}) mang lại biên độ an toàn tải trọng rất lớn. Lời khuyên cốt lõi từ thợ máy: Tuyệt đối không bao giờ thay bằng lốp có chỉ số tải thấp hơn lốp nguyên bản theo xe.`
      });
    } else if (spec.loadIndex < 82) {
      insights.push({
        topic: 'Chỉ số tải trọng thấp',
        type: 'warning',
        content: `Mức tải ${spec.loadIndex} (${spec.maxLoadKg ? `${spec.maxLoadKg} kg/lốp` : ''}) chỉ dành cho xe phân khúc nhỏ. Cần kiểm tra kỹ tải trọng tổng của xe khi chở đủ người, và tuyệt đối không lắp lốp có chỉ số tải thấp hơn khuyến nghị trên tem khung cửa.`
      });
    } else {
      insights.push({
        topic: 'Chỉ số tải trọng tối ưu',
        type: 'info',
        content: `Mức tải ${spec.loadIndex} (${spec.maxLoadKg ? `${spec.maxLoadKg} kg/lốp` : ''}) hoàn toàn đáp ứng nhu cầu chở đủ tải của dòng xe gia đình. Nguyên tắc thợ máy: Khi thay thế, chỉ chọn lốp có chỉ số tải bằng hoặc cao hơn lốp nguyên bản.`
      });
    }
  }

  // Insight 3: Về Speed Rating (nếu có)
  if (spec.speedRating) {
    const sr = spec.speedRating.replace(/[()]/g, '').toUpperCase();
    if (['H', 'V', 'W', 'Y'].includes(sr)) {
      insights.push({
        topic: `Hiệu năng dải tốc độ (${spec.speedRating})`,
        type: 'tip',
        content: `Lốp đạt dải tốc độ cao (${spec.maxSpeedKmH ? `${spec.maxSpeedKmH} km/h` : ''}), hợp chất cao su bám đường tốt hơn nhưng sinh nhiệt nhanh. Cần duy trì đúng áp suất lốp tiêu chuẩn để tránh hiện tượng quá nhiệt biến dạng cấu trúc khi chạy tốc độ cao liên tục.`
      });
    } else if (['S', 'T', 'U'].includes(sr)) {
      insights.push({
        topic: `Tốc độ phổ thông (${spec.speedRating})`,
        type: 'info',
        content: `Mã tốc độ ${spec.speedRating} (${spec.maxSpeedKmH ? `${spec.maxSpeedKmH} km/h` : ''}) hoàn toàn đáp ứng trần vận tốc 120 km/h của hệ thống cao tốc Việt Nam, bền bỉ và kinh tế trong điều kiện sử dụng hàng ngày.`
      });
    } else {
      insights.push({
        topic: `Giới hạn tốc độ (${spec.speedRating})`,
        type: 'warning',
        content: `Mã tốc độ ${spec.speedRating} (${spec.maxSpeedKmH ? `${spec.maxSpeedKmH} km/h` : ''}) có trần vận tốc thấp. Thường thấy trên lốp vượt địa hình gai thô (M/T), lốp dự phòng hoặc xe chuyên dụng. Chú ý không duy trì tốc độ cao liên tục.`
      });
    }
  }

  // Insight 4: Về HL (High Load xe điện)
  if (spec.vehicleType === 'HL' || spec.extraLoad === 'HL') {
    insights.push({
      topic: 'Chuẩn lốp xe điện High Load (HL)',
      type: 'info',
      content: 'Lốp HL (High Load Capacity) là tiêu chuẩn quốc tế mới được thiết kế đặc thù cho xe thuần điện (EV) và SUV hạng nặng có bộ pin lớn. Lốp chịu được tải trọng cao hơn lốp XL cùng kích thước tới 10-25% mà không cần mở rộng bề mặt lốp, giúp tối ưu hóa khí động học và tầm vận hành xe điện.'
    });
  } else if (spec.extraLoad) {
    insights.push({
      topic: `Lốp gia cường (${spec.extraLoad})`,
      type: 'tip',
      content: 'Lốp gia cường cần bơm áp suất cao hơn lốp SL cùng cỡ khoảng 3-4 PSI (0.2-0.3 Bar). Kiểm tra nhãn dán ở bệ cửa ghế lái để biết đúng áp suất khuyến nghị cho lốp XL.'
    });
  }

  // Insight 5: Về chuẩn OEM
  if (spec.oeMarking) {
    insights.push({
      topic: `Dấu ấn chính hãng (${spec.oeMarking.brand})`,
      type: 'tip',
      content: `Ký hiệu ${spec.oeMarking.code}: Lốp được thiết kế riêng theo đơn đặt hàng độc quyền của ${spec.oeMarking.brand}. Đã trải qua hàng trăm giờ tinh chỉnh để tương thích tối đa với hệ thống treo, trọng tâm xe và hệ thống cân bằng điện tử ESP của hãng.`
    });
  }

  // Insight 6: Về cấu trúc ZR (nếu có)
  if (spec.construction === 'ZR') {
    insights.push({
      topic: 'Cấu trúc hiệu năng cao ZR',
      type: 'info',
      content: 'Ký hiệu ZR biểu thị cấu trúc bố tỏa tròn Radial thiết kế cho vận tốc trên 240 km/h. Vành bố thép và đai gia cường đỉnh lốp được thiết kế chống ly tâm tốt hơn lốp R tiêu chuẩn.'
    });
  }

  // ==========================================
  // E. CÂU HỎI THƯỜNG GẶP (FAQS)
  // ==========================================
  const faqs: FaqItem[] = [];

  // FAQ 1: Luôn có
  faqs.push({
    q: 'Tôi có thể thay bằng lốp có chỉ số tải thấp hơn không?',
    a: spec.loadIndex
      ? `Tuyệt đối không nên. Lốp hiện tại có chỉ số tải ${spec.loadIndex} (${spec.maxLoadKg || 0} kg/bánh). Lắp lốp có chỉ số tải thấp hơn sẽ khiến lốp bị quá tải, gây quá nhiệt, méo thành lốp và nguy cơ nổ lốp rất cao khi xe chở đủ người hoặc hành lý.`
      : 'Tuyệt đối không nên. Việc hạ chỉ số tải trọng so với thông số quy định của nhà sản xuất xe sẽ gây nguy cơ nổ lốp do quá tải và mất an toàn nghiêm trọng.'
  });

  // FAQ 2: Luôn có
  faqs.push({
    q: 'Bao lâu thì nên thay lốp mới?',
    a: 'Theo khuyến cáo của các hãng lốp lớn và tiêu chuẩn an toàn kỹ thuật, nên thay lốp sau mỗi 5-6 năm kể từ ngày sản xuất (tra cứu mã 4 số DOT trên thành lốp) hoặc sau 50.000 - 60.000 km lăn bánh, tùy điều kiện nào đến trước. Kể cả khi gai lốp còn dày nhưng cao su đã quá 6 năm tuổi sẽ bị lão hóa, chai cứng và mất độ bám.'
  });

  // FAQ 3: Nếu aspectRatio < 50
  if (spec.aspectRatio < 50) {
    faqs.push({
      q: 'Lốp profile thấp có dễ hỏng vành khi qua ổ gà không?',
      a: `Có, nguy cơ cao hơn rất nhiều. Với tỷ lệ hông lốp ${spec.aspectRatio}%, lớp đệm khí giữa vành và mặt đường rất mỏng. Khi xe sụp ổ gà hoặc va vào gờ sắc với tốc độ cao, lực va đập sẽ tác động trực tiếp vào vành gây móp méo, nứt vành hoặc chém rách hông lốp (phồng lốp).`
    });
  }

  // FAQ 4: Nếu có extraLoad
  if (spec.extraLoad) {
    faqs.push({
      q: 'Bơm áp suất lốp XL (Extra Load) như thế nào?',
      a: 'Lốp XL chịu được tải trọng cao hơn nhờ khung lốp gia cố và áp suất làm việc cao hơn. Bạn nên bơm cao hơn mức tiêu chuẩn của lốp SL khoảng 3 - 5 PSI (0.2 - 0.35 bar), hoặc tham khảo bảng áp suất dành riêng cho cấu hình lốp gia cường dán trên khung cửa ghế lái.'
    });
  }

  // FAQ 5: Nếu thiếu loadIndex hoặc speedRating
  if (!spec.loadIndex || !spec.speedRating) {
    faqs.push({
      q: 'Tại sao không thấy chỉ số tải và tốc độ?',
      a: 'Bạn có thể mới chỉ nhập kích thước hình học (ví dụ: 205/55R16). Hãy nhìn kỹ trên thành lốp thực tế, ngay sau ký hiệu mâm sẽ có cụm 2-3 chữ số kèm một chữ cái (ví dụ: 91V, 94W, 112T). Nhập đầy đủ chuỗi này để hệ thống DeepM Lab đưa ra đánh giá an toàn chuẩn xác nhất.'
    });
  }

  return {
    safetyScore,
    safetyLabel,
    safetyColor,
    summary,
    checklist,
    insights,
    faqs
  };
}
