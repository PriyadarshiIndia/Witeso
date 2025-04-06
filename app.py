from flask import Flask, render_template, request, render_template_string, jsonify, url_for, session, redirect, send_file
import requests
import tempfile
import io
from urllib.parse import urlparse
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import json
from flask_caching import Cache
from flask import Response
from datetime import datetime
import hashlib
from flask_wtf.csrf import CSRFProtect, validate_csrf, CSRFError
from flask_cors import CORS
from JudgeCode import JudgeCode
from Striver_Plus import striver_plus_ques_list
from TCS_NQT import tcs_nqt_sections
from ResumeBuilder import ResumeGenerator

# PayU Credentials
PAYU_MERCHANT_KEY = "EAeGJA"
PAYU_MERCHANT_SALT = ""
PAYU_BASE_URL = "https://test.payu.in/_payment"

# Currency-Based Pricing
PRICING = {
    "INR": {"1_month": 20, "6_months": 100, "12_months": 180},
    "USD": {"1_month": 1, "6_months": 5, "12_months": 9},
    "EUR": {"1_month": 1.2, "6_months": 6, "12_months": 10},
    "GBP": {"1_month": 1, "6_months": 5, "12_months": 9},
    "AUD": {"1_month": 1.5, "6_months": 7.5, "12_months": 12},
    "CAD": {"1_month": 1.3, "6_months": 6.5, "12_months": 11},
    "JPY": {"1_month": 110, "6_months": 550, "12_months": 990},
    "CNY": {"1_month": 6, "6_months": 30, "12_months": 54}
}

judgeCode = JudgeCode()
# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

app.config['SECRET_KEY'] = 'rhamPUBlenTrUTHEMPLumAtexhAu'

# Configure MongoDB
app.config["MONGO_URI"] = os.environ.get('MONGODB_URI')

# Configure Flask session (to store user authentication details)
app.config['SESSION_COOKIE_NAME'] = 'supabase_session'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure it works only over HTTPS

app.config['CACHE_TYPE'] = 'simple'  # Simple in-memory cache
cache = Cache(app)
mongo = PyMongo(app)
csrf = CSRFProtect(app)

# Allow CORS only for witeso.com and its subdomains
CORS(app, origins=["https://www.witeso.com", "https://witeso.com", "https://*.witeso.com", "http://localhost:4321"], supports_credentials=True)

settings = {
    'colors': {
        'primary': '#f44336',
        'secondary': '#ff5722',
        'accent': '#ff9800'
    },
    'favicon': 'https://www.flaticon.com/svg/static/icons/svg/3523/3523063.svg'
}

companies_logo_map = {
    "bytedancetoutiao": "https://logo.clearbit.com/bytedance.com",
    "ge-digital": "https://logo.clearbit.com/ge.com",
    "deutsche-bank": "https://logo.clearbit.com/deutschebank.co.in",
    "hrt": "https://logo.clearbit.com/hudsonrivertrading.com",
    "iit-bombay": "https://logo.clearbit.com/iitb.ac.in",
    "palantir-technologies": "https://logo.clearbit.com/palantir.com",
    "ponyai": "https://logo.clearbit.com/pony.ai",
    "works-applications": "https://logo.clearbit.com/worksapplications.com",
    "jingchi": "https://placehold.co/150",
    "gilt-groupe": "https://logo.clearbit.com/gilt.com",
}

# -------------------------------
#   Single Sign-On (SSO)
# -------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_AUTH_URL = f"{SUPABASE_URL}/auth/v1"

@app.route("/login")
def login():
    """Redirect user to Supabase Google OAuth with query params instead of fragment"""
    redirect_to = request.args.get("redirect", "/")  # Default to homepage if no redirect param
    session["post_login_redirect"] = redirect_to  # Store in session

    google_oauth_url = f"{SUPABASE_AUTH_URL}/authorize?provider=google&redirect_to={url_for('callback', _external=True)}&scopes=openid email profile&flow_type=pkce"
    return redirect(google_oauth_url)

