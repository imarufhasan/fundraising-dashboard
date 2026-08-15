import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsAndConditionsPage() {
    return (
        <LegalLayout title="Terms & Conditions" lastUpdated="August 15, 2026">
            <p>
                These Terms & Conditions (&ldquo;Terms&rdquo;) govern your access to
                and use of FunRaisingIt (&ldquo;we&rdquo;, &ldquo;our&rdquo;,
                &ldquo;us&rdquo;), including our website, dashboard, and related
                services (the &ldquo;Service&rdquo;). By creating an account or using
                the Service, you agree to these Terms.
            </p>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    1. Eligibility
                </h2>
                <p>
                    You must be at least 18 years old, or the age of majority in your
                    jurisdiction, to create a campaign, make a donation, or otherwise
                    use the Service.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    2. Your Account
                </h2>
                <p>
                    You&rsquo;re responsible for keeping your login credentials
                    confidential and for all activity under your account. Notify us
                    immediately if you suspect unauthorized access.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    3. Campaigns & Fundraising
                </h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                        Organizers are solely responsible for the accuracy of their
                        campaign information and for how raised funds are used.
                    </li>
                    <li>
                        We may review, flag, pause, or remove any campaign that appears
                        to violate these Terms or applicable law.
                    </li>
                    <li>
                        Donors contribute at their own discretion; contributions are
                        generally non-refundable except as described in our Refund
                        section below.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    4. Fees & Payouts
                </h2>
                <p>
                    The Service charges a launch fee and a transaction fee (currently
                    6%) on funds raised, as shown in your dashboard at the time of
                    setup. Payouts are processed to the organizer&rsquo;s connected
                    payment account, minus applicable fees, on the schedule described
                    in your account settings.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    5. Prohibited Activities
                </h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>Creating fraudulent, misleading, or fake campaigns.</li>
                    <li>Using the Service for money laundering or illegal activity.</li>
                    <li>
                        Attempting to interfere with, disrupt, or gain unauthorized
                        access to the Service or other users&rsquo; accounts.
                    </li>
                    <li>
                        Uploading content that infringes on intellectual property or
                        violates any third party&rsquo;s rights.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    6. Refunds & Chargebacks
                </h2>
                <p>
                    Refund requests are evaluated case by case in line with our refund
                    policy. We reserve the right to reverse a donation, pause a payout,
                    or hold funds while investigating a chargeback, dispute, or
                    suspected fraud.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    7. Intellectual Property
                </h2>
                <p>
                    The Service, including its branding, design, and underlying
                    technology, is owned by FunRaisingIt and protected by applicable
                    intellectual property laws. Organizers retain ownership of the
                    content they upload but grant us a license to display it on the
                    Service.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    8. Limitation of Liability
                </h2>
                <p>
                    The Service is provided &ldquo;as is&rdquo; without warranties of
                    any kind. To the fullest extent permitted by law, FunRaisingIt is
                    not liable for indirect, incidental, or consequential damages
                    arising from your use of the Service.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    9. Termination
                </h2>
                <p>
                    We may suspend or terminate access to the Service for accounts
                    that violate these Terms, with or without notice, at our
                    discretion.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    10. Governing Law
                </h2>
                <p>
                    These Terms are governed by the laws of the jurisdiction in which
                    FunRaisingIt is registered, without regard to conflict-of-law
                    principles.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    11. Changes to These Terms
                </h2>
                <p>
                    We may revise these Terms from time to time. Continued use of the
                    Service after changes take effect constitutes acceptance of the
                    revised Terms.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">
                    12. Contact Us
                </h2>
                <p>
                    Questions about these Terms? Reach out at{" "}
                    <a
                        href="mailto:support@funraisingit.com"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        support@funraisingit.com
                    </a>
                    .
                </p>
            </section>
        </LegalLayout>
    );
}