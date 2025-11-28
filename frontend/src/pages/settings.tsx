import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function SettingsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center">
          <h1 className={title()}>Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
            Manage your account settings and preferences. (This is a placeholder page.)
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
