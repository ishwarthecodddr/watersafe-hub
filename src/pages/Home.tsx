import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, AlertTriangle, BarChart3, Shield, Users, FileText } from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Water Data",
      description: "Import CSV/Excel files with metal concentration measurements and location data."
    },
    {
      icon: BarChart3,
      title: "Pollution Analysis",
      description: "Automatic calculation of HPI, MPI, PLI, and HEI pollution indices."
    },
    {
      icon: AlertTriangle,
      title: "Citizen Reports",
      description: "Community-driven reporting system for real-time water quality concerns."
    },
    {
      icon: Shield,
      title: "Safety Classification",
      description: "Clear color-coded safety levels: Safe (green), Moderate (yellow), Unsafe (red)."
    }
  ];

  const stats = [
    { value: "50+", label: "Data Points Monitored" },
    { value: "15", label: "Citizen Reports" },
    { value: "85%", label: "Sites Classified Safe" },
    { value: "24/7", label: "Continuous Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Clean water monitoring" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Track Heavy Metal Pollution.
                <span className="block bg-gradient-ocean bg-clip-text text-transparent">
                  Empower Citizens.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Monitor water quality, analyze pollution indices, and create a transparent 
                platform for environmental accountability in your community.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-ocean hover:shadow-strong transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/upload" className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Data</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Link to="/report" className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Report Issue</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="secondary" 
                size="lg"
                className="bg-gradient-earth hover:shadow-medium transition-all duration-300"
              >
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>View Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Water Quality Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines scientific data analysis with community reporting 
              to create a complete picture of water safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-medium transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-gradient-ocean mb-4 shadow-medium">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-ocean">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Join the Movement for Water Safety
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Help build a transparent, data-driven approach to environmental protection 
            in your community. Every report and data point makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-strong"
            >
              <Link to="/accountability" className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>View Public Reports</span>
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/upload" className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;