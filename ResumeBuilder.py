class ResumeGenerator:
    def __init__(self):
        self.personal_info = {}
        self.education = []      # list of dictionaries
        self.experience = []     # list of dictionaries
        self.skills = {}         # dictionary with keys: languages, libraries, tools, databases
        self.projects = []       # list of dictionaries
        self.honors = []         # list of dictionaries (text and link)

    def latex_char_escape(self, text):
        escape_dict = {
                "&": "\\&",
                "%": "\\%",
                "$": "\\$",
                "#": "\\#",
                "_": "\\_",
                "{": "\\{",
                "}": "\\}",
                "~": "\\textasciitilde{}",
                "^": "\\^{}",
                "\\": "\\textbackslash{}",
                "<": "\\textless{}",
                ">": "\\textgreater{}",
        }

        if text:
            if type(text) == list:
                text = ["".join(escape_dict.get(c, c) for c in t) for t in text]
                return text
            else:
                return "".join(escape_dict.get(c, c) for c in text)
        else:
            return text 

    def set_personal_info(self, first_name, last_name, email, phone, address, job_title,
                          github=None, linkedin=None, leetcode=None, codechef=None, codeforces=None, portfolio=None):
        self.personal_info = {
            "first_name":  self.latex_char_escape(first_name),
            "last_name":  self.latex_char_escape(last_name),
            "email":  self.latex_char_escape(email),
            "phone":  self.latex_char_escape(phone),
            "address":  self.latex_char_escape(address),
            "job_title":  self.latex_char_escape(job_title),
            "github":  self.latex_char_escape(github),
            "linkedin":  self.latex_char_escape(linkedin),
            "leetcode":  self.latex_char_escape(leetcode),
            "codechef":  self.latex_char_escape(codechef),
            "codeforces":  self.latex_char_escape(codeforces),
            "portfolio":  self.latex_char_escape(portfolio)
        }

    def add_education(self, institution, location, degree_type, field_of_study,
                      start_date, end_date, score, score_type):
        edu = {
            "institution": self.latex_char_escape(institution),
            "location": self.latex_char_escape(location),
            "degree_type": self.latex_char_escape(degree_type),
            "field_of_study": self.latex_char_escape(field_of_study),
            "start_date": self.latex_char_escape(start_date),
            "end_date": self.latex_char_escape(end_date),
            "score": self.latex_char_escape(score),
            "score_type": self.latex_char_escape(score_type)
        }
        self.education.append(edu)

    def add_experience(self, employer, job_title, start_date, end_date, location, description):
        exp = {
            "employer": self.latex_char_escape(employer),
            "job_title": self.latex_char_escape(job_title),
            "start_date": self.latex_char_escape(start_date),
            "end_date": self.latex_char_escape(end_date),
            "location": self.latex_char_escape(location),
            "description": self.latex_char_escape(description)  # description can be a list of bullet points or a string
        }
        self.experience.append(exp)

    def set_skills(self, languages=None, libraries=None, tools=None, databases=None):
        self.skills = {
            "languages": self.latex_char_escape(languages) if languages else [],
            "libraries": self.latex_char_escape(libraries) if libraries else [],
            "tools": self.latex_char_escape(tools) if tools else [],
            "databases": self.latex_char_escape(databases) if databases else []
        }

    def add_project(self, project_name, technologies, link, description):
        proj = {
            "project_name": self.latex_char_escape(project_name),
            "technologies": self.latex_char_escape(technologies),
            "link": self.latex_char_escape(link),
            "description": self.latex_char_escape(description)  # description can be a list of bullet points or a string
        }
        self.projects.append(proj)

    def add_honor(self, text, link=None):
        honor = {
            "text": self.latex_char_escape(text),
            "link": self.latex_char_escape(link)
        }
        self.honors.append(honor)

    def generate_latex(self):
        latex_parts = []

        # Preamble and definitions
        latex_parts.append(r"""\documentclass[a4paper]{article}
\usepackage{fullpage}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{textcomp}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[hidelinks]{hyperref}
\usepackage[left=2cm, right=2cm, top=2cm]{geometry}
\usepackage{longtable}
\textheight=10in
\pagestyle{empty}
\raggedright

\def\bull{\vrule height 0.8ex width .7ex depth -.1ex }

% DEFINITIONS FOR RESUME %%%%%%%%%%%%%%%%%%%%%%%
\newcommand{\header}[1]{
  {\hspace*{-18pt}\vspace*{6pt} \textsc{#1}}
  \vspace*{-6pt} \\ \hspace*{-18pt}\hrulefill \\}
  
\newcommand{\contact}[3]{
  \begin{center}
    {\Huge \scshape {#1}}\\
    #2 \\ #3
  \end{center}}
  
% END RESUME DEFINITIONS %%%%%%%%%%%%%%%%%%%%%%%
\begin{document}
\vspace*{-40pt}
""")

        # Personal Information
        if self.personal_info:
            pi = self.personal_info
            full_name = f"{pi.get('first_name', '')} {pi.get('last_name', '')}"
            # Combine available links
            links = []
            if pi.get("github"):
                links.append(r"\textbf{\href{" + pi["github"] + r"}{GitHub}}")
            if pi.get("linkedin"):
                links.append(r"\textbf{\href{" + pi["linkedin"] + r"}{Linkedin}}")
            if pi.get("leetcode"):
                links.append(r"\textbf{\href{" + pi["leetcode"] + r"}{LeetCode}}")
            if pi.get("codechef"):
                links.append(r"\textbf{\href{" + pi["codechef"] + r"}{CodeChef}}")
            if pi.get("codeforces"):
                links.append(r"\textbf{\href{" + pi["codeforces"] + r"}{CodeForces}}")
            if pi.get("portfolio"):
                links.append(r"\textbf{\href{" + pi["portfolio"] + r"}{Portfolio}}")
            links_str = " | ".join(links)
            latex_parts.append(r"\begin{center}")
            latex_parts.append(r"{\Huge \scshape {" + full_name + r"}}\\")
            latex_parts.append(pi.get("job_title", "") + r"\\")
            latex_parts.append(pi.get("email", "") + r" | " + pi.get("phone", "") + r" | " + pi.get("address", "") + r"\\")
            latex_parts.append(links_str)
            latex_parts.append(r"\end{center}" + "\n")

        # Education Section
        if self.education:
            latex_parts.append(r"\header{Education}")
            for edu in self.education:
                edu_str = (f"\\textbf{{{edu['institution']}}} \\hfill {edu['location']}\\\\\n"
                           f"{edu['degree_type']} in {edu['field_of_study']} \\hfill {edu['start_date']} - {edu['end_date']}\\\\\n"
                           f"{{\\sl {edu['score_type']}: {edu['score']}}}\\\\[2mm]")
                latex_parts.append(edu_str)

        # Experience Section
        if self.experience:
            latex_parts.append(r"\header{Experience}\vspace{2mm}")
            for exp in self.experience:
                exp_str = (f"\\textbf{{{exp['employer']}}} | {exp['job_title']} \\hfill {exp['start_date']} - {exp['end_date']} \\hfill {exp['location']}\\\\\n")
                if isinstance(exp['description'], list):
                    exp_str += r"\begin{itemize}" + "\n"
                    for bullet in exp['description']:
                        exp_str += f"\\item {bullet}\n"
                    exp_str += r"\end{itemize}" + "\n"
                else:
                    exp_str += exp['description'] + "\n"
                latex_parts.append(exp_str)

        # Skills Section
        if self.skills and any(self.skills.values()):
            latex_parts.append(r"\header{Skills}")
            skills_lines = []
            if self.skills.get("languages"):
                skills_lines.append("Programming Languages: & " + ", ".join(self.skills["languages"]))
            if self.skills.get("libraries"):
                skills_lines.append("Libraries/Frameworks: & " + ", ".join(self.skills["libraries"]))
            if self.skills.get("tools"):
                skills_lines.append("Tools/Platforms: & " + ", ".join(self.skills["tools"]))
            if self.skills.get("databases"):
                skills_lines.append("Databases: & " + ", ".join(self.skills["databases"]))
            latex_parts.append("\\vspace{2mm}\\begin{longtable}{p{4cm}p{12cm}}\n" +
                               " \\\\ \n".join(skills_lines) +
                               "\n\\end{longtable}\\vspace{1mm}\n")

        # Projects Section
        if self.projects:
            latex_parts.append(r"\header{Projects / Open-Source}")
            for proj in self.projects:
                proj_str = (f"\\textbf{{{proj['project_name']}}} | \\href{{{proj['link']}}}{{Link}} \\hfill"
                            f"{{\\sl {proj['technologies']}}}\\\\\n")
                if isinstance(proj['description'], list):
                    proj_str += r"\begin{itemize}" + "\n"
                    for bullet in proj['description']:
                        proj_str += f"\\item {bullet}\n"
                    proj_str += r"\end{itemize}" + "\n"
                else:
                    proj_str += proj['description'] + "\n"
                latex_parts.append(proj_str)

        # Honors & Awards Section
        if self.honors:
            latex_parts.append(r"\header{Honors \& Awards}")
            for honor in self.honors:
                if honor.get("link"):
                    honor_str = f"\\href{{{honor['link']}}}{{{honor['text']}}}\\\\\n"
                else:
                    honor_str = honor["text"] + r"\\"
                latex_parts.append(honor_str)

        # End document
        latex_parts.append(r"\end{document}")

        return "\n".join(latex_parts)


# ----------------------
# Sample usage
# ----------------------
if __name__ == "__main__":
    resume = ResumeGenerator()

    # Personal Info
    resume.set_personal_info(
        first_name="Pushpender",
        last_name="Singh",
        email="singhpushpender6387@gmail.com",
        phone="+916387543965",
        address="Delhi, India",
        job_title="Software Engineer",
        github="https://github.com/pushpenderindia",
        linkedin="https://linkedin.com/in/pushpenderindia",
        leetcode="https://leetcode.com/u/pushu_singh",
        codechef="https://www.codechef.com/users/singhindia",
        codeforces="https://codeforces.com/profile/pushpenderindia",
        portfolio=None  # If you don't have a portfolio link, you can set it to None
    )

    # Education
    resume.add_education(
        institution="Guru Gobind Singh Indraprastha University",
        location="New Delhi, India",
        degree_type="Bachelor of Technology",
        field_of_study="Computer Science with Specialization in AI-ML",
        start_date="November 2021",
        end_date="July 2025",
        score="8.2",
        score_type="CGPA"
    )

    # Experience
    resume.add_experience(
        employer="Upwork",
        job_title="Software Developer Freelancer",
        start_date="May 2021",
        end_date="Present",
        location="Remote",
        description=[
            "Engineered 250+ Websites & Android apps using various technologies.",
            "Collaborated with over 50+ global clients achieving 100% Job Success Score.",
            "Optimized app performance, reducing load time by 30%."
        ]
    )
    resume.add_experience(
        employer="rtCamp",
        job_title="Software Engineer Trainee",
        start_date="July 2024",
        end_date="September 2024",
        location="Remote",
        description=[
            "Developed custom WordPress themes and plugins.",
            "Built web applications using React.js and headless WordPress.",
            "Ensured code quality with PHP Code Sniffer achieving a 95% compliance rate."
        ]
    )

    # Skills
    resume.set_skills(
        languages=["Python", "PHP", "Kotlin", "C", "C++", "Java", "JavaScript"],
        libraries=["HTML", "CSS", "React.js", "Astro.js", "Next.js", "Tailwind", "Bootstrap", "TypeScript"],
        tools=["Git", "Jenkins", "Docker", "Postman", "Bitbucket", "AWS", "GCP"],
        databases=["Mongodb", "MySQL", "PostgreSQL", "Sqlite", "Airtable", "Cassandra"]
    )

    # Projects
    resume.add_project(
        project_name="Social2Amazon",
        technologies="React, Tailwind, TypeScript, Django, PostgreSQL, Gemini API, Tesseract OCR",
        link="https://amazonsmbhav2024.hackerearth.com/",
        description=[
            "Architected AI-powered platform that won 1st Runner-Up at Amazon Smbhav Hackathon.",
            "Automated conversion of social media posts into Amazon listings, reducing manual effort by 95%."
        ]
    )
    resume.add_project(
        project_name="StoryScape",
        technologies="Celery, Redis, Mistral 7B, Django, Tailwind, PostgreSQL, Intel oneAPI",
        link="https://devpost.com/software/storyscape-znf1xm",
        description=[
            "Led a team to build an AI-powered Comic/Manga Generator in under 30 seconds.",
            "Presented unique technical solutions resulting in winning the competition among 1063+ teams."
        ]
    )

    # Honors & Awards
    resume.add_honor(
        text="9x Global Hackathon Winner: https://github.com/PushpenderIndia/Achievements",
        link="https://github.com/PushpenderIndia/Achievements"
    )
    resume.add_honor(
        text="Top Rated (Top 10%) Freelancer",
        link=None
    )
    resume.add_honor(
        text="1st Runner-Up in Amazon Sambhav Hackathon",
        link=None
    )
    resume.add_honor(
        text="Leetcode (Top 1%) 2,282+ Contest Rating",
        link=None
    )

    # Generate and print the LaTeX code
    latex_resume = resume.generate_latex()
    with open("resume_1.tex", "w") as f:
        f.write(latex_resume)
    print(latex_resume)
