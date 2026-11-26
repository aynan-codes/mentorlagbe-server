import "dotenv/config";
import { connectDB, getDB } from "../config/db.js";

const seedTuitions = async () => {
  try {
    await connectDB();

    const db = getDB();

    const tutor = await db.collection("users").findOne({
      role: "tutor",
      __ba_model: "user",
    });

    if (!tutor) {
      throw new Error(
        "No tutor account found. Create a tutor account first."
      );
    }

    const tutorName = tutor.name || "MentorLagbe Tutor";
    const tutorEmail = tutor.email;

    // Subject-specific images
    const subjectImages = {
      Mathematics:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",

      English:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",

      Bangla:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",

      Physics:
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",

      Chemistry:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",

      Biology:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",

      ICT:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",

      "Higher Mathematics":
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",

      "General Science":
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",

      "Bangladesh and Global Studies":
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",

      "Social Science":
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",

      Accounting:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",

      Economics:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",

      "Finance and Banking":
        "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&q=80",

      "Business Entrepreneurship":
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",

      Geography:
        "https://images.unsplash.com/photo-1524666041070-9b8768338538?w=800&q=80",

      "Islam and Moral Education":
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",

      "Physical Education":
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",

      Agriculture:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",

      "Home Science":
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",

      "All Subjects":
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    };

    const rawTuitions = [
      // Class 1-5
      {
        title: "Class 1 All Subjects Tuition",
        subject: "All Subjects",
        classLevel: "Class 1",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 2000,
        daysPerWeek: 5,
        description: "Complete academic support for class one students.",
      },
      {
        title: "Class 1 Bangla Tuition",
        subject: "Bangla",
        classLevel: "Class 1",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 1500,
        daysPerWeek: 3,
        description: "Bangla reading, writing and basic grammar.",
      },
      {
        title: "Class 2 English Tuition",
        subject: "English",
        classLevel: "Class 2",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 1800,
        daysPerWeek: 4,
        description: "English reading, vocabulary and grammar.",
      },
      {
        title: "Class 2 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 2",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 1800,
        daysPerWeek: 3,
        description: "Basic mathematics and problem-solving practice.",
      },
      {
        title: "Class 3 All Subjects Tuition",
        subject: "All Subjects",
        classLevel: "Class 3",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 2500,
        daysPerWeek: 5,
        description: "Complete primary academic preparation.",
      },
      {
        title: "Class 3 Science Tuition",
        subject: "General Science",
        classLevel: "Class 3",
        mode: "online",
        location: "Sylhet",
        monthlyFee: 1800,
        daysPerWeek: 3,
        description: "Easy science lessons with practical examples.",
      },
      {
        title: "Class 4 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 4",
        mode: "offline",
        location: "Rajshahi",
        monthlyFee: 2200,
        daysPerWeek: 4,
        description: "Mathematics fundamentals and regular practice.",
      },
      {
        title: "Class 4 English Tuition",
        subject: "English",
        classLevel: "Class 4",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 2000,
        daysPerWeek: 3,
        description: "English grammar and writing improvement.",
      },
      {
        title: "Class 5 All Subjects Tuition",
        subject: "All Subjects",
        classLevel: "Class 5",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 3000,
        daysPerWeek: 5,
        description: "Complete academic preparation for primary students.",
      },
      {
        title: "Class 5 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 5",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 2500,
        daysPerWeek: 4,
        description: "Mathematics preparation with chapter-wise practice.",
      },

      // Class 6-8
      {
        title: "Class 6 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 6",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 2500,
        daysPerWeek: 4,
        description: "Build a strong foundation in mathematics.",
      },
      {
        title: "Class 6 English Tuition",
        subject: "English",
        classLevel: "Class 6",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 2500,
        daysPerWeek: 3,
        description: "English grammar, vocabulary and writing.",
      },
      {
        title: "Class 6 Science Tuition",
        subject: "General Science",
        classLevel: "Class 6",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 2500,
        daysPerWeek: 4,
        description: "Science fundamentals with practical examples.",
      },
      {
        title: "Class 7 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 7",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 3000,
        daysPerWeek: 4,
        description: "Class seven mathematics chapter-wise preparation.",
      },
      {
        title: "Class 7 English Tuition",
        subject: "English",
        classLevel: "Class 7",
        mode: "online",
        location: "Sylhet",
        monthlyFee: 2800,
        daysPerWeek: 3,
        description: "Improve English grammar and writing skills.",
      },
      {
        title: "Class 7 ICT Tuition",
        subject: "ICT",
        classLevel: "Class 7",
        mode: "offline",
        location: "Rajshahi",
        monthlyFee: 2500,
        daysPerWeek: 3,
        description: "Introduction to information and communication technology.",
      },
      {
        title: "Class 8 Physics Tuition",
        subject: "Physics",
        classLevel: "Class 8",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 3000,
        daysPerWeek: 3,
        description: "Understand physics concepts through practical examples.",
      },
      {
        title: "Class 8 Chemistry Tuition",
        subject: "Chemistry",
        classLevel: "Class 8",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 3000,
        daysPerWeek: 4,
        description: "Basic chemistry and scientific concepts.",
      },
      {
        title: "Class 8 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 8",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 3200,
        daysPerWeek: 4,
        description: "Strengthen mathematics skills with regular practice.",
      },
      {
        title: "Class 8 Bangla Tuition",
        subject: "Bangla",
        classLevel: "Class 8",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 2500,
        daysPerWeek: 3,
        description: "Bangla grammar, literature and writing preparation.",
      },

      // Class 9-10
      {
        title: "Class 9 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 9",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 4000,
        daysPerWeek: 4,
        description: "SSC mathematics preparation with regular tests.",
      },
      {
        title: "Class 9 Physics Tuition",
        subject: "Physics",
        classLevel: "Class 9",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 3500,
        daysPerWeek: 3,
        description: "Physics concepts, formulas and numerical problems.",
      },
      {
        title: "Class 9 Chemistry Tuition",
        subject: "Chemistry",
        classLevel: "Class 9",
        mode: "offline",
        location: "Rajshahi",
        monthlyFee: 3500,
        daysPerWeek: 4,
        description: "Chemistry fundamentals and chapter-wise preparation.",
      },
      {
        title: "Class 9 Biology Tuition",
        subject: "Biology",
        classLevel: "Class 9",
        mode: "online",
        location: "Sylhet",
        monthlyFee: 3500,
        daysPerWeek: 3,
        description: "Biology concepts, diagrams and exam preparation.",
      },
      {
        title: "Class 9 Higher Mathematics Tuition",
        subject: "Higher Mathematics",
        classLevel: "Class 9",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 4000,
        daysPerWeek: 4,
        description: "Advanced mathematics and problem-solving techniques.",
      },
      {
        title: "Class 9 ICT Tuition",
        subject: "ICT",
        classLevel: "Class 9",
        mode: "online",
        location: "Chattogram",
        monthlyFee: 3000,
        daysPerWeek: 3,
        description: "ICT fundamentals and practical concepts.",
      },
      {
        title: "Class 10 Mathematics Tuition",
        subject: "Mathematics",
        classLevel: "Class 10",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 5000,
        daysPerWeek: 4,
        description: "Complete SSC mathematics preparation.",
      },
      {
        title: "Class 10 English Tuition",
        subject: "English",
        classLevel: "Class 10",
        mode: "online",
        location: "Rajshahi",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "SSC English first and second paper preparation.",
      },
      {
        title: "Class 10 Physics Tuition",
        subject: "Physics",
        classLevel: "Class 10",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 4500,
        daysPerWeek: 4,
        description: "SSC physics preparation with numerical practice.",
      },
      {
        title: "Class 10 Chemistry Tuition",
        subject: "Chemistry",
        classLevel: "Class 10",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "SSC chemistry with chapter-wise explanations.",
      },
      {
        title: "Class 10 Biology Tuition",
        subject: "Biology",
        classLevel: "Class 10",
        mode: "offline",
        location: "Sylhet",
        monthlyFee: 4000,
        daysPerWeek: 4,
        description: "SSC biology with diagrams and model tests.",
      },
      {
        title: "Class 10 Higher Mathematics Tuition",
        subject: "Higher Mathematics",
        classLevel: "Class 10",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 4500,
        daysPerWeek: 4,
        description: "SSC higher mathematics and advanced problem solving.",
      },
      {
        title: "Class 10 Bangladesh and Global Studies Tuition",
        subject: "Bangladesh and Global Studies",
        classLevel: "Class 10",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 3000,
        daysPerWeek: 3,
        description: "SSC Bangladesh and Global Studies preparation.",
      },
      {
        title: "Class 10 Accounting Tuition",
        subject: "Accounting",
        classLevel: "Class 10",
        mode: "online",
        location: "Rajshahi",
        monthlyFee: 3500,
        daysPerWeek: 3,
        description: "Accounting basics and financial calculations.",
      },
      {
        title: "Class 10 Agriculture Tuition",
        subject: "Agriculture",
        classLevel: "Class 10",
        mode: "offline",
        location: "Mymensingh",
        monthlyFee: 3000,
        daysPerWeek: 3,
        description: "Agriculture studies and practical concepts.",
      },

      // HSC / Intermediate
      {
        title: "HSC Higher Mathematics Tuition",
        subject: "Higher Mathematics",
        classLevel: "HSC",
        mode: "offline",
        location: "Chattogram",
        monthlyFee: 6000,
        daysPerWeek: 4,
        description: "HSC higher mathematics first and second paper.",
      },
      {
        title: "HSC Physics Tuition",
        subject: "Physics",
        classLevel: "HSC",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 5000,
        daysPerWeek: 4,
        description: "HSC physics with numerical and conceptual practice.",
      },
      {
        title: "HSC Chemistry Tuition",
        subject: "Chemistry",
        classLevel: "HSC",
        mode: "offline",
        location: "Rajshahi",
        monthlyFee: 5000,
        daysPerWeek: 4,
        description: "HSC chemistry first and second paper preparation.",
      },
      {
        title: "HSC Biology Tuition",
        subject: "Biology",
        classLevel: "HSC",
        mode: "online",
        location: "Sylhet",
        monthlyFee: 4500,
        daysPerWeek: 3,
        description: "HSC biology with diagrams and board questions.",
      },
      {
        title: "HSC English Tuition",
        subject: "English",
        classLevel: "HSC",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "HSC English first and second paper preparation.",
      },
      {
        title: "HSC Bangla Tuition",
        subject: "Bangla",
        classLevel: "HSC",
        mode: "online",
        location: "Chattogram",
        monthlyFee: 3500,
        daysPerWeek: 3,
        description: "HSC Bangla literature, grammar and writing.",
      },
      {
        title: "HSC ICT Tuition",
        subject: "ICT",
        classLevel: "HSC",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "HSC ICT theory, programming and practical preparation.",
      },
      {
        title: "HSC Accounting Tuition",
        subject: "Accounting",
        classLevel: "HSC",
        mode: "online",
        location: "Dhaka",
        monthlyFee: 4500,
        daysPerWeek: 3,
        description: "HSC accounting first and second paper.",
      },
      {
        title: "HSC Economics Tuition",
        subject: "Economics",
        classLevel: "HSC",
        mode: "offline",
        location: "Rajshahi",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "HSC economics concepts and analytical preparation.",
      },
      {
        title: "HSC Finance and Banking Tuition",
        subject: "Finance and Banking",
        classLevel: "HSC",
        mode: "online",
        location: "Chattogram",
        monthlyFee: 4500,
        daysPerWeek: 3,
        description: "HSC finance and banking concepts and calculations.",
      },
      {
        title: "HSC Business Entrepreneurship Tuition",
        subject: "Business Entrepreneurship",
        classLevel: "HSC",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "Business organization and entrepreneurship preparation.",
      },
      {
        title: "HSC Geography Tuition",
        subject: "Geography",
        classLevel: "HSC",
        mode: "online",
        location: "Sylhet",
        monthlyFee: 4000,
        daysPerWeek: 3,
        description: "HSC geography with maps and chapter-wise preparation.",
      },
      {
        title: "HSC Statistics Tuition",
        subject: "Mathematics",
        classLevel: "HSC",
        mode: "offline",
        location: "Dhaka",
        monthlyFee: 4500,
        daysPerWeek: 3,
        description: "HSC statistics and mathematical problem solving.",
      },
      {
        title: "HSC Social Science Tuition",
        subject: "Social Science",
        classLevel: "HSC",
        mode: "online",
        location: "Chattogram",
        monthlyFee: 3500,
        daysPerWeek: 3,
        description: "HSC social science concepts and exam preparation.",
      },
      {
        title: "HSC Islam and Moral Education Tuition",
        subject: "Islam and Moral Education",
        classLevel: "HSC",
        mode: "offline",
        location: "Cumilla",
        monthlyFee: 3000,
        daysPerWeek: 3,
        description: "Moral education and subject-based academic support.",
      },
    ];

    // Exactly 50 records
    if (rawTuitions.length !== 50) {
      throw new Error(
        `Expected 50 tuitions, found ${rawTuitions.length}`
      );
    }

    const seedData = rawTuitions.map((tuition) => ({
      ...tuition,
      bannerImage:
        subjectImages[tuition.subject] || subjectImages["All Subjects"],
      tutorName,
      tutorEmail,
      approvalStatus: "approved",
      isActive: true,
      isSeedData: true,
      createdAt: new Date(),
    }));

    // Remove only previous seed records.
    // Tutor-created tuition posts will remain untouched.
    await db.collection("tuitions").deleteMany({
      isSeedData: true,
    });

    await db.collection("tuitions").insertMany(seedData);

    const totalSeedTuitions = await db.collection("tuitions").countDocuments({
      isSeedData: true,
    });

    console.log(`${totalSeedTuitions} sample tuitions inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Tuition Seed Error:", error.message);
    process.exit(1);
  }
};

seedTuitions();