@app.route("/callback", endpoint="callback")
def callback():
    html_content = """
    <html>
    <head>
        <title>Processing Login - Witeso</title>
    </head>
    <body>
        <script>
            // Extract tokens from the URL fragment
            const fragment = window.location.hash.substring(1);
            const params = new URLSearchParams(fragment);
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            // Retrieve client location and other info from the IP API
            fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // Build parameters with URL encoding
                const location = encodeURIComponent(data.city + ', ' + data.country_name);
                const ip_addr = encodeURIComponent(data.ip);
                const currency = encodeURIComponent(data.currency);
                const timezone = encodeURIComponent(data.timezone);
                const org = encodeURIComponent(data.org);

                if (accessToken) {
                    // Construct the redirect URL with parameters
                    window.location.href = "/process_login?access_token=" + encodeURIComponent(accessToken)
                        + "&location=" + location
                        + "&ip_addr=" + ip_addr
                        + "&currency=" + currency
                        + "&timezone=" + timezone
                        + "&org=" + org;
                } else {
                    document.body.innerHTML = "<h2>Authentication failed. No access token received.</h2>";
                }
            })
            .catch(error => {
                console.error('Error fetching IP data:', error);
                document.body.innerHTML = "<h2>Error fetching location data.</h2>";
            });
        </script>
    </body>
    </html>
    """
    return render_template_string(html_content)

def authorized(access_token):
    headers = {"Authorization": f"Bearer {access_token}", "apikey": SUPABASE_ANON_KEY}
    response = requests.get(f"{SUPABASE_AUTH_URL}/user", headers=headers)
    
    if response.status_code != 200:
        return None
    
    user_info = response.json()
    if not user_info:
        return None
    
    email = user_info.get("email")
    user_id = user_info.get("id")
    full_name = user_info.get("user_metadata", {}).get("full_name", "User")
    picture  = user_info.get("user_metadata", {}).get("avatar_url", "/images/default-avatar.png")
    
    session["user"] = {
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "picture": picture
    }
    
    users_collection = mongo.db.users
    existing_user = users_collection.find_one({"user_id": user_id})
    auto_generated_username = email.split("@")[0]
    if not existing_user:
        plan_type = "Premium" if email.endswith("@ipu.ac.in") else "Freemium"
        credit = "Unlimited" if plan_type == "Premium" else 500
        
        auto_generated_username_count = users_collection.count_documents({"username": auto_generated_username})
        if auto_generated_username_count > 0:
            auto_generated_username = auto_generated_username + str(auto_generated_username_count)
        
        user_data = {
            "location": "",
            "user_id": user_id,
            "username": auto_generated_username,
            "name": full_name,
            "email": email,
            "picture": picture,
            "plan_type": plan_type,
            "credit": credit,
            "leetcode": "",
            "codechef": "",
            "codeforces": "",
            "codestudio": "",
            "geeksforgeeks": "",
            "interviewbit": "",
            "atcoder": "",
            "hackerrank": "",
            "hackerearth": "",
            "spoj": "",
            "linkedin": "",
            "github": "",
            "twitter": "",
            "facebook": "",
            "website": "",
            "bio": "",
            "tagline": "",
            "created_at": {
                "$date": datetime.now().isoformat()
            }
        }
        users_collection.insert_one(user_data)
    else:
        if existing_user.get("picture") != picture:
            users_collection.update_one({"user_id": user_id}, {"$set": {"picture": picture}})
        credit = existing_user.get("credit", 500)
        plan_type = existing_user.get("plan_type", "Freemium")
    
    session["credit"] = credit
    session["plan_type"] = plan_type

    if existing_user:
        session["user"]["username"] = existing_user.get("username", auto_generated_username)
    else:
        session["user"]["username"] = auto_generated_username
    return user_info

@app.route("/process_login")
def process_login():
    access_token = request.args.get("access_token")
    location     = request.args.get("location")
    ip_addr      = request.args.get("ip_addr")
    currency     = request.args.get("currency")
    timezone     = request.args.get("timezone")
    organization = request.args.get("org")
    if not access_token:
        return "Authentication failed. No access token received.", 400
    
    user_info = authorized(access_token)
    if not user_info:
        return "Failed to authenticate user.", 400
    else:
        # Update user location and IP address
        user_id = user_info.get("id")
        users_collection = mongo.db.users
        users_collection.update_one({"user_id": user_id}, {"$set": {"location": location, "ip_addr": ip_addr, "currency": currency, "timezone": timezone, "organization": organization}})

    # Retrieve post-login redirect URL, default to "/"
    redirect_url = session.pop("post_login_redirect", "/")
    return redirect(redirect_url)

