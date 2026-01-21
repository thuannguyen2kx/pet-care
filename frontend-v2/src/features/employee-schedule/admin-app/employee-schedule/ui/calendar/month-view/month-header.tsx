type Props = {
  days: string[];
};

export function MonthHeader({ days }: Props) {
  return (
    <div className="bg-card border-border text-muted-foreground grid grid-cols-7 border-b text-xs font-medium">
      {days.map((d) => (
        <div key={d} className="px-2 py-2 text-center">
          {d}
        </div>
      ))}
    </div>
  );
}
