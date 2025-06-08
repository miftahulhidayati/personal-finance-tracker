'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useFinanceStore } from '@/stores/finance-store';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
  Plus,
  Edit,
  Target
} from 'lucide-react';

export default function AssetsPage() {
  const {
    assets,
    isLoading,
    loadData,
    refreshAssetPrices
  } = useFinanceStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate portfolio summary
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalCost = assets.reduce((sum, asset) => {
    const shares = asset.shares || 1;
    return sum + (shares * asset.price);
  }, 0);
  const totalProfit = totalValue - totalCost;
  const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  // Group assets by category
  const assetsByCategory = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category]!.push(asset);
    return acc;
  }, {} as Record<string, typeof assets>);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    trendValue
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Aset</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau portofolio investasi Anda
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <Button
              onClick={() => refreshAssetPrices()}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Harga
            </Button>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Aset
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Nilai Portfolio"
            value={formatCurrency(totalValue)}
            icon={DollarSign}
            color="bg-blue-500"
          />

          <StatCard
            title="Total Modal"
            value={formatCurrency(totalCost)}
            icon={Target}
            color="bg-purple-500"
          />

          <StatCard
            title="Keuntungan/Kerugian"
            value={formatCurrency(totalProfit)}
            icon={totalProfit >= 0 ? TrendingUp : TrendingDown}
            color={totalProfit >= 0 ? "bg-green-500" : "bg-red-500"}
            trend={totalProfit >= 0 ? 'up' : 'down'}
            trendValue={formatPercentage(profitPercentage)}
          />

          <StatCard
            title="Jumlah Aset"
            value={assets.length.toString()}
            icon={PieChart}
            color="bg-orange-500"
          />
        </div>

        {/* Assets by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(assetsByCategory).map(([category, categoryAssets]) => {
            const categoryValue = categoryAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
            const categoryPercentage = totalValue > 0 ? (categoryValue / totalValue) * 100 : 0;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-sm text-gray-500">
                      {formatPercentage(categoryPercentage)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryAssets.map((asset) => {
                      const shares = asset.shares || 1;
                      const cost = shares * asset.price;
                      const profit = asset.currentValue - cost;
                      const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;

                      return (
                        <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{asset.name}</p>
                            <p className="text-sm text-gray-500">
                              {shares} @ {formatCurrency(asset.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(asset.currentValue)}
                            </p>
                            <p className={`text-sm ${
                              profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {profit >= 0 ? '+' : ''}{formatCurrency(profit)} ({formatPercentage(profitPercent)})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-900">Aset</th>
                    <th className="text-right p-3 font-medium text-gray-900">Jumlah</th>
                    <th className="text-right p-3 font-medium text-gray-900">Harga</th>
                    <th className="text-right p-3 font-medium text-gray-900">Nilai</th>
                    <th className="text-right p-3 font-medium text-gray-900">Keuntungan/Kerugian</th>
                    <th className="text-right p-3 font-medium text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assets.map((asset) => {
                    const shares = asset.shares || 1;
                    const cost = shares * asset.price;
                    const profit = asset.currentValue - cost;
                    const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;

                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{asset.name}</p>
                            <p className="text-sm text-gray-500">{asset.category}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-medium">{shares}</span>
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(asset.price)}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {formatCurrency(asset.currentValue)}
                        </td>
                        <td className="p-3 text-right">
                          <div className={`${
                            profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <p className="font-medium">
                              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                            </p>
                            <p className="text-sm">
                              ({formatPercentage(profitPercent)})
                            </p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}