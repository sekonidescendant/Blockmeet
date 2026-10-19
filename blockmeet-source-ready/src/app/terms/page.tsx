import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms of Service — BlockMeet" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      intro="By using BlockMeet you agree to these terms. Please read them carefully. If you do not agree, please do not use the service."
      sections={[
        {
          heading: "What BlockMeet is",
          paragraphs: [
            "BlockMeet is a directory where people can discover Web3 events, where organizers can list events, and where community leaders can apply to become hosts. We do not organize the events listed, sell tickets or process payments. Registration happens on the organizer's own website or a third-party platform.",
          ],
        },
        {
          heading: "Your account",
          items: [
            "You must give accurate information and keep your password secure.",
            "You are responsible for activity on your account.",
            "You must be at least 16 years old to use BlockMeet.",
          ],
        },
        {
          heading: "Listing events",
          items: [
            "Every submission is reviewed by our team before it is published. We may approve, reject, edit, cancel or remove any listing at our discretion.",
            "You must have the right to promote the event and everything you submit, including images.",
            "Listings must be accurate and must not be misleading, fraudulent, spam, or illegal.",
            "By submitting content you give BlockMeet a free, worldwide licence to display it on the service in connection with promoting your event.",
          ],
        },
        {
          heading: "Becoming a host",
          paragraphs: ["Approval as a BlockMeet host is at our discretion and can be withdrawn. Being approved does not make you an employee, agent or partner of BlockMeet."],
        },
        {
          heading: "Acceptable use",
          items: [
            "Do not post scams, fake events, impersonation, hate, harassment, or content that breaks the law.",
            "Do not attempt to break, overload or gain unauthorized access to the service.",
            "Do not collect other people's information from BlockMeet without permission.",
          ],
        },
        {
          heading: "Third-party events and links",
          paragraphs: [
            "Events and links on BlockMeet belong to third parties. We do not guarantee that any event will take place as described, and we are not responsible for what happens at or because of an event, or for third-party websites. Always do your own checks before you attend or share personal information.",
          ],
        },
        {
          heading: "No financial advice",
          paragraphs: ["Nothing on BlockMeet is financial, investment or legal advice. Listing an event does not mean we endorse a project, token or product."],
        },
        {
          heading: "Disclaimer and limits on liability",
          paragraphs: [
            "BlockMeet is provided \"as is\" and \"as available\". To the fullest extent allowed by law, we are not liable for indirect or consequential losses arising from your use of the service, or for events, listings or links that are inaccurate or unavailable.",
          ],
        },
        {
          heading: "Ending your use",
          paragraphs: ["You may stop using BlockMeet at any time. We may suspend or end access if these terms are broken or to protect the service or its users."],
        },
        {
          heading: "Changes to these terms",
          paragraphs: ["We may update these terms as BlockMeet grows. Continued use after a change means you accept the updated terms."],
        },
        {
          heading: "Contact",
          paragraphs: ["Contact details will be published on this page before BlockMeet's public launch."],
        },
      ]}
    />
  );
}
