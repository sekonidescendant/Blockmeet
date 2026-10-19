import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — BlockMeet" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      intro="BlockMeet helps people discover Web3 events and helps organizers and community hosts reach them. This page explains what personal information we collect, why, and the choices you have."
      sections={[
        {
          heading: "Information we collect",
          items: [
            "Account details: your email address and a password. Passwords are stored in a protected, scrambled form by our authentication provider; we never see or store your actual password.",
            "Profile details you give us: your name, country and city, when you submit a form.",
            "Event submissions: the event details you enter, your contact email (visible only to our review team), and any image you upload.",
            "Host applications: your name, email, location, community details, experience and the reasons you give for applying. Only our review team can see these.",
            "Notifications we send you about your submissions and applications.",
          ],
        },
        {
          heading: "How we use it",
          items: [
            "To run your account and let you sign in.",
            "To review, publish and manage events and host applications.",
            "To send you messages about your account, such as email confirmation, password reset and decisions on your submissions.",
            "To keep BlockMeet safe, prevent spam and abuse, and keep a record of moderation decisions.",
          ],
        },
        {
          heading: "What is public and what is private",
          paragraphs: [
            "When an event is approved, its public details (name, description, date, location, organizer name, links and image) are shown on BlockMeet. Your contact email and your account details are not shown publicly.",
            "Host applications and submitted contact emails can be seen only by you and by BlockMeet administrators.",
          ],
        },
        {
          heading: "Who we share information with",
          paragraphs: [
            "We do not sell your personal information. We use trusted service providers to run BlockMeet:",
          ],
          items: [
            "Supabase, which provides our database, sign-in and file storage.",
            "Vercel, which hosts the website.",
            "Google Fonts and Unsplash, which deliver fonts and some images; your browser contacts them when you load a page.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: ["We use only the essential cookies and browser storage needed to keep you signed in. We do not use advertising cookies."],
        },
        {
          heading: "How long we keep information",
          paragraphs: ["We keep account information while your account is active. Moderation records are kept so we can show how decisions were made. You can ask us to delete your account and the personal information we hold about you."],
        },
        {
          heading: "Your choices and rights",
          paragraphs: [
            "Depending on where you live, including under Nigeria's Data Protection Act 2023, you may have the right to access, correct or delete your personal information, and to object to certain uses. You can change your password from your account page at any time.",
          ],
        },
        {
          heading: "Security",
          paragraphs: ["We protect information with access rules in our database, encrypted connections and limited staff access. No online service can promise perfect security, so please use a strong, unique password."],
        },
        {
          heading: "Children",
          paragraphs: ["BlockMeet is not intended for children under 16, and we do not knowingly collect their information."],
        },
        {
          heading: "Changes to this policy",
          paragraphs: ["We may update this policy as BlockMeet grows. The date at the top shows when it last changed."],
        },
        {
          heading: "Contact",
          paragraphs: ["Contact details for privacy requests will be published on this page before BlockMeet's public launch."],
        },
      ]}
    />
  );
}
