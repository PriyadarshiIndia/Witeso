import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: "user_id_12345",
  });

  return (
    <section className="relative bg-neutral-900 text-white py-12 px-6 overflow-hidden">
      {/* decorators */}
      <div className="absolute w-48 h-48 bg-green-500 rounded-full top-0 -left-24 opacity-30 transform rotate-45"></div>
      <div className="absolute w-64 h-64 bg-green-600 rounded-full bottom-0 -right-32 opacity-20 transform rotate-12"></div>

      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
            Feedback on the Interview -{' '}
            <span className="capitalize">{interview.role}</span> Interview
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Overall Impression */}
          <div className="flex items-center gap-3 bg-neutral-800 p-4 rounded-lg">
            <Image src="/star.svg" width={24} height={24} alt="star" />
            <p className="text-lg">
              Overall Impression:{' '}
              <span className="text-green-400 font-bold">
                {feedback?.totalScore}/100
              </span>
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 bg-neutral-800 p-4 rounded-lg">
            <Image src="/calendar.svg" width={24} height={24} alt="calendar" />
            <p className="text-lg">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : 'N/A'}
            </p>
          </div>
        </div>

        <hr className="border-neutral-700" />

        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
          <p className="leading-relaxed">{feedback?.finalAssessment}</p>
        </div>

        {/* Interview Breakdown */}
        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 border-b border-green-500 pb-2">
            Breakdown of the Interview:
          </h2>
          <div className="flex flex-col gap-6">
            {feedback?.categoryScores?.map((category, index) => (
              <div key={index} className="space-y-2">
                <p className="font-semibold">
                  {index + 1}. {category.name} ({category.score}/100)
                </p>
                <p className="text-sm text-neutral-300">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold border-b border-green-500 pb-1 mb-3">
            Strengths
          </h3>
          <ul className="list-disc list-inside space-y-1 text-neutral-300">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold border-b border-green-500 pb-1 mb-3">
            Areas for Improvement
          </h3>
          <ul className="list-disc list-inside space-y-1 text-neutral-300">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Link href="/" className="w-full text-center py-2">
              <span className="text-sm font-semibold">Back to dashboard</span>
            </Link>
          </Button>
          <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Link
              href={`/interview/${id}`}
              className="w-full text-center py-2"
            >
              <span className="text-sm font-semibold">Retake Interview</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;