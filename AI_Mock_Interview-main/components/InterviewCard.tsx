import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-green-500",
      Mixed: "bg-green-600",
      Technical: "bg-green-700",
    }[normalizedType] || "bg-green-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="relative w-[360px] max-sm:w-full min-h-96 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-lg shadow-green-900/20 hover:shadow-green-500/10 transition-all">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-700"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-green-500/10 blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-green-600/10 blur-xl"></div>
      
      <div className="p-6 relative z-10">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-4 right-4 w-fit px-4 py-1.5 rounded-lg",
              badgeColor,
              "shadow-md backdrop-blur-sm"
            )}
          >
            <p className="text-neutral-100 font-medium text-sm">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <div className="relative">
            <div className="absolute -z-10 w-24 h-24 rounded-full bg-green-500/20 blur-md"></div>
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-cover size-[90px] border-2 border-green-500/50 shadow-lg shadow-green-500/20"
            />
          </div>

          {/* Interview Role */}
          <h3 className="mt-5 capitalize text-white font-semibold text-xl">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3 text-neutral-300">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/calendar.svg"
                width={20}
                height={20}
                alt="calendar"
                className="opacity-80"
              />
              <p className="text-sm">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/star.svg" 
                width={20} 
                height={20} 
                alt="star" 
                className="opacity-80"
              />
              <p className={`text-sm ${feedback ? "text-green-400" : "text-neutral-400"}`}>
                {feedback?.totalScore || "---"}/100
              </p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5 text-neutral-400 bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-6">
          <DisplayTechIcons techStack={techstack} />

          <Button className={`${feedback ? "bg-green-600" : "bg-green-500"} text-white hover:bg-green-700 transition-colors shadow-md`}>
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center gap-1"
            >
              {feedback ? "Check Feedback" : "View Interview"}
              <span className="ml-1">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
