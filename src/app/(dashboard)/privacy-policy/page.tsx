import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPolicyPage() {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="August 15, 2026">
            <p>
                FunRaisingIt (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
                respects your privacy and is committed to protecting the personal
                information you share with us. This Privacy Policy explains what
                information we collect, how we use it, and the choices you have,
                whenever you use our fundraising platform and related services (the
                &ldquo;Service&rdquo;).
            </p>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    1. Information We Collect
                </h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                        <span className="font-semibold text-slate-700">
                            Account information
                        </span>{" "}
                        — name, email address, password, and profile details you provide
                        when you sign up.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-700">
                            Campaign & payment information
                        </span>{" "}
                        — campaign details, donation amounts, order history, and payout
                        details processed through our payment provider.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-700">
                            Usage information
                        </span>{" "}
                        — pages visited, device and browser type, IP address, and
                        timestamps collected automatically via cookies and similar
                        technologies.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-700">
                            Support communications
                        </span>{" "}
                        — messages, tickets, and attachments you send our support team.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    2. How We Use Your Information
                </h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>To create and manage your account and campaigns.</li>
                    <li>To process donations, orders, fees, and payouts.</li>
                    <li>To respond to support requests and send service updates.</li>
                    <li>
                        To detect, investigate, and prevent fraud, abuse, or violations
                        of our Terms & Conditions.
                    </li>
                    <li>To improve and personalize the Service over time.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    3. Cookies & Tracking
                </h2>
                <p>
                    We use cookies and similar technologies to keep you signed in,
                    remember your preferences, and understand how the Service is used.
                    You can control cookies through your browser settings; disabling
                    them may limit some features.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    4. How We Share Information
                </h2>
                <p>
                    We do not sell your personal information. We share it only with:
                    payment processors to complete transactions, service providers who
                    support our operations (hosting, analytics, customer support) under
                    confidentiality obligations, and authorities when required by law
                    or to protect the rights and safety of our users.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    5. Data Security
                </h2>
                <p>
                    We use industry-standard safeguards, including encryption in
                    transit, to protect your information. No method of transmission or
                    storage is completely secure, so we cannot guarantee absolute
                    security.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    6. Your Rights & Choices
                </h2>
                <p>
                    You may access, update, or delete your account information at any
                    time from your account settings, or by contacting us. Depending on
                    your location, you may have additional rights under applicable data
                    protection laws, such as requesting a copy of your data or
                    objecting to certain processing.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    7. Children&rsquo;s Privacy
                </h2>
                <p>
                    The Service is not directed to children under 13, and we do not
                    knowingly collect personal information from them. If you believe a
                    child has provided us information, please contact us so we can
                    remove it.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    8. Changes to This Policy
                </h2>
                <p>
                    We may update this Privacy Policy from time to time. Material
                    changes will be announced within the Service or by email before
                    they take effect.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    9. Contact Us
                </h2>
                <p>
                    Questions about this Privacy Policy? Reach out at{" "}
                    <a
                        href="mailto:privacy@funraisingit.com"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        privacy@funraisingit.com
                    </a>
                    .
                </p>
            </section>
        </LegalLayout>
    );
}