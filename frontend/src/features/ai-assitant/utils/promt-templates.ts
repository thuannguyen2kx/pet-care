export interface PromptTemplate {
    key: string;
    title: string;
    icon: string;
    description: string;
    prompt: string;
    category: string;
  }  
  export interface QuickSuggestion {
    key: string;
    title: string;
    icon: string;
  } 
  export interface PromptCategory {
    id: string;
    name: string;
  }
  
  export const quickSuggestions: QuickSuggestion[] = [
    { key: 'summarize', title: 'Tóm tắt', icon: '📝' },
    { key: 'continue', title: 'Tiếp tục viết', icon: '➡️' },
    { key: 'grammar', title: 'Sửa ngữ pháp', icon: '🔤' },
    { key: 'concise', title: 'Viết ngắn gọn', icon: '✂️' },
    { key: 'expand', title: 'Mở rộng', icon: '🔍' }
  ];
  
  export const promptCategories: PromptCategory[] = [
    { id: 'refinement', name: 'Tinh chỉnh nội dung' },
    { id: 'style', name: 'Phông cách & Ngữ điệu' },
    { id: 'special', name: 'Đặt biệt' }
  ];
  
export const promptTemplates: PromptTemplate[] = [
  {
    key: 'summarize',
    title: "Tóm tắt",
    icon: "📝",
    description: "Tạo bản tóm tắt ngắn gọn",
    prompt: "Tạo một bản tóm tắt rõ ràng và ngắn gọn về những điểm chính trong nội dung đã cung cấp. Tập trung vào ý chính và thông tin thiết yếu. Giữ bản tóm tắt trong khoảng 3-4 câu và giữ nguyên giọng điệu gốc.",
    category: "refinement"
  },
  {
    key: 'continue',
    title: "Viết tiếp",
    icon: "➡️",
    description: "Viết tiếp nội dung một cách tự nhiên",
    prompt: "Viết tiếp nội dung đã cho một cách tự nhiên và mạch lạc. Giữ nguyên phong cách, giọng điệu và nhịp điệu hiện tại. Thêm các ý tiếp theo hợp lý hoặc phát triển câu chuyện. Viết thêm khoảng 3-5 câu như một phần mở rộng tự nhiên của nội dung gốc.",
    category: "refinement"
  },
  {
    key: 'grammar',
    title: "Sửa ngữ pháp",
    icon: "🔤",
    description: "Sửa lỗi ngữ pháp",
    prompt: "Sửa các lỗi ngữ pháp, dấu câu và cải thiện cấu trúc câu trong nội dung được cung cấp. Giữ nguyên ý nghĩa và giọng điệu ban đầu. Chỉ sửa những gì cần thiết và tránh thay đổi phong cách trừ khi ảnh hưởng đến độ rõ ràng.",
    category: "special"
  },
  {
    key: 'concise',
    title: "Rút gọn",
    icon: "✂️",
    description: "Rút ngắn và đơn giản hóa nội dung",
    prompt: "Viết lại nội dung được cung cấp sao cho ngắn gọn và trực tiếp hơn, đồng thời vẫn giữ nguyên các thông tin và ý chính. Loại bỏ sự lặp lại, chi tiết không cần thiết và các cụm từ dài dòng. Nhắm đến việc giảm độ dài từ 30-50% mà không làm mất nội dung quan trọng.",
    category: "refinement"
  },
  {
    key: 'expand',
    title: "Mở rộng",
    icon: "🔍",
    description: "Bổ sung chi tiết và diễn giải thêm",
    prompt: "Mở rộng và phát triển nội dung được cung cấp với các chi tiết, ví dụ và giải thích phù hợp. Giữ nguyên giọng điệu và ý định ban đầu, đồng thời cung cấp thêm chiều sâu. Thêm bối cảnh khi cần thiết và phát triển các ý chưa rõ ràng.",
    category: "refinement"
  },
  {
    key: 'professional',
    title: "Giọng điệu chuyên nghiệp",
    icon: "👔",
    description: "Phong cách trang trọng, doanh nghiệp",
    prompt: "Viết lại nội dung với giọng điệu chuyên nghiệp và rõ ràng. Sử dụng ngôn ngữ chính xác, cấu trúc trang trọng, tránh tiếng lóng và đảm bảo nội dung phù hợp trong môi trường kinh doanh chuyên nghiệp nhưng vẫn dễ đọc và hấp dẫn.",
    category: "style"
  },
  {
    key: 'casual',
    title: "Giọng điệu thân mật",
    icon: "👋",
    description: "Phong cách trò chuyện",
    prompt: "Viết lại nội dung theo phong cách thân mật, gần gũi. Làm cho nội dung dễ tiếp cận và thân thiện hơn nhưng vẫn giữ nguyên thông tin chính. Sử dụng lối viết thoải mái với các dạng viết tắt và câu đơn giản mà không mất đi tính chuyên nghiệp.",
    category: "style"
  },
  {
    key: 'translate',
    title: "Dịch thuật",
    icon: "🌐",
    description: "Dịch sang ngôn ngữ khác",
    prompt: "Dịch nội dung được cung cấp sang [LANGUAGE]. Đảm bảo bản dịch giữ nguyên ý nghĩa, giọng điệu và ngữ cảnh ban đầu, đồng thời nghe tự nhiên trong ngôn ngữ đích.",
    category: "special"
  },
  {
    key: 'creative',
    title: "Sáng tạo",
    icon: "✨",
    description: "Phong cách sinh động và giàu hình ảnh",
    prompt: "Viết lại nội dung theo phong cách sáng tạo và lôi cuốn hơn. Thêm mô tả sinh động, các phép so sánh thú vị và ngôn ngữ hấp dẫn trong khi vẫn giữ nguyên thông tin ban đầu.",
    category: "style"
  },
  {
    key: 'technical',
    title: "Kỹ thuật",
    icon: "🔧",
    description: "Ngôn ngữ chuyên ngành chính xác",
    prompt: "Viết lại nội dung sử dụng ngôn ngữ chuyên ngành chính xác, phù hợp với đối tượng có hiểu biết về lĩnh vực này. Tập trung vào tính chính xác, cụ thể và rõ ràng.",
    category: "style"
  }
];

  
  // Language options for translation
  export const languageOptions = [
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Russian", label: "Russian" },
    { value: "Arabic", label: "Arabic" }
  ];
  
  // Helper function to get customized prompt
  export const getCustomizedPrompt = (
    templateKey: string,
    options: {
      language?: string;
      keyword?: string;
    } = {}
  ): string => {
    const template = promptTemplates.find(t => t.key === templateKey);
    if (!template) return "";
  
    let prompt = template.prompt;
  
    // Replace placeholders with specific options
    if (options.language && prompt.includes("[LANGUAGE]")) {
      prompt = prompt.replace("[LANGUAGE]", options.language);
    }
  
    if (options.keyword && prompt.includes("[KEYWORD]")) {
      prompt = prompt.replace("[KEYWORD]", options.keyword);
    }
  
    return prompt;
  };