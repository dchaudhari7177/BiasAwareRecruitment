"""
Resume Parser Utility

This module provides functions to parse resumes, extract structured information,
and perform feature calculations for candidate evaluation.
"""
import os
import re
import io
import json
import logging
import requests
from typing import Any, Dict, List, Optional
from pdfminer.high_level import extract_text
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Groq API configuration (use environment variable for security)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except Exception as e:
    logger.error(f"Error downloading NLTK data: {str(e)}")

def parse_resume(file) -> Dict[str, Any]:
    """
    Parse resume file and extract relevant information.
    Args:
        file: File-like object containing the resume PDF.
    Returns:
        Dictionary with extracted and calculated features.
    Raises:
        Exception: If parsing fails.
    """
    try:
        logger.debug("Starting resume parsing")
        file_content = file.read()
        logger.debug(f"Read file content, size: {len(file_content)} bytes")
        file_obj = io.BytesIO(file_content)
        text = extract_text(file_obj)
        logger.debug(f"Extracted text length: {len(text)} characters")
        if not text:
            raise ValueError("No text could be extracted from the PDF")
        structured_data = analyze_with_groq(text)
        info = {
            'text': text,
            'education': structured_data.get('education', []),
            'experience': structured_data.get('experience', []),
            'skills': structured_data.get('skills', []),
            'certifications': structured_data.get('certifications', []),
            'languages': structured_data.get('languages', []),
            'education_level': calculate_education_level(structured_data.get('education', [])),
            'years_experience': calculate_years_experience(structured_data.get('experience', [])),
            'skills_match': calculate_skills_match(structured_data.get('skills', [])),
            'project_complexity': calculate_project_complexity(structured_data.get('experience', []))
        }
        logger.debug("Parsing completed successfully")
        return info
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise

