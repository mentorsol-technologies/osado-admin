import Image from "next/image";

export const metadata = {
  title: "Terms and Conditions | Off Grid",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black-600 text-white-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-center mb-10">
          <Image src="/Logo.png" alt="Off Grid Logo" width={140} height={44} priority />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="flex flex-col gap-6 leading-relaxed text-sm text-gray-300">
          <p>
            These Terms and Conditions ("Terms") govern your access to and use of the Off Grid
            platform, including our website and mobile applications (the "Service"). By creating
            an account or otherwise using the Service, you agree to be bound by these Terms.
          </p>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">1. Account Registration</h2>
            <p>
              You must provide accurate and complete information when creating an account and
              keep it up to date. You are responsible for maintaining the confidentiality of your
              login credentials and for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">2. Use of the Service</h2>
            <p>
              You agree to use the Service only for lawful purposes and in accordance with these
              Terms. You must not misuse the Service, interfere with its normal operation, or
              attempt to access it using a method other than the interface we provide.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">3. Bookings and Payments</h2>
            <p>
              Any bookings, event registrations, or payments made through the Service are subject
              to the pricing, availability, and policies presented at the time of the transaction.
              Refunds, cancellations, and disputes are handled in accordance with our platform
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">4. User Conduct</h2>
            <p>
              You agree not to post or transmit content that is unlawful, misleading, or infringes
              on the rights of others. We reserve the right to suspend or terminate accounts that
              violate these Terms or our community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">5. Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which describes how
              we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">6. Limitation of Liability</h2>
            <p>
              The Service is provided on an "as is" basis. To the maximum extent permitted by law,
              Off Grid is not liable for any indirect, incidental, or consequential damages arising
              from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-white-100 text-base font-medium mb-2">7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service after any
              changes take effect constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <p className="text-xs text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
