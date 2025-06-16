import re
from pdfminer.high_level import extract_text
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import logging
import io

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.download('punkt')
    nltk.download('stopwords')
except Exception as e:
    logger.error(f"Error downloading NLTK data: {str(e)}")

def parse_resume(file):
    """Parse resume file and extract relevant information"""
    try:
        logger.debug("Starting resume parsing")
        
        # Read file content
        file_content = file.read()
        logger.debug(f"Read file content, size: {len(file_content)} bytes")
        
        # Create a file-like object from the content
        file_obj = io.BytesIO(file_content)
        
        # Extract text from PDF
        logger.debug("Extracting text from PDF")
        text = extract_text(file_obj)
        logger.debug(f"Extracted text length: {len(text)} characters")
        
        if not text:
            raise ValueError("No text could be extracted from the PDF")
        
        # Extract basic information
        skills = extract_skills(text)
        education = extract_education(text)
        experience = extract_experience(text)
        
        # Calculate derived metrics
        education_level = calculate_education_level(education)
        years_experience = calculate_years_experience(experience)
        skills_match = calculate_skills_match(skills)
        project_complexity = calculate_project_complexity(text)
        
        info = {
            'text': text,
            'skills': skills,
            'education': education,
            'experience': experience,
            'education_level': education_level,
            'years_experience': years_experience,
            'skills_match': skills_match,
            'project_complexity': project_complexity
        }
        
        logger.debug(f"Parsing completed successfully")
        return info
        
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise

def extract_skills(text):
    """Extract skills from text"""
    skills = []
    # Common programming languages and technologies
    skill_patterns = [
        r'\b(python|java|javascript|c\+\+|c#|ruby|php)\b',
        r'\b(html|css|react|angular|vue|node\.js)\b',
        r'\b(sql|mysql|postgresql|mongodb|oracle)\b',
        r'\b(aws|azure|gcp|docker|kubernetes)\b'
    ]
    
    for pattern in skill_patterns:
        matches = re.finditer(pattern, text.lower())
        skills.extend([match.group() for match in matches])
    
    return list(set(skills))

def extract_education(text):
    """Extract education information"""
    education = []
    edu_patterns = [
        r'(?i)(bachelor|master|phd|b\.?s\.?|m\.?s\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech)',
        r'(?i)(university|college|institute|school)',
        r'(?i)(xth|xiith|high school|secondary school)'
    ]
    
    # Split text into lines and process each line
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
            # Only add non-project related lines to current education entry
            if not any(keyword in line.lower() for keyword in [
                'developed', 'project', 'platform', 'solution', 'application',
                'integrated', 'implemented', 'created', 'built', 'designed'
            ]):
                current_edu.append(line)
    
    # Add the last education entry if exists
    if current_edu:
        education.append(' '.join(current_edu))
    
    # Clean up education entries
    cleaned_education = []
    for edu in education:
        # Remove any remaining project-related content
        edu_lines = edu.split('.')
        edu_lines = [line.strip() for line in edu_lines if line.strip()]
        edu_lines = [line for line in edu_lines if not any(keyword in line.lower() for keyword in [
            'developed', 'project', 'platform', 'solution', 'application',
            'integrated', 'implemented', 'created', 'built', 'designed'
        ])]
        if edu_lines:
            cleaned_education.append('. '.join(edu_lines))
    
    return cleaned_education

def extract_experience(text):
    """Extract experience information"""
    experience = []
    exp_patterns = [
        r'(\d+)\s*(?:years?|yrs?)\s*(?:of)?\s*experience',
        r'experience:\s*(\d+)\s*(?:years?|yrs?)',
        r'(\d+)\s*(?:years?|yrs?)\s*(?:in)?\s*the\s*field'
    ]
    
    for pattern in exp_patterns:
        matches = re.finditer(pattern, text.lower())
        experience.extend([match.group() for match in matches])
    
    return list(set(experience))

def calculate_education_level(education):
    """Calculate education level score (0-3)"""
    if not education:
        return 0
    
    education_text = ' '.join(education).lower()
    
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
    
    # Extract numbers from experience strings
    years = []
    for exp in experience:
        match = re.search(r'(\d+)', exp)
        if match:
            years.append(int(match.group(1)))
    
    return max(years) if years else 0

def calculate_skills_match(skills):
    """Calculate skills match score (0-1)"""
    if not skills:
        return 0
    
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
        category_matches = sum(1 for skill in skills if skill.lower() in required)
        matches += category_matches
        total += len(required)
    
    return matches / total if total > 0 else 0

def calculate_project_complexity(text):
    """Calculate project complexity score (0-3)"""
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