def analyze_with_groq(text: str) -> Dict[str, Any]:
    """
    Use Groq API to analyze and structure resume content.
    Falls back to basic parsing if API fails or key is missing.
    Args:
        text: Extracted resume text.
    Returns:
        Structured data dictionary.
    """
    if not GROQ_API_KEY:
        logger.warning("GROQ_API_KEY not set. Using fallback parsing.")
        return {
            'education': extract_education(text),
            'experience': extract_experience(text),
            'skills': extract_skills(text),
            'certifications': extract_certifications(text),
            'languages': extract_languages(text)
        }
    try:
        prompt = f"""Analyze the following resume and extract information into structured sections. \
        Return the data in JSON format with the following structure:\n\n        {{\n            \"education\": [list of education entries],\n            \"experience\": [list of experience entries],\n            \"skills\": [list of technical skills],\n            \"certifications\": [list of certifications],\n            \"languages\": [list of languages and proficiency]\n        }}\n\n        Resume text:\n        {text}\n        """
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "mixtral-8x7b-32768",
            "messages": [
                {"role": "system", "content": "You are a resume parser that extracts structured information from resumes."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 4000
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        structured_data = json.loads(result['choices'][0]['message']['content'])
        return structured_data
    except Exception as e:
        logger.error(f"Error in Groq API call: {str(e)}. Using fallback parsing.")
        return {
            'education': extract_education(text),
            'experience': extract_experience(text),
            'skills': extract_skills(text),
            'certifications': extract_certifications(text),
            'languages': extract_languages(text)
        }

def split_into_sections(text: str) -> Dict[str, str]:
    """
    Split resume text into sections based on common headers and content.
    Args:
        text: Resume text.
    Returns:
        Dictionary mapping section names to their content.
    """
    sections = {
        'education': '',
        'experience': '',
        'skills': '',
        'certifications': '',
        'languages': ''
    }
    section_headers = {
        'education': ['education', 'academic', 'qualification', 'degree', 'diploma', 'certificate', 'school'],
        'experience': ['experience', 'work', 'employment', 'professional', 'internship', 'project'],
        'skills': ['skills', 'technical skills', 'expertise', 'programming', 'technologies', 'tools'],
        'certifications': ['certifications', 'certificates', 'certified', 'certification'],
        'languages': ['languages', 'language proficiency', 'language skills']
    }
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    current_section = None
    current_content = []
    section_found = False
    for i, line in enumerate(lines):
        line_lower = line.lower()
        is_header = False
        for section, headers in section_headers.items():
            if any(header in line_lower for header in headers):
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content)
                current_section = section
                current_content = []
                is_header = True
                section_found = True
                break
        if not section_found:
            if any(edu_word in line_lower for edu_word in ['university', 'college', 'school', 'b.tech', 'm.tech', 'phd']):
                current_section = 'education'
                section_found = True
            elif any(exp_word in line_lower for exp_word in ['developer', 'engineer', 'intern', 'worked', 'experience']):
                current_section = 'experience'
                section_found = True
            elif any(skill_word in line_lower for skill_word in ['python', 'java', 'javascript', 'c++', 'html', 'css']):
                current_section = 'skills'
                section_found = True
            elif any(cert_word in line_lower for cert_word in ['certification', 'certified', 'certificate']):
                current_section = 'certifications'
                section_found = True
            elif any(lang_word in line_lower for lang_word in ['language', 'fluent', 'native', 'proficient']):
                current_section = 'languages'
                section_found = True
        if current_section:
            current_content.append(line)
    if current_section and current_content:
        sections[current_section] = '\n'.join(current_content)
    return sections

def extract_education(text: str) -> List[str]:
    """Extract education information from text."""
    education = []
    edu_patterns = [
        r'(?i)(bachelor|master|phd|b\.?s\.?|m\.?s\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech)',
        r'(?i)(university|college|institute|school)',
        r'(?i)(xth|xiith|high school|secondary school)',
        r'(?i)(diploma|certificate)',
        r'(?i)(ssc|hsc|cbse|icse)'
    ]
    
    lines = text.split('\n')
    current_edu = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if line contains education indicators
        is_education = any(re.search(pattern, line) for pattern in edu_patterns)
        
        # Skip lines that are clearly project-related
        is_project = any(keyword in line.lower() for keyword in [
            'developed', 'project', 'platform', 'solution', 'application',
            'integrated', 'implemented', 'created', 'built', 'designed'
        ])
        
        if is_education and not is_project:
            if current_edu:
                education.append(' '.join(current_edu))
                current_edu = []
            current_edu.append(line)
        elif current_edu and not is_project:
            if not any(keyword in line.lower() for keyword in [
                'developed', 'project', 'platform', 'solution', 'application',
                'integrated', 'implemented', 'created', 'built', 'designed'
            ]):
                current_edu.append(line)
    
    if current_edu:
        education.append(' '.join(current_edu))
    
    return education

def extract_experience(text):
    """Extract experience information"""
    experience = []
    exp_patterns = [
        r'(\d+)\s*(?:years?|yrs?)\s*(?:of)?\s*experience',
        r'experience:\s*(\d+)\s*(?:years?|yrs?)',
        r'(\d+)\s*(?:years?|yrs?)\s*(?:in)?\s*the\s*field'
    ]
    
    lines = text.split('\n')
    current_exp = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if line contains experience indicators
        is_experience = any(re.search(pattern, line) for pattern in exp_patterns) or any(keyword in line.lower() for keyword in [
            'developer', 'engineer', 'analyst', 'consultant', 'manager',
            'intern', 'internship', 'worked', 'working', 'responsibilities'
        ])
        
        if is_experience:
            if current_exp:
                experience.append(' '.join(current_exp))
                current_exp = []
            current_exp.append(line)
        elif current_exp:
            current_exp.append(line)
    
    if current_exp:
        experience.append(' '.join(current_exp))
    
    return experience

def extract_skills(text):
    """Extract skills from text"""
    skills = []
    skill_categories = {
        'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'c', 'sql'],
        'web': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'next.js', 'tailwind', 'bootstrap'],
        'database': ['mongodb', 'mysql', 'postgresql', 'oracle', 'firebase'],
        'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes'],
        'ml': ['tensorflow', 'pytorch', 'scikit-learn', 'opencv', 'resnet'],
        'mobile': ['android', 'ios', 'react native', 'flutter'],
        'tools': ['git', 'github', 'jira', 'jenkins', 'linux', 'unix']
    }
    
    # First try to extract skills from bullet points or lists
    lines = text.split('\n')
    for line in lines:
        line = line.strip().lower()
        if line.startswith(('•', '◦', '-', '*', '○')):
            for category, tech_skills in skill_categories.items():
                for skill in tech_skills:
                    if skill in line:
                        skills.append(skill)
    
    # If no skills found in bullet points, search in the entire text
    if not skills:
        text_lower = text.lower()
        for category, tech_skills in skill_categories.items():
            for skill in tech_skills:
                if skill in text_lower:
                    skills.append(skill)
    
    return list(set(skills))

