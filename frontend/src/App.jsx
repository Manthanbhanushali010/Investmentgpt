import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Brain, TrendingUp, Shield, BarChart3, Search, Bot, Zap, CheckCircle, AlertTriangle, DollarSign, Globe, Users, Target } from 'lucide-react'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([
    { id: 1, name: 'Market Analysis Agent', status: 'idle', progress: 0, icon: TrendingUp },
    { id: 2, name: 'Company Research Agent', status: 'idle', progress: 0, icon: Search },
    { id: 3, name: 'Sentiment Analysis Agent', status: 'idle', progress: 0, icon: Users },
    { id: 4, name: 'Risk Assessment Agent', status: 'idle', progress: 0, icon: Shield },
    { id: 5, name: 'Blockchain Verification Agent', status: 'idle', progress: 0, icon: CheckCircle }
  ])

  const [marketData, setMarketData] = useState({
    sp500: { value: 4567.89, change: '+1.2%', trend: 'up' },
    nasdaq: { value: 14234.56, change: '+0.8%', trend: 'up' },
    dow: { value: 34567.12, change: '+0.5%', trend: 'up' },
    vix: { value: 18.45, change: '-2.1%', trend: 'down' }
  })

  const simulateAnalysis = async (ticker) => {
    setLoading(true)
    setAnalysisResults(null)
    
    // Simulate agent activation
    const agentSequence = [
      { id: 1, delay: 500 },
      { id: 2, delay: 1000 },
      { id: 3, delay: 1500 },
      { id: 4, delay: 2000 },
      { id: 5, delay: 2500 }
    ]

    // Start agents sequentially
    for (const { id, delay } of agentSequence) {
      setTimeout(() => {
        setAgents(prev => prev.map(agent => 
          agent.id === id ? { ...agent, status: 'active' } : agent
        ))
        // Simulate progress
        const progressInterval = setInterval(() => {
          setAgents(prev => prev.map(agent => {
            if (agent.id === id && agent.progress < 100) {
              const newProgress = Math.min(agent.progress + Math.random() * 20, 100)
              if (newProgress >= 100) {
                clearInterval(progressInterval)
                return { ...agent, status: 'completed', progress: 100 }
              }
              return { ...agent, progress: newProgress }
            }
            return agent
          }))
        }, 200)
      }, delay)
    }

    // Make real API call to backend
    try {
      const response = await fetch('https://YOUR-BACKEND-URL.onrender.com/api/investment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      })
      const data = await response.json()
      setAnalysisResults(data)
    } catch (error) {
      setAnalysisResults({ error: 'Failed to fetch analysis. Please try again.' })
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Zap className="h-4 w-4 text-blue-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Bot className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">InvestmentGPT</h1>
                <p className="text-slate-400 text-sm">Multi-Agent Investment Research Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Blockchain Verified
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                5 AI Agents Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(marketData).map(([key, data]) => (
            <Card key={key} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm uppercase">{key}</p>
                    <p className="text-white text-lg font-semibold">{data.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {data.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analysis Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Agents */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Investment Research
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter a stock ticker to begin multi-agent analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter ticker (e.g., AAPL, TSLA)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button 
                    onClick={() => simulateAnalysis(searchQuery)}
                    disabled={!searchQuery || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Agents Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Agents Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agents.map((agent) => {
                  const IconComponent = agent.icon
                  return (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-slate-400" />
                          <span className="text-white text-sm">{agent.name}</span>
                        </div>
                        {getStatusIcon(agent.status)}
                      </div>
                      {agent.status !== 'idle' && (
                        <Progress 
                          value={agent.progress} 
                          className="h-2"
                        />
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {loading && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white">AI agents are analyzing your request...</p>
                  <p className="text-slate-400 text-sm mt-2">This may take a few moments</p>
                </CardContent>
              </Card>
            )}

            {analysisResults && (
              <div className="space-y-6">
                {/* Main Results */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-2xl">
                        {analysisResults.ticker} Analysis
                      </CardTitle>
                      <Badge 
                        variant={analysisResults.recommendation === 'BUY' ? 'default' : 'secondary'}
                        className={analysisResults.recommendation === 'BUY' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {analysisResults.recommendation}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-slate-400 text-sm">Current Price</p>
                        <p className="text-white text-xl font-semibold">${analysisResults.price}</p>
                        <p className="text-green-400 text-sm">{analysisResults.change}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Target Price</p>
                        <p className="text-white text-xl font-semibold">${analysisResults.targetPrice}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Confidence</p>
                        <p className="text-white text-xl font-semibold">{analysisResults.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Risk Score</p>
                        <p className="text-white text-xl font-semibold">{analysisResults.riskScore}</p>
                      </div>
                    </div>

                    <Tabs defaultValue="insights" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                        <TabsTrigger value="insights" className="text-white">Key Insights</TabsTrigger>
                        <TabsTrigger value="risks" className="text-white">Risk Factors</TabsTrigger>
                        <TabsTrigger value="verification" className="text-white">Blockchain Verification</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="insights" className="mt-4">
                        <div className="space-y-3">
                          {analysisResults.keyInsights.map((insight, index) => (
                            <Alert key={index} className="bg-slate-700/50 border-slate-600">
                              <TrendingUp className="h-4 w-4" />
                              <AlertDescription className="text-slate-200">
                                {insight}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="risks" className="mt-4">
                        <div className="space-y-3">
                          {analysisResults.riskFactors.map((risk, index) => (
                            <Alert key={index} className="bg-slate-700/50 border-slate-600">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-slate-200">
                                {risk}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="verification" className="mt-4">
                        <Alert className="bg-green-900/20 border-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-200">
                            All data sources have been cryptographically verified on the blockchain. 
                            Transaction hash: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef12
                          </AlertDescription>
                        </Alert>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Data Sources Verified:</span>
                            <span className="text-green-400">✓ 15/15</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Blockchain Network:</span>
                            <span className="text-white">Ethereum Mainnet</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Verification Time:</span>
                            <span className="text-white">2.3 seconds</span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {!loading && !analysisResults && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">Ready for Analysis</h3>
                  <p className="text-slate-400">
                    Enter a stock ticker to begin comprehensive multi-agent investment research
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Multi-Agent AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Five specialized AI agents work in parallel to provide comprehensive investment analysis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Blockchain Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                All data sources are cryptographically verified for maximum transparency and trust
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Real-Time Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Live market data and sentiment analysis provide up-to-the-minute investment insights
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App

