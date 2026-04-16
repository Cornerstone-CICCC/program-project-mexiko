import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// create fake user
// Run command : npx ts-node --esm src/utils/seed.ts

const rootPath = process.cwd();
dotenv.config({ path: path.join(rootPath, ".env") });

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        id: { type: String, unique: true },
        firebaseUid: String,
        email: String,
      },
      { strict: false },
    ),
  );

const ALL_MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const generateCanadaCoordinates = (fakerInstance: any): [number, number] => {
  const cities: [number, number][] = [
    [-123.1207, 49.2827], // Vancouver
    [-79.3832, 43.6532], // Toronto
    [-114.0708, 51.0447], // Calgary
    [-73.5673, 45.5017], // Montreal
    [-75.6972, 45.4215], // Ottawa
  ];
  const base = fakerInstance.helpers.arrayElement(cities);
  return [
    base[0] + (Math.random() - 0.5) * 0.5,
    base[1] + (Math.random() - 0.5) * 0.5,
  ];
};

const seedUsers = async (count: number) => {
  const { faker } = await import("@faker-js/faker");

  try {
    const MONGO_URI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PC-final-project";

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully.");

    const mockUsers = Array.from({ length: count }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        id: faker.string.uuid(),
        firebaseUid: faker.string.alphanumeric(28),
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        fullName: { first: firstName, last: lastName },
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        birthDate: faker.date.birthdate({ min: 19, max: 40, mode: "age" }),
        isAdmin: false,
        mbtiType: faker.helpers.arrayElement(ALL_MBTI_TYPES),
        keywords: [faker.word.adjective(), faker.word.noun()],
        Interests: faker.helpers.arrayElements(
          ["Hockey", "Skiing", "Yoga", "Coding", "Hiking"],
          3,
        ),
        bio: `Hi! I'm ${firstName} from Canada. ${faker.lorem.sentence()}`,
        profileImage: "",
        subImages: [],
        lastDailyMatchDate: "",
        isSuspended: false,
        reportedCount: 0,
        lastLogin: new Date(),
        isDeleted: false,
        location: {
          type: "Point",
          coordinates: generateCanadaCoordinates(faker),
        },
        preferredAgeRange: { min: 19, max: 35 },
        preferredDistance: faker.number.int({ min: 10, max: 50 }),
        preferredGender: "All",
        mbtiTestchecked: true,
      };
    });

    await User.insertMany(mockUsers, { ordered: false });
    console.log(`🚀 Successfully seeded ${count} mock users in Canada!`);
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedUsers(100);