def extract_certifications(text):
    """Extract certification information"""
    certifications = []
    cert_patterns = [
        r'(?i)certification',
        r'(?i)certified',
        r'(?i)certificate'
    ]
    
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if any(re.search(pattern, line) for pattern in cert_patterns):
            # Clean up the certification entry
            cert = re.sub(r'[•◦○-]', '', line).strip()
            if cert:
                certifications.append(cert)
    
    return certifications

def extract_languages(text):
    """Extract language proficiency information"""
    languages = []
    lang_patterns = [
        r'(?i)language',
        r'(?i)fluent',
        r'(?i)native',
        r'(?i)proficient'
    ]
    
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if any(re.search(pattern, line) for pattern in lang_patterns):
            # Clean up the language entry
            lang = re.sub(r'[•◦○-]', '', line).strip()
            if lang:
                languages.append(lang)
    
    return languages

def calculate_education_level(education):
    """Calculate education level score (0-3)"""
    if not education:
        return 0
    
    if isinstance(education, list):
        education_text = ' '.join(education).lower()
    else:
        education_text = str(education).lower()
    
    if any(word in education_text for word in ['phd', 'doctorate']):
        return 3
    elif any(word in education_text for word in ['master', 'm.s.', 'm.tech', 'mba']):
        return 2
    elif any(word in education_text for word in ['bachelor', 'b.s.', 'b.tech', 'b.e.']):
        return 1
    else:
        return 0

def calculate_years_experience(experience):
    """Calculate years of experience"""
    if not experience:
        return 0
    
    if isinstance(experience, list):
        experience_text = ' '.join(experience)
    else:
        experience_text = str(experience)
    
    # Extract numbers from experience strings
    years = []
    for exp in experience_text.split():
        match = re.search(r'(\d+)', exp)
        if match:
            years.append(int(match.group(1)))
    
    return max(years) if years else 0

def calculate_skills_match(skills):
    """Calculate skills match score (0-1)"""
    if not skills:
        return 0
    
    if isinstance(skills, list):
        skills_text = ' '.join(skills).lower()
    else:
        skills_text = str(skills).lower()
    
    # Define required skills
    required_skills = {
        'programming': ['python', 'java', 'javascript', 'c++', 'c#'],
        'web': ['html', 'css', 'react', 'angular', 'vue'],
        'database': ['sql', 'mysql', 'postgresql', 'mongodb'],
        'cloud': ['aws', 'azure', 'gcp']
    }
    
    # Count matches in each category
    matches = 0
    total = 0
    
    for category, required in required_skills.items():
        category_matches = sum(1 for skill in required if skill in skills_text)
        matches += category_matches
        total += len(required)
    
    return matches / total if total > 0 else 0

def calculate_project_complexity(experience):
    """Calculate project complexity score (0-3)"""
    if not experience:
        return 0
    
    if isinstance(experience, list):
        text = ' '.join(experience)
    else:
        text = str(experience)
    
    # Look for project-related keywords and indicators
    project_indicators = {
        'complex': ['architecture', 'design', 'lead', 'manage', 'implement'],
        'medium': ['develop', 'create', 'build', 'integrate'],
        'basic': ['assist', 'support', 'maintain']
    }
    
    score = 0
    text_lower = text.lower()
    
    for complexity, keywords in project_indicators.items():
        for keyword in keywords:
            if keyword in text_lower:
                if complexity == 'complex':
                    score += 3
                elif complexity == 'medium':
                    score += 2
                else:
                    score += 1
    
    return min(score, 3)  # Cap at 3 