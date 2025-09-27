import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Target, 
  TrendingUp, 
  GitBranch, 
  Brain, 
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  DollarSign,
  Sparkles
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced NLP algorithms using TF-IDF and Cosine Similarity for semantic matching",
      features: ["TF-IDF Algorithm", "Cosine Similarity", "Semantic Analysis", "Keyword Extraction"],
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Resume-Job Matching",
      description: "Intelligent matching system that compares your resume against job requirements",
      features: ["Smart Keyword Analysis", "Skills Gap Detection", "Match Score", "Missing Skills Alert"],
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "ATS Compatibility",
      description: "Ensure your resume passes through Applicant Tracking Systems successfully",
      features: ["Format Analysis", "Keyword Optimization", "Structure Check", "Compatibility Score"],
      color: "text-success"
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Verify projects and analyze your coding activity to validate resume claims",
      features: ["Project Verification", "Language Analysis", "Commit Statistics", "Repository Insights"],
      color: "text-warning"
    },
    {
      icon: DollarSign,
      title: "Salary Estimation",
      description: "Get data-driven salary insights based on your skills and experience level",
      features: ["Market Analysis", "Skill-based Pricing", "Experience Factor", "Location Adjustment"],
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Interactive Dashboards",
      description: "Beautiful visualizations and charts to understand your analysis results",
      features: ["Real-time Charts", "Progress Tracking", "Visual Insights", "Exportable Reports"],
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-up">
            <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              Powerful AI Features
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-foreground/90">
              Discover the advanced AI technologies that make our resume analyzer 
              the most comprehensive tool for job seekers
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="hover-lift animate-fade-in shadow-professional"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-primary mb-4 ${feature.color}`}>
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built with Advanced AI Technology
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Our platform leverages cutting-edge algorithms and machine learning techniques
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "TF-IDF Algorithm",
              "Cosine Similarity", 
              "NLP Processing",
              "Machine Learning",
              "GitHub API",
              "Real-time Analysis",
              "Semantic Matching",
              "ATS Optimization"
            ].map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="py-3 px-4 text-sm font-medium hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;