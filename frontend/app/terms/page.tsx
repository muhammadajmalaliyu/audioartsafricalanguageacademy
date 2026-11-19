import Link from "next/link";
import { Legal, H, UL, Mail } from "@/components/Legal";

export const metadata = { title: "Terms of Use | Audio Arts Africa Language Academy", description: "The rules for using Audio Arts Africa Language Academy." };

export default function Terms() {
  return (
    <Legal title="Terms of Use" updated="16 November 2026"
      intro="Welcome to Audio Arts Africa Language Academy (“the Academy”), a free platform for learning Nigerian languages, run as a project of Audio Arts Africa, a company registered in Nigeria. By creating an account or using the website, you agree to these terms. If you do not agree, please do not use the Academy.">

      <H>1. Your account</H>
      <UL items={[
        "Give us correct information and keep your password private. You are responsible for activity on your account.",
        "The Academy is for people aged 13 and over. If you are under 18, use it with a parent or guardian's permission.",
        "Tell us straight away if you think someone else is using your account.",
      ]} />

      <H>2. Using the Academy</H>
      <p>The Academy is free for your personal, non-commercial learning. Please do not:</p>
      <UL items={[
        "copy, scrape, download in bulk, resell or republish our lessons or recordings without our written permission;",
        "try to break, overload or gain unauthorised access to the website or other people's accounts;",
        "post or send anything unlawful, abusive, hateful or misleading;",
        "pretend to be someone else.",
      ]} />
      <p>You are welcome to share links to the Academy and to our articles.</p>

      <H>3. Our content</H>
      <p>The lessons, recordings, design, logo and text belong to Audio Arts Africa, or to the volunteers and other owners who allowed us to use them. These terms give you permission to use them for personal learning only. All other rights are reserved.</p>

      <H>4. Accuracy of lessons</H>
      <p>We work hard to make our lessons accurate, but languages have many dialects and ways of speaking, and mistakes can happen. The Academy is for learning and cultural interest and is not an official qualification or translation service. If you spot an error, please tell us at <Mail />.</p>

      <H>5. Volunteers</H>
      <p>If you volunteer a recording, you confirm that it is your own voice and that you are free to give it to us. You allow Audio Arts Africa to use your recording, and the name you choose to be credited under, in our lessons, on the platform and to promote the Academy. Volunteering is unpaid unless we agree otherwise in writing. You can ask us at any time to stop using your recording in future material or to remove your name from the Wall of Voices.</p>

      <H>6. Sponsors and partners</H>
      <p>Sending an enquiry through our website does not create a contract. Any sponsorship or partnership will only apply once it is agreed in writing by both sides.</p>

      <H>7. Availability and changes to the service</H>
      <p>The Academy is a free service. We may add, change, pause or remove features, lessons or languages, and we do not promise that the website will always be available or free of errors.</p>

      <H>8. Third-party links</H>
      <p>Our site links to services such as WhatsApp. We do not control them and are not responsible for their content or privacy practices.</p>

      <H>9. Our responsibility</H>
      <p>The Academy is provided “as is”. To the fullest extent the law allows, Audio Arts Africa is not liable for losses that arise from using, or being unable to use, the Academy. Nothing in these terms limits any right or liability that cannot lawfully be limited.</p>

      <H>10. Suspending accounts</H>
      <p>We may suspend or close an account that breaks these terms or puts others at risk. You may stop using the Academy at any time and can ask us to delete your account by writing to <Mail />.</p>

      <H>11. Changes to these terms</H>
      <p>We may update these terms as the Academy grows. The date at the top shows the latest version. If you keep using the Academy after a change, you accept the updated terms.</p>

      <H>12. Governing law</H>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria, and any dispute will be dealt with by the courts of Nigeria.</p>

      <H>13. Contact us</H>
      <p>Email: <Mail />. WhatsApp: 0802 960 9876. Please also read our <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.</p>
    </Legal>
  );
}
