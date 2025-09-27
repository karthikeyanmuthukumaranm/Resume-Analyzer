// AI-powered resume analysis algorithms
export interface TFIDFResult {
  [key: string]: number;
}

export interface SimilarityResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

// TF-IDF (Term Frequency-Inverse Document Frequency) Implementation
export function calculateTFIDF(documents: string[]): TFIDFResult[] {
  const tokenize = (text: string): string[] => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  };

  const tokenizedDocs = documents.map(tokenize);
  const vocabulary = [...new Set(tokenizedDocs.flat())];
  
  // Calculate TF (Term Frequency)
  const calculateTF = (tokens: string[]): { [key: string]: number } => {
    const tf: { [key: string]: number } = {};
    const totalTokens = tokens.length;
    
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    
    // Normalize by total tokens
    Object.keys(tf).forEach(token => {
      tf[token] = tf[token] / totalTokens;
    });
    
    return tf;
  };

  // Calculate IDF (Inverse Document Frequency)
  const calculateIDF = (vocabulary: string[], docs: string[][]): { [key: string]: number } => {
    const idf: { [key: string]: number } = {};
    const totalDocs = docs.length;
    
    vocabulary.forEach(term => {
      const docsContainingTerm = docs.filter(doc => doc.includes(term)).length;
      idf[term] = Math.log(totalDocs / (docsContainingTerm + 1));
    });
    
    return idf;
  };

  const tfResults = tokenizedDocs.map(calculateTF);
  const idfResults = calculateIDF(vocabulary, tokenizedDocs);
  
  // Calculate TF-IDF
  return tfResults.map(tf => {
    const tfidf: TFIDFResult = {};
    Object.keys(tf).forEach(term => {
      tfidf[term] = tf[term] * idfResults[term];
    });
    return tfidf;
  });
}

// Cosine Similarity Implementation
export function cosineSimilarity(vectorA: TFIDFResult, vectorB: TFIDFResult): number {
  const keys = [...new Set([...Object.keys(vectorA), ...Object.keys(vectorB)])];
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  keys.forEach(key => {
    const a = vectorA[key] || 0;
    const b = vectorB[key] || 0;
    
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  });
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Jaccard Similarity Implementation
export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Advanced Resume-Job Matching Algorithm
export function analyzeResumeJobMatch(resumeText: string, jobDescription: string): SimilarityResult {
  const documents = [resumeText, jobDescription];
  const tfidfResults = calculateTFIDF(documents);
  
  const resumeTFIDF = tfidfResults[0];
  const jobTFIDF = tfidfResults[1];
  
  // Calculate cosine similarity
  const cosineSim = cosineSimilarity(resumeTFIDF, jobTFIDF);
  
  // Extract keywords (terms with high TF-IDF scores)
  const getTopKeywords = (tfidf: TFIDFResult, threshold: number = 0.05): string[] => {
    return Object.entries(tfidf)
      .filter(([_, score]) => score > threshold)
      .sort((a, b) => b[1] - a[1])
      .map(([term, _]) => term);
  };
  
  const resumeKeywords = new Set(getTopKeywords(resumeTFIDF));
  const jobKeywords = new Set(getTopKeywords(jobTFIDF));
  
  const matchedKeywords = [...resumeKeywords].filter(kw => jobKeywords.has(kw));
  const missingKeywords = [...jobKeywords].filter(kw => !resumeKeywords.has(kw));
  
  // Combined score using both cosine similarity and keyword matching
  const keywordMatchRatio = matchedKeywords.length / Math.max(jobKeywords.size, 1);
  const finalScore = (cosineSim * 0.6 + keywordMatchRatio * 0.4) * 100;
  
  return {
    score: Math.round(Math.max(0, Math.min(100, finalScore))),
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 10) // Limit to top 10 missing keywords
  };
}

// ATS Compatibility Scoring Algorithm
export function calculateATSScore(resumeText: string): number {
  let score = 100;
  const penalties: { [key: string]: number } = {};
  
  // Check for common ATS-unfriendly elements
  const checks = [
    {
      name: 'Special Characters',
      regex: /[★☆●◆▪▫]/g,
      penalty: 5,
      description: 'Special characters may not be parsed correctly'
    },
    {
      name: 'Complex Formatting',
      regex: /\t{2,}|\s{4,}/g,
      penalty: 3,
      description: 'Complex spacing may cause parsing issues'
    },
    {
      name: 'Missing Contact Info',
      regex: /email|phone|@|\.com/gi,
      penalty: -10, // Bonus for having contact info
      description: 'Contact information is essential'
    },
    {
      name: 'Skills Section',
      regex: /skills|technical|technologies|programming/gi,
      penalty: -5, // Bonus for skills section
      description: 'Clear skills section improves parsing'
    },
    {
      name: 'Standard Headers',
      regex: /experience|education|work|employment/gi,
      penalty: -5, // Bonus for standard headers
      description: 'Standard section headers help ATS parsing'
    }
  ];
  
  checks.forEach(check => {
    const matches = resumeText.match(check.regex);
    if (matches) {
      if (check.penalty > 0) {
        penalties[check.name] = check.penalty;
        score -= check.penalty;
      } else {
        // Bonus points
        score += Math.abs(check.penalty);
      }
    } else if (check.penalty < 0) {
      // Missing required elements
      penalties[check.name] = Math.abs(check.penalty);
      score -= Math.abs(check.penalty);
    }
  });
  
  // Word count check
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    penalties['Content Length'] = 15;
    score -= 15;
  } else if (wordCount > 1000) {
    penalties['Content Length'] = 10;
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Skills Extraction using weighted keywords
export function extractSkills(text: string): string[] {
  const skillKeywords = [
    // Programming Languages
    'javascript', 'python', 'java', 'typescript', 'react', 'angular', 'vue',
    'node.js', 'express', 'django', 'flask', 'spring', 'hibernate',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'sql', 'nosql',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
    // Frameworks & Tools
    'bootstrap', 'tailwind', 'sass', 'webpack', 'vite', 'npm', 'yarn',
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'agile', 'scrum'
  ];
  
  const lowerText = text.toLowerCase();
  const foundSkills = skillKeywords.filter(skill => 
    lowerText.includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

// Mock GitHub API Analysis (in real implementation, this would call GitHub API)
export async function analyzeGitHubProfile(githubUrl: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - in real implementation, this would fetch from GitHub API
  return {
    totalRepos: 24,
    verifiedProjects: 8,
    unverifiedProjects: ['E-commerce Dashboard', 'Mobile Banking App'], 
    languages: [
      { name: 'JavaScript', value: 45, color: '#f1e05a' },
      { name: 'TypeScript', value: 25, color: '#2b7489' },
      { name: 'Python', value: 15, color: '#3572A5' },
      { name: 'CSS', value: 10, color: '#563d7c' },
      { name: 'HTML', value: 5, color: '#e34c26' }
    ],
    recentActivity: true,
    totalStars: 156,
    totalCommits: 1247
  };
}