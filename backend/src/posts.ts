import { Post } from "./models";

const STARTERS = [
  {
    title: "How to greet elders respectfully in Yorùbá", slug: "how-to-greet-elders-respectfully-in-yoruba", language: "Yorùbá",
    excerpt: "Respect is built into the Yorùbá language. Learn the greetings, the respectful “ẹ”, and the traditional body language.",
    body: `In Yorùbá culture, greeting an elder properly is a sign of good upbringing. The language itself builds respect into every greeting.

## Use the respectful “ẹ”
Yorùbá has two ways of saying “you”. Use “o” with friends and people younger than you, and the plural “ẹ” with elders and anyone you want to honour. This is why you say “Ẹ kú àárọ̀” to one elderly person.

## Greetings for the time of day
- Ẹ kú àárọ̀ — good morning
- Ẹ kú ọ̀sán — good afternoon
- Ẹ kú ìrọ̀lẹ́ — good evening

## Greetings for what someone is doing
Yorùbá has a greeting for almost every activity. Say “Ẹ kú iṣẹ́” to someone who is working, and “Ẹ káàbọ̀” to welcome a visitor.

## Body language
Traditionally, men prostrate (ìdọ̀bálẹ̀) and women kneel (ìkúnlẹ̀) when greeting elders. Many families, especially in cities, now use a slight bow, but the respect behind the gesture is the same.

## Replying
Elders often reply with a blessing, and you can thank them with “Ẹ ṣé”.

## Practise with native audio
Hear every greeting spoken by native speakers in our free Yorùbá Beginner course.`,
  },
  {
    title: "Common Hausa phrases for travellers to Kano", slug: "common-hausa-phrases-for-travellers-to-kano", language: "Hausa",
    excerpt: "Kano is one of West Africa's great trading cities. These simple Hausa phrases will help you greet, shop and find your way.",
    body: `Kano is one of the oldest and most famous trading cities in West Africa, and a few Hausa phrases will make your visit warmer and easier.

## Start with a greeting
In Hausa culture, you ask after someone's health and family before you talk business. A friendly greeting opens every door.
- Sannu — hello
- Sannu da zuwa — welcome
- Barka da safe — good morning
- Na gode — thank you

## At the market
- Nawa ne wannan? — how much is this?
- Yana da tsada — it is expensive
- Rage mini farashi — reduce the price for me
- Zan saya — I will buy

## Getting around
- Ina so in je kasuwa — I want to go to the market
- Ka tsaya a nan — stop here
- Ina bukatar taimako — I need help

## Keep learning
Hear each phrase spoken by native speakers in our free Hausa Beginner course.`,
  },
  {
    title: "Igbo names and their deep meanings", slug: "igbo-names-and-their-deep-meanings", language: "Igbo",
    excerpt: "Many Igbo names are whole sentences. Discover the meanings behind some well-loved names.",
    body: `In Igbo culture, a name is more than a label. Many names are short sentences that express faith, hope, gratitude or family pride.

## Names that begin with “Chi”
“Chi” refers to God or one's personal spirit, so many names carry a prayer or a thank-you.
- Chukwuemeka — God has done great things
- Chinedu — God leads
- Chioma — good God

## Names about family and blessing
- Nneka — mother is supreme
- Obinna — father's heart
- Ngozi — blessing
- Ebere — mercy

## Why meaning matters
Because names are sentences, each time a child is called, a small blessing is spoken. Learning the language helps you understand the story behind every name.

## Learn more
Start our free Igbo Beginner course and hear the words spoken by native speakers.`,
  },
];

/** Adds three starter articles as DRAFTS the first time only. Review and publish them in Admin → Blog. */
export async function ensurePosts() {
  if (await Post.countDocuments()) return;
  await Post.insertMany(STARTERS.map(p => ({ ...p, published: false })));
  console.log("Starter blog drafts added");
}
