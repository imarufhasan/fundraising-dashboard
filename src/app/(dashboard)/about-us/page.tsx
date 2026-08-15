import LegalLayout from "@/components/legal/LegalLayout";

export default function AboutUsPage() {
    return (
        <LegalLayout title="About Us">
            <section>
                <h2 className="text-base font-bold text-slate-800">Our Mission</h2>
                <p>
                    FunRaisingIt exists to make fundraising simple and transparent for
                    organizers, and delightful for the donors who support them.
                    Whether it&rsquo;s a school bake sale, a community fundraiser, or a
                    small business partnership, our platform gives organizers the
                    tools to launch, manage, and grow their campaigns with confidence.
                </p>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">What We Do</h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                        A simple campaign builder so organizers can go live in minutes.
                    </li>
                    <li>
                        Secure payment processing and clear, itemized payouts for every
                        campaign.
                    </li>
                    <li>
                        Brand Builder — helping local businesses turn campaign support
                        into branded merchandise.
                    </li>
                    <li>
                        A support team ready to help organizers and donors at every
                        step.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">Our Values</h2>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                        <span className="font-semibold text-slate-700">
                            Transparency
                        </span>{" "}
                        — clear fees, visible progress, and honest reporting for every
                        campaign.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-700">Trust</span> —
                        secure payments and careful review of the campaigns on our
                        platform.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-700">Community</span>{" "}
                        — we grow when the organizers and donors we serve succeed.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-base font-bold text-slate-800">Get in Touch</h2>
                <p>
                    Have a question, partnership idea, or feedback for us? We&rsquo;d
                    love to hear from you at{" "}
                    <a
                        href="mailto:hello@funraisingit.com"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        hello@funraisingit.com
                    </a>
                    .
                </p>
            </section>
        </LegalLayout>
    );
}