@app.route("/api/user/<username>")
def get_user_by_username(username):
    want_to_edit = request.args.get("edit", False)
    if want_to_edit:
        user = session.get("user")
        if not user or user.get("username") != username:
            return jsonify({"error": "User not authenticated or unauthorized."}), 401

    user = mongo.db.users.find_one({"username": username})
    if user:
        return jsonify({
            "username": user.get("username", "default_user"),
            "name": user.get("name", "User"),
            "email": user.get("email"),
            "picture": user.get("picture", "/images/default-avatar.png"),
            "leetcode": user.get("leetcode", ""),
            "codechef": user.get("codechef", ""),
            "codeforces": user.get("codeforces", ""),
            "codestudio": user.get("codestudio", ""),
            "geeksforgeeks": user.get("geeksforgeeks", ""),
            "interviewbit": user.get("interviewbit", ""),
            "atcoder": user.get("atcoder", ""),
            "hackerrank": user.get("hackerrank", ""),
            "hackerearth": user.get("hackerearth", ""),
            "spoj": user.get("spoj", ""),
            "linkedin": user.get("linkedin", ""),
            "github": user.get("github", ""),
            "twitter": user.get("twitter", ""),
            "facebook": user.get("facebook", ""),
            "website": user.get("website", ""),
            "bio": user.get("bio", ""),
            "tagline": user.get("tagline", ""),
            "created_at": user.get("created_at", ""),
            "plan_type": user.get("plan_type", "Freemium"),
            "location": user.get("location", ""),
        })
    else:
        return jsonify({
            "name": "404 Not Found",
            "picture": "/images/default-avatar.png",
            "error": "User not found."  
        })

@app.route("/api/user")
def get_user():
    user = session.get("user")
    if user:
        return jsonify({
            "username": user.get("username", "default_user"),
            "logged_in": True,
            "name": user.get("full_name", "User"),
            "email": user.get("email"),
            "picture": user.get("picture", "/images/default-avatar.png"),
        })
    else:
        return jsonify({"logged_in": False})

## Payment Routes
@csrf.exempt
@app.route("/api/get_pro_pricing")
def get_pro_pricing():
    return jsonify(
        {
        "INR": "20 INR/month",
        "USD": "1 USD/month",
        "EUR": "1.2 EUR/month",
        "GBP": "1 GBP/month",
        "AUD": "1.5 AUD/month",
        "CAD": "1.3 CAD/month",
        "JPY": "110 JPY/month",
        "CNY": "6 CNY/month"
      }
    )

@app.route('/api/test')
def test():
    return render_template('test.html', currencies=PRICING.keys())

@csrf.exempt
@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    user_email = session.get("user").get("email")
    if not user_email:
        return "User not logged in!", 401

    currency = request.form["currency"]
    plan = request.form["plan"]

    if currency not in PRICING or plan not in PRICING[currency]:
        return "Invalid Plan or Currency!", 400

    price = PRICING[currency][plan]
    duration = int(plan.split("_")[0]) * 30  # Convert months to days
    txnid = "txn" + hashlib.sha256(user_email.encode()).hexdigest()[:10]

    # Generate PayU Hash
    hash_sequence = f"{PAYU_MERCHANT_KEY}|{txnid}|{price}|Witeso Pro {plan}|{user_email}|{user_email}|||||||||||{PAYU_MERCHANT_SALT}"
    hash_value = hashlib.sha512(hash_sequence.encode()).hexdigest()

    session["duration"] = duration

    payment_success_route = url_for("payment_success", _external=True)
    payment_failure_route = url_for("payment_failure", _external=True)

    payu_url = f"{PAYU_BASE_URL}?key={PAYU_MERCHANT_KEY}&txnid={txnid}&amount={price}&productinfo=Witeso Pro {plan}&firstname={user_email}&email={user_email}&surl={payment_success_route}&furl={payment_failure_route}&service_provider=payu_paisa&hash={hash_value}&currency={currency}"

    return redirect(payu_url)

@csrf.exempt
@app.route('/api/payment-success', methods=['POST'])
def payment_success():
    user_email = session.get("user").get("email")
    duration = session.get("duration")

    if not user_email or not duration:
        return "Session Expired! Please try again."

    user = mongo.db.users.find_one({"email": user_email})
    current_time = datetime.datetime.utcnow()

    if user:
        if user.get("pro_expiry") and user["pro_expiry"] > current_time:
            new_expiry = user["pro_expiry"] + datetime.timedelta(days=duration)
        else:
            new_expiry = current_time + datetime.timedelta(days=duration)

        mongo.db.users.update_one(
            {"email": user_email},
            {"$set": {"pro_expiry": new_expiry}}
        )

    return f"Payment Successful! Pro Subscription Active Until: {new_expiry}"

