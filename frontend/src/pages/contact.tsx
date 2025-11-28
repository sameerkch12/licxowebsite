import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function ContactPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center">
          <h1 className={title()}>Contact Us</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
            For support or inquiries, email us at <a className="text-blue-600" href="mailto:hello@licxorental.com">hello@licxorental.com</a> or call
            <strong> +91 98765 43210</strong>.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
