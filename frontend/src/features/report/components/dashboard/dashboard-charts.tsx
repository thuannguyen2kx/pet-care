// src/components/dashboard/dashboard-charts.tsx
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart,
  Line
} from 'recharts';
import { COLORS, formatCurrency } from './dashboard-utils';
// import { ReportDataPoint } from '@/features/report/types/api.types';

interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  height?: number;
}

// Revenue Bar Chart
export const RevenueBarChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000000)}M`}
            width={50}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
            cursor={{ fill: '#f3f4f6' }}
            labelFormatter={(label) => `Ngày: ${label}`}
          />
          <Bar 
            dataKey="amount" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
            name="Doanh thu"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Appointment Bar Chart
export const AppointmentBarChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => value} />
          <Tooltip formatter={(value) => [value, 'Lịch hẹn']} />
          <Bar dataKey="count" name="Số lịch hẹn" fill="#82ca9d" barSize={40} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Service Breakdown Pie Chart
export const ServicePieChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [
            name === 'value' ? `${value}%` : formatCurrency(Number(value)),
            name === 'value' ? 'Tỉ lệ' : 'Doanh thu'
          ]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Appointment Status Pie Chart
export const StatusPieChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Số lượng']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Monthly Trend Line Chart
export const MonthlyTrendChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis 
            yAxisId="left" 
            tickFormatter={(value) => `${(value / 1000000)}M`} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tickFormatter={(value) => value} 
          />
          <Tooltip formatter={(value, name) => [
            name === 'revenue' ? formatCurrency(Number(value)) : value,
            name === 'revenue' ? 'Doanh thu' : 'Lịch hẹn'
          ]} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#8884d8" 
            name="Doanh thu" 
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="appointments" 
            stroke="#82ca9d" 
            name="Lịch hẹn" 
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Employee Performance Bar Chart
export const EmployeePerformanceChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill="#00C49F" />
          <Bar dataKey="cancelled" name="Đã hủy" stackId="a" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Service Analysis Chart
export const ServiceAnalysisChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip formatter={(value) => [`${value}%`, 'Tỉ lệ']} />
          <Legend />
          <Bar dataKey="value" name="Tỉ lệ sử dụng" fill="#8884d8" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};