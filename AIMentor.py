from openai import OpenAI
import time
import os
from dotenv import load_dotenv
import markdown
import PyPDF2
load_dotenv()

class AIMentor:
    def __init__(self):
        self.client = OpenAI(
            base_url = os.getenv("E2E_BASE_URL"),
            api_key = os.getenv("E2E_AUTH_TOKEN"),
        )
        self.system_prompt = "You are an AI Mentor designed for career guidance and mentoring of students. Keep responses concise (under 600 characters)."
        
    def extract_text_from_pdf(self, pdf_path):
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        return text

    def review_resume(self, resume_text):

        system_prompt = self.system_prompt
        
        user_prompt = "You are an expert resume reviewer. Please analyze the following resume and provide specific, actionable feedback on content, format, skills presentation, and how to improve it. Focus on helping the candidate highlight their strengths and address weaknesses. " + f"Here's the resume text:\n\n{resume_text}\n\n"
        
        try:
            completion = self.client.chat.completions.create(
            model='llama_4_scout_17b_16e_instruct',
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=200  # Limited to keep responses under 600 chars
            )
            
            response = completion.choices[0].message.content
            
            # Convert markdown to HTML if needed
            try:
                response = markdown.markdown(response)
            except ImportError:
                # If markdown package is not installed, return plain text
                pass

            return response
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"

    def handle_query(self, query):
        system_prompt = self.system_prompt + " If asked about your technology, backend, or which LLM you use, explain that you are designed and developed by the Witeso Team."
        
        try:
            completion = self.client.chat.completions.create(
            model='llama_4_scout_17b_16e_instruct',
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.5,
            max_tokens=200  # Limited to keep responses under 600 chars
            )
            
            response = completion.choices[0].message.content
            
            # Convert markdown to HTML if needed
            try:
                response = markdown.markdown(response)
            except ImportError:
                # If markdown package is not installed, return plain text
                pass

            return response
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"

# Usage
if __name__ == "__main__":
    mentor = AIMentor()
    while True:
        query = input("\n\nAsk AI Mentor (type 'exit' to quit): ")
        if query.lower() == 'exit':
            break
        mentor.handle_query(query)
