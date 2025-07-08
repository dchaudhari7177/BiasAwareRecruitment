# BiasAwareRecruitment: Ethical AI-Powered Recruitment System

[![Research Paper](https://img.shields.io/badge/Research-Paper-blue)](http://dx.doi.org/10.13140/RG.2.2.11411.80163)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.2.5-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Overview

**BiasAwareRecruitment** is an innovative AI-powered recruitment system designed to address the critical ethical challenges of algorithmic bias in hiring processes. This project implements the **FATE (Fairness, Accountability, Transparency, and Ethics)** framework to ensure responsible AI deployment in recruitment.

### 🎯 Research Foundation

This project is based on the research paper: **"Bias in AI Recruitment Systems: An Ethical Evaluation of Algorithmic Hiring Tools"** by Dipak Rajendra Chaudhari (PES University, Bangalore). The research examines the ethical implications of AI-based hiring tools and proposes solutions for developing transparent, accountable, and inclusive recruitment technologies.

**📄 Research Paper:** [DOI: 10.13140/RG.2.2.11411.80163](http://dx.doi.org/10.13140/RG.2.2.11411.80163)

## 🌟 Key Features

### 🤖 AI-Powered Resume Analysis
- **Intelligent Resume Parsing**: Advanced PDF text extraction and structured data analysis
- **Skills Assessment**: Automated technical skills evaluation and matching
- **Experience Quantification**: Years of experience calculation and project complexity analysis
- **Education Level Assessment**: Automated education qualification scoring

### ⚖️ Bias Detection & Mitigation
- **Demographic Parity Analysis**: Ensures equal selection rates across protected groups
- **Equal Opportunity Evaluation**: Measures fairness in positive outcome distribution
- **Predictive Parity Assessment**: Evaluates prediction accuracy across demographic groups
- **Real-time Bias Monitoring**: Continuous bias detection and alerting

### 🔍 Transparency & Explainability
- **Decision Transparency**: Clear explanation of AI decision-making processes
- **Bias Report Generation**: Comprehensive bias analysis reports
- **Audit Trail**: Complete logging of all system decisions and modifications
- **Model Cards**: Detailed documentation of model behavior and limitations

### 🛡️ Ethical Framework Implementation
- **FATE Compliance**: Full implementation of Fairness, Accountability, Transparency, and Ethics
- **Human-in-the-Loop**: Maintains human oversight in final hiring decisions
- **Privacy Protection**: Secure handling of sensitive candidate data
- **Regulatory Compliance**: Alignment with anti-discrimination and employment laws

## 🏗️ System Architecture

```
BiasAwareRecruitment/
├── backend/                 # Flask API Server
│   ├── app.py              # Main Flask application
│   ├── model/              # AI/ML Models
│   │   ├── fairness.py     # Bias detection algorithms
│   │   ├── predict.py      # Candidate prediction model
│   ├── utils/              # Utility functions
│   │   ├── resume_parser.py # Resume parsing engine
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── App.js          # Main React application
│   └── package.json        # Node.js dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dchaudhari7177/BiasAwareRecruitment.git
   cd BiasAwareRecruitment
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server**
   ```bash
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 📊 Usage Guide

### 1. Resume Upload & Analysis
- Navigate to the **Upload** page
- Upload a PDF resume
- View automated analysis results including:
  - Skills assessment
  - Experience evaluation
  - Education level scoring
  - Overall candidate score

### 2. Bias Analysis
- Access the **Bias Analysis** page
- Upload datasets for fairness evaluation
- View comprehensive bias reports including:
  - Demographic parity metrics
  - Equal opportunity analysis
  - Bias pattern detection
  - Recommendations for bias mitigation

### 3. Dashboard
- Monitor system performance
- View fairness metrics over time
- Access bias detection alerts
- Generate compliance reports

## 🔬 Technical Implementation

### AI/ML Stack
- **Natural Language Processing**: NLTK, spaCy for text analysis
- **Machine Learning**: scikit-learn for prediction models
- **Fairness Metrics**: Fairlearn, AIF360 for bias detection
- **Data Processing**: Pandas, NumPy for data manipulation

### Web Technologies
- **Backend**: Flask (Python) with RESTful API
- **Frontend**: React.js with Material-UI
- **Data Visualization**: Recharts for bias reporting
- **API Communication**: Axios for HTTP requests

### Bias Detection Algorithms
- **Demographic Parity**: Ensures equal selection rates
- **Equal Opportunity**: Measures fairness in positive outcomes
- **Predictive Parity**: Evaluates prediction accuracy
- **Statistical Parity**: Analyzes overall fairness metrics

## 📈 Ethical Framework (FATE)

### 🎯 Fairness
- **Protected Attributes**: Gender, race, age, disability status
- **Fairness Metrics**: Demographic parity, equal opportunity, predictive parity
- **Bias Thresholds**: Configurable fairness thresholds for different metrics

### 📋 Accountability
- **Decision Logging**: Complete audit trail of all AI decisions
- **Responsibility Assignment**: Clear ownership of system outcomes
- **Redress Mechanisms**: Processes for addressing unfair outcomes

### 🔍 Transparency
- **Explainable AI**: Clear reasoning for all predictions
- **Model Documentation**: Comprehensive model cards and documentation
- **Open Source**: Transparent codebase and algorithms

### ⚖️ Ethics
- **Human Oversight**: Human-in-the-loop decision making
- **Privacy Protection**: Secure handling of sensitive data
- **Regulatory Compliance**: Alignment with employment laws

## 📚 Research Contributions

This project addresses key findings from the research paper:

### 🚨 Bias Detection
- **Amazon Case Study**: Addresses gender bias in resume screening
- **HireVue Analysis**: Examines cultural and linguistic bias
- **Systematic Bias**: Identifies patterns across multiple AI hiring tools

### 🛠️ Technical Solutions
- **Adversarial Debiasing**: Implementation of fairness-aware algorithms
- **Data Diversity**: Representative training data requirements
- **Continuous Monitoring**: Real-time bias detection systems

### 📋 Best Practices
- **Diverse Training Data**: Ensuring representative datasets
- **Regular Bias Audits**: Systematic fairness testing
- **Human Oversight**: Maintaining human decision-making authority
- **Transparency**: Explainable AI and clear documentation

## 🔬 Case Studies Addressed

| Case Study | Bias Type | Solution Implemented |
|------------|-----------|---------------------|
| Amazon's Recruitment Tool | Gender bias | Protected attribute detection |
| HireVue Video Interviews | Cultural/linguistic bias | Multi-modal fairness analysis |
| General AI Hiring Tools | Multiple biases | Comprehensive bias framework |

## 📊 Performance Metrics

### Fairness Metrics
- **Demographic Parity Difference**: < 0.05
- **Equal Opportunity Difference**: < 0.05
- **Predictive Parity**: > 0.95 accuracy across groups

### System Performance
- **Resume Processing**: < 30 seconds per resume
- **Bias Analysis**: < 60 seconds for dataset evaluation
- **API Response Time**: < 2 seconds average

## 🤝 Contributing

We welcome contributions to improve the ethical AI recruitment system:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the FATE framework principles
- Include comprehensive testing for bias detection
- Document all changes and their ethical implications
- Ensure transparency in all modifications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍🎓 Author

**Dipak Rajendra Chaudhari**
- **Institution**: PES University, Bangalore
- **Department**: Computer Science
- **Email**: pes1ug24cs804@pesu.pes.edu
- **Research Paper**: [DOI: 10.13140/RG.2.2.11411.80163](http://dx.doi.org/10.13140/RG.2.2.11411.80163)

## 🙏 Acknowledgments

- **Open Source Community**: Contributors to Fairlearn, AIF360, and other fairness libraries
- **Ethical AI Community**: Researchers working on responsible AI deployment

## 📞 Contact

For questions, suggestions, or collaboration opportunities:

- **Email**: pes1ug24cs804@pesu.pes.edu
- **Research Paper**: [http://dx.doi.org/10.13140/RG.2.2.11411.80163](http://dx.doi.org/10.13140/RG.2.2.11411.80163)
- **GitHub Issues**: [Create an issue](https://github.com/dchaudhari7177/BiasAwareRecruitment/issues)

---

**⚠️ Important Notice**: This system is designed for research and educational purposes. When deploying in production environments, ensure compliance with local employment laws and regulations regarding AI-assisted hiring decisions.

**🔬 Research Citation**: If you use this system in your research, please cite:
```
Chaudhari, D. R. (2025). Bias in AI Recruitment Systems: An Ethical Evaluation of Algorithmic Hiring Tools. 
PES University, Bangalore. DOI: 10.13140/RG.2.2.11411.80163
```
