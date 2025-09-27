import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Award,
  Target,
  Lightbulb,
  Heart,
  Zap,
  Globe,
  TrendingUp
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Resumes Analyzed", value: "10,000+", color: "text-primary" },
    { icon: Award, label: "Success Rate", value: "94%", color: "text-success" },
    { icon: Target, label: "Job Matches", value: "15,000+", color: "text-accent" },
    { icon: Globe, label: "Countries", value: "25+", color: "text-warning" }
  ];

  const team = [
    {
      name: "AI Research Team",
      role: "Machine Learning & NLP",
      description: "Experts in natural language processing and machine learning algorithms"
    },
    {
      name: "UX/UI Team",
      role: "User Experience Design",
      description: "Creating intuitive and beautiful interfaces for seamless user experience"
    },
    {
      name: "Backend Team",
      role: "System Architecture",
      description: "Building robust and scalable backend systems for reliable performance"
    },
    {
      name: "Data Science Team", 
      role: "Analytics & Insights",
      description: "Extracting meaningful insights from resume and job market data"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-up">
            <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              About Our Mission
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-primary-foreground/90">
              Empowering job seekers worldwide with AI-powered resume analysis 
              to bridge the gap between talent and opportunity
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that every talented individual deserves the opportunity to showcase 
                their skills effectively. Our AI-powered resume analyzer helps job seekers 
                optimize their resumes to match job requirements and pass through ATS systems.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By combining advanced natural language processing with GitHub integration and 
                salary insights, we provide comprehensive feedback that goes beyond traditional 
                resume review services.
              </p>
            </div>
            
            <div className="animate-fade-in space-y-6">
              <Card className="hover-lift shadow-professional">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-accent" />
                    <CardTitle className="text-lg">Innovation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leveraging cutting-edge AI and machine learning to revolutionize 
                    how job seekers approach resume optimization.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-professional">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-success" />
                    <CardTitle className="text-lg">Precision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Providing accurate, data-driven insights that help candidates 
                    align their profiles with market demands.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-professional">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">Efficiency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Delivering instant, comprehensive analysis that would take 
                    hours of manual review in just seconds.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Impact by Numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our AI-powered platform is making a difference for job seekers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index}
                  className="text-center hover-lift animate-scale-in shadow-professional"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <Icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Expert Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dedicated professionals working together to build the future of resume analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="hover-lift animate-fade-in shadow-professional"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-lg">{member.name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;