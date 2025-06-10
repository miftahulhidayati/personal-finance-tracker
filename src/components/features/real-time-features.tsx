'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/stores/finance-store';
import { RefreshCw, Play, Pause, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { validateAnalyticsData, debounce } from '@/utils/data-validation';

export function RealTimeFeatures() {
  const { 
    expenses, 
    monthlyIncome,
    budgetCategories,
    setAutoRefresh, 
    simulateRealTimeUpdate, 
    getRefreshStatus,
    isLoading 
  } = useFinanceStore();
  
  const [refreshStatus, setRefreshStatus] = useState(getRefreshStatus());
  const [simulationCount, setSimulationCount] = useState(0);
  const [dataValidation, setDataValidation] = useState({ isValid: true, errors: [] as string[] });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    lastUpdateDuration: 0,
    averageUpdateTime: 0,
    totalUpdates: 0
  });

  // Debounced data validation
  const validateData = useCallback(
    debounce(() => {
      const validation = validateAnalyticsData(expenses, monthlyIncome, budgetCategories);
      setDataValidation({
        isValid: validation.errors.length === 0,
        errors: validation.errors
      });
    }, 500),
    [expenses, monthlyIncome, budgetCategories]
  );

  // Validate data when it changes
  useEffect(() => {
    validateData();
  }, [validateData]);

  // Update refresh status every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshStatus(getRefreshStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRefreshStatus]);

  const handleToggleAutoRefresh = () => {
    const newEnabled = !refreshStatus.isAutoRefreshEnabled;
    setAutoRefresh(newEnabled, 5); // 5 minutes interval
  };

  const handleSimulateUpdate = () => {
    const startTime = performance.now();
    simulateRealTimeUpdate();
    setSimulationCount(prev => prev + 1);
    trackPerformance(startTime);
  };

  const trackPerformance = useCallback((startTime: number) => {
    const duration = performance.now() - startTime;
    setPerformanceMetrics(prev => {
      const newTotal = prev.totalUpdates + 1;
      const newAverage = ((prev.averageUpdateTime * prev.totalUpdates) + duration) / newTotal;
      return {
        lastUpdateDuration: duration,
        averageUpdateTime: newAverage,
        totalUpdates: newTotal
      };
    });
  }, []);

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const recentExpenses = expenses.slice(0, 5);
  const totalRecentAmount = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Real-Time Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Auto Refresh</p>
                  <p className="text-lg font-bold text-blue-800">
                    {refreshStatus.isAutoRefreshEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Button
                  variant={refreshStatus.isAutoRefreshEnabled ? "danger" : "primary"}
                  size="sm"
                  onClick={handleToggleAutoRefresh}
                  disabled={isLoading}
                >
                  {refreshStatus.isAutoRefreshEnabled ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Last Refresh</p>
                  <p className="text-lg font-bold text-green-800">
                    {formatTimeAgo(refreshStatus.lastRefreshTime)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Simulations</p>
                  <p className="text-lg font-bold text-purple-800">{simulationCount}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSimulateUpdate}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Simulate
                </Button>
              </div>
            </div>
          </div>

          {refreshStatus.isAutoRefreshEnabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-yellow-800">
                  Auto-refresh active - Data will update every 5 minutes
                </p>
              </div>
            </div>
          )}

          {/* Data Validation Status */}
          <div className={`border rounded-lg p-3 ${
            dataValidation.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {dataValidation.isValid ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    Data validation passed
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800 font-medium">
                    Data validation issues detected
                  </p>
                </>
              )}
            </div>
            {!dataValidation.isValid && dataValidation.errors.length > 0 && (
              <div className="mt-2 pl-6">
                <ul className="text-xs text-red-700 space-y-1">
                  {dataValidation.errors.slice(0, 3).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {dataValidation.errors.length > 3 && (
                    <li>• ... and {dataValidation.errors.length - 3} more issues</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Performance Metrics</p>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Last Update Duration: 
                <span className="font-semibold text-gray-800">
                  {' '}{performanceMetrics.lastUpdateDuration.toFixed(2)} ms
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Average Update Time: 
                <span className="font-semibold text-gray-800">
                  {' '}{performanceMetrics.averageUpdateTime.toFixed(2)} ms
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Total Updates: 
                <span className="font-semibold text-gray-800">
                  {' '}{performanceMetrics.totalUpdates}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Recent Transactions ({recentExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-600">Total Recent Amount:</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(totalRecentAmount, 'Rp')}
              </span>
            </div>
            
            {recentExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent transactions</p>
                <p className="text-sm mt-1">Click "Simulate" to add demo transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentExpenses.map((expense, index) => (
                  <div 
                    key={expense.id} 
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
                      index === 0 && expense.id.startsWith('demo-') 
                        ? 'bg-green-50 border-green-200 shadow-sm' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{expense.date}</span>
                        {expense.id.startsWith('demo-') && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">DEMO</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        -{formatCurrency(expense.amount, 'Rp')}
                      </p>
                      <p className="text-xs text-gray-500">{expense.account}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
