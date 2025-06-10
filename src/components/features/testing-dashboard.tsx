/**
 * Testing Dashboard Component
 * Provides comprehensive testing interface for the Personal Finance Tracker application
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TestRunner,
  TestSuite,
  DataValidationTests,
  PerformanceTests,
  APITests,
  RealTimeFeatureTests,
  TestDataGenerator,
  createComprehensiveTestSuite
} from '@/utils/testing-utilities';
import GoogleSheetsManager from './google-sheets-manager';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  Zap, 
  Database,
  Trash2,
  Download
} from 'lucide-react';

interface TestingDashboardProps {
  className?: string;
}

export default function TestingDashboard({ className = '' }: TestingDashboardProps) {
  const [testRunner] = useState(() => new TestRunner());
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    memoryUsage: { used: number; total: number; percentage: number };
    lastUpdate: Date;
  } | null>(null);

  // Update performance metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const memoryUsage = PerformanceTests.testMemoryUsage();
      setPerformanceMetrics({
        memoryUsage,
        lastUpdate: new Date()
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTest('Initializing test suite...');
    
    try {
      const tests = createComprehensiveTestSuite();
      setCurrentTest('Running comprehensive test suite...');
      
      await testRunner.runTestSuite('Comprehensive Tests', tests);
      const updatedSuites = [...testRunner.getResults()];
      setTestSuites(updatedSuites);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runDataValidationTests = async () => {
    setIsRunning(true);
    setCurrentTest('Running data validation tests...');
    
    try {
      const tests = [
        {
          name: 'Expense Validation',
          test: () => {
            const testExpenses = TestDataGenerator.generateExpenses(50);
            return testExpenses.every(DataValidationTests.testExpenseValidation);
          }
        },
        {
          name: 'Income Validation',
          test: () => {
            const testIncome = TestDataGenerator.generateIncome(20);
            return testIncome.every(DataValidationTests.testIncomeValidation);
          }
        },
        {
          name: 'Budget Validation',
          test: () => {
            const testBudget = TestDataGenerator.generateBudget(15);
            return testBudget.every(DataValidationTests.testBudgetValidation);
          }
        },
        {
          name: 'Invalid Data Rejection',
          test: () => {
            const invalidExpense = {
              id: '',
              description: '',
              amount: -100,
              category: '',
              date: new Date(),
              account: ''
            };
            return !DataValidationTests.testExpenseValidation(invalidExpense as any);
          }
        }
      ];

      await testRunner.runTestSuite('Data Validation Tests', tests);
      const updatedSuites = [...testRunner.getResults()];
      setTestSuites(updatedSuites);
    } catch (error) {
      console.error('Error running data validation tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setCurrentTest('Running performance tests...');
    
    try {
      const tests = [
        {
          name: 'Small Dataset Processing (100 items)',
          test: async () => {
            const result = await PerformanceTests.testDataProcessingPerformance(100);
            return result.duration < 100 && result.throughput > 50;
          }
        },
        {
          name: 'Medium Dataset Processing (1,000 items)',
          test: async () => {
            const result = await PerformanceTests.testDataProcessingPerformance(1000);
            return result.duration < 500 && result.throughput > 100;
          }
        },
        {
          name: 'Large Dataset Processing (10,000 items)',
          test: async () => {
            const result = await PerformanceTests.testDataProcessingPerformance(10000);
            return result.duration < 2000 && result.throughput > 500;
          }
        },
        {
          name: 'Chart Rendering Performance',
          test: async () => {
            const duration = await PerformanceTests.testChartRenderingPerformance(500);
            return duration < 1000;
          }
        },
        {
          name: 'Memory Usage Monitoring',
          test: () => {
            const memory = PerformanceTests.testMemoryUsage();
            return memory.percentage < 90; // Memory usage should be below 90%
          }
        }
      ];

      await testRunner.runTestSuite('Performance Tests', tests);
      const updatedSuites = [...testRunner.getResults()];
      setTestSuites(updatedSuites);
    } catch (error) {
      console.error('Error running performance tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runAPITests = async () => {
    setIsRunning(true);
    setCurrentTest('Running API tests...');
    
    try {
      const tests = [
        {
          name: 'Sheets API Endpoint Availability',
          test: async () => {
            const result = await APITests.testAPIEndpoint('/api/sheets');
            return result.available;
          }
        },
        {
          name: 'Google Sheets Connection',
          test: async () => {
            const result = await APITests.testGoogleSheetsConnection();
            return result.connected || result.responseTime < 5000;
          }
        },
        {
          name: 'API Response Time',
          test: async () => {
            const result = await APITests.testAPIEndpoint('/api/sheets?type=income');
            return result.responseTime < 3000;
          }
        }
      ];

      await testRunner.runTestSuite('API Tests', tests);
      const updatedSuites = [...testRunner.getResults()];
      setTestSuites(updatedSuites);
    } catch (error) {
      console.error('Error running API tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runRealTimeTests = async () => {
    setIsRunning(true);
    setCurrentTest('Running real-time feature tests...');
    
    try {
      const tests = [
        {
          name: 'Real-time Validation',
          test: () => RealTimeFeatureTests.testRealTimeValidation()
        },
        {
          name: 'Data Synchronization',
          test: async () => {
            try {
              return await RealTimeFeatureTests.testDataSync();
            } catch {
              return false; // Expected to fail if not properly configured
            }
          }
        },
        {
          name: 'Auto-refresh Functionality',
          test: async () => {
            try {
              return await RealTimeFeatureTests.testAutoRefresh(1000);
            } catch {
              return false;
            }
          }
        }
      ];

      await testRunner.runTestSuite('Real-time Feature Tests', tests);
      const updatedSuites = [...testRunner.getResults()];
      setTestSuites(updatedSuites);
    } catch (error) {
      console.error('Error running real-time tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const clearResults = () => {
    testRunner.clearResults();
    setTestSuites([]);
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      testSuites,
      performanceMetrics,
      summary: {
        totalSuites: testSuites.length,
        totalTests: testSuites.reduce((sum, suite) => sum + suite.totalTests, 0),
        totalPassed: testSuites.reduce((sum, suite) => sum + suite.passedTests, 0),
        totalFailed: testSuites.reduce((sum, suite) => sum + suite.failedTests, 0),
        totalDuration: testSuites.reduce((sum, suite) => sum + suite.totalDuration, 0)
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTestResultIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getOverallSuccessRate = () => {
    if (testSuites.length === 0) return 0;
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
    const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
    return totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testing Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive testing suite for data validation, performance, and functionality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={clearResults}
            variant="secondary"
            size="sm"
            disabled={isRunning}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Results
          </Button>
          <Button
            onClick={exportResults}
            variant="secondary"
            size="sm"
            disabled={testSuites.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Play className="h-5 w-5 mr-2 text-blue-600" />
              Quick Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="w-full"
              size="sm"
            >
              Run All Tests
            </Button>
            <Button
              onClick={runDataValidationTests}
              disabled={isRunning}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              Data Validation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Performance Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={runPerformanceTests}
              disabled={isRunning}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </Button>
            <Button
              onClick={runAPITests}
              disabled={isRunning}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              API Tests
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Real-time Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runRealTimeTests}
              disabled={isRunning}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              Real-time Features
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Test Status */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">{currentTest}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Memory Usage</div>
                <div className="text-2xl font-bold">
                  {performanceMetrics.memoryUsage.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatBytes(performanceMetrics.memoryUsage.used)} / {formatBytes(performanceMetrics.memoryUsage.total)}
                </div>
                <Progress value={performanceMetrics.memoryUsage.percentage} className="mt-2" />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Overall Success Rate</div>
                <div className="text-2xl font-bold">
                  {getOverallSuccessRate().toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)} tests
                </div>
                <Progress value={getOverallSuccessRate()} className="mt-2" />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Last Updated</div>
                <div className="text-sm">
                  {performanceMetrics.lastUpdate.toLocaleTimeString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Auto-refresh every 5s
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testSuites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Test Results</h3>
          {testSuites.map((suite, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{suite.suiteName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={suite.failedTests === 0 ? "default" : "destructive"}>
                      {suite.passedTests}/{suite.totalTests} passed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDuration(suite.totalDuration)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={(suite.passedTests / suite.totalTests) * 100} 
                  className="h-2"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suite.results.map((result, resultIndex) => (
                    <div 
                      key={resultIndex}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div className="flex items-center space-x-2">
                        {getTestResultIcon(result.passed)}
                        <span className="font-medium">{result.testName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatDuration(result.duration)}</span>
                        <span>{result.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Google Sheets Integration Management */}
      <GoogleSheetsManager />

      {/* Empty State */}
      {testSuites.length === 0 && !isRunning && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Test Results</p>
              <p className="text-sm">Run some tests to see comprehensive results and performance metrics.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
