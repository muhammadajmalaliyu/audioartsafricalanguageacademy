import Link from "next/link";
import { Legal, H, UL, Mail } from "@/components/Legal";

export const metadata = { title: "Privacy Policy | Audio Arts Africa Language Academy", description: "How Audio Arts Africa Language Academy collects, uses and protects your personal information." };

export default function Privacy() {
  return (
    <Legal title="Privacy Policy" updated="16 November 2026"
      intro="Audio Arts Africa Language Academy (“the Academy”, “we”, “us”) is a free platform for learning Nigerian languages, run as a project of Audio Arts Africa, a company registered in Nigeria. This policy explains what personal information we collect, why, who we share it with, and the choices you have.">

      <H>1. Information we collect</H>
      <UL items={[
        <><b>Account details:</b> your name, email address and password (stored only in scrambled, “hashed” form, so we cannot read it), and the language you chose to study.</>,
        <><b>Learning activity:</b> the lessons you open and complete, your quiz attempts and scores, and when you last studied, so we can save your progress.</>,
        <><b>How you found us:</b> if you sign up after trying the homepage demo, we store a simple label saying so. We use it to count sign-ups, not to profile you.</>,
        <><b>Volunteers:</b> your name, phone number and/or email, language, any notes you add, your voice recordings, and, only if you opt in, the name and profile link you want credited publicly.</>,
        <><b>Sponsors and partners:</b> your name, organisation, email or phone, and the message you send us.</>,
        <><b>Messages:</b> anything you send us by email or WhatsApp.</>,
        <><b>Technical data:</b> our hosting providers keep standard server logs (such as IP address and browser type) for security and reliability.</>,
      ]} />

      <H>2. How we use your information</H>
      <UL items={[
        "To create your account, keep you signed in and save your progress.",
        "To send emails you need: a welcome message and password-reset links.",
        "To reply to volunteers, sponsors and anyone who contacts us.",
        "To show anonymous totals on our Impact page (for example, lessons published or learners reached). These never include personal details.",
        "To keep the Academy secure, prevent abuse and fix problems.",
        "To improve our lessons and the website.",
      ]} />
      <p>We process your information with your consent, to provide the service you asked for, and for our legitimate interest in running and protecting the Academy, in line with the Nigeria Data Protection Act 2023.</p>

      <H>3. What is shown publicly</H>
      <p>Only two things can be public. The <Link href="/impact" className="text-accent hover:underline">Impact page</Link> shows totals only. The <Link href="/voices" className="text-accent hover:underline">Wall of Voices</Link> shows a volunteer&apos;s name, language and optional link, and only if the volunteer ticked the box to be credited and we approved it. Your email, phone number and learning progress are never shown publicly.</p>

      <H>4. Who we share it with</H>
      <p>We do not sell your personal information. We use trusted service providers to run the Academy, and they process data on our behalf:</p>
      <UL items={[
        "Vercel: hosts the website.",
        "Render: runs our server.",
        "MongoDB Atlas: stores our database.",
        "Cloudinary: stores and delivers audio recordings.",
        "Our email provider (such as Brevo or Gmail): sends our emails.",
      ]} />
      <p>Some of these providers store data outside Nigeria, so your information may be transferred and processed in other countries. We may also disclose information if the law requires it.</p>

      <H>5. Cookies and browser storage</H>
      <p>We use one essential, secure cookie that keeps you signed in (for up to 30 days, or until you log out). Your browser also stores a short label of how you reached the sign-up page until you sign up. At the time of writing we do not use advertising or tracking cookies. If we add analytics later, we will update this policy.</p>

      <H>6. How long we keep it</H>
      <p>We keep your account and progress while your account is active. We keep volunteer and enquiry details while they are needed for the project, and delete them when you ask us to. Backups may keep copies for a short time after deletion.</p>

      <H>7. Security</H>
      <p>We protect your information with encrypted connections (HTTPS), hashed passwords and restricted administrator access. No system is completely secure, so please choose a strong password and keep it private.</p>

      <H>8. Your rights</H>
      <p>You can ask us to give you a copy of your information, correct it, delete it, stop using it, or withdraw your consent (for example, to be removed from the Wall of Voices or to stop a recording being used in new material). Write to <Mail /> and we will respond within a reasonable time. You also have the right to complain to the Nigeria Data Protection Commission.</p>

      <H>9. Children</H>
      <p>The Academy is meant for people aged 13 and over. If you are under 18, please use it with the permission of a parent or guardian. If you believe a child has given us personal information without permission, contact us and we will delete it.</p>

      <H>10. Changes to this policy</H>
      <p>We may update this policy as the Academy grows. The date at the top shows when it last changed, and we will highlight important changes on the site.</p>

      <H>11. Contact us</H>
      <p>Audio Arts Africa Language Academy, Nigeria. Email: <Mail />. WhatsApp: 0802 960 9876. See also our <Link href="/terms" className="text-accent hover:underline">Terms of Use</Link>.</p>
    </Legal>
  );
}
