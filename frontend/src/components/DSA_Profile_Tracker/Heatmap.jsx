// src/components/Heatmap.jsx
import { useState, useEffect } from 'preact/hooks';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import { Doughnut } from 'react-chartjs-2';
import 'react-calendar-heatmap/dist/styles.css';
import '../../styles/Heatmap.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Heatmap({ leetcodeUsername, codechefUsername }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissionData, setSubmissionData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    maxStreak: 0,
    currentStreak: 0,
    totalContests: 0, // New dynamic stat
    badges: 0, // New dynamic stat
  });
  const [pieChartData, setPieChartData] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [contestRatings, setContestRatings] = useState({
    leetcode: 0,
    codechef: 0,
  });

  // Helper function to calculate streaks from an array of submissions ({ date, count })
  const calculateStreaks = (submissions) => {
    let currentStreak = 0;
    let maxStreak = 0;
    let previousDay = null;
    submissions.sort((a, b) => new Date(a.date) - new Date(b.date));
    submissions.forEach((day) => {
      if (day.count > 0) {
        const currentDate = new Date(day.date);
        if (previousDay) {
          const diffTime = currentDate.getTime() - previousDay.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          if (diffDays === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        previousDay = currentDate;
      } else {
        currentStreak = 0;
        previousDay = null;
      }
    });
    return { maxStreak, currentStreak };
  };

  useEffect(() => {
    async function fetchData() {
      let combinedCalendar = {}; // { date: count }
      let totalSubmissions = 0;
      let errorMessages = '';

      // Variables to hold individual profile streaks
      let leetcodeStreaks = { maxStreak: 0, currentStreak: 0 };
      let codechefStreaks = { maxStreak: 0, currentStreak: 0 };

      // Variables for pie chart data
      let easy = 0,
        medium = 0,
        hard = 0;

      // Fetch LeetCode data if provided
      if (leetcodeUsername) {
        try {
          const response = await fetch(
            'https://leetcode-api-faisalshohag.vercel.app/' + leetcodeUsername
          );
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          const data = await response.json();
          let calendarData = data.submissionCalendar;
          if (typeof calendarData === 'string') {
            calendarData = JSON.parse(calendarData);
          }
          // Process LeetCode calendar data (object with UNIX timestamps as keys)
          const leetcodeSubmissions = Object.entries(calendarData).map(
            ([timestamp, count]) => {
              const date = new Date(parseInt(timestamp, 10) * 1000)
                .toISOString()
                .split('T')[0];
              combinedCalendar[date] = (combinedCalendar[date] || 0) + count;
              totalSubmissions += count;
              return { date, count };
            }
          );
          leetcodeStreaks = calculateStreaks(leetcodeSubmissions);

          // Update pie chart data (example values, replace with actual data)
          easy += data.easySolved || 0;
          medium += data.mediumSolved || 0;
          hard += data.hardSolved || 0;

          // Update contest rating (example value, replace with actual data)
          setContestRatings((prev) => ({
            ...prev,
            leetcode: data.contestRating || 0,
          }));
        } catch (err) {
          console.error(err);
          errorMessages += 'Failed to fetch LeetCode data. ';
        }
      }

      // Fetch Codechef data if provided
      if (codechefUsername) {
        try {
          const response = await fetch(
            'https://codechef-api.vercel.app/handle/' + codechefUsername
          );
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          const data = await response.json();
          // data.heatMap is an array of objects with { date, value }
          const codechefSubmissions = Array.isArray(data.heatMap)
            ? data.heatMap.map((entry) => {
                const { date, value } = entry;
                combinedCalendar[date] = (combinedCalendar[date] || 0) + value;
                totalSubmissions += value;
                return { date, count: value };
              })
            : [];
          codechefStreaks = calculateStreaks(codechefSubmissions);

          // Update pie chart data (example values, replace with actual data)
          easy += data.easySolved || 0;
          medium += data.mediumSolved || 0;
          hard += data.hardSolved || 0;

          // Update contest rating (example value, replace with actual data)
          setContestRatings((prev) => ({
            ...prev,
            codechef: data.contestRating || 0,
          }));
        } catch (err) {
          console.error(err);
          errorMessages += 'Failed to fetch Codechef data. ';
        }
      }

      // Convert the combined calendar into an array for the heatmap
      const combinedSubmissions = Object.entries(combinedCalendar).map(
        ([date, count]) => ({ date, count })
      );

      // Instead of calculating streaks on merged data, take the maximum from individual profiles.
      const maxStreakCombined = Math.max(leetcodeStreaks.maxStreak, codechefStreaks.maxStreak);
      const currentStreakCombined = Math.max(leetcodeStreaks.currentStreak, codechefStreaks.currentStreak);

      setSubmissionData(combinedSubmissions);
      setStats({
        total: totalSubmissions,
        maxStreak: maxStreakCombined,
        currentStreak: currentStreakCombined,
        totalContests: '-', // Replace with dynamic value
        badges: '-', // Replace with dynamic value
      });
      setPieChartData({ easy, medium, hard });
      if (errorMessages) {
        setError(errorMessages);
      }
      setLoading(false);
    }
    fetchData();
  }, [leetcodeUsername, codechefUsername]);

  if (loading) {
    return (
      <section className="bg-gray-900 pt-2 py-12 px-4 sm:px-6 lg:px-4">
        <div className="max-w-6xl mx-auto mt-2">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 w-full">
              <div className="bg-gray-800 p-4 rounded-lg text-center animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 rounded border border-green-500 p-4">
                <div className="h-40 bg-gray-700 rounded"></div>
              </div>
              <div className="flex-1 rounded border border-green-500 p-4">
                <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-40 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error} - Please try again later.
      </div>
    );
  }

  // Prepare chart data as before
  const pieData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [pieChartData.easy, pieChartData.medium, pieChartData.hard],
        backgroundColor: ['#10B981', '#FBBF24', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#F59E0B', '#DC2626'],
        borderWidth: 0
      },
    ],
  };

  // Add some Doughnut chart options
  const doughnutOptions = {
    plugins: {
      legend: {
        display: false, // We already show a custom legend on the side
      },
      tooltip: {
        enabled: true,  // or false, if you don't want tooltips
      },
    },
    cutout: '70%', // creates the ring shape
  };

  return (
    <section className="bg-gray-900 pt-2 py-12 px-4 sm:px-6 lg:px-4">
      <div className="max-w-6xl mx-auto mt-2">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 w-full">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Total Contests</p>
              <p className="text-white text-xl font-bold">{stats.totalContests}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Max Streak</p>
              <p className="text-white text-xl font-bold">{stats.maxStreak} days</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-white text-xl font-bold">{stats.currentStreak} days</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Badges</p>
              <p className="text-white text-xl font-bold">{stats.badges}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            Combined Activity
          </h2>
          <div className="flex flex-col md:flex-row gap-2">
            {/* Heatmap Section */}
            <div className="flex-1 rounded border border-green-500 p-4">
              <div className="flex max-w-[80vw] justify-center md:max-w-[480px] lg:max-w-[600px] items-center w-full gap-2 overflow-x-scroll no-scrollbar">
                <ReactCalendarHeatmap
                  startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                  endDate={new Date()}
                  values={submissionData}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    if (value.count <= 2) return 'color-scale-1';
                    if (value.count <= 4) return 'color-scale-2';
                    return 'color-scale-3';
                  }}
                  tooltipDataAttrs={(value) => ({
                    'data-tip': value?.date
                      ? `${value.date}: ${value.count} submissions`
                      : 'No data',
                  })}
                  showWeekdayLabels={true}
                  gutterSize={2}
                />
              </div>
            </div>
            {/* Pie Chart Section */}
            <div className="flex-1 rounded border border-green-500 p-4">
              <h3 className="text-center text-white text-xl font-bold mb-4">LeetCode</h3>
              <hr className="border-gray-700 my-4" />
              <div className="flex items-center justify-center gap-4 mt-2">
                {/* Chart Container */}
                <div className="relative w-[105px] md:w-[120px] aspect-square">
                  <Doughnut data={pieData} options={doughnutOptions} />
                  {/* Absolute center text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold dark:text-darkText-300">
                      {pieChartData.easy + pieChartData.medium + pieChartData.hard}
                    </span>
                  </div>
                </div>

                {/* Custom legend on the side */}
                <div className="w-full max-w-[280px] flex flex-col gap-1">
                  <div className="rounded flex justify-between p-2 text-sm font-semibold text-gray-600 bg-gray-100 round-border dark:text-darkText-300 dark:bg-darkBox-800">
                    <div className="text-green-400 mr-4">Easy</div>
                    <span>{pieChartData.easy}</span>
                  </div>
                  <div className="rounded flex justify-between p-2 text-sm font-semibold text-gray-600 bg-gray-100 round-border dark:text-darkText-300 dark:bg-darkBox-800">
                    <div className="text-yellow-400 mr-4">Medium</div>
                    <span>{pieChartData.medium}</span>
                  </div>
                  <div className="rounded flex justify-between p-2 text-sm font-semibold text-gray-600 bg-gray-100 round-border dark:text-darkText-300 dark:bg-darkBox-800">
                    <div className="text-red-500 mr-4">Hard</div>
                    <span>{pieChartData.hard}</span>
                  </div>
                </div>
              </div>
              {/* Contest Ratings Section */}
              {/* <div className="mt-6">
                <h3 className="text-white text-xl font-bold mb-4">Contest Ratings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">LeetCode</p>
                    <p className="text-white text-xl font-bold">{contestRatings.leetcode}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">CodeChef</p>
                    <p className="text-white text-xl font-bold">{contestRatings.codechef}</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}