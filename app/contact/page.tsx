import SiteNavbar from "../components/site-navbar";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Contact Us</h2>
        <p className="text-gray-700 leading-7 mb-6">
          Have a question, suggestion, or partnership request? Send us a message.
        </p>

        <ContactForm />

        <p className="text-sm text-gray-600 mt-5">
          You can also reach us at{" "}
          <span className="font-semibold">support@quickread.com</span>.
        </p>
      </main>

      <footer className="bg-black text-white text-center py-4 px-4 text-sm">
        Copyright (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}



