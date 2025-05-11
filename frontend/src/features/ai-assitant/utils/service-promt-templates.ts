// service-suggestion-prompts.ts
import { PetCategory } from '@/constants';
import { petCategoryTranslations } from '@/constants';

// Gợi ý chung cho tất cả các dịch vụ
export const serviceSuggestionPrompts = [
  {
    key: "general-description",
    title: "Mô tả dịch vụ",
    icon: "📝",
    prompt: "Hãy tạo một mô tả chuyên nghiệp và hấp dẫn cho dịch vụ này, bao gồm các lợi ích chính và tại sao chủ thú cưng nên chọn dịch vụ này. Giữ giọng điệu thân thiện và tập trung vào lợi ích cho cả thú cưng và chủ của chúng."
  },
  {
    key: "benefits-list",
    title: "Liệt kê lợi ích",
    icon: "✅",
    prompt: "Tạo một danh sách 5-7 lợi ích chính của dịch vụ này cho thú cưng và chủ nhân. Mỗi lợi ích nên ngắn gọn, rõ ràng và nhấn mạnh giá trị cụ thể mà dịch vụ mang lại."
  },
  {
    key: "process-description",
    title: "Quy trình thực hiện",
    icon: "🔄",
    prompt: "Mô tả chi tiết quy trình thực hiện dịch vụ này từ đầu đến cuối, bao gồm các bước, thời gian, và trải nghiệm mà thú cưng sẽ có trong quá trình thực hiện. Làm nổi bật sự chuyên nghiệp và tiêu chuẩn cao của dịch vụ."
  },
  {
    key: "pricing-explanation",
    title: "Giải thích giá trị",
    icon: "💰",
    prompt: "Viết một đoạn văn ngắn giải thích giá trị mà khách hàng nhận được với mức giá này, bao gồm chất lượng dịch vụ, chuyên môn của nhân viên, và kết quả dài hạn. Giúp khách hàng hiểu tại sao dịch vụ này đáng giá với số tiền họ bỏ ra."
  },
  {
    key: "faq-generator",
    title: "Tạo FAQ",
    icon: "❓",
    prompt: "Tạo 3-5 câu hỏi thường gặp và câu trả lời chi tiết liên quan đến dịch vụ này, bao gồm thông tin về quy trình, kết quả mong đợi, và thông tin quan trọng mà khách hàng cần biết."
  },
  {
    key: "promotional",
    title: "Nội dung quảng cáo",
    icon: "🌟",
    prompt: "Viết một đoạn quảng cáo ngắn (2-3 câu) cho dịch vụ này, sử dụng ngôn ngữ thuyết phục và hấp dẫn, nhấn mạnh những điểm độc đáo và kết thúc bằng lời kêu gọi hành động rõ ràng."
  },
  {
    key: "pet-specific",
    title: "Theo loại thú cưng",
    icon: "🐾",
    prompt: "Điều chỉnh mô tả dịch vụ để phù hợp với các loại thú cưng đã chọn, giải thích tại sao dịch vụ này đặc biệt phù hợp với nhu cầu của từng loại thú cưng và lợi ích cụ thể mà chúng sẽ nhận được."
  }
];

