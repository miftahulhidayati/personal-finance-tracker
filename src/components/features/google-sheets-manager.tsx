/**
 * Google Sheets API Enhancement
 * Provides improved error handling, connection diagnostics, and configuration validation
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Wifi,
  WifiOff,
  Database,
  Key,
  FileSpreadsheet
} from 'lucide-react';

interface GoogleSheetsConfig {
  hasPrivateKey: boolean;
  hasClientEmail: boolean;
  hasProjectId: boolean;
  hasSpreadsheetId: boolean;
  isDemo: boolean;
}

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  message: string;
  lastTested: Date | null;
  responseTime: number;
  details?: string;
}

interface SheetsData {
  hasIncome: boolean;
  hasBudget: boolean;
  hasExpenses: boolean;
  hasAssets: boolean;
  hasAccounts: boolean;
  totalRecords: number;
  lastSync: Date | null;
}

export default function GoogleSheetsManager() {
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    hasPrivateKey: false,
    hasClientEmail: false,
    hasProjectId: false,
    hasSpreadsheetId: false,
    isDemo: true
  });
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected',
    message: 'Not tested',
    lastTested: null,
    responseTime: 0
  });
  
  const [sheetsData, setSheetsData] = useState<SheetsData>({
    hasIncome: false,
    hasBudget: false,
    hasExpenses: false,
    hasAssets: false,
    hasAccounts: false,
    totalRecords: 0,
    lastSync: null
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Check configuration on component mount
  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    // Check environment variables (simulated client-side check)
    const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
    const isDemo = !spreadsheetId || spreadsheetId === '1234567890abcdef1234567890abcdef12345678';
    
    setConfig({
      hasPrivateKey: !isDemo && !!process.env.GOOGLE_PRIVATE_KEY,
      hasClientEmail: !isDemo && !!process.env.GOOGLE_CLIENT_EMAIL,
      hasProjectId: !isDemo && !!process.env.GOOGLE_PROJECT_ID,
      hasSpreadsheetId: !isDemo && !!spreadsheetId,
      isDemo
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus({
      status: 'testing',
      message: 'Testing connection...',
      lastTested: null,
      responseTime: 0
    });

    const startTime = Date.now();
    
    try {
      // Test basic API endpoint availability
      const response = await fetch('/api/sheets?type=income&month=1&year=2024');
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.error) {
          setConnectionStatus({
            status: 'error',
            message: 'API Error',
            lastTested: new Date(),
            responseTime,
            details: data.error
          });
        } else {
          setConnectionStatus({
            status: 'connected',
            message: 'Connection successful',
            lastTested: new Date(),
            responseTime
          });
          
          // Update sheets data status
          await checkSheetsData();
        }
      } else {
        setConnectionStatus({
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          lastTested: new Date(),
          responseTime,
          details: await response.text()
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      setConnectionStatus({
        status: 'error',
        message: 'Connection failed',
        lastTested: new Date(),
        responseTime,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const checkSheetsData = async () => {
    try {
      // Test each sheet type
      const [incomeRes, budgetRes, expensesRes, assetsRes, accountsRes] = await Promise.allSettled([
        fetch('/api/sheets?type=income&month=1&year=2024'),
        fetch('/api/sheets?type=budget&month=1&year=2024'),
        fetch('/api/sheets?type=expenses&month=1&year=2024'),
        fetch('/api/sheets?type=assets'),
        fetch('/api/sheets?type=accounts')
      ]);

      let totalRecords = 0;
      const dataStatus = {
        hasIncome: false,
        hasBudget: false,
        hasExpenses: false,
        hasAssets: false,
        hasAccounts: false,
        totalRecords: 0,
        lastSync: new Date()
      };

      // Check income data
      if (incomeRes.status === 'fulfilled' && incomeRes.value.ok) {
        const incomeData = await incomeRes.value.json();
        dataStatus.hasIncome = !incomeData.error && incomeData.data?.length > 0;
        totalRecords += incomeData.data?.length || 0;
      }

      // Check budget data
      if (budgetRes.status === 'fulfilled' && budgetRes.value.ok) {
        const budgetData = await budgetRes.value.json();
        dataStatus.hasBudget = !budgetData.error && budgetData.data?.length > 0;
        totalRecords += budgetData.data?.length || 0;
      }

      // Check expenses data
      if (expensesRes.status === 'fulfilled' && expensesRes.value.ok) {
        const expensesData = await expensesRes.value.json();
        dataStatus.hasExpenses = !expensesData.error && expensesData.data?.length > 0;
        totalRecords += expensesData.data?.length || 0;
      }

      // Check assets data
      if (assetsRes.status === 'fulfilled' && assetsRes.value.ok) {
        const assetsData = await assetsRes.value.json();
        dataStatus.hasAssets = !assetsData.error && assetsData.data?.length > 0;
        totalRecords += assetsData.data?.length || 0;
      }

      // Check accounts data
      if (accountsRes.status === 'fulfilled' && accountsRes.value.ok) {
        const accountsData = await accountsRes.value.json();
        dataStatus.hasAccounts = !accountsData.error && accountsData.data?.length > 0;
        totalRecords += accountsData.data?.length || 0;
      }

      dataStatus.totalRecords = totalRecords;
      setSheetsData(dataStatus);
    } catch (error) {
      console.error('Error checking sheets data:', error);
    }
  };

  const getConfigurationScore = () => {
    const requirements = [
      config.hasPrivateKey,
      config.hasClientEmail,
      config.hasProjectId,
      config.hasSpreadsheetId
    ];
    
    const score = requirements.filter(Boolean).length;
    return (score / requirements.length) * 100;
  };

  const getDataCompleteness = () => {
    const sheets = [
      sheetsData.hasIncome,
      sheetsData.hasBudget,
      sheetsData.hasExpenses,
      sheetsData.hasAssets,
      sheetsData.hasAccounts
    ];
    
    const score = sheets.filter(Boolean).length;
    return (score / sheets.length) * 100;
  };

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Google Sheets Integration</h2>
          <p className="text-muted-foreground">
            Manage your Google Sheets API connection and data synchronization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={testConnection}
            disabled={isTestingConnection}
            variant="secondary"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
          <Button
            onClick={checkConfiguration}
            variant="secondary"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Refresh Config
          </Button>
        </div>
      </div>

      {/* Demo Mode Warning */}
      {config.isDemo && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">Demo Mode Active</h4>
              <p className="text-sm text-yellow-700">
                You're using sample data. Configure your Google Sheets API credentials to connect real data.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open('/api/sheets', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              API Docs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Configuration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Setup Completion</span>
                <span className="text-sm text-muted-foreground">
                  {getConfigurationScore().toFixed(0)}%
                </span>
              </div>
              <Progress value={getConfigurationScore()} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Private Key</span>
                {config.hasPrivateKey ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Client Email</span>
                {config.hasClientEmail ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Project ID</span>
                {config.hasProjectId ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Spreadsheet ID</span>
                {config.hasSpreadsheetId ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Wifi className="h-5 w-5 mr-2" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg border ${getStatusColor(connectionStatus.status)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(connectionStatus.status)}
                <span className="font-medium">{connectionStatus.message}</span>
              </div>
              
              {connectionStatus.lastTested && (
                <div className="text-sm space-y-1">
                  <div>
                    Last tested: {connectionStatus.lastTested.toLocaleString()}
                  </div>
                  <div>
                    Response time: {connectionStatus.responseTime}ms
                  </div>
                </div>
              )}
              
              {connectionStatus.details && (
                <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-sm">
                  <strong>Details:</strong> {connectionStatus.details}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data Completeness</span>
              <span className="text-sm text-muted-foreground">
                {getDataCompleteness().toFixed(0)}%
              </span>
            </div>
            <Progress value={getDataCompleteness()} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <div className={`p-2 rounded ${sheetsData.hasIncome ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileSpreadsheet className={`h-4 w-4 mx-auto ${sheetsData.hasIncome ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs mt-1">Income</div>
            </div>
            
            <div className="text-center">
              <div className={`p-2 rounded ${sheetsData.hasBudget ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileSpreadsheet className={`h-4 w-4 mx-auto ${sheetsData.hasBudget ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs mt-1">Budget</div>
            </div>
            
            <div className="text-center">
              <div className={`p-2 rounded ${sheetsData.hasExpenses ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileSpreadsheet className={`h-4 w-4 mx-auto ${sheetsData.hasExpenses ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs mt-1">Expenses</div>
            </div>
            
            <div className="text-center">
              <div className={`p-2 rounded ${sheetsData.hasAssets ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileSpreadsheet className={`h-4 w-4 mx-auto ${sheetsData.hasAssets ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs mt-1">Assets</div>
            </div>
            
            <div className="text-center">
              <div className={`p-2 rounded ${sheetsData.hasAccounts ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileSpreadsheet className={`h-4 w-4 mx-auto ${sheetsData.hasAccounts ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs mt-1">Accounts</div>
            </div>
          </div>

          {sheetsData.totalRecords > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Total Records</span>
              <Badge variant="secondary">{sheetsData.totalRecords}</Badge>
            </div>
          )}

          {sheetsData.lastSync && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Last Sync</span>
              <span className="text-sm text-muted-foreground">
                {sheetsData.lastSync.toLocaleString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      {config.isDemo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <span>Follow the Google Sheets setup guide in <code>GOOGLE_SHEETS_SETUP.md</code></span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <span>Configure your <code>.env.local</code> file with the required credentials</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <span>Restart your development server with <code>npm run dev</code></span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <span>Test your connection using the "Test Connection" button above</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
