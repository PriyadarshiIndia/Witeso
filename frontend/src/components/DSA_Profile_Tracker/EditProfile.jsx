import { useState, useEffect } from "react";
import NotFoundPage from "../NotFoundPage";

const baseUrl = import.meta.env.DEV ? "http://127.0.0.1:5000" : import.meta.env.PUBLIC_API_URL;

export default function EditProfile({ slug }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user/${slug}?edit=true`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
      tagline: e.target.tagline.value,
      bio: e.target.bio.value,
      leetcode: e.target.leetcode.value,
      codechef: e.target.codechef.value,
      codeforces: e.target.codeforces.value,
      codestudio: e.target.codestudio.value,
      geeksforgeeks: e.target.geeksforgeeks.value,
      interviewbit: e.target.interviewbit.value,
      atcoder: e.target.atcoder.value,
      hackerrank: e.target.hackerrank.value,
      hackerearth: e.target.hackerearth.value,
      spoj: e.target.spoj.value,
      linkedin: e.target.linkedin.value,
      github: e.target.github.value,
      twitter: e.target.twitter.value,
      facebook: e.target.facebook.value,
      website: e.target.website.value,
    };

    try {
      // Send POST request to the API
      const response = await fetch(`${baseUrl}/api/update_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies for session handling
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("User updated successfully!");
      } else {
        setMessage(result.error || "Failed to update user.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  if (loading) return (
    <section id="edit-profile" className="pt-30 bg-gray-900 pb-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-48 h-8 bg-gray-800 animate-pulse mb-2"></div>
              <div className="w-32 h-6 bg-gray-800 animate-pulse mb-4"></div>
              <div className="w-full space-y-4">
                <div className="w-full h-10 bg-gray-800 animate-pulse"></div>
                <div className="w-full h-24 bg-gray-800 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <div key={index} className="w-full h-10 bg-gray-800 animate-pulse"></div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <div className="w-32 h-10 bg-gray-800 animate-pulse"></div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
  if (error) return <NotFoundPage />;
  if (!userData?.username) return <NotFoundPage />;

  return (
    <section id="edit-profile" className="pt-30 bg-gray-900 pb-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Info */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-green-500 text-lg font-medium mb-4">{userData.tagline}</p>

            {/* Display success/error message */}
            {message && (
              <div className={`mb-4 p-4 rounded ${message.includes("successfully") ? "bg-green-500" : "bg-red-500"}`}>
                <p className="text-white">{message}</p>
              </div>
            )}

            {/* Form Fields */}
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="tagline">
                  Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  defaultValue={userData.tagline}
                  className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={userData.bio}
                  className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                />
              </div>

              {/* Grid for LeetCode, CodeChef, and Codeforces */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="leetcode">
                    LeetCode
                  </label>
                  <input
                    type="text"
                    id="leetcode"
                    name="leetcode"
                    defaultValue={userData.leetcode}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="codechef">
                    CodeChef
                  </label>
                  <input
                    type="text"
                    id="codechef"
                    name="codechef"
                    defaultValue={userData.codechef}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="codeforces">
                    Codeforces
                  </label>
                  <input
                    type="text"
                    id="codeforces"
                    name="codeforces"
                    defaultValue={userData.codeforces}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Add other fields similarly */}
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="codestudio">
                    CodeStudio
                  </label>
                  <input
                    type="text"
                    id="codestudio"
                    name="codestudio"
                    defaultValue={userData.codestudio}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="geeksforgeeks">
                    GeeksforGeeks
                  </label>
                  <input
                    type="text"
                    id="geeksforgeeks"
                    name="geeksforgeeks"
                    defaultValue={userData.geeksforgeeks}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="interviewbit">
                    InterviewBit
                  </label>
                  <input
                    type="text"
                    id="interviewbit"
                    name="interviewbit"
                    defaultValue={userData.interviewbit}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="atcoder">
                    AtCoder
                  </label>
                  <input
                    type="text"
                    id="atcoder"
                    name="atcoder"
                    defaultValue={userData.atcoder}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="hackerrank">
                    HackerRank
                  </label>
                  <input
                    type="text"
                    id="hackerrank"
                    name="hackerrank"
                    defaultValue={userData.hackerrank}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="hackerearth">
                    HackerEarth
                  </label>
                  <input
                    type="text"
                    id="hackerearth"
                    name="hackerearth"
                    defaultValue={userData.hackerearth}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="spoj">
                    SPOJ
                  </label>
                  <input
                    type="text"
                    id="spoj"
                    name="spoj"
                    defaultValue={userData.spoj}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="linkedin">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    defaultValue={userData.linkedin}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="github">
                    GitHub
                  </label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    defaultValue={userData.github}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="twitter">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    defaultValue={userData.twitter}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="facebook">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    defaultValue={userData.facebook}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="website">
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    defaultValue={userData.website}
                    className="text-white border-gray-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}