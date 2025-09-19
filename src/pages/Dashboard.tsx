import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Map, 
  Filter, 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { listReports, ReportDTO } from "@/lib/api";
import MapView from "@/components/MapView";
const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [selectedDate, setSelectedDate] = useState("last-month");

  const [reports, setReports] = useState<ReportDTO[] | null>(null);
  const [showHeat, setShowHeat] = useState(false);

  useEffect(() => {
    let mounted = true;
    listReports()
      .then((data) => { if (mounted) setReports(data); })
      .catch(() => setReports([]));
    return () => { mounted = false; };
  }, []);

  const mockData = {
    summary: {
      totalSites: 45,
      safeSites: 32,
      moderateSites: 8,
      unsafeSites: 5,
      citizenReports: (reports ?? []).length
    },
    recentSites: [
      { id: 1, name: "River Site A", lat: 25.2, lng: 89.3, status: "safe", hpi: 15.2, lastUpdated: "2 hours ago" },
      { id: 2, name: "Lake Site B", lat: 25.4, lng: 89.1, status: "moderate", hpi: 45.8, lastUpdated: "5 hours ago" },
      { id: 3, name: "Well Site C", lat: 25.1, lng: 89.5, status: "unsafe", hpi: 125.6, lastUpdated: "1 day ago" },
      { id: 4, name: "Stream Site D", lat: 25.3, lng: 89.2, status: "safe", hpi: 8.9, lastUpdated: "3 hours ago" },
    ],
    citizenReports: (reports ?? []).map((r) => ({
      id: r.id,
      location: r.location,
      description: r.description,
      status: r.status.toLowerCase(),
      priority: r.priority.toLowerCase(),
    }))
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-safe text-safe-foreground";
      case "moderate": return "bg-moderate text-moderate-foreground";
      case "unsafe": return "bg-unsafe text-unsafe-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-unsafe text-unsafe-foreground";
      case "high": return "bg-moderate text-moderate-foreground";
      case "medium": return "bg-primary text-primary-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-safe text-safe-foreground";
      case "investigating": return "bg-moderate text-moderate-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Water Quality Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Interactive monitoring and analysis of water pollution data across all sites.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockData.summary.totalSites}</div>
              <div className="text-sm text-muted-foreground">Total Sites</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-safe">{mockData.summary.safeSites}</div>
              <div className="text-sm text-muted-foreground">Safe Sites</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-moderate">{mockData.summary.moderateSites}</div>
              <div className="text-sm text-muted-foreground">Moderate Risk</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-unsafe">{mockData.summary.unsafeSites}</div>
              <div className="text-sm text-muted-foreground">Unsafe Sites</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{mockData.summary.citizenReports}</div>
              <div className="text-sm text-muted-foreground">Citizen Reports</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Safety Level</label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sites</SelectItem>
                        <SelectItem value="safe">Safe Only</SelectItem>
                        <SelectItem value="moderate">Moderate Risk</SelectItem>
                        <SelectItem value="unsafe">Unsafe Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Metal Type</label>
                    <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Metals</SelectItem>
                        <SelectItem value="arsenic">Arsenic</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="mercury">Mercury</SelectItem>
                        <SelectItem value="cadmium">Cadmium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Time Period</label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5 text-primary" />
                  <span>Interactive Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  {reports && reports.length > 0 ? (
                    <MapView reports={reports} showHeat={showHeat} />
                  ) : (
                    <div className="h-96 bg-gradient-earth rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
                      <div className="text-center z-10">
                        <Map className="h-16 w-16 text-white/80 mx-auto mb-4" />
                        <div className="text-white/90 space-y-2">
                          <p className="text-lg font-medium">Interactive Map Loading...</p>
                          <p className="text-sm">Heatmap • Markers • Citizen Reports</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-safe"></div>
                      <span>Safe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-moderate"></div>
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-unsafe"></div>
                      <span>Unsafe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Reports</span>
                    </div>
                  </div>
                  
                  <Button variant={showHeat ? "default" : "outline"} size="sm" className="flex items-center space-x-2" onClick={() => setShowHeat(h => !h)}>
                    <Layers className="h-4 w-4" />
                    <span>{showHeat ? 'Hide Heatmap' : 'Show Heatmap'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Site Data */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Recent Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.recentSites.map((site) => (
                  <div key={site.id} className="border border-border rounded-lg p-3 hover:shadow-soft transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{site.name}</p>
                        <p className="text-xs text-muted-foreground">{site.lat}°N, {site.lng}°E</p>
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(site.status))}>
                        {site.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>HPI: {site.hpi}</span>
                      <span>{site.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Citizen Reports */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Active Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.citizenReports.map((report) => (
                  <div key={report.id} className="border border-border rounded-lg p-3 hover:shadow-soft transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{report.location}</p>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      </div>
                      <Badge className={cn("text-xs", getPriorityColor(report.priority))}>
                        {report.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn("text-xs", getReportStatusColor(report.status))}>
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" size="sm">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-ocean hover:shadow-medium transition-all duration-300" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;