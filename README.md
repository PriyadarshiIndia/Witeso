# Witeso

Witeso is an all-in-one upskilling platform designed to empower users by providing a comprehensive suite of tools and learning modules to master technical and non-technical skills. Whether you're preparing for technical interviews, improving your coding skills, or honing your web development abilities, Witeso offers everything you need in one centralized platform.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Comprehensive Learning and Assessment
- **Company-wise DSA Problems:** Practice data structures and algorithms problems tailored to company-specific requirements.
- **DSA Sheet:** Access a curated and comprehensive DSA sheet covering essential topics.
- **Built-in Browser-based Code Runner:** Write, test, and debug your code directly in the browser.
- **Aptitude Mock Tests:** Prepare with realistic aptitude tests designed to simulate real interview scenarios.

### Career and Professional Development
- **ATS-friendly Resume Builder:** Create professional resumes optimized for applicant tracking systems.
- **AI-powered Resume Reviewer:** Get intelligent feedback on your resume using an open-source LLM model (Deepseek) for resume feedback.
- **HR Email Finder:** Find and validate HR email addresses by checking hiring statuses and ensuring you send your CV to the right person.
- **Centralized Coding Profile:** Manage and showcase all your coding achievements in one place.
- **Witeso Card & Sharable Certificates:** Share your progress and achievements with customizable Witeso cards and certificates.

### Gamified Web Development Learning
- **CSS Games:** Engage in interactive, gamified learning modules to master web development through hands-on practice.

---

## Technology Stack

### Backend
- **Flask:** Python web framework for building robust server-side applications.
- **MongoDB:** NoSQL database for flexible and scalable data storage.
- **Judge0:** Integrated code judging system for real-time code evaluation.

### Frontend
- **Astro.js:** Modern framework for building fast, optimized, and highly interactive user interfaces.

### Hosting and Authentication
- **Vercel:** Hosting platform for seamless deployment and scalability.
- **Google OAuth & Supabase:** Secure and reliable authentication solutions to manage user identities.

### AI and Open Source Integrations
- **Deepseek:** Open-source LLM model used for resume feedback, HR email discovery, and analyzing hiring patterns.

---

## Installation and Setup

### Prerequisites
- Python 3.7+
- Node.js and npm (for Astro.js frontend)
- MongoDB instance (local or cloud-based)
- Vercel account (for hosting)
- Supabase account (for authentication)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone <URL>
   cd witeso
   ```

2. **Backend Setup:**
   - Create a virtual environment and install dependencies:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use: venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - Configure environment variables (e.g., database URL, OAuth credentials) in a `.env` file.
   - Run the Flask application:
     ```bash
     flask run
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory and install dependencies:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - Configure any necessary environment variables for Astro.js if required.

4. **Deployment:**
   - Follow Vercel’s documentation to deploy the frontend.
   - Ensure your backend is deployed and connected to the same environment variables as your local setup.

---

## Usage

- **Accessing the Platform:** Open your browser and navigate to the deployed Vercel URL for the frontend.
- **User Registration and Login:** Use Google OAuth or sign up using Supabase authentication.
- **Exploring Features:** Navigate through the dashboard to access coding challenges, resume tools, aptitude tests, and gamified learning modules.
- **Feedback and Resume Tools:** Utilize the integrated AI tools to receive personalized feedback on your resume and improve your application strategy.

## Team Mate

<table>
<tr>

<td align="center">
    <a href="https://github.com/PushpenderIndia">
        <kbd><img src="https://avatars3.githubusercontent.com/PushpenderIndia?size=400" width="100px;" alt=""/></kbd><br />
        <sub><b>Pushpender Singh</b></sub>
    </a><br />
    <a href="https://github.com/PriyadarshiIndia/Witeso/commits?author=PushpenderIndia" title="Code"> :computer: </a> 
</td>

<td align="center">
    <a href="https://github.com/PriyadarshiIndia">
        <kbd><img src="https://avatars3.githubusercontent.com/pri?size=400" width="100px;" alt=""/></kbd><br />
        <sub><b>Priyadarshi Anand</b></sub>
    </a><br />
    <a href="https://github.com/PriyadarshiIndia/Witeso/commits?author=PriyadarshiIndia" title="Code"> :computer: </a> 
</td>

<td align="center">
    <a href="https://github.com/khusburai28">
        <kbd><img src="https://avatars3.githubusercontent.com/khusburai28?size=400" width="100px;" alt=""/></kbd><br />
        <sub><b>Khusbu Rai</b></sub>
    </a><br />
    <a href="https://github.com/PriyadarshiIndia/Witeso/commits?author=khusburai28" title="Code"> :computer: </a> 
</td>
</tr>
</tr>
</table>


## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Witeso aims to be your one-stop solution for upskilling, interview preparation, and career growth. Enjoy your learning journey and happy coding!
