
import { 
  parseISO, 
  format, 
  startOfDay, 
  endOfDay, 
  differenceInHours, 
  isBefore, 
  formatISO 
} from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Các hàm tiện ích xử lý ngày tháng sử dụng date-fns
 */
export const dateUtils = {
  /**
   * Tạo đối tượng Date từ chuỗi ngày YYYY-MM-DD
   * @param dateString - Chuỗi ngày định dạng YYYY-MM-DD
   * @returns Đối tượng Date tương ứng
   */
  parseDate: (dateString: string): Date => {
    return parseISO(dateString);
  },
  
  /**
   * Lấy đầu ngày từ đối tượng Date
   * @param date - Đối tượng Date cần xử lý
   * @returns Đối tượng Date đại diện cho thời điểm bắt đầu của ngày
   */
  getStartOfDay: (date: Date): Date => {
    return startOfDay(date);
  },
  
  /**
   * Lấy cuối ngày từ đối tượng Date
   * @param date - Đối tượng Date cần xử lý
   * @returns Đối tượng Date đại diện cho thời điểm kết thúc của ngày
   */
  getEndOfDay: (date: Date): Date => {
    return endOfDay(date);
  },
  
  /**
   * Định dạng ngày thành chuỗi theo định dạng mong muốn
   * @param date - Đối tượng Date cần định dạng
   * @param pattern - Mẫu định dạng, mặc định là 'dd/MM/yyyy'
   * @returns Chuỗi ngày đã được định dạng
   */
  formatDate: (date: Date, pattern: string = 'dd/MM/yyyy'): string => {
    return format(date, pattern, { locale: vi });
  },
  
  /**
   * Định dạng ngày theo chuẩn ISO
   * @param date - Đối tượng Date cần định dạng
   * @returns Chuỗi ngày theo định dạng ISO (YYYY-MM-DD)
   */
  formatISODate: (date: Date): string => {
    return formatISO(date, { representation: 'date' });
  },
  
  /**
   * Kiểm tra xem ngày đã qua chưa
   * @param date - Đối tượng Date cần kiểm tra
   * @returns true nếu ngày đã qua, ngược lại là false
   */
  isPastDate: (date: Date): boolean => {
    return isBefore(date, new Date());
  },
  
  /**
   * Tính khoảng cách giữa hai ngày theo giờ
   * @param date1 - Đối tượng Date thứ nhất
   * @param date2 - Đối tượng Date thứ hai
   * @returns Số giờ giữa hai ngày (giá trị tuyệt đối)
   */
  getHoursBetween: (date1: Date, date2: Date): number => {
    return differenceInHours(date1, date2);
  }
};