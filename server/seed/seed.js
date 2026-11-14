import { readFile } from "node:fs/promises";
import Quiz from "../models/Quiz.js";
import SportQuiz from "../models/sportQuiz.js";
import ComputerQuiz from "../models/computerQ.js";
import HistoryQuiz from "../models/historyQ.js";
import PoliticsQuiz from "../models/politicsQ.js";
import ArtQuiz from "../models/artQ.js";
import ScienceQuiz from "../models/scienceNatureQ.js";
import AnimalsQuiz from "../models/animalsQ.js";
import VehiclesQuiz from "../models/vehiclesQ.js";
import ComicsQuiz from "../models/comicsQ.js";
import User from "../models/User.js";

// Category key used by the client -> Mongoose model
const MODELS = {
  Gk: Quiz,
  sports: SportQuiz,
  Computers: ComputerQuiz,
  History: HistoryQuiz,
  Politics: PoliticsQuiz,
  Art: ArtQuiz,
  "Science&Nature": ScienceQuiz,
  Animals: AnimalsQuiz,
  Vehicles: VehiclesQuiz,
  Comics: ComicsQuiz,
};

export const DEMO_USER = {
  username: "demo",
  email: "demo@quizapp.dev",
  password: "demo1234",
  ph: 9000000000,
};

// Fills any empty category with the bundled questions (from Open Trivia DB,
// CC BY-SA 4.0) and creates the demo account if it is missing. Safe to run
// on every start: it never touches existing data.
export async function seedIfEmpty() {
  const questions = JSON.parse(
    await readFile(new URL("./questions.json", import.meta.url), "utf8")
  );

  for (const [key, Model] of Object.entries(MODELS)) {
    if (await Model.estimatedDocumentCount()) continue;
    const docs = (questions[key] || []).map((q) => ({
      ...q,
      // The client shows four options from incorrect_answers, so the
      // correct answer is stored in that list too (it shuffles them).
      incorrect_answers: [...q.incorrect_answers, q.correct_answer],
    }));
    await Model.insertMany(docs);
    console.log(`Seeded ${docs.length} ${key} questions`);
  }

  if (!(await User.exists({ email: DEMO_USER.email }))) {
    await new User({ ...DEMO_USER, currentPoints: 0, previousPoint: 0, totalPoints: 0 }).save();
    console.log(`Created demo user ${DEMO_USER.email}`);
  }
}