// Các prompt theo từng loại dịch vụ cụ thể
export const specialtyPrompts: Record<string, string[]> = {
  // Dịch vụ Grooming - Tắm gội
  BATHING: [
    "Mô tả chi tiết về dịch vụ tắm gội cao cấp, bao gồm các sản phẩm đặc biệt được sử dụng, quy trình chăm sóc từng bước, và cách dịch vụ này giúp cải thiện sức khỏe da lông của thú cưng. Đề cập đến các biện pháp an toàn và thoải mái cho thú cưng trong quá trình tắm.",
    
    "Viết một mô tả thu hút về trải nghiệm tắm gội thư giãn mà thú cưng sẽ nhận được. Nhấn mạnh vào chất lượng sản phẩm, kỹ năng của nhân viên, và cảm giác sạch sẽ, thơm tho sau khi sử dụng dịch vụ. Kết thúc bằng các lợi ích lâu dài của việc tắm gội thường xuyên.",
    
    "Tạo nội dung giải thích tầm quan trọng của việc tắm gội chuyên nghiệp đối với sức khỏe tổng thể của thú cưng. Đề cập đến việc ngăn ngừa các vấn đề về da, kiểm soát rụng lông, và phát hiện sớm các vấn đề tiềm ẩn. Giải thích sự khác biệt giữa dịch vụ tắm chuyên nghiệp và tắm tại nhà."
  ],
  
  // Dịch vụ Grooming - Cắt tỉa lông
  HAIRCUT: [
    "Mô tả dịch vụ cắt tỉa lông chuyên nghiệp, nhấn mạnh vào các kiểu cắt tỉa phù hợp với từng giống thú cưng, kỹ thuật cắt tỉa an toàn, và kết quả thẩm mỹ cao. Giải thích cách nhân viên được đào tạo để xử lý mọi loại lông và tính cách của thú cưng.",
    
    "Viết về lợi ích của dịch vụ cắt tỉa lông định kỳ, bao gồm ngăn ngừa rối lông, giảm rụng lông trong nhà, phát hiện sớm các vấn đề về da, và giúp thú cưng thoải mái hơn trong thời tiết nóng. Đề cập đến các kỹ thuật cắt tỉa hiện đại được sử dụng.",
    
    "Tạo một mô tả chi tiết về quy trình cắt tỉa lông từ đầu đến cuối, bao gồm đánh giá tình trạng lông, tắm trước khi cắt, kỹ thuật cắt phù hợp với giống thú cưng, và những lưu ý đặc biệt với các giống thú cưng khác nhau. Nhấn mạnh về tính chuyên nghiệp và kinh nghiệm của đội ngũ."
  ],
  
  // Dịch vụ Grooming - Chăm sóc da
  SKINCARE: [
    "Mô tả dịch vụ chăm sóc da toàn diện cho thú cưng, bao gồm các bước đánh giá tình trạng da, sử dụng sản phẩm đặc trị, và các kỹ thuật massage cải thiện tuần hoàn máu. Nhấn mạnh cách dịch vụ này giúp giải quyết các vấn đề như da khô, ngứa, và dị ứng.",
    
    "Viết về các phương pháp chăm sóc da tiên tiến được áp dụng trong dịch vụ này, các sản phẩm tự nhiên và an toàn được sử dụng, và cách điều trị các vấn đề da thường gặp ở thú cưng. Đề cập đến việc tùy chỉnh dịch vụ theo từng loại da và vấn đề cụ thể.",
    
    "Tạo nội dung giải thích tầm quan trọng của việc chăm sóc da chuyên nghiệp đối với sức khỏe tổng thể và chất lượng cuộc sống của thú cưng. Liệt kê các dấu hiệu của vấn đề về da mà chủ thú cưng nên chú ý và lợi ích của việc điều trị sớm."
  ],
  
  // Dịch vụ Grooming - Cắt móng
  NAIL_TRIMMING: [
    "Mô tả dịch vụ cắt móng chuyên nghiệp, nhấn mạnh vào kỹ thuật an toàn, công cụ chất lượng cao, và kinh nghiệm của nhân viên trong việc xử lý thú cưng lo lắng. Giải thích cách dịch vụ này giúp ngăn ngừa các vấn đề sức khỏe liên quan đến móng quá dài.",
    
    "Viết về quy trình cắt móng đầy đủ, bao gồm kiểm tra tình trạng móng, kỹ thuật cắt phù hợp với từng loại thú cưng, và chăm sóc sau cắt. Nhấn mạnh sự thoải mái và an toàn của thú cưng trong suốt quá trình.",
    
    "Tạo nội dung giải thích tầm quan trọng của việc cắt móng định kỳ, các vấn đề sức khỏe có thể phát sinh nếu bỏ qua việc này, và lợi ích cho cả thú cưng và gia đình. Kết thúc bằng khuyến nghị về tần suất cắt móng phù hợp."
  ],
  
  // Dịch vụ Spa và Thư giãn - Massage
  MASSAGE: [
    "Mô tả dịch vụ massage thư giãn cho thú cưng, các kỹ thuật massage được sử dụng, và lợi ích đối với sức khỏe thể chất và tinh thần của thú cưng. Nhấn mạnh cách dịch vụ này giúp giảm căng thẳng, cải thiện tuần hoàn máu, và tăng cường liên kết giữa thú cưng và chủ nhân.",
    
    "Viết về trải nghiệm spa thư giãn toàn diện mà thú cưng sẽ nhận được, môi trường yên tĩnh và dễ chịu, các tinh dầu tự nhiên được sử dụng, và cách massage giúp cải thiện sức khỏe và tâm trạng của thú cưng. Đề cập đến các phương pháp massage khác nhau cho từng giống thú cưng.",
    
    "Tạo nội dung giải thích các lợi ích sức khỏe của massage thú cưng, bao gồm giảm đau cho thú cưng lớn tuổi, giảm lo âu, cải thiện vận động, và tăng cường hệ miễn dịch. Đề cập đến nghiên cứu khoa học về lợi ích của massage đối với thú cưng."
  ],
  
  // Dịch vụ Spa và Thư giãn - Xông hơi tinh dầu
  AROMATHERAPY: [
    "Mô tả dịch vụ xông hơi tinh dầu cho thú cưng, các loại tinh dầu an toàn được sử dụng, và lợi ích thư giãn cũng như sức khỏe mà dịch vụ này mang lại. Nhấn mạnh vào cách liệu pháp này giúp giảm căng thẳng và cải thiện chất lượng cuộc sống cho thú cưng.",
    
    "Viết về quy trình xông hơi tinh dầu đầy đủ, cách các tinh dầu được lựa chọn phù hợp với từng thú cưng, và môi trường thư giãn được thiết kế đặc biệt. Đề cập đến các biện pháp an toàn và cách theo dõi phản ứng của thú cưng trong quá trình.",
    
    "Tạo nội dung giải thích khoa học về cách aromatherapy ảnh hưởng đến hệ thần kinh và cảm xúc của thú cưng, các loại tinh dầu có lợi cho các vấn đề cụ thể (như giảm lo âu, cải thiện giấc ngủ), và hiệu quả lâu dài của liệu pháp này."
  ],
  
  // Dịch vụ Spa và Thư giãn - Tắm thảo dược
  HERBAL_BATH: [
    "Mô tả dịch vụ tắm thảo dược cao cấp, các loại thảo dược tự nhiên được sử dụng và công dụng của chúng, quy trình tắm đặc biệt, và lợi ích đối với da và lông của thú cưng. Nhấn mạnh tính tự nhiên và an toàn của các thành phần.",
    
    "Viết về trải nghiệm tắm thảo dược thư giãn và chữa lành, cách các thảo mộc được chọn lọc dựa trên nhu cầu cụ thể của từng thú cưng, và kết quả làn da khỏe mạnh, lông mềm mượt. Kết hợp các lợi ích về tinh thần và thể chất của dịch vụ.",
    
    "Tạo nội dung giải thích các loại thảo dược khác nhau được sử dụng trong dịch vụ và công dụng cụ thể của chúng (như oải hương giúp thư giãn, cúc la mã giảm viêm da, v.v.), cách dịch vụ này khác biệt so với tắm thông thường, và lợi ích lâu dài cho sức khỏe da lông."
  ],
  
  // Dịch vụ Spa và Thư giãn - Điều trị da
  SKIN_TREATMENT: [
    "Mô tả dịch vụ điều trị da chuyên sâu, các phương pháp chẩn đoán vấn đề da, các liệu pháp được áp dụng, và hiệu quả cải thiện các vấn đề như viêm da, nấm, dị ứng. Nhấn mạnh chuyên môn của đội ngũ và sản phẩm y tế chất lượng được sử dụng.",
    
    "Viết về quy trình điều trị da toàn diện, bao gồm đánh giá tình trạng, lựa chọn phương pháp điều trị phù hợp, và chăm sóc sau điều trị. Đề cập đến các vấn đề da phổ biến ở từng giống thú cưng và cách dịch vụ giải quyết các vấn đề này.",
    
    "Tạo nội dung giải thích tầm quan trọng của việc điều trị da chuyên nghiệp đối với sức khỏe tổng thể của thú cưng, các dấu hiệu cảnh báo của vấn đề da nghiêm trọng, và lợi ích lâu dài của việc chăm sóc da đúng cách. Kết hợp testimonial từ khách hàng hài lòng trước đây."
  ],
  
  // Dịch vụ Y tế cơ bản - Khám sức khỏe định kỳ
  HEALTH_CHECK: [
    "Mô tả dịch vụ khám sức khỏe định kỳ toàn diện, các hạng mục kiểm tra (như thể trạng, tim mạch, răng miệng, v.v.), thiết bị y tế hiện đại được sử dụng, và tầm quan trọng của việc phát hiện sớm các vấn đề sức khỏe. Nhấn mạnh chuyên môn của đội ngũ y tế.",
    
    "Viết về quy trình khám sức khỏe chi tiết, cách thú cưng được chăm sóc và an ủi trong suốt quá trình, báo cáo sức khỏe chi tiết mà chủ nhân sẽ nhận được, và các khuyến nghị cá nhân hóa về chế độ chăm sóc. Đề cập đến lợi ích của việc theo dõi sức khỏe liên tục.",
    
    "Tạo nội dung giải thích tầm quan trọng của việc khám sức khỏe định kỳ trong việc kéo dài tuổi thọ và chất lượng cuộc sống của thú cưng, các vấn đề sức khỏe phổ biến có thể được phát hiện sớm, và tần suất khám phù hợp theo độ tuổi và giống thú cưng."
  ],
  
  // Dịch vụ Y tế cơ bản - Tiêm phòng
  VACCINATION: [
    "Mô tả dịch vụ tiêm phòng an toàn và hiệu quả, các loại vaccine cần thiết cho từng loại thú cưng, quy trình tiêm phòng đảm bảo thoải mái cho thú cưng, và tầm quan trọng của việc duy trì lịch tiêm phòng đầy đủ. Nhấn mạnh sự an toàn và tiêu chuẩn y tế cao.",
    
    "Viết về các loại vaccine được cung cấp, lịch trình tiêm phòng khuyến nghị theo độ tuổi, cách thú cưng được chăm sóc trước và sau khi tiêm, và hệ thống nhắc lịch tiêm tự động. Đề cập đến các bệnh nguy hiểm có thể phòng ngừa bằng vaccine.",
    
    "Tạo nội dung giải thích cơ chế hoạt động của vaccine, mức độ an toàn, và tầm quan trọng của việc tiêm phòng đối với không chỉ thú cưng của họ mà còn cả cộng đồng thú cưng nói chung. Giải đáp những lo ngại phổ biến về tác dụng phụ và hiệu quả của vaccine."
  ],
  
  // Dịch vụ Y tế cơ bản - Chăm sóc sau tiêm
  POST_VACCINE_CARE: [
    "Mô tả dịch vụ chăm sóc chuyên nghiệp sau tiêm vaccine, bao gồm theo dõi các phản ứng phụ, hướng dẫn chăm sóc tại nhà, và hỗ trợ y tế khi cần thiết. Nhấn mạnh tầm quan trọng của việc theo dõi sát sao sau khi tiêm phòng.",
    
    "Viết về quy trình chăm sóc toàn diện sau tiêm, các dấu hiệu cần theo dõi, chế độ ăn uống và hoạt động được khuyến nghị, và dịch vụ tư vấn 24/7 cho các trường hợp khẩn cấp. Đề cập đến cách giảm thiểu khó chịu cho thú cưng.",
    
    "Tạo nội dung hướng dẫn chi tiết về cách chăm sóc thú cưng sau khi tiêm phòng, các dấu hiệu bình thường và bất thường cần chú ý, thời điểm cần liên hệ với bác sĩ, và các biện pháp hỗ trợ thú cưng phục hồi nhanh chóng."
  ],
  
  // Dịch vụ Y tế cơ bản - Tư vấn dinh dưỡng
  NUTRITION_ADVICE: [
    "Mô tả dịch vụ tư vấn dinh dưỡng chuyên sâu, quy trình đánh giá nhu cầu dinh dưỡng cá nhân, các yếu tố được xem xét (như tuổi, giống, tình trạng sức khỏe), và kế hoạch dinh dưỡng chi tiết được cung cấp. Nhấn mạnh chuyên môn của chuyên gia dinh dưỡng thú y.",
    
    "Viết về cách dịch vụ tư vấn dinh dưỡng có thể giải quyết các vấn đề sức khỏe cụ thể thông qua chế độ ăn, các thương hiệu thức ăn chất lượng được khuyến nghị, và lợi ích sức khỏe lâu dài của việc cung cấp dinh dưỡng tối ưu. Đề cập đến cách tiết kiệm chi phí thức ăn trong khi vẫn đảm bảo dinh dưỡng.",
    
    "Tạo nội dung giải thích khoa học về nhu cầu dinh dưỡng của các loại thú cưng khác nhau, các dấu hiệu của chế độ ăn không phù hợp, cách chuyển đổi thức ăn an toàn, và tầm quan trọng của việc điều chỉnh chế độ ăn theo các giai đoạn sống khác nhau."
  ]
};

// Chuyển đổi loại thú cưng thành văn bản
export const getPetTypesText = (petTypes: PetCategory[]): string => {
  if (!petTypes || petTypes.length === 0) return "tất cả các loại thú cưng";
  
  return petTypes.map(type => petCategoryTranslations[type] || type).join(", ");
};

// Hàm lấy gợi ý dựa trên loại dịch vụ
export const getServiceSpecificPrompts = (category: string): string[] => {
  if (!category) return [];
  
  return specialtyPrompts[category] || [];
};