import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-3xl">
              <h1 className="font-headline text-4xl font-bold">
                Terms & Conditions
              </h1>
              <p>
                Please read these Terms and Conditions ("Terms", "Terms and
                Conditions") carefully before using the TourNaija website
                (the "Service") operated by us.
              </p>
              
              <h2>1. Agreement to Terms</h2>
              <p>
                By using our Service, you agree to be bound by these Terms. If
                you disagree with any part of the terms, then you may not access
                the Service.
              </p>

              <h2>2. Accounts</h2>
              <p>
                When you create an account with us, you must provide us with
                information that is accurate, complete, and current at all times.
                Failure to do so constitutes a breach of the Terms, which may
                result in immediate termination of your account on our Service.
              </p>

              <h2>3. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                TourNaija and its licensors.
              </p>

              <h2>4. Links To Other Web Sites</h2>
                <p>
                Our Service may contain links to third-party web sites or
                services that are not owned or controlled by TourNaija. We
                have no control over, and assume no responsibility for, the
                content, privacy policies, or practices of any third party web
                sites or services.
                </p>
              
               <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at mukhtar6369@bazeuniversity.edu.ng.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
