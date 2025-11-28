import DefaultLayout from "@/layouts/default";
import FeedbackScroller from "@/components/Feedback";
import { title } from "@/components/primitives";

export default function FeedbackPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="inline-block max-w-3xl text-center">
          <h1 className={title()}>User Feedback</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">What guests and owners are saying about rooms.</p>
        </div>

        <div className="w-full max-w-3xl px-4">
          <FeedbackScroller />
        </div>
      </section>
    </DefaultLayout>
  );
}
