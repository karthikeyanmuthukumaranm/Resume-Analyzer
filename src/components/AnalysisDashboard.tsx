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
  Calendar
} from "lucide-react";

interface AnalysisData {
  resumeJobMatch: number;
  atsScore: number;
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
  const { resumeJobMatch, atsScore, skillsGap, githubAnalysis, recommendations } = data;

  const scoreData = [
    { name: 'Resume Match', value: resumeJobMatch, color: 'hsl(var(--primary))' },
    { name: 'ATS Score', value: atsScore, color: 'hsl(var(--accent))' }
  ];

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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
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

        <Card className="shadow-card">
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

        <Card className="shadow-card">
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

        <Card className="shadow-card">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Comparison Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart data={scoreData} innerRadius="30%" outerRadius="80%">
                <RadialBar dataKey="value" cornerRadius={10} fill={scoreData[0].color} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Programming Languages Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-chart-2" />
              Programming Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={githubAnalysis.languages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {githubAnalysis.languages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {githubAnalysis.languages.map((lang, index) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{lang.name}: {lang.value}%</span>
                </div>
              ))}
            </div>
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