import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-3xl">
              <h1 className="font-headline text-4xl font-bold">
                Privacy Policy
              </h1>
              <p>
                Welcome to TourNaija. We are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website.
              </p>
              
              <h2>1. Information We Collect</h2>
              <p>
                We may collect personal information such as your name, email
                address, and demographic information that you voluntarily provide
                to us when you register on the website.
              </p>

              <h2>2. Use of Your Information</h2>
              <p>
                Having accurate information permits us to provide you with a
                smooth, efficient, and customized experience. Specifically, we
                may use information collected about you to:
              </p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Email you regarding your account or order.</li>
                <li>Generate a personal profile about you to make future visits more personalized.</li>
              </ul>

              <h2>3. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable.
              </p>
              
               <h2>Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at contact@tournaija.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
