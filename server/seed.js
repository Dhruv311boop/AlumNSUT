require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock data...');

  // Hash password
  const password = await bcrypt.hash('password123', 10);

  // 1. Create a Student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password,
      role: 'STUDENT',
      studentProfile: {
        create: {
          fullName: 'Alice Smith',
          phone: '1234567890',
          department: 'Computer Engineering',
          graduationYear: 2026,
          linkedinUrl: 'https://linkedin.com/in/alicesmith',
          bio: 'Passionate computer engineering student.',
          profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
        }
      }
    }
  });

  // 2. Create a Mentor
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@example.com' },
    update: {},
    create: {
      email: 'mentor@example.com',
      password,
      role: 'MENTOR',
      mentorProfile: {
        create: {
          fullName: 'Bob Johnson',
          phone: '0987654321',
          currentPosition: 'Senior Software Engineer',
          company: 'Google',
          industry: 'Technology',
          yearsOfExperience: 5,
          bio: 'NSUT Alum working at Google.',
          availability: ['Monday 10AM-12PM', 'Wednesday 2PM-4PM'],
          profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
        }
      }
    }
  });

  // 3. Create a Forum Post by Student
  const post1 = await prisma.forumPost.create({
    data: {
      title: 'How to prepare for Google interviews?',
      content: 'I am a 3rd year student looking for advice on how to start preparing for Google SWE internships. Any tips on data structures or algorithms to focus on?',
      category: 'Placements',
      tags: ['google', 'swe', 'internship', 'dsa'],
      authorId: student.id,
      isAnonymous: false
    }
  });

  // 4. Create a Forum Post by Mentor
  const post2 = await prisma.forumPost.create({
    data: {
      title: 'Open Source contributions can land you a job',
      content: 'Just wanted to share my experience: actively contributing to open source projects helped me build a great portfolio and landed me interviews at top tech companies. Highly recommend doing this!',
      category: 'Career',
      tags: ['opensource', 'career', 'advice'],
      authorId: mentor.id,
      isAnonymous: false,
      likesCount: 1
    }
  });

  // 5. Add a like from Student to Mentor's post
  await prisma.like.create({
    data: {
      userId: student.id,
      postId: post2.id
    }
  });

  // 6. Add a comment from Mentor to Student's post
  await prisma.comment.create({
    data: {
      content: 'Focus heavily on Trees, Graphs, and Dynamic Programming. LeetCode mediums and hards are your best friends. Make sure to communicate your thought process clearly during the interview!',
      postId: post1.id,
      authorId: mentor.id
    }
  });

  // 7. Add a comment from Student to Mentor's post
  await prisma.comment.create({
    data: {
      content: 'That is great advice! Do you have any recommended beginner-friendly open source projects?',
      postId: post2.id,
      authorId: student.id
    }
  });

  console.log('Seeding finished.');
  console.log('Student credentials: student@example.com / password123');
  console.log('Mentor credentials: mentor@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
