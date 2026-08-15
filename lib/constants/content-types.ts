export const CONTENT_TYPES = [
  { slug: "acceptable_use_policy", label: "Acceptable Use Policy" },
  { slug: "refund_policy", label: "Refund Policy" },
  { slug: "seller_agreement", label: "Seller Agreement" },
  { slug: "website_disclaimer", label: "Website Disclaimer" },
  { slug: "cookie_policy", label: "Cookie Policy" },
  { slug: "privacy_policy", label: "Privacy Policy" },
  { slug: "buyer_terms_and_condition", label: "Buyer Terms & Conditions" },
  {
    slug: "charge_back_and_dispute_resolution_policy",
    label: "Chargeback & Dispute Resolution",
  },
  { slug: "terms_and_conditions", label: "Terms & Conditions" },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["slug"];

export function isValidContentType(slug: string): slug is ContentType {
  return CONTENT_TYPES.some((item) => item.slug === slug);
}

export function getContentLabel(slug: string): string {
  return CONTENT_TYPES.find((item) => item.slug === slug)?.label ?? slug;
}