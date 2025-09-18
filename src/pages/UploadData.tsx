import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const UploadData = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Mock data for demonstration
  const mockResults = {
    totalSites: 12,
    processedSuccessfully: 11,
    errors: 1,
    sites: [
      { id: 1, location: "Site A (25.2°N, 89.3°E)", hpi: 15.2, mpi: 1.2, pli: 0.8, hei: 12.1, status: "safe" },
      { id: 2, location: "Site B (25.4°N, 89.1°E)", hpi: 45.8, mpi: 2.1, pli: 1.8, hei: 38.2, status: "moderate" },
      { id: 3, location: "Site C (25.1°N, 89.5°E)", hpi: 125.6, mpi: 4.2, pli: 3.1, hei: 98.4, status: "unsafe" },
      { id: 4, location: "Site D (25.3°N, 89.2°E)", hpi: 8.9, mpi: 0.7, pli: 0.5, hei: 7.2, status: "safe" },
      { id: 5, location: "Site E (25.5°N, 89.4°E)", hpi: 67.3, mpi: 2.8, pli: 2.2, hei: 52.1, status: "moderate" },
    ]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setResults(mockResults);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-safe text-safe-foreground";
      case "moderate": return "bg-moderate text-moderate-foreground";
      case "unsafe": return "bg-unsafe text-unsafe-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="h-4 w-4" />;
      case "moderate": return <AlertCircle className="h-4 w-4" />;
      case "unsafe": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Upload Water Quality Data
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload CSV or Excel files containing metal concentration data with coordinates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit shadow-medium border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span>Data Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                  dragActive
                    ? "border-primary bg-primary/5 shadow-medium"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV, Excel (.xlsx, .xls) up to 10MB
                  </p>
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    className="mt-4 bg-gradient-ocean hover:shadow-medium transition-all duration-300"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </Label>
              </div>

              {/* File Info */}
              {uploadedFile && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isProcessing && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    )}
                  </div>
                </div>
              )}

              {/* Processing Status */}
              {isProcessing && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-primary font-medium">
                    Processing your data... Calculating pollution indices...
                  </p>
                </div>
              )}

              {/* Requirements */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">File Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Columns: Latitude, Longitude, Metal concentrations (ppm)</li>
                  <li>• Supported metals: As, Cd, Cr, Cu, Fe, Mn, Ni, Pb, Zn</li>
                  <li>• Header row required</li>
                  <li>• Maximum 1000 data points per file</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Summary */}
                <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-safe" />
                      <span>Processing Complete</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{results.totalSites}</div>
                        <div className="text-sm text-muted-foreground">Total Sites</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-safe">{results.processedSuccessfully}</div>
                        <div className="text-sm text-muted-foreground">Processed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-unsafe">{results.errors}</div>
                        <div className="text-sm text-muted-foreground">Errors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Table */}
                <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Pollution Indices by Site</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.sites.map((site: any) => (
                        <div key={site.id} className="border border-border rounded-lg p-4 hover:shadow-soft transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="font-medium text-foreground">{site.location}</p>
                              </div>
                            </div>
                            <Badge className={cn("flex items-center space-x-1", getStatusColor(site.status))}>
                              {getStatusIcon(site.status)}
                              <span className="capitalize">{site.status}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <div className="font-medium text-foreground">{site.hpi}</div>
                              <div className="text-muted-foreground">HPI</div>
                            </div>
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <div className="font-medium text-foreground">{site.mpi}</div>
                              <div className="text-muted-foreground">MPI</div>
                            </div>
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <div className="font-medium text-foreground">{site.pli}</div>
                              <div className="text-muted-foreground">PLI</div>
                            </div>
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <div className="font-medium text-foreground">{site.hei}</div>
                              <div className="text-muted-foreground">HEI</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button className="bg-gradient-ocean hover:shadow-medium transition-all duration-300" onClick={() => window.location.href = '/dashboard'}>
                        View on Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Information Panel */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Pollution Index Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-safe"></div>
                    <span className="text-sm"><strong>Safe:</strong> HPI &lt; 30, suitable for consumption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-moderate"></div>
                    <span className="text-sm"><strong>Moderate:</strong> HPI 30-100, requires treatment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-unsafe"></div>
                    <span className="text-sm"><strong>Unsafe:</strong> HPI &gt; 100, not suitable for use</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>HPI:</strong> Heavy Metal Pollution Index<br />
                    <strong>MPI:</strong> Metal Pollution Index<br />
                    <strong>PLI:</strong> Pollution Load Index<br />
                    <strong>HEI:</strong> Heavy Metal Evaluation Index
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadData;