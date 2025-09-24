import { PrismaClient, Role, EventStatus, FieldType, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Create Super Admin
  const superAdminPassword = await bcrypt.hash("superAdmin237", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superAdmin@gmail.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superAdmin@gmail.com",
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("Super Admin seeded:", superAdmin.email);

  // 2️⃣ Create Schools
  const school1 = await prisma.school.upsert({
    where: { email: "school1@example.com" },
    update: {},
    create: {
      name: "Sunrise High School",
      email: "school1@example.com",
      approved: true,
      city: "Douala",
    },
  });

  const school2 = await prisma.school.upsert({
    where: { email: "school2@example.com" },
    update: {},
    create: {
      name: "Greenfield Academy",
      email: "school2@example.com",
      approved: true,
      city: "Yaoundé",
    },
  });

  console.log("Schools seeded:", school1.name, school2.name);

  // 3️⃣ Create Organizers
  const organizer1Password = await bcrypt.hash("organizer123", 10);
  const organizer1 = await prisma.user.upsert({
    where: { email: "organizer1@gmail.com" },
    update: {},
    create: {
      name: "Alice Organizer",
      email: "organizer1@gmail.com",
      password: organizer1Password,
      role: Role.SCHOOL_ORGANIZER,
      schoolId: school1.id,
    },
  });

  const organizer2Password = await bcrypt.hash("organizer123", 10);
  const organizer2 = await prisma.user.upsert({
    where: { email: "organizer2@gmail.com" },
    update: {},
    create: {
      name: "Bob Organizer",
      email: "organizer2@gmail.com",
      password: organizer2Password,
      role: Role.SCHOOL_ORGANIZER,
      schoolId: school2.id,
    },
  });

  console.log("Organizers seeded:", organizer1.name, organizer2.name);

  // 4️⃣ Create Events for organizers
  const event1 = await prisma.event.upsert({
    where: { eventLink: "spring-fundraiser-1" },
    update: {},
    create: {
      title: "Spring Fundraiser",
      description: "Annual school fundraising event",
      type: "WEDDING",
      status: EventStatus.APPROVED,
      date: new Date(),
      location: "School Hall",
      organizerId: organizer1.id,
      schoolId: school1.id,
      eventLink: "spring-fundraiser-1",
      paymentMethods: ["MOMO", "OM"], // adjust depending on your schema
      theme: { color: "blue", banner: "spring.jpg" },
    },
  });

  const event2 = await prisma.event.upsert({
    where: { eventLink: "greenfield-charity-2" },
    update: {},
    create: {
      title: "Greenfield Charity Event",
      description: "Charity event for students",
      type: "CHARITY",
      status: EventStatus.PENDING,
      date: new Date(),
      location: "Auditorium",
      organizerId: organizer2.id,
      schoolId: school2.id,
      eventLink: "greenfield-charity-2",
      paymentMethods: ["MOMO"],
      theme: { color: "green", banner: "charity.jpg" },
    },
  });

  console.log("Events seeded:", event1.title, event2.title);

  // 5️⃣ Create Event Fields
  const event1Fields = [
    { label: "Contributor Name", fieldType: FieldType.TEXT, required: true },
    { label: "Amount", fieldType: FieldType.NUMBER, required: true },
    { label: "Email", fieldType: FieldType.EMAIL, required: true },
  ];

  for (const field of event1Fields) {
    await prisma.eventField.create({
      data: { ...field, eventId: event1.id },
    });
  }

  console.log("Event fields for Event 1 seeded.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
