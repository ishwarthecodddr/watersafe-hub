import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createReport } from "@/lib/api";

const CitizenReport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    coordinates: "",
    issueType: "",
    priority: "",
    description: "",
    anonymous: false,
    contactForUpdates: true
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdReportCode, setCreatedReportCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name || undefined,
        email: formData.email || undefined,
        location: formData.location,
        coordinates: formData.coordinates || undefined,
        issueType: formData.issueType,
        priority: formData.priority,
        description: formData.description,
        anonymous: formData.anonymous,
        contactForUpdates: formData.contactForUpdates,
      };
  const created = await createReport(payload);
  setCreatedReportCode(created.reportCode);
      setSubmitted(true);
      toast({
        title: "Report Submitted Successfully",
        description: "Thank you for helping keep our water safe.",
      });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCoordinates = () => {
    // Mock coordinates for demo
    const lat = (25 + Math.random() * 0.5).toFixed(6);
    const lng = (89 + Math.random() * 0.5).toFixed(6);
    setFormData(prev => ({ ...prev, coordinates: `${lat}, ${lng}` }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-sky py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-strong border-0 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-safe mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted Successfully!</h2>
                <p className="text-muted-foreground">
                  Thank you for contributing to water safety in your community.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Report ID:</span>
                    <span className="font-mono text-foreground">{createdReportCode ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-primary font-medium">Under Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className="text-moderate font-medium capitalize">{formData.priority}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your report will be reviewed by environmental officials within 24-48 hours. 
                  You'll receive updates at {formData.email || "your email"}.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Submit Another Report
                  </Button>
                  <Button 
                    asChild
                    className="bg-gradient-ocean hover:shadow-medium transition-all duration-300"
                  >
                    <a href="/accountability">View All Reports</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Report Water Quality Issue
          </h1>
          <p className="text-lg text-muted-foreground">
            Help protect your community by reporting water quality concerns or pollution incidents.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Report Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your name"
                        disabled={formData.anonymous}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={formData.anonymous}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) => {
                        handleInputChange("anonymous", checked);
                        if (checked) {
                          handleInputChange("name", "");
                          handleInputChange("email", "");
                          handleInputChange("contactForUpdates", false);
                        }
                      }}
                    />
                    <Label htmlFor="anonymous" className="text-sm">Submit anonymously</Label>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location Description *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., Downtown Lake, Main Street Well, Industrial Area River"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="coordinates"
                          value={formData.coordinates}
                          onChange={(e) => handleInputChange("coordinates", e.target.value)}
                          placeholder="25.123456, 89.123456"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={generateCoordinates}
                          className="shrink-0"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Get Location
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Issue Classification */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issue Type *</Label>
                      <Select value={formData.issueType} onValueChange={(value) => handleInputChange("issueType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discoloration">Water Discoloration</SelectItem>
                          <SelectItem value="odor">Unusual Odor</SelectItem>
                          <SelectItem value="taste">Strange Taste</SelectItem>
                          <SelectItem value="pollution">Visible Pollution</SelectItem>
                          <SelectItem value="industrial">Industrial Discharge</SelectItem>
                          <SelectItem value="algae">Algae Bloom</SelectItem>
                          <SelectItem value="dead-fish">Dead Fish/Wildlife</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority Level *</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor concern</SelectItem>
                          <SelectItem value="medium">Medium - Noticeable issue</SelectItem>
                          <SelectItem value="high">High - Significant problem</SelectItem>
                          <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Please provide as much detail as possible about what you observed, when it started, and any other relevant information..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <Label>Photo Evidence (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <div className="space-y-2">
                        <p className="text-sm text-foreground">Upload a photo of the issue</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                      </div>
                      <Label htmlFor="photo" className="cursor-pointer">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photo
                        </Button>
                      </Label>
                    </div>

                    {uploadedImage && (
                      <div className="bg-muted rounded-lg p-3 flex items-center space-x-3">
                        <Camera className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{uploadedImage.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Preferences */}
                  {!formData.anonymous && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="updates"
                        checked={formData.contactForUpdates}
                        onCheckedChange={(checked) => handleInputChange("contactForUpdates", checked)}
                      />
                      <Label htmlFor="updates" className="text-sm">
                        Contact me with updates about this report
                      </Label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.location || !formData.issueType || !formData.priority || !formData.description}
                      className="w-full bg-gradient-ocean hover:shadow-medium transition-all duration-300"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* What Happens Next */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>What Happens Next?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Immediate Review</p>
                    <p className="text-muted-foreground">Your report is logged and assigned a tracking ID</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Expert Assessment</p>
                    <p className="text-muted-foreground">Environmental officials review within 24-48 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Investigation</p>
                    <p className="text-muted-foreground">On-site testing and analysis if needed</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Resolution</p>
                    <p className="text-muted-foreground">Action taken and results published</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="shadow-medium border-0 bg-unsafe/10 backdrop-blur-sm border-unsafe/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2 text-unsafe">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Emergency Situations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-foreground">
                  For immediate health risks or environmental emergencies, contact:
                </p>
                <div className="space-y-2">
                  <div className="font-mono text-unsafe font-medium">
                    Emergency: 911
                  </div>
                  <div className="font-mono text-foreground">
                    EPA Hotline: 1-800-424-8802
                  </div>
                  <div className="font-mono text-foreground">
                    Local Environmental Office: (555) 123-4567
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Reporting Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Be as specific as possible about location and timing</li>
                  <li>• Include photos when safe to do so</li>
                  <li>• Don't approach dangerous areas or chemicals</li>
                  <li>• Report multiple instances separately</li>
                  <li>• Follow up if the issue persists</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenReport;