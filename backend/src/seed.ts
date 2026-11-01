import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Language, Course, Module, Lesson, Quiz } from "./models";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  if (!email || !process.env.ADMIN_PASSWORD) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  if (!(await User.exists({ email }))) {
    await User.create({ name: process.env.ADMIN_NAME || "Admin", email, role: "admin", passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) });
    console.log("Admin created:", email);
  }
  if (!(await Language.exists({ code: "ha" }))) {
    const lang = await Language.create({ name: "Hausa", code: "ha" });
    const course = await Course.create({ language: lang._id, title: "Hausa Beginner", level: "beginner", published: true,
      description: "Start speaking Hausa: greetings, courtesy and everyday phrases." });
    const mod = await Module.create({ course: course._id, title: "Greetings", order: 1 });
    const lesson = await Lesson.create({ course: course._id, module: mod._id, title: "Basic Greetings", order: 1, published: true, items: [
      { kind: "word", text: "Sannu", translation: "Hello" },
      { kind: "sentence", text: "Barka da safe", translation: "Good morning" },
      { kind: "sentence", text: "Ina wuni?", translation: "How is your day?" },
      { kind: "sentence", text: "Na gode", translation: "Thank you" },
      { kind: "sentence", text: "Sai an jima", translation: "See you later" },
    ] });
    await Quiz.create({ lesson: lesson._id, questions: [
      { prompt: "What does “Sannu” mean?", options: ["Goodbye", "Hello", "Thank you", "Please"], answerIndex: 1 },
      { prompt: "How do you say “Thank you”?", options: ["Sannu", "Sai an jima", "Na gode", "Barka da safe"], answerIndex: 2 },
      { prompt: "“Barka da safe” is said in the…", options: ["Morning", "Evening", "Night", "Afternoon"], answerIndex: 0 },
    ] });
    console.log("Sample Hausa Beginner course created (please review the wording and add your recordings).");
  }
  await mongoose.disconnect();
})();
