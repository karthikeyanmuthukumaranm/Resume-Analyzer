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

// Real GitHub API Analysis
export async function analyzeGitHubProfile(githubUrl: string) {
  try {
    // Extract username from GitHub URL
    const username = githubUrl.replace(/https?:\/\/(www\.)?github\.com\//, '').split('/')[0].trim();
    
    if (!username) {
      throw new Error('Invalid GitHub URL');
    }

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      throw new Error('GitHub user not found');
    }
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const repos = await reposResponse.json();

    // Calculate language statistics
    const languageStats: { [key: string]: number } = {};
    let totalStars = 0;
    let totalCommits = 0;
    
    for (const repo of repos) {
      // Count stars
      totalStars += repo.stargazers_count || 0;
      
      // Get language data
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
      
      // Get commit count for each repo (limited to avoid rate limiting)
      try {
        const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`);
        if (commitsResponse.ok) {
          const linkHeader = commitsResponse.headers.get('Link');
          if (linkHeader) {
            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (match) {
              totalCommits += parseInt(match[1]);
            }
          } else {
            totalCommits += 1; // At least one commit
          }
        }
      } catch (error) {
        // Skip if rate limited or error
        console.warn(`Could not fetch commits for ${repo.name}`);
      }
    }

    // Convert language stats to percentages
    const totalRepos = repos.length;
    const languageColors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Rust': '#dea584',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
      'Vue': '#41b883',
      'Jupyter Notebook': '#DA5B0B'
    };

    const languages = Object.entries(languageStats)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalRepos) * 100),
        color: languageColors[name] || '#8b5cf6'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 languages

    // Check for recent activity (repos updated in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentActivity = repos.some((repo: any) => 
      new Date(repo.updated_at) > sixMonthsAgo
    );

    // Get public repos from user data
    const verifiedProjects = repos.filter((repo: any) => !repo.fork).length;
    
    // Identify unverified projects (projects mentioned but not found in GitHub)
    // This would need resume text to compare, for now return empty array
    const unverifiedProjects: string[] = [];

    return {
      totalRepos: repos.length,
      verifiedProjects,
      unverifiedProjects,
      languages,
      recentActivity,
      totalStars,
      totalCommits
    };
  } catch (error) {
    console.error('GitHub analysis error:', error);
    // Return minimal data on error
    return {
      totalRepos: 0,
      verifiedProjects: 0,
      unverifiedProjects: [],
      languages: [],
      recentActivity: false,
      totalStars: 0,
      totalCommits: 0
    };
  }
}

// Salary Estimation Algorithm
export function estimateSalary(resumeText: string, jobTitle: string, location: string = "Global"): { 
  estimated: number; 
  range: { min: number; max: number }; 
  factors: string[];
  breakdown: { base: number; skills: number; experience: number; location: number };
} {
  const skills = extractSkills(resumeText);
  
  // Base salary by job title (in thousands)
  const baseSalaries: { [key: string]: number } = {
    'software engineer': 85,
    'senior software engineer': 110,
    'full stack developer': 90,
    'frontend developer': 80,
    'backend developer': 95,
    'data scientist': 105,
    'devops engineer': 100,
    'product manager': 120,
    'engineering manager': 140,
    'tech lead': 130
  };
  
  // Skill premiums (in thousands)
  const skillPremiums: { [key: string]: number } = {
    'react': 8, 'angular': 7, 'vue': 6,
    'node.js': 10, 'python': 12, 'java': 9,
    'aws': 15, 'azure': 12, 'kubernetes': 18,
    'machine learning': 25, 'ai': 30,
    'blockchain': 35, 'golang': 20
  };
  
  // Experience multipliers based on keywords in resume
  const experienceKeywords = resumeText.toLowerCase();
  let experienceMultiplier = 1.0;
  
  if (experienceKeywords.includes('senior') || experienceKeywords.includes('lead')) {
    experienceMultiplier = 1.3;
  } else if (experienceKeywords.includes('junior') || experienceKeywords.includes('entry')) {
    experienceMultiplier = 0.7;
  }
  
  // Calculate years of experience (rough estimation)
  const yearMatches = resumeText.match(/(\d+)\+?\s*year/gi);
  const maxYears = yearMatches ? Math.max(...yearMatches.map(m => parseInt(m))) : 2;
  const experienceBonus = Math.min(maxYears * 5, 50); // Max 50k bonus
  
  // Base calculation
  const titleKey = jobTitle.toLowerCase();
  const baseForTitle = Object.keys(baseSalaries).find(key => 
    titleKey.includes(key)
  );
  const baseSalary = baseForTitle ? baseSalaries[baseForTitle] : 85;
  
  // Skills bonus
  const skillsBonus = skills.reduce((total, skill) => {
    return total + (skillPremiums[skill.toLowerCase()] || 0);
  }, 0);
  
  // Location adjustments (simplified)
  const locationMultipliers: { [key: string]: number } = {
    'san francisco': 1.4, 'new york': 1.3, 'seattle': 1.25,
    'london': 1.2, 'toronto': 1.1, 'berlin': 1.05,
    'global': 1.0, 'remote': 1.1
  };
  
  const locationKey = location.toLowerCase();
  const locationMultiplier = Object.keys(locationMultipliers).find(key => 
    locationKey.includes(key)
  );
  const locMultiplier = locationMultiplier ? locationMultipliers[locationMultiplier] : 1.0;
  
  // Final calculation
  const adjustedBase = baseSalary * experienceMultiplier;
  const totalSkillsBonus = skillsBonus * locMultiplier;
  const experienceBonusAdjusted = experienceBonus * locMultiplier;
  const locationBonus = (adjustedBase * locMultiplier) - adjustedBase;
  
  const estimated = Math.round((adjustedBase + totalSkillsBonus + experienceBonusAdjusted + locationBonus) * 1000);
  
  // Generate factors that influenced the salary
  const factors = [];
  if (experienceMultiplier > 1.1) factors.push("Senior experience level (+30%)");
  if (experienceMultiplier < 0.9) factors.push("Entry level experience (-30%)");
  if (skillsBonus > 20) factors.push("High-demand skills premium");
  if (locMultiplier > 1.1) factors.push(`${location} location premium (+${Math.round((locMultiplier-1)*100)}%)`);
  if (maxYears > 5) factors.push(`${maxYears}+ years experience`);
  
  return {
    estimated,
    range: {
      min: Math.round(estimated * 0.85),
      max: Math.round(estimated * 1.25)
    },
    factors,
    breakdown: {
      base: Math.round(adjustedBase * 1000),
      skills: Math.round(totalSkillsBonus * 1000),
      experience: Math.round(experienceBonusAdjusted * 1000),
      location: Math.round(locationBonus * 1000)
    }
  };
}