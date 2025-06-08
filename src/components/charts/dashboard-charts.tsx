'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { ChartData } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ExpensePieChartProps {
  data: ChartData[];
  title?: string;
}

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({
  data,
  title = "Pengeluaran per Kategori"
}) => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-gray-500">{formatPercentage(data.percentage || 0)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface BudgetProgressChartProps {
  data: Array<{
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
  }>;
  title?: string;
}

export const BudgetProgressChart: React.FC<BudgetProgressChartProps> = ({
  data,
  title = "Progress Budget vs Realisasi"
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {pld.dataKey === 'allocated' ? 'Dialokasikan' :
               pld.dataKey === 'spent' ? 'Terpakai' : 'Sisa'}: {formatCurrency(pld.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="allocated" fill="#3B82F6" name="Dialokasikan" />
            <Bar dataKey="spent" fill="#EF4444" name="Terpakai" />
            <Bar dataKey="remaining" fill="#10B981" name="Sisa" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface MonthlyTrendChartProps {
  data: Array<{
    month: string;
    amount: number;
    budget: number;
  }>;
  title?: string;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  data,
  title = "Trend Pengeluaran Bulanan"
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {pld.dataKey === 'amount' ? 'Pengeluaran' : 'Budget'}: {formatCurrency(pld.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="budget"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              name="Budget"
            />
            <Area
              type="monotone"
              dataKey="amount"
              stackId="2"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
              name="Pengeluaran"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface AssetAllocationChartProps {
  data: Array<{
    name: string;
    value: number;
    type: 'liquid' | 'non-liquid';
  }>;
  title?: string;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  data,
  title = "Alokasi Aset"
}) => {
  const liquidData = data.filter(item => item.type === 'liquid');
  const nonLiquidData = data.filter(item => item.type === 'non-liquid');

  const COLORS = {
    liquid: ['#3B82F6', '#06B6D4', '#10B981', '#84CC16'],
    'non-liquid': ['#8B5CF6', '#A855F7', '#D946EF', '#EC4899']
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liquid Assets */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Aset Liquid</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={liquidData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liquidData.map((_, index) => (
                    <Cell key={`liquid-${index}`} fill={COLORS.liquid[index % COLORS.liquid.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Non-Liquid Assets */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Aset Non-Liquid</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={nonLiquidData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nonLiquidData.map((_, index) => (
                    <Cell key={`non-liquid-${index}`} fill={COLORS['non-liquid'][index % COLORS['non-liquid'].length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};