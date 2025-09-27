import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload,
  Brain,
  BarChart3,
  CheckCircle,
  ArrowRight,
  FileText,
  Github,
  Target,
  DollarSign,
  Zap,
  Settings,
  TrendingUp
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Resume",
      description: "Upload your resume (PDF/DOC) and provide job details including title, description, and GitHub profile URL.",
      details: ["PDF/DOC/DOCX Support", "Secure File Processing", "Quick Upload Process", "Format Validation"],
      color: "bg-primary"
    },
    {
      icon: Brain,
      title: "AI Analysis Begins", 
      description: "Our advanced AI algorithms analyze your resume using TF-IDF, cosine similarity, and natural language processing.",
      details: ["TF-IDF Algorithm", "Cosine Similarity", "NLP Processing", "Keyword Extraction"],
      color: "bg-accent"
    },
    {
      icon: Github,
      title: "GitHub Verification",
      description: "We verify your projects by analyzing your GitHub repositories, commit history, and programming languages.",
      details: ["Project Verification", "Commit Analysis", "Language Detection", "Repository Stats"],
      color: "bg-success"
    },
    {
      icon: Target,
      title: "Skills Gap Analysis",
      description: "Compare your skills with job requirements to identify gaps and matching areas for improvement.",
      details: ["Skill Matching", "Gap Identification", "Missing Keywords", "Strength Analysis"],
      color: "bg-warning"
    },
    {
      icon: DollarSign,
      title: "Salary Estimation",
      description: "Get data-driven salary insights based on your skills, experience, and market conditions.",
      details: ["Market Analysis", "Experience Factor", "Skill Premium", "Location Adjustment"],
      color: "bg-primary"
    },
    {
      icon: BarChart3,
      title: "Interactive Results",
      description: "View comprehensive analysis results with interactive charts, recommendations, and actionable insights.",
      details: ["Visual Dashboard", "Interactive Charts", "Detailed Reports", "Actionable Tips"],
      color: "bg-accent"
    }
  ];

  const algorithms = [
    {
      name: "TF-IDF Algorithm",
      description: "Term Frequency-Inverse Document Frequency for keyword importance analysis",
      icon: Settings
    },
    {
      name: "Cosine Similarity",
      description: "Measures semantic similarity between resume and job description",
      icon: Target
    },
    {
      name: "ATS Scoring",
      description: "Evaluates resume compatibility with Applicant Tracking Systems",
      icon: CheckCircle
    },
    {
      name: "GitHub API Integration",
      description: "Real-time analysis of repositories and coding activity",
      icon: Github
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-up">
            <Zap className="h-16 w-16 mx-auto mb-6 animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-primary-foreground/90">
              Discover the step-by-step process of our AI-powered resume analysis 
              and the advanced algorithms that power our platform
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Analysis Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive 6-step process delivers detailed insights in under 60 seconds
            </p>
          </div>
          
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1 hover-lift shadow-professional">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {step.details.map((detail, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {detail}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block flex-shrink-0">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Advanced AI Algorithms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The cutting-edge technologies that power our intelligent analysis engine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {algorithms.map((algorithm, index) => {
              const Icon = algorithm.icon;
              return (
                <Card 
                  key={index}
                  className="hover-lift animate-scale-in shadow-professional"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-primary rounded-lg">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="text-lg">{algorithm.name}</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{algorithm.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Our Platform?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: "94% Success Rate",
                description: "Our users see significant improvement in job application success"
              },
              {
                icon: Zap,
                title: "60 Second Analysis",
                description: "Get comprehensive insights faster than any manual review"
              },
              {
                icon: CheckCircle,
                title: "ATS Optimized",
                description: "Ensure your resume passes through modern ATS systems"
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="text-center hover-lift animate-fade-in shadow-professional"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;