import { Language } from "./models";

const CONTENT = [
  {
    name: "Hausa", code: "ha", greeting: "Sannu",
    tagline: "One of the most widely spoken languages in Africa, and the voice of northern Nigeria.",
    history: `Hausa belongs to the Chadic branch of the Afroasiatic language family. Its homeland is northern Nigeria and southern Niger, where the old Hausa city-states of Kano, Katsina, Zazzau (Zaria), Daura, Gobir, Rano and Biram grew into centres of trade, scholarship and craft.

Traders carried Hausa along the trans-Saharan routes, and today it is a lingua franca across West Africa, spoken in Nigeria, Niger, Ghana, Cameroon, Chad, Benin, Togo and beyond. More than 50 million people speak it as a first language, and many millions more use it as a second language.

Hausa was written in Ajami (an adaptation of the Arabic script) for centuries before the Latin-based alphabet, known as boko, became the standard in the 20th century. Today Hausa is heard on national and international radio, and is the language of the Kannywood film industry in Kano.`,
    culture: `Greetings are the heart of Hausa social life. Asking after someone's night, day, family and work is a sign of respect, and elders are always greeted first.

Hausa culture is closely tied to Islam and to colourful festivals such as Eid (Sallah) and the royal Durbar, with horsemen in full regalia. Traditional dress includes the flowing babban riga and the embroidered hula cap. Favourite foods include tuwo shinkafa, miyan kuka, suya, kilishi and fura da nono.

Hausa is rich in proverbs (karin magana), praise songs and poetry (waƙa), and Kano remains one of West Africa's oldest and most famous trading cities.`,
    alphabet: "A B Ɓ C D Ɗ E F G H I J K Ƙ L M N O R S Sh T Ts U W Y Ƴ Z",
    specialChars: `Ɓ ɓ|A "b" made with a little air drawn inward. Example: ɓarna (damage).
Ɗ ɗ|A "d" made with a little air drawn inward. Example: ɗaya (one).
Ƙ ƙ|A "k" pronounced with a sharp pop in the throat. Example: ƙasa (ground, country).
Ƴ ƴ|A glottalised "y". Example: ƴa (daughter), also written 'ya.
Ts ts|A sharp "ts" sound. Example: tsaya (stop).
C c|Pronounced like English "ch". Example: ci (to eat).
Sh sh|As in English "she". Example: shayi (tea).
R r|A quick tapped or rolled "r". Example: rana (sun, day).
' |A glottal stop, a tiny catch in the throat. Example: a'a (no).`,
    funFacts: `Hausa is a tonal language: the pitch of a vowel can change a word's meaning, although tones are not normally written.
Hausa nouns and many forms are masculine or feminine. That is why you say "sunanka" to a man and "sunanki" to a woman.
Hausa borrowed many words from Arabic, for example alƙalami (pen) from the Arabic qalam.
Writing Hausa in Ajami script is a centuries-old tradition that is still used today.`,
  },
  {
    name: "Yorùbá", code: "yo", greeting: "Báwo ni",
    tagline: "A tonal language of the south-west, famous for proverbs, praise poetry and the talking drum.",
    history: `Yorùbá belongs to the Niger-Congo language family. It is spoken by more than 40 million people, mainly in south-western Nigeria (including Lagos, Ogun, Oyo, Osun, Ondo and Ekiti states) and in Benin and Togo.

Ile-Ife is regarded by the Yorùbá as the spiritual home of their people, and the city's ancient bronze and terracotta heads are admired around the world. Powerful kingdoms such as Old Oyo shaped the region's history.

Through the Atlantic slave trade, Yorùbá language and traditions travelled to Cuba, Brazil, Trinidad and beyond, where they live on in religion, music and song. In the 19th century, scholars such as Samuel Ajayi Crowther wrote down Yorùbá in Latin letters, laying the foundation for the written standard used today.`,
    culture: `Respect is expressed in language. The plural "ẹ" is used to greet elders and people you honour, and traditionally men prostrate and women kneel when greeting elders.

Yorùbá culture is famous for oríkì (praise poetry), òwe (proverbs), names that carry deep meaning, and the dùndún "talking drum", which can imitate the tones of speech. Festivals include the Osun-Osogbo festival, Eyo in Lagos, Ojude Oba in Ijebu-Ode and Egungun masquerades.

Aso-oke woven cloth, the gele headtie and the agbada gown are admired symbols of celebration. Popular foods include amala with ewedu and gbegiri, iyan (pounded yam), moin-moin and akara.`,
    alphabet: "A B D E Ẹ F G Gb H I J K L M N O Ọ P R S Ṣ T U W Y",
    specialChars: `Ẹ ẹ|An open "e", like the "e" in "bed". Example: ẹja (fish).
Ọ ọ|An open "o", like the "aw" in "saw". Example: ọmọ (child).
Ṣ ṣ|Pronounced "sh", as in "she". Example: ṣe (to do, to make).
Gb gb|A "g" and "b" said together at the same moment. Example: gba (to receive).
P p|A quick "kp" sound made with both lips. Example: pẹ̀lẹ́ o (sorry, take it easy).
À|A grave accent marks a low tone.
Á|An acute accent marks a high tone. A vowel with no mark has a middle tone.`,
    funFacts: `Yorùbá has three tones (high, middle and low), and they change meaning completely: ọkọ (husband), ọkọ̀ (vehicle) and ọ̀kọ̀ (spear) differ only in tone and the dot below.
The standard Yorùbá alphabet has 25 letters. C, Q, V, X and Z are not used.
Yorùbá names are sentences. Akínọlá, for example, expresses that valour brings honour.
The talking drum can "speak" Yorùbá because it copies the language's tones.`,
  },
  {
    name: "Igbo", code: "ig", greeting: "Ndewo",
    tagline: "The language of the south-east, rich in proverbs, music and community spirit.",
    history: `Igbo belongs to the Niger-Congo language family. It is spoken by more than 30 million people, mainly in south-eastern Nigeria (including Anambra, Imo, Abia, Enugu and Ebonyi states) and in parts of Delta and Rivers states, with large communities across the world.

The people of the region created some of Africa's most remarkable early art: the Igbo-Ukwu bronzes, dating from around the 9th century, show extraordinary skill. Igbo communities were traditionally governed by councils of elders, title-holders and age grades, so strong community ties and personal achievement have long been valued.

Igbo has many dialects. The standard written form blends them, and the Onwu alphabet of 1961 is the basis of the spelling used in schools today.`,
    culture: `Hospitality is central to Igbo life, and the breaking and sharing of the kola nut (oji) is the traditional welcome to a guest.

The New Yam Festival (Iri ji) celebrates the harvest, and colourful masquerades (mmanwu), the ogene gong and the ekwe drum mark ceremonies across the region. The writer Chinua Achebe described proverbs as the palm-oil with which words are eaten, and proverbs remain a prized form of speech.

Traditional dress includes the isi agu top and the red cap worn by title-holders. Popular dishes include ofe onugbu, ofe oha, abacha, akpu, nkwobi and, of course, yam. Igbo names such as Chukwuemeka ("God has done great things") are statements of faith and gratitude.`,
    alphabet: "A B Ch D E F G Gb Gh Gw H I Ị J K Kp Kw L M N Ṅ Nw Ny O Ọ P R S Sh T U Ụ V W Y Z",
    specialChars: `Ị ị|A relaxed "i", like the "i" in "bit". Example: ịhụnanya (love).
Ọ ọ|An open "o", like the "aw" in "saw". Example: ọkụ (fire).
Ụ ụ|A relaxed "u", like the "oo" in "book". Example: ụlọ (house).
Ṅ ṅ|The "ng" sound in "sing". Example: ṅụọ (drink).
Gb gb, Kp kp|Two sounds made together at the same moment. Example: kpọọ (call).
Gw, Kw, Nw|The sound plus a rounded "w". Example: nwa (child).
Ny ny|Like "ny" in "canyon" or Spanish "ñ". Example: nye (give).
Ch ch, Sh sh|As in English "church" and "shoe". Example: chi (a personal spirit or God).`,
    funFacts: `Igbo is tonal: ákwá (cry), àkwá (egg), ákwà (cloth) and àkwà (bed or bridge) are written the same but sound different.
The standard Igbo alphabet has 36 letters, including digraphs such as Ch, Gb, Kp and Nw.
Igbo has vowel harmony, which means vowels in a word tend to come from one of two groups.
Many Igbo names are whole sentences with a meaning worth learning.`,
  },
];

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const FIELDS = ["greeting", "tagline", "history", "culture", "alphabet", "specialChars", "funFacts"];

/** Adds Hausa/Yorùbá/Igbo and fills in empty welcome-page content. Never overwrites text an admin has edited. */
export async function ensureLanguages() {
  const all: any[] = await Language.find();
  for (const c of CONTENT) {
    const l: any = all.find(x => norm(x.name) === norm(c.name));
    if (!l) { await Language.create(c); console.log("Language added:", c.name); continue; }
    let changed = false;
    for (const f of FIELDS) if (!l[f]) { l[f] = (c as any)[f]; changed = true; }
    if (changed) { await l.save(); console.log("Language content filled:", l.name); }
  }
}
