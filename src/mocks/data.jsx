// Mock Database State

export const initialElection = {
  id: 'election-1',
  title: '2026 Campus Student Elections',
  status: 'OPEN', // 'OPEN' or 'CLOSED'
};

export const initialCategories = [
  { id: 'cat-1', name: 'Student Body President', electionId: 'election-1' },
  { id: 'cat-2', name: 'Vice President of Activities', electionId: 'election-1' },
  { id: 'cat-3', name: 'Treasurer', electionId: 'election-1' },
];

export const initialCandidates = [
  {
    id: 'cand-1',
    categoryId: 'cat-1',
    name: 'Alex Rivera',
    bio: 'Third-year Computer Science major. Passionate about transparency, coding workshops, and campus-wide hackathons.',
    manifesto: 'My manifesto is simple: expand campus technology funding, provide free textbooks online, and host student-led career fairs. Let\'s make our campus a hub for tech and innovation!',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 42,
  },
  {
    id: 'cand-2',
    categoryId: 'cat-1',
    name: 'Taylor Chen',
    bio: 'Third-year Economics major. Focused on budget optimization, student club resources, and green initiatives.',
    manifesto: 'I will work to reallocate 15% of unused administrative budgets directly back into student-run clubs, double the campus recycling bins, and mandate solar panels on all parking lot roofs.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 38,
  },
  {
    id: 'cand-3',
    categoryId: 'cat-2',
    name: 'Jordan Smith',
    bio: 'Second-year Communications major. Aims to improve student-faculty liaison and increase campus event frequency.',
    manifesto: 'Communication is the bridge to success. I will institute weekly town halls with faculty heads, launch an official college events mobile application, and fund monthly live-music festivals.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 29,
  },
  {
    id: 'cand-4',
    categoryId: 'cat-2',
    name: 'Morgan Davis',
    bio: 'Third-year Psychology major. Champion for student mental health resources and lounge space modernization.',
    manifesto: 'Student mental wellness is paramount. My focus is securing double funding for the campus counseling center, creating 24/7 quiet study spaces, and building outdoor hammocks for student relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 35,
  },
  {
    id: 'cand-5',
    categoryId: 'cat-3',
    name: 'Casey Patel',
    bio: 'Third-year Finance major. Dedicated to club audit transparency and establishing student entrepreneurship grants.',
    manifesto: 'As Treasurer, I will implement a live-updating budget dashboard open to all students, set up a $10,000 student business seed fund, and simplify the club reimbursement pipeline.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 51,
  },
  {
    id: 'cand-6',
    categoryId: 'cat-3',
    name: 'Sam Wilson',
    bio: 'Second-year Business Administration major. Expert in campus-wide event sponsorship and fee reduction.',
    manifesto: 'I believe college should be affordable. I will secure local corporate sponsors to fund large-scale events, reducing student activity fees by 20%, and optimize travel funding for sports clubs.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80',
    votesCount: 49,
  },
];

// In-Memory Database instances with sessionStorage persistence to survive page reloads
const isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const loadFromStorage = (key, defaultValue) => {
  if (!isBrowser) return defaultValue;
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key, value) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export let election = loadFromStorage('voting_election', { ...initialElection });
export let categories = loadFromStorage('voting_categories', [...initialCategories]);
export let candidates = loadFromStorage('voting_candidates', [...initialCandidates]);
export let votes = loadFromStorage('voting_votes', []);
export let receipts = loadFromStorage('voting_receipts', []);

// Reset database functions for testing/visual integrity
export const resetDb = () => {
  election = { ...initialElection };
  categories = [...initialCategories];
  candidates = [...initialCandidates];
  votes = [];
  receipts = [];
  
  if (isBrowser) {
    window.localStorage.removeItem('voting_election');
    window.localStorage.removeItem('voting_categories');
    window.localStorage.removeItem('voting_candidates');
    window.localStorage.removeItem('voting_votes');
    window.localStorage.removeItem('voting_receipts');
  }
};

export const setElectionStatus = (status) => {
  election.status = status;
  saveToStorage('voting_election', election);
};

export const addCandidate = (cand) => {
  const newCand = {
    ...cand,
    id: `cand-${Date.now()}`,
    votesCount: 0
  };
  candidates.push(newCand);
  saveToStorage('voting_candidates', candidates);
  return newCand;
};

export const updateCandidate = (id, fields) => {
  const idx = candidates.findIndex(c => c.id === id);
  if (idx !== -1) {
    candidates[idx] = { ...candidates[idx], ...fields };
    saveToStorage('voting_candidates', candidates);
    return candidates[idx];
  }
  return null;
};

export const deleteCandidate = (id) => {
  const idx = candidates.findIndex(c => c.id === id);
  if (idx !== -1) {
    const deleted = candidates[idx];
    candidates.splice(idx, 1);
    saveToStorage('voting_candidates', candidates);
    return deleted;
  }
  return null;
};

export const castVote = (studentId, categoryId, candidateId) => {
  const voteId = `vote-${Date.now()}`;
  const receiptId = `receipt-${Date.now()}`;
  
  const vote = {
    id: voteId,
    studentId,
    categoryId,
    candidateId,
    createdAt: new Date().toISOString(),
  };
  votes.push(vote);
  saveToStorage('voting_votes', votes);

  // Increment candidate's vote count
  const cand = candidates.find(c => c.id === candidateId);
  if (cand) {
    cand.votesCount = (cand.votesCount || 0) + 1;
    saveToStorage('voting_candidates', candidates);
  }

  const receipt = {
    id: receiptId,
    voteId,
    studentId,
    categoryId,
    candidateId,
    issuedAt: new Date().toISOString(),
  };
  receipts.push(receipt);
  saveToStorage('voting_receipts', receipts);

  return receipt;
};
