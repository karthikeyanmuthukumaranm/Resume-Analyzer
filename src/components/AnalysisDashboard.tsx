import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  GitBranch, 
  Code, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  Users,
  Calendar,
  DollarSign,
  Award,
  Briefcase
} from "lucide-react";

interface AnalysisData {
  resumeJobMatch: number;
  atsScore: number;
  salaryEstimation: {
    estimated: number;
    range: { min: number; max: number };
    factors: string[];
    breakdown: { base: number; skills: number; experience: number; location: number };
  };
  skillsGap: {
    missing: string[];
    present: string[];
    recommended: string[];
  };
  githubAnalysis: {
    totalRepos: number;
    verifiedProjects: number;
    unverifiedProjects: string[];
    languages: { name: string; value: number; color: string }[];
    recentActivity: boolean;
    totalStars: number;
    totalCommits: number;
  };
  recommendations: string[];
}

interface AnalysisDashboardProps {
  data: AnalysisData;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  const { resumeJobMatch, atsScore, salaryEstimation, skillsGap, githubAnalysis, recommendations } = data;

  const scoreData = [
    { name: 'Resume Match', value: resumeJobMatch, color: 'hsl(var(--primary))' },
    { name: 'ATS Score', value: atsScore, color: 'hsl(var(--accent))' }
  ];

  const salaryBreakdownData = [
    { name: 'Base Salary', value: salaryEstimation.breakdown.base, color: 'hsl(var(--chart-1))' },
    { name: 'Skills Premium', value: salaryEstimation.breakdown.skills, color: 'hsl(var(--chart-2))' },
    { name: 'Experience', value: salaryEstimation.breakdown.experience, color: 'hsl(var(--chart-3))' },
    { name: 'Location', value: salaryEstimation.breakdown.location, color: 'hsl(var(--chart-4))' }
  ].filter(item => item.value > 0);

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Salary Estimation Hero Card */}
      <Card className="shadow-professional bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 animate-scale-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <DollarSign className="h-8 w-8 text-primary animate-pulse-glow" />
            Estimated Salary Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {formatSalary(salaryEstimation.estimated)}
            </div>
            <div className="text-lg text-muted-foreground">
              Range: {formatSalary(salaryEstimation.range.min)} - {formatSalary(salaryEstimation.range.max)}
            </div>
          </div>
          
          {salaryEstimation.factors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-center text-foreground">Factors Affecting Your Salary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {salaryEstimation.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg hover-lift">
                    <Award className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.1s"}}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Resume Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getScoreColor(resumeJobMatch)}`}>
                {resumeJobMatch}%
              </span>
              <Badge variant={getScoreBadgeVariant(resumeJobMatch)}>
                {resumeJobMatch >= 80 ? 'Excellent' : resumeJobMatch >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
            <Progress value={resumeJobMatch} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.2s"}}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
                {atsScore}%
              </span>
              <Badge variant={getScoreBadgeVariant(atsScore)}>
                {atsScore >= 80 ? 'ATS Ready' : atsScore >= 60 ? 'Moderate' : 'Poor'}
              </Badge>
            </div>
            <Progress value={atsScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.3s"}}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-chart-3" />
              GitHub Repos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">
                {githubAnalysis.totalRepos}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">{githubAnalysis.totalStars}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {githubAnalysis.verifiedProjects} verified projects
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.4s"}}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-chart-5" />
              Skills Gap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-destructive">
                {skillsGap.missing.length}
              </span>
              <Badge variant="outline">
                Missing Skills
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {skillsGap.present.length} skills matched
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Score Comparison Chart */}
        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.5s"}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart data={scoreData} innerRadius="30%" outerRadius="80%">
                <RadialBar dataKey="value" cornerRadius={10} fill={scoreData[0].color} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Programming Languages Chart */}
        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.6s"}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="h-5 w-5 text-chart-2" />
              Programming Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={githubAnalysis.languages}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {githubAnalysis.languages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-3">
              {githubAnalysis.languages.map((lang, index) => (
                <div key={lang.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{lang.name}: {lang.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Salary Breakdown Chart */}
        <Card className="shadow-card hover-lift animate-fade-in" style={{animationDelay: "0.7s"}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-success" />
              Salary Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salaryBreakdownData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                <Tooltip formatter={(value) => [formatSalary(Number(value)), 'Amount']} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Matched Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsGap.present.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-success/10 text-success border-success/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsGap.missing.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GitHub Project Verification */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            GitHub Project Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">Verified Projects</span>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success">
                {githubAnalysis.verifiedProjects} Found
              </Badge>
            </div>
            
            {githubAnalysis.unverifiedProjects.length > 0 && (
              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="font-medium">Unverified Projects</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {githubAnalysis.unverifiedProjects.map((project) => (
                    <Badge key={project} variant="outline" className="bg-warning/20 text-warning">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{githubAnalysis.totalCommits}</div>
                <div className="text-sm text-muted-foreground">Total Commits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{githubAnalysis.totalStars}</div>
                <div className="text-sm text-muted-foreground">Total Stars</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${githubAnalysis.recentActivity ? 'text-success' : 'text-destructive'}`}>
                  {githubAnalysis.recentActivity ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm text-muted-foreground">Recent Activity</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}