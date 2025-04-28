import StartFirst from "@/assets/icons/start-1.svg";
import StartSecond from "@/assets/icons/start-2.svg";
import StartThird from "@/assets/icons/start-3.svg";

const stats = [
  {
    id: 1,
    value: "180",
    label: "Khách hàng hài lòng mỗi ngày",
    icon: StartFirst,
    color: "bg-blue-50 text-blue-500",
    ring: "ring-blue-500",
  },
  {
    id: 2,
    value: "68+",
    label: "Nhiều năm kinh nghiệm",
    icon: StartSecond,
    color: "bg-yellow-50 text-yellow-500",
    ring: "ring-yellow-500",
  },
  {
    id: 3,
    value: "28+",
    label: "Nhân viên đều đạt chứng chỉ",
    icon: StartThird,
    color: "bg-green-50 text-green-500",
    ring: "ring-green-500",
  },
];

const StatCard = ({
  value,
  label,
  icon,
  color,
  ring
}: {
  value: string;
  label: string;
  icon: string;
  color: string;
  ring: string
}) => {
  return (
    <div className={`ring-2 bg-white p-4 rounded-tl-2xl rounded-br-2xl ${ring}`}>
      <div className={`${color} p-6 rounded-xl flex items-center space-x-4`}>
        <div className="">
          <img src={icon} alt="icon" className="color-blue-500" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-lg">{label}</div>
        </div>
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              ring={stat.ring}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
