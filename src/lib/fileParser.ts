import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker using local package
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function parseResumeFile(file: File): Promise<string> {
  const fileType = file.name.toLowerCase();
  
  try {
    if (fileType.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (fileType.endsWith('.docx')) {
      return await parseDOCX(file);
    } else if (fileType.endsWith('.doc')) {
      // For .doc files, we'll try to read as text
      return await parseAsText(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOC, or DOCX files.');
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse resume file. Please ensure the file is not corrupted.');
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function parseAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}
