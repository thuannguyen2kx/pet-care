type Props = {
  weekDates: Date[];
};
const formatDateHeader = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};
const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
export function ScheduleGridHeader({ weekDates }: Props) {
  return (
    <thead>
      <tr className="border-border bg-muted/30 border-b">
        <th className="text-foreground w-56 p-4 text-left font-semibold">Nhân viên</th>
        {weekDates.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <th key={index} className={`min-w-25 p-4 text-center ${isToday ? 'bg-primary/5' : ''}`}>
              <div className="text-foreground font-semibold">{daysOfWeek[index]}</div>
              <div
                className={`text-sm ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                {formatDateHeader(date)}
              </div>
            </th>
          );
        })}
        <th className="w-16 p-4"></th>
      </tr>
    </thead>
  );
}
