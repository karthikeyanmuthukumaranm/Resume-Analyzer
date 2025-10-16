import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Bot, 
  Upload, 
  GitBranch, 
  Target, 
  TrendingUp, 
  Sparkles,
  FileText,
  Globe,
  CheckCircle,
  Loader2,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  analyzeResumeJobMatch, 
  calculateATSScore, 
  extractSkills, 
  analyzeGitHubProfile,
  estimateSalary
} from "@/lib/analysis";
import { parseResumeFile } from "@/lib/fileParser";

interface FormData {
  jobTitle: string;
  jobDescription: string;
  githubUrl: string;
  resumeFile: File | null;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    githubUrl: "",
    resumeFile: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({ ...prev, resumeFile: file }));
  };

  const validateForm = (): boolean => {
    if (!formData.jobTitle.trim()) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title to analyze against.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.jobDescription.trim()) {
      toast({
        title: "Job Description Required", 
        description: "Please enter a job description for matching analysis.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume for analysis.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.githubUrl.trim()) {
      toast({
        title: "GitHub URL Required",
        description: "Please provide your GitHub profile URL for project verification.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const performAnalysis = async () => {
    if (!validateForm()) return;

    setIsAnalyzing(true);
    
    try {
      // Parse the uploaded resume file
      const resumeText = await parseResumeFile(formData.resumeFile!);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Could not extract enough text from resume. Please ensure the file is readable.');
      }

      // Perform AI analysis
      const matchResult = analyzeResumeJobMatch(resumeText, formData.jobDescription);
      const atsScore = calculateATSScore(resumeText);
      const resumeSkills = extractSkills(resumeText);
      const jobSkills = extractSkills(formData.jobDescription);
      const githubData = await analyzeGitHubProfile(formData.githubUrl);
      
      // Generate salary estimation
      const salaryData = estimateSalary(resumeText, formData.jobTitle);
      
      // Generate skills gap analysis
      const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
      const presentSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
      
      // Generate AI recommendations
      const recommendations = [
        `Add ${missingSkills.slice(0, 3).join(', ')} to your skills section to better match the job requirements.`,
        `Your resume shows strong technical skills in ${presentSkills.slice(0, 2).join(' and ')}, which aligns well with the position.`,
        `Consider adding metrics and quantifiable achievements to strengthen your experience section.`,
        `Your GitHub profile shows consistent activity with ${githubData.totalCommits} commits, which demonstrates ongoing learning.`,
        `The ${githubData.languages[0]?.name} expertise in your repositories matches the job's technical requirements.`
      ];

      const result = {
        resumeJobMatch: matchResult.score,
        atsScore,
        salaryEstimation: salaryData,
        skillsGap: {
          missing: missingSkills,
          present: presentSkills,
          recommended: missingSkills.slice(0, 5)
        },
        githubAnalysis: githubData,
        recommendations
      };

      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been successfully analyzed with AI-powered insights.",
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setFormData({
      jobTitle: "",
      jobDescription: "",
      githubUrl: "",
      resumeFile: null
    });
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Analysis Dashboard */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analysis Complete</h1>
                <p className="text-muted-foreground">Your comprehensive AI-powered resume analysis</p>
              </div>
            </div>
            <Button onClick={resetAnalysis} variant="outline" className="hover-lift">
              Analyze New Resume
            </Button>
          </div>
          
          <AnalysisDashboard data={analysisResult} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 animate-bounce-gentle">
              <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm glass-effect">
                <Bot className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 font-heading animate-fade-up">
              AI-Powered Resume Analyzer
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-fade-up" style={{animationDelay: "0.2s"}}>
              Get comprehensive insights with TF-IDF analysis, ATS compatibility scoring, 
              GitHub project verification, and salary estimation
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{animationDelay: "0.4s"}}>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 hover-lift">
                <Target className="h-5 w-5 mr-2" />
                Resume-Job Matching
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 hover-lift">
                <TrendingUp className="h-5 w-5 mr-2" />
                ATS Compatibility
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 hover-lift">
                <GitBranch className="h-5 w-5 mr-2" />
                GitHub Integration
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 hover-lift">
                <DollarSign className="h-5 w-5 mr-2" />
                Salary Estimation
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Analysis Form */}
      <main className="container mx-auto px-4 py-16 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-professional backdrop-blur-sm animate-scale-in">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 gradient-text">
                <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
                Start Your AI-Powered Analysis
              </CardTitle>
              <p className="text-muted-foreground mt-4 text-lg">
                Upload your resume and job details for comprehensive AI analysis using advanced NLP algorithms
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Job Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Job Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Profile URL *</Label>
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/yourusername"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the complete job description here for AI analysis..."
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Include requirements, responsibilities, and preferred skills for better analysis
                  </p>
                </div>
              </div>

              {/* Resume Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Resume Upload</h3>
                </div>
                
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  maxSize={10}
                />
              </div>

              {/* Analysis Features */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-4">AI Analysis Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">TF-IDF & Cosine Similarity</p>
                      <p className="text-xs text-muted-foreground">Advanced semantic matching algorithms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">ATS Compatibility Score</p>
                      <p className="text-xs text-muted-foreground">Applicant Tracking System optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Skills Gap Analysis</p>
                      <p className="text-xs text-muted-foreground">Identify missing and matched skills</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">GitHub Project Verification</p>
                      <p className="text-xs text-muted-foreground">Validate projects and analyze code stats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center pt-4">
                <Button 
                  onClick={performAnalysis}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-opacity px-12 py-4 text-lg font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-3" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Analysis typically takes 30-60 seconds using advanced NLP algorithms
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;