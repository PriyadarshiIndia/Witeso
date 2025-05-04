import re
import requests
import base64
import time
from pprint import pprint
import os

class JudgeCode:
    def __init__(self):
        # Free Unlimited Judge0 API
        self.JUDGE0_URL = os.environ.get('JUDGE_URL')

        self.LANGUAGE_IDS = {
            "cpp": 105,        # C++ (GCC 14.1.0)
            "java": 91,       # Java (JDK 17.0.6)
            "python": 100,     # Python (3.12.5)
            "javascript": 102  # JavaScript (Node.js 22.08.0)
        }

        self.HEADERS = {
            "Content-Type": "application/json"
        }

    def extract_function_name_and_args(self, boilerplate, lang):
        """
        Extracts the function name and argument types from the boilerplate code.
        For Python, looks for a pattern like: def functionName(...):
        - Uses type hints if provided; otherwise, defaults to "Any".
        For Java, C++ or JavaScript, uses a simple pattern to extract the parameter list
        and then splits each parameter to retrieve the type (everything except the last token).
        Returns:
            (function_name, arg_types) where:
            - function_name: string, name of the function.
            - arg_types: list of strings representing the type for each argument.
        """
        if lang == "python":
            # Capture the function name and the parameter list.
            pattern = r"def\s+(\w+)\s*\(([^)]*)\)"
            match = re.search(pattern, boilerplate)
            if match:
                function_name = match.group(1)
                args_str = match.group(2)
                args = [arg.strip() for arg in args_str.split(",") if arg.strip()]
                arg_types = []
                for arg in args:
                    # Look for a type hint: e.g., "a: int"
                    if ":" in arg:
                        # Split on colon and take the type part.
                        parts = arg.split(":")
                        arg_type = parts[1].strip()
                    else:
                        arg_type = "Any"
                    arg_types.append(arg_type)
                return function_name, arg_types

        elif lang in ["java", "cpp"]:
            # For Java/C++, assume the signature is something like:
            # "return_type functionName(arg_type arg_name, ...)"
            # We capture the function name and the entire parameter list.
            pattern = r"\w[\w\s:<>\*&]*\s+(\w+)\s*\(([^)]*)\)"
            match = re.search(pattern, boilerplate)
            if match:
                function_name = match.group(1)
                args_str = match.group(2).strip()
                if args_str == "":
                    return function_name, []
                args = [arg.strip() for arg in args_str.split(",") if arg.strip()]
                arg_types = []
                for arg in args:
                    # For each parameter, assume the last token is the variable name,
                    # and all preceding tokens form the type.
                    tokens = arg.split()
                    if len(tokens) >= 2:
                        arg_type = " ".join(tokens[:-1])
                    else:
                        # If we only have one token, use it as the type (ambiguous case).
                        arg_type = tokens[0]

                    arg_type = arg_type.replace("&", "").strip()  # Remove reference symbol
                    arg_types.append(arg_type)
                return function_name, arg_types

        elif lang == "javascript":
            # For JavaScript, assume the pattern: function functionName(arg1, arg2, ...)
            pattern = r"function\s+(\w+)\s*\(([^)]*)\)"
            match = re.search(pattern, boilerplate)
            if match:
                function_name = match.group(1)
                args_str = match.group(2).strip()
                if args_str == "":
                    return function_name, []
                args = [arg.strip() for arg in args_str.split(",") if arg.strip()]
                # JavaScript doesn't have built-in type annotations.
                arg_types = ["Any" for _ in args]
                return function_name, arg_types

        # Fallback: try Python pattern
        pattern = r"def\s+(\w+)\s*\(([^)]*)\)"
        match = re.search(pattern, boilerplate)
        if match:
            function_name = match.group(1)
            args_str = match.group(2)
            args = [arg.strip() for arg in args_str.split(",") if arg.strip()]
            arg_types = ["Any" for _ in args]
            return function_name, arg_types

        return None


    def wrap_user_code(self, user_code, boilerplate, lang, test_case):
        """
        Combines the boilerplate (which contains the function signature) and
        the user code (which is the function body), then appends a driver code
        that calls the extracted function with test cases.

        Now it also reorders the inputs to match the parameter order from the signature.
        """
        # Combine the boilerplate and the user-provided function body.
        combined_code = user_code

        # Extract function name, argument types, and argument names from the boilerplate.
        # We assume extract_function_name_and_args returns a tuple of:
        # (func_name, arg_types, arg_names) OR (func_name, arg_types) as a fallback.
        extracted = self.extract_function_name_and_args(boilerplate, lang)
        if extracted:
            if len(extracted) == 3:
                func_name, arg_types, arg_names = extracted
            else:
                func_name, arg_types = extracted
                # Fallback: use the keys from test_case["inputs"] as argument names.
                arg_names = list(test_case["inputs"].keys())
        else:
            func_name = "longestConsecutive"  # default fallback
            arg_types = []
            arg_names = list(test_case["inputs"].keys())

        # Reorder test_case inputs according to the parameter order from the signature.
        ordered_inputs = []
        for name in arg_names:
            if name in test_case["inputs"]:
                ordered_inputs.append(test_case["inputs"][name])
            else:
                # If a parameter is missing, provide an empty placeholder.
                ordered_inputs.append("")

        if lang == "python":
            # Build driver code for Python.
            args = ", ".join(f"{v}" for v in ordered_inputs)
            test_calls = f"    print(solution.{func_name}({args}))\n"
            driver = f"""
if __name__ == '__main__':
    solution = Solution()
{test_calls}
    """
            return combined_code + "\n" + driver

        elif lang == "java":
            # Build driver code for Java.
            args = ", ".join(ordered_inputs)
            test_calls = f"        System.out.println(solution.{func_name}({args}));\n"
            driver = f"""
class Main {{
    public static void main(String[] args) {{
        Solution solution = new Solution();
{test_calls}    }}
}}
    """
            return combined_code + "\n" + driver

        elif lang == "cpp":
            # Build driver code for C++.
            import_statements = "#include <bits/stdc++.h>\nusing namespace std;\n"
            var_decls = ""
            test_calls = ""
            var_counter = 1
            arg_vars = []
            # Use the ordered input values.
            values = ordered_inputs
            for i, value in enumerate(values):
                value_str = value.strip()
                # Use the extracted argument type if available.
                if i < len(arg_types):
                    ctype = arg_types[i]
                else:
                    # Fallback: try to determine the type by the value format.
                    if value_str.startswith("{") and value_str.endswith("}"):
                        elems = [e.strip() for e in value_str[1:-1].split(',') if e.strip()]
                        if elems and elems[0].replace('-', '').isdigit():
                            ctype = "vector<int>"
                        elif elems and elems[0].startswith('"') and elems[0].endswith('"'):
                            ctype = "vector<string>"
                        else:
                            ctype = "vector<int>"
                    elif value_str.startswith('"') and value_str.endswith('"'):
                        ctype = "string"
                    else:
                        ctype = "int"

                # For vector types, convert list notation from Python (using [ ]) to C++ (using { }).
                if ctype in ["vector<int>", "vector<string>"] and value_str.startswith("["):
                    value_str = "{" + value_str[1:-1] + "}"
                elif ctype == "string":
                    # Add quotes if not already provided.
                    if not (value_str.startswith('"') and value_str.endswith('"')):
                        value_str = f'"{value_str}"'

                # Create a unique variable name.
                var_name = f"var{var_counter}"
                var_counter += 1
                var_decls += f"    {ctype} {var_name} = {value_str};\n"
                arg_vars.append(var_name)
            args_str = ", ".join(arg_vars)
            test_calls += f"    cout << solution.{func_name}({args_str}) << endl;\n"
            driver = f"""
int main() {{
    Solution solution;
{var_decls}{test_calls}    return 0;
}}
    """
            return import_statements + combined_code + "\n" + driver

        elif lang == "javascript":
            # Build driver code for JavaScript.
            args = ", ".join(ordered_inputs)
            test_calls = f"console.log({func_name}({args}));\n"
            return combined_code + "\n" + test_calls

        else:
            # If language not supported, return the combined code as-is.
            return combined_code

    def submit_code(self, user_code, boilerplate, lang, test_cases):
        """
        Wraps the user code (combined with the boilerplate) with a driver that
        calls the function extracted from the boilerplate. Then submits the complete
        source code along with test cases to Judge0.
        """
        lang_id = self.LANGUAGE_IDS.get(lang)
        print("LangID: ", lang_id)
        if not lang_id:
            return {"error": "Unsupported language"}

        results = []
        # For each test case, create a submission.
        for test in test_cases:
            print("Test: ", test)
            wrapped_code = self.wrap_user_code(user_code, boilerplate, lang, test)
            encoded_code = base64.b64encode(wrapped_code.encode("utf-8")).decode("utf-8")
            print(encoded_code)
            expected_output = test["parsedOutput"]

            payload = {
                "source_code": encoded_code,
                "language_id": lang_id,
                "expected_output": base64.b64encode(expected_output.encode("utf-8")).decode("utf-8"),
                "base64_encoded": True
            }

            response = requests.post(self.JUDGE0_URL, json=payload, headers=self.HEADERS, params={"base64_encoded": "true"})
            if response.status_code != 201:
                print(response.json())
                return {"error": "Failed to create submission"}

            token = response.json()["token"]
            results.append(token)
        return results

    def poll_results(self, token):
        # Poll for the result (with a simple timeout mechanism)
        querystring = {"base64_encoded": "true", "wait": "false", "fields": "*"}
        result_response = requests.get(f"{self.JUDGE0_URL}/{token}?base64_encoded=true", headers=self.HEADERS, params=querystring)
        result = result_response.json()
        expected_output = base64.b64decode(result["expected_output"]).decode("utf-8").strip()

        if result["status"]["id"] in [1, 2]:  # 1 = In Queue, 2 = Processing
            return {"status": "Processing"}

        actual_output = ""
        if result.get("stdout"):
            actual_output = base64.b64decode(result["stdout"]).decode("utf-8").strip()

        results = {
            "token": token,
            "expected_output": expected_output,
            "actual_output": actual_output,
            "time": result["time"],
            "status": result["status"]["description"],
            "source_code": result["source_code"],
            "memory": result["memory"]
        }

        return results

if __name__ == "__main__":
    # Example usage
    boilerplate = """\
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        
    }
};
"""

    user_code = """\
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        if (nums.empty()) {
            return 0;
        }

        // Insert all elements into a set to remove duplicates and allow for O(1) lookups
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longestStreak = 0;

        for (int num : numSet) {
            // Only start counting from numbers that are the start of a sequence
            if (numSet.find(num - 1) == numSet.end()) {
                int currentNum = num;
                int currentStreak = 1;

                // Count the length of the streak starting from num
                while (numSet.find(currentNum + 1) != numSet.end()) {
                    currentNum++;
                    currentStreak++;
                }

                longestStreak = max(longestStreak, currentStreak);
            }
        }

        return longestStreak;
    }
};
"""

    test_cases = [
        {"inputs": {"nums": "[100, 4, 200, 1, 3, 2]"}, "parsedOutput": "4"},
        # {"inputs": {"nums": "[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]"}, "parsedOutput": "9"}
    ]

    # Submit the code for Python
    judge = JudgeCode()
    tokens = judge.submit_code(user_code, boilerplate, "cpp", test_cases)
    time.sleep(5)
    for token in tokens:
        result = judge.poll_results(token)
        print(result)