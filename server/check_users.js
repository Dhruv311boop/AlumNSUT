const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Students ---');
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: true }
  });
  console.log(JSON.stringify(students, null, 2));

  console.log('\\n--- Mentors ---');
  const mentors = await prisma.user.findMany({
    where: { role: 'MENTOR' },
    include: { mentorProfile: true }
  });
  console.log(JSON.stringify(mentors, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
