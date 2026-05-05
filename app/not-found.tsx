import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 mx-auto mb-6">
          <svg className="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-3">Page Not Found</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" variant="primary">
            <Link href="/">Go Home</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-brand-600 text-brand-600">
            <Link href="/services">View Services</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