@csrf.exempt
@app.route('/payment-failure', methods=['POST'])
def payment_failure():
    return "Payment Failed! Please try again."

@csrf.exempt
@app.route('/subscription-status')
def subscription_status():
    user_email = session.get("email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    user = users_collection.find_one({"email": user_email})
    if not user or not user.get("pro_expiry"):
        return jsonify({"active": False, "message": "No active subscription"}), 200

    current_time = datetime.datetime.utcnow()
    if user["pro_expiry"] > current_time:
        return jsonify({"active": True, "expires_on": user["pro_expiry"]}), 200
    else:
        return jsonify({"active": False, "message": "Subscription expired"}), 200

@csrf.exempt
@app.route("/api/update_user", methods=["POST"])
def update_user():
    user = session.get("user")
    if not user:
        return jsonify({"error": "User not logged in."}), 401

    user_id = user.get("id")
    users_collection = mongo.db.users
    existing_user = users_collection.find_one({"user_id": user_id})
    if not existing_user:
        return jsonify({"error": "User not found."}), 404

    data = request.json
    users_collection.update_one({"user_id": user_id}, {"$set": data})
    return jsonify({"message": "User updated successfully."})

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

# Routes
@csrf.exempt
@app.route('/api/resume_builder', methods=['POST'])
def resume_builder():
    data = request.get_json()
    print(data)
    """
    {'firstName': 'Pushpender', 'lastName': 'Singh', 'email': 'mrrobotishere4u@gmail.com', 'phone': '+916387543965', 'address': 'Delhi, India', 'jobTitle': 'Software Engineer', 'github': 'https://github.com/pushpenderindia', 'linkedin': 'https://www.linkedin.com/in/pushpenderindia', 'leetcode': 'pushu_singh', 'codechef': 'singhindia', 'codeforces': 'pushpenderindia', 'portfolio': '', 'institution': 'Guru Gobind Singh Indraprastha University', 'eduLocation': 'Delhi', 'degreeType': 'B.Tech', 'fieldOfStudy': 'AIML', 'startEdu': 'Nov 2021', 'gradEdu': 'July 2025', 'scores': '8.2', 'employer': '', 'jobTitleExp': '', 'startExp': '', 'endExp': '', 'expLocation': '', 'expDescription': '', 'languages': '', 'frameworks': '', 'tools': '', 'databases': '', 'projectName': '', 'technologies': '', 'projectLink': '', 'projectDescription': '', 'honorsText': '', 'honorsLink': ''}
    """

    resume = ResumeGenerator()
    # Personal Info
    resume.set_personal_info(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        phone=data['phone'],
        address=data['address'],
        job_title=data['jobTitle'],
        github=data['github'],
        linkedin=data['linkedin'],
        leetcode=data['leetcode'],
        codechef=data['codechef'],
        codeforces=data['codeforces'],
        portfolio=None  
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
    latex_content = resume.generate_latex()
    print(latex_content)

    # URL for the online LaTeX compilation service.
    compile_url = "https://latexonline.cc/compile"

    # Pass the LaTeX content as the 'text' parameter.
    params = {'text': latex_content}
    try:
        # Call the external API to compile the LaTeX document.
        response = requests.get(compile_url, params=params)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to compile PDF with external service.', 'message': response.text, "latex": latex_content}), 500

        # Read the PDF data from the response.
        pdf_data = response.content

        # Return the PDF data as a file.
        return send_file(
            io.BytesIO(pdf_data),
            mimetype='application/pdf',
            as_attachment=False,
            download_name="resume.pdf"
        )
    except Exception as e:
        return jsonify({'error': 'Failed to compile PDF', 'message': str(e)}), 500

@csrf.exempt
@app.route('/api/get_company_email')
def get_company_email():
    # check login
    user = session.get("user")
    if not user:
        return jsonify({"error": "User not authenticated."})

    company = request.args.get('company')
    position = request.args.get('position', None)
    location = request.args.get('location', None)

    if not company or len(company) < 4:
        return jsonify({"error": "Company name too short."})

    # Build query clauses for flexible, case-insensitive search.
    query_clauses = [
        {
            '$or': [
                {'Company': {'$regex': company, '$options': 'i'}},
                {'Website': {'$regex': company, '$options': 'i'}}
            ]
        }
    ]

    if position:
        query_clauses.append({'Title': {'$regex': position, '$options': 'i'}})
    if location:
        query_clauses.append({'Location': {'$regex': location, '$options': 'i'}})

    query = {'$and': query_clauses} if query_clauses else {}

    email = mongo.db.HR.find_one(query, {'_id': 0, 'Name': 1, 'Email': 1, 'Title': 1, 'Company': 1, 'Website': 1})
    if email:
        return jsonify(email)
    else:
        return jsonify({"error": "Email not found."})

@app.route('/api/problems')
@cache.cached(timeout=36000)
def get_problems():
    problems = mongo.db.DSA_Striver_Plus.find(
        {"Subcategory": {"$ne": "Contest"}},
        {'_id': 1, 'Category': 1, 'Subcategory': 1, 'Problem': 1, 'problem_slug': 1, 'Difficulty': 1}
    )
    return jsonify({
        'problems': list(problems), 
        'striver_plus_ques_list': striver_plus_ques_list,
        'Is_Authenticated': bool(session.get("user"))
    })

@app.route('/api/tcs_nqt')
@csrf.exempt
def tcs_nqt():
    category = request.args.get('category', None)
    subcategory = request.args.get('subcategory', None)
    
    num_ques_map = {
        "Numerical_Ability": {"question_count": 20, "duration": 25},
        "Reasoning_Ability": {"question_count": 20, "duration": 25},
        "Verbal_Ability": {"question_count": 25, "duration": 25},
    }
    
    if not category:
        category2 = tcs_nqt_sections.keys()
        category1 = mongo.db.TCS_NQT_Mocks.distinct('Category')
        merged_category = list(set(category1) | set(category2))
        return jsonify(merged_category)
    
    if not subcategory and category == 'TCS NQT':
        data = mongo.db.TCS_NQT_Mocks.distinct('Subcategory', {"Category": category})
        return jsonify(data)
    
    # Get question count and duration if available
    current_category_data = num_ques_map.get(category, {})
    num_questions = current_category_data.get("question_count", 20)
    duration = current_category_data.get("duration", 25)
    subcategories = tcs_nqt_sections.get(category, [])
    
    query = {"Category": category, "Subcategory": subcategory}
    problems = list(mongo.db.TCS_NQT_Mocks.find(query, {'_id': 0, 'Category': 0, 'Subcategory': 0}))
    
    # If problems exist in TCS_NQT_Mocks, return them
    if problems:
        return jsonify({"category": category, "subcategory": subcategory, "problems": problems})
    
    # Otherwise, fetch random questions from Aptitude collection
    pipeline = [
        {"$match": {"Subcategory": {"$in": subcategories}}},
        {"$sample": {"size": num_questions}},
        {"$project": {"_id": 0, "Subcategory": 0}}
    ]
    
    data = list(mongo.db.Aptitude.aggregate(pipeline))
    return jsonify({"duration": duration, "category": category, "problems": data})


@app.route('/api/top_6_companies')
@cache.cached(timeout=36000)
def top_6_companies():
    # Aggregation pipeline to fetch top 6 companies with highest total question count
    pipeline = [
        # Unwind the company_tag array to group by individual companies
        {"$unwind": "$company_tag"},
        
        # Group by company and calculate counts for each difficulty level
        {"$group": {
            "_id": "$company_tag",
            "total": {"$sum": 1},
            "easy_count": {"$sum": {"$cond": [{"$eq": ["$difficulty", "Easy"]}, 1, 0]}},
            "medium_count": {"$sum": {"$cond": [{"$eq": ["$difficulty", "Medium"]}, 1, 0]}},
            "hard_count": {"$sum": {"$cond": [{"$eq": ["$difficulty", "Hard"]}, 1, 0]}}
        }},
        
        # Sort by total question count in descending order
        {"$sort": {"total": -1}},
        
        # Limit to top 6 companies
        {"$limit": 6},
        
        # Project the desired output format with logo mapping
        {"$project": {
            "_id": 0,
            "name": "$_id",
            "logo": {
                "$concat": [
                    "https://logo.clearbit.com/",
                    {"$replaceOne": {"input": "$_id", "find": "-", "replacement": ""}},  # Remove hyphens from company name
                    ".com"
                ]
            },
            "total": 1,
            "easy_count": 1,
            "medium_count": 1,
            "hard_count": 1
        }}
    ]

    # Execute the aggregation query
    top_6_companies = list(mongo.db.CompanyWise_Leetcode.aggregate(pipeline))
    return jsonify(top_6_companies)

@app.route('/api/problem/<problem_slug>')
def problem_detail_api(problem_slug):
    # Fetch only '_id' and 'title' for the sidebar
    problems = list(mongo.db.DSA_Striver_Plus.find({}, {'_id': 1, 'Problem': 1, 'Difficulty': 1, 'problem_slug': 1, 'URL': 1, 'new_editorial': 1, 'Facts': 1}))

    # Fetch a specific problem by slug
    problem = mongo.db.DSA_Striver_Plus.find_one({'problem_slug': problem_slug})

    if problem.get("Facts"):
        problem["Facts"] = [fact.strip() for fact in problem["Facts"].split('.') if fact.strip()]

    return jsonify({"problems":problems, "problem":problem})

@app.route('/problem/<problem_slug>')
def problem_detail(problem_slug):
    # Fetch only '_id' and 'title' for the sidebar
    problems = list(mongo.db.DSA_Striver_Plus.find({}, {'_id': 1, 'Problem': 1, 'Difficulty': 1, 'problem_slug': 1, 'URL': 1, 'new_editorial': 1, 'Facts': 1}))

    # Fetch a specific problem by slug
    problem = mongo.db.DSA_Striver_Plus.find_one({'problem_slug': problem_slug})

    if problem.get("Facts"):
        problem["Facts"] = [fact.strip() for fact in problem["Facts"].split('.') if fact.strip()]

    if problem.get("Testcases"):
        for test_case in problem["Testcases"]:
            if 'parsedOutput' in test_case:
                test_case['parsedOutput'] = test_case['parsedOutput'].replace('TestCase-1', '').replace('\n', '<br>')

    problem['Is_Authenticated'] = bool(session.get("user"))

    return render_template('problem_detail.html', problems=problems, problem=problem, settings=settings)

@app.route('/api/submit_code', methods=['POST'])
def submit_code():
    # Fetch user code
    user_code = request.form['code']
    # Fetch lang
    lang = request.form['lang']
    if lang == 'cpp':
        boilerplate = 'Public_Cpp'
    elif lang == 'java':
        boilerplate = 'Public_Java'
    elif lang == 'python':
        boilerplate = 'Public_Py'
    elif lang == 'javascript':
        boilerplate = 'Public_Js'

    # Fetch boilerplate code
    ques_data = mongo.db.DSA_Striver_Plus.find_one({'problem_slug': request.form['problem_slug']})
    boilerplate = ques_data[boilerplate]
    # Fetch test cases
    test_cases = ques_data['Testcases']
    final_test_cases = []
    for test_case in test_cases:
        final_test_case = {}
        final_test_case['inputs'] = test_case['inputs']
        if 'parsedOutput' not in test_case:
            continue
        final_test_case['parsedOutput'] = test_case['parsedOutput'].replace('TestCase-1\n', '')
        final_test_cases.append(final_test_case)
    tokens = judgeCode.submit_code(user_code, boilerplate, "cpp", final_test_cases)
    print("tokens: ", tokens)
    return jsonify(tokens)

@app.route('/api/get_output', methods=['POST'])
def get_output():
    tokens = request.form['tokens'] # list of tokens
    tokens = json.loads(tokens)
    results = []
    for token in tokens:
        result = judgeCode.poll_results(token)
        results.append(result)
    return jsonify(results)

@app.route('/api/company_wise_dsa_questions')
@cache.cached(timeout=36000)
def company_wise_dsa_questions():
    # Fetch all documents from the collection
    data = list(mongo.db.CompanyWise_Leetcode.find({}, {'_id': 0}))
    
    # Group the documents by company
    companies = {}
    for doc in data:
        if 'company_tag' in doc:
            for comp in doc['company_tag']:
                companies.setdefault(comp, []).append(doc)
                
    # Build a list of companies info (with question counts and difficulty counts)
    companies_info = []
    for comp, questions in companies.items():
        easy_count = sum(1 for q in questions if q.get("difficulty", "").lower() == "easy")
        medium_count = sum(1 for q in questions if q.get("difficulty", "").lower() == "medium")
        hard_count = sum(1 for q in questions if q.get("difficulty", "").lower() == "hard")
        companies_info.append({
            "name": comp,
            "logo": companies_logo_map.get(comp, f"https://logo.clearbit.com/{comp.replace('-', '')}.com"),
            "total": len(questions),
            "easy_count": easy_count,
            "medium_count": medium_count,
            "hard_count": hard_count,
        })
    
    # Sort companies alphabetically (optional)
    companies_info.sort(key=lambda x: x["name"])
    return jsonify(companies_info)

@app.route('/api/company_wise_dsa/<company>')
def company_detail(company):
    # Perform a case-insensitive search to find all questions for the given company
    questions = list(mongo.db.CompanyWise_Leetcode.find(
        {"company_tag": {"$regex": f"^{company}$", "$options": "i"}},
        {'_id': 0}
    ))

    # Fetch user authentication status
    user = session.get("user")
    is_authenticated = bool(user)

    # Sort questions by leetcode_id (or any other criteria)
    questions.sort(key=lambda x: x.get("leetcode_id", 0))
    company_logo = f"https://logo.clearbit.com/{company}.com"

    total_questions = len(questions)
    if not is_authenticated:
        unrestricted_questions = questions[:5]
        restricted_questions = [{
            "title": "Restricted",
            "difficulty": "Hard",
            "company_tag": [company],
            "leetcode_id": 0,
            "problem_slug": "restricted"
        }] * (15 - len(unrestricted_questions))
        questions = unrestricted_questions + restricted_questions
    else:
        questions.append({
            "title": "Restricted",
            "difficulty": "Hard",
            "company_tag": [company],
            "leetcode_id": 0,
            "problem_slug": "restricted"
        })
    response = {
        "company":company.title(), 
        "questions":questions, 
        "company_logo":company_logo,
        "total_questions": total_questions,
        "is_authenticated": is_authenticated
    }
    return jsonify(response)

@app.route('/api/aptitude_questions')
def aptitude_questions():
    category = request.args.get('category', None)
    subcategory = request.args.get('subcategory', None)
    
    if not category:
        data = mongo.db.Aptitude.distinct('Category')
        return jsonify(data)

    if not subcategory:
        data = mongo.db.Aptitude.distinct('Subcategory', {"Category": category})
        return jsonify(data)

    query = {}
    if category:
        query['Category'] = category
    if subcategory:
        query['Subcategory'] = subcategory

    data = list(mongo.db.Aptitude.find(query, {'_id': 0, 'Category': 0, 'Subcategory': 0}))
    return jsonify({"category": category, "subcategory": subcategory, "problems": data})
    
# @app.route('/latest_oa/<question_title>')
# def latest_oa(question_title):
#     # Fetch the data from MongoDB
#     oa_data = mongo.db.Latest_OA.find_one({"slug": question_title})
    
#     if oa_data:
#         try:
#             input_date = oa_data["date"]  
#             date_object = datetime.strptime(input_date, "%Y-%m-%d")
#             formatted_date = "Asked on: " + date_object.strftime("%d %b %Y")
#         except Exception as e:
#             print("Error: ", e)
#             formatted_date = oa_data["date"]

#         # If user authenticated then only show solutions
#         user = session.get("user")
#         is_authenticated = bool(user)
#         if is_authenticated:
#             cpp_solution = oa_data.get("solution_code", "")
#         else:
#             cpp_solution = ""

#         # Map the data to the structure expected by problem_details.html
#         problem_data = {
#             "Problem": oa_data["title"],
#             "Problem_Statement": oa_data["problem_statement"].replace("\\n", "<br>").replace("\\", ""),
#             "Category": "Latest OA",
#             "Subcategory": formatted_date,
#             "Company_Tags": [oa_data["company_name"]],
#             "Public_Cpp": cpp_solution,  # Default to empty string if not available
#             "Public_Java": "",  # Add Java solution if available
#             "Public_Py": "",  # Add Python solution if available
#             "Public_Js": "",  # Add JavaScript solution if available
#             "Latest_OA": True,
#             "Is_Authenticated": is_authenticated
#         }
#         return render_template('problem_detail.html', problem=problem_data, settings=settings)
#     else:
#         return "Question not found", 404

# @app.route('/api/search', methods=['GET'])
# @csrf.exempt
# def search_api():
#     query = request.args.get("query", "").strip().lower()
#     if len(query) < 5:
#         return jsonify([])
#     result_data = []
#     if query:
#         # Split the query into individual words
#         words = query.split()
#         filters = []
#         for word in words:
#             # For each word, create an $or filter that checks all desired fields
#             filters.append({
#                 "$or": [
#                     {"slug": {"$regex": word, "$options": "i"}},
#                     {"title": {"$regex": word, "$options": "i"}},
#                     {"company_name": {"$regex": word, "$options": "i"}},
#                     {"problem_statement": {"$regex": word, "$options": "i"}},
#                     {"solution_code": {"$regex": word, "$options": "i"}}
#                 ]
#             })
#         # Combine the word filters with an $and so that every word must match at least one field
#         query_filter = {"$and": filters} if filters else {}
#         # Optionally limit the number of results returned (e.g., to 5)
#         oa_data = list(mongo.db.Latest_OA.find(query_filter).limit(5))
#         for item in oa_data:
#             result_data.append({
#                 "title": item.get("title", ""),
#                 "company_name": item.get("company_name", ""),
#                 "date": item.get("date", ""),
#                 "slug": item.get("slug", "")
#             })
#     return jsonify(result_data)

@app.route('/sitemap.xml')
def sitemap():
    base_url = request.host_url.rstrip('/')  # Get the base URL of the site

    # Fetch all problems from MongoDB
    problems = mongo.db.DSA_Striver_Plus.find({}, {'problem_slug': 1})

    # Start XML structure
    xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

    # Add the homepage URL
    xml_content += f'''  <url>
    <loc>{base_url}/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
'''

    # Add Legal Pages
    list_of_pages = ['privacy_policy', 'terms_of_service', 'refund_policy', 'contact_us', 'about_us']
    for page in list_of_pages:
        xml_content += f'''  <url>
    <loc>{base_url}/{page}</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
'''

    # Add company wise URL
    xml_content += f'''  <url>
    <loc>{base_url}/company_wise_dsa_questions</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
    </url>
'''

    # Add problem solving patterns URL
    xml_content += f'''  <url>
    <loc>{base_url}/problem-solving-patterns-coding-interviews</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
    </url>
'''

    # Add CSS Games URL
    xml_content += f'''  <url>
    <loc>{base_url}/css_learning_game</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
    </url>
'''

    for i in range(1, 6):
        xml_content += f'''  <url>
    <loc>{base_url}/css_learning_game/level_{i}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
    </url>
'''

    # Add recruiter email finder URL
    xml_content += f'''  <url>
    <loc>{base_url}/recruiter_email_finder</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
    </url>
'''

    # Add aptitude questions URL
    for category in mongo.db.Aptitude.distinct('Category'):
        xml_content += f'''  <url>
        <loc>{base_url}/company_aptitude_mock_test/{category}</loc>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
        </url>
    '''

    # Add aptitude category & subcategory URLs
    for category in mongo.db.Aptitude.distinct('Category'):
        subcategory_list = mongo.db.Aptitude.distinct('Subcategory', {'Category': category})
        for subcategory in subcategory_list:
            xml_content += f'''  <url>
        <loc>{base_url}/company_aptitude_mock_test/{category}/{subcategory}</loc>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
        </url>
    '''

    # Add latest OA URL
#     for problem in mongo.db.Latest_OA.find({}, {'slug': 1}):
#         problem_slug = problem.get('slug')
#         if problem_slug:
#             xml_content += f'''  <url>
#     <loc>{base_url}/latest_oa/{problem_slug}</loc>
#     <priority>0.8</priority>
#     <changefreq>weekly</changefreq>
#   </url>
# '''

    # Add problem URLs
    for problem in problems:
        problem_slug = problem.get('problem_slug')
        if problem_slug:
            xml_content += f'''  <url>
    <loc>{base_url}/problem/{problem_slug}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
'''

    # Add company wise URls
    unique_companies = mongo.db.CompanyWise_Leetcode.distinct("company_tag")
    for tag in unique_companies:
        xml_content += f'''  <url>
    <loc>{base_url}/company_wise_dsa/{tag}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
'''
    # Close the XML structure
    xml_content += '</urlset>'

    # Return XML response
    return Response(xml_content, mimetype='application/xml')

# Run the app
if __name__ == '__main__':
    app.run(debug=True)