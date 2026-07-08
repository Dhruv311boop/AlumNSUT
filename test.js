async function main() {
  const API_URL = 'http://localhost:5001';

  console.log('Testing against Vercel deployment:', API_URL);

  // 1. Create a Student
  console.log('\\n--- Creating Student ---');
  let res = await fetch(`${API_URL}/api/auth/student/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `student_${Date.now()}@test.com`,
      password: 'password123',
      fullName: 'Alice Test',
      phone: '1234567890',
      department: 'Computer Engineering',
      graduationYear: 2026,
      linkedinUrl: 'https://linkedin.com/in/alicetest',
      githubUrl: '',
      bio: 'Test student account.',
      profilePicture: ''
    })
  });
  
  if (!res.ok) {
    console.error('Failed to create student:', await res.text());
    return;
  }
  const studentData = await res.json();
  console.log('Student created. Token:', studentData.accessToken.substring(0, 20) + '...');
  const studentToken = studentData.accessToken;

  // 2. Create a Mentor
  console.log('\\n--- Creating Mentor ---');
  res = await fetch(`${API_URL}/api/auth/mentor/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `mentor_${Date.now()}@test.com`,
      password: 'password123',
      fullName: 'Bob Test',
      phone: '0987654321',
      company: 'Test Corp',
      currentPosition: 'Senior Engineer',
      yearsOfExperience: 5,
      industry: 'Software',
      bio: 'Test mentor account.',
      linkedinUrl: 'https://linkedin.com/in/bobtest',
      availability: ['Mon 10AM'],
      profilePicture: ''
    })
  });

  if (!res.ok) {
    console.error('Failed to create mentor:', await res.text());
    return;
  }
  const mentorData = await res.json();
  console.log('Mentor created. Token:', mentorData.accessToken.substring(0, 20) + '...');
  const mentorToken = mentorData.accessToken;

  // 3. Create a Forum Post by Student
  console.log('\\n--- Creating Forum Post (Student) ---');
  res = await fetch(`${API_URL}/api/forum`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      title: 'How to prepare for placements?',
      content: 'Any tips on algorithms?',
      category: 'Placements',
      tags: ['placements', 'help'],
      isAnonymous: false
    })
  });

  if (!res.ok) {
    console.error('Failed to create post:', await res.text());
    return;
  }
  const post = await res.json();
  console.log('Post created:', post.title);

  // 4. Mentor comments on the post
  console.log('\\n--- Creating Comment (Mentor) ---');
  res = await fetch(`${API_URL}/api/forum/${post.id}/comments`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mentorToken}`
    },
    body: JSON.stringify({
      content: 'Focus on Data Structures and practice on LeetCode!'
    })
  });

  if (!res.ok) {
    console.error('Failed to add comment:', await res.text());
    return;
  }
  console.log('Comment added successfully!');

  // 5. Mentor likes the post
  console.log('\\n--- Liking Post (Mentor) ---');
  res = await fetch(`${API_URL}/api/forum/${post.id}/like`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${mentorToken}`
    }
  });

  if (!res.ok) {
    console.error('Failed to like post:', await res.text());
    return;
  }
  console.log('Post liked successfully!');

  console.log('\\n✅ Full API flow tested successfully against production!');
}

main().catch(console.error);
