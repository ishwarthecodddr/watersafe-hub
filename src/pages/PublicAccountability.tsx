import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { listReports, ReportDTO } from "@/lib/api";

const PublicAccountability = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [reports, setReports] = useState<ReportDTO[] | null>(null);

  useEffect(() => {
    let mounted = true;
    listReports()
      .then((data) => { if (mounted) setReports(data); })
      .catch(() => { setReports([]); });
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-safe text-safe-foreground";
      case "investigating": return "bg-moderate text-moderate-foreground";
      case "pending": return "bg-muted text-muted-foreground";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4" />;
      case "investigating": return <Clock className="h-4 w-4" />;
      case "pending": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredReports = (reports ?? []).filter((report) => {
    const statusText = report.status.toLowerCase();
    const priorityText = report.priority.toLowerCase();
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || statusText === statusFilter;
    const matchesPriority = priorityFilter === 'all' || priorityText === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    totalReports: reports?.length ?? 0,
    resolved: (reports ?? []).filter(r => r.status === 'RESOLVED').length,
    investigating: (reports ?? []).filter(r => r.status === 'INVESTIGATING').length,
    pending: (reports ?? []).filter(r => r.status === 'PENDING').length,
    avgResolutionTime: "3.2 days"
  };

  const downloadReport = () => {
    // Mock PDF generation
    const blob = new Blob(["Mock PDF Report Content"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "WaterSafe_Public_Report_2024.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Public Accountability Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Transparent tracking of all citizen reports and official responses for environmental accountability.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalReports}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-safe">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-moderate">{stats.investigating}</div>
              <div className="text-sm text-muted-foreground">Investigating</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-primary">{stats.avgResolutionTime}</div>
              <div className="text-sm text-muted-foreground">Avg Resolution</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="reports">All Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={downloadReport}
              className="bg-gradient-ocean hover:shadow-medium transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
          </div>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Search & Filter</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                      <Input
                        placeholder="Search by location, description, or report ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="shadow-medium border-0 bg-card/80 backdrop-blur-sm hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                      {/* Main Info */}
                      <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground flex items-center space-x-2">
                              <span>Report {report.reportCode}</span>
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{report.location}</span>
                              <span>•</span>
                              <span>{report.coordinates ?? ""}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={cn("flex items-center space-x-1", getStatusColor(report.status.toLowerCase()))}>
                              {getStatusIcon(report.status.toLowerCase())}
                              <span className="capitalize">{report.status.toLowerCase()}</span>
                            </Badge>
                            <Badge className={cn("capitalize", getPriorityColor(report.priority.toLowerCase()))}>
                              {report.priority.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground">{report.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>By: {report.submittedByName ?? 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Submitted: {new Date(report.submittedAt).toLocaleDateString()}</span>
                          </div>
                          {report.resolvedAt && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Resolved: {new Date(report.resolvedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Official Response */}
                      <div className="lg:col-span-2 space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground text-sm mb-2">Official Response:</h4>
                          <p className="text-sm text-muted-foreground">{report.officialResponse ?? '—'}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground text-sm mb-2">Action Taken:</h4>
                          <p className="text-sm text-muted-foreground">{report.actionTaken ?? '—'}</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <Eye className="h-3 w-3" />
                            <span>View Details</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Reports Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resolution Trends */}
              <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Resolution Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-earth rounded-lg flex items-center justify-center">
                    <div className="text-center text-white/90">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Analytics Chart</p>
                      <p className="text-sm opacity-80">Resolution trends over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>Priority Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Critical</span>
                        <span>1 (25%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-unsafe h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>High</span>
                        <span>2 (50%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-moderate h-2 rounded-full" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Medium</span>
                        <span>1 (25%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low</span>
                        <span>0 (0%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-muted-foreground h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Response Time Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-safe mb-2">2.1 days</div>
                      <div className="text-sm text-muted-foreground">Average Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">85%</div>
                      <div className="text-sm text-muted-foreground">Within Target Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-moderate mb-2">3.2 days</div>
                      <div className="text-sm text-muted-foreground">Average Resolution Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicAccountability;