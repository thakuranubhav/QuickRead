import SiteNavbar from "../components/site-navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About QuickRead</h2>
        <p className="text-gray-700 leading-7">
          QuickRead helps you stay updated by collecting top headlines and generating concise AI-powered summaries so you can understand the day&apos;s news faster.
        </p>
      </main>

      <footer className="bg-black text-white text-center py-4 px-4 text-sm">
        Copyright (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}



