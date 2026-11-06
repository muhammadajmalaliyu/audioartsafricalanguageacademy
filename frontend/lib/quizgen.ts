export type QItem = { kind?: string; text: string; translation: string };
const shuf = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

/** Builds multiple-choice questions from a lesson's words/sentences (both directions). */
export function makeQuiz(items: QItem[], globalPool: QItem[] = items, count = 8) {
  const out: any[] = [];
  for (const it of shuf(items).slice(0, count)) {
    const toEnglish = Math.random() < 0.5;
    const key: "text" | "translation" = toEnglish ? "translation" : "text";
    const correct = it[key];
    const ok = (p: QItem) => p !== it && p[key] !== correct;
    const ordered = [
      ...shuf(items.filter(p => ok(p) && p.kind === it.kind)), ...shuf(items.filter(ok)),
      ...shuf(globalPool.filter(p => ok(p) && p.kind === it.kind)), ...shuf(globalPool.filter(ok)),
    ].map(p => p[key]);
    const wrong = Array.from(new Set(ordered)).slice(0, 3);
    if (wrong.length < 3) continue;
    const options = shuf([correct, ...wrong]);
    out.push({
      prompt: toEnglish ? `What does “${it.text}” mean?` : `How do you say “${it.translation}”?`,
      options, answerIndex: options.indexOf(correct),
    });
  }
  return out;
}
