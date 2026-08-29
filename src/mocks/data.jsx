// Mock Database State

export const initialElection = {
  id: 'election-1',
  title: '2026 Campus Student Elections',
  status: 'OPEN', // 'OPEN' or 'CLOSED'
};

export const initialCategories = [];

export const initialCandidates = [];

// In-Memory Database instances with localStorage persistence to survive page reloads
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadFromStorage = (key, defaultValue) => {
  if (!isBrowser) return defaultValue;
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key, value) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const initialValidStudents = Array.from(
  { length: 50 },
  (_, i) => `23CS${String(i + 1).padStart(3, '0')}`
);

export const initialManagers = [
  { username: 'admin', email: 'admin123@gmail.com', password: 'admin123', name: 'Election Manager' }
];

export let election = loadFromStorage('voting_election', { ...initialElection });
export let eventElection = loadFromStorage('voting_event_election', {
  id: 'election-event',
  title: '2026 Campus Event Decisions',
  status: 'OPEN',
});
export let categories = loadFromStorage('voting_categories', [...initialCategories]);
export let candidates = loadFromStorage('voting_candidates', [...initialCandidates]);
export let votes = loadFromStorage('voting_votes', []);
export let receipts = loadFromStorage('voting_receipts', []);
export let managers = loadFromStorage('voting_managers', [...initialManagers]);
export let validStudents = loadFromStorage('voting_valid_students', [...initialValidStudents]);

export const initialStudentDobs = {
  "23CS001": "2005-05-02",
  "23CS002": "2006-01-05",
  "23CS003": "2004-06-23",
  "23CS004": "2005-07-28",
  "23CS005": "2006-03-10",
  "23CS006": "2004-06-09",
  "23CS007": "2006-09-04",
  "23CS008": "2006-10-23",
  "23CS009": "2006-04-30",
  "23CS010": "2005-02-11",
  "23CS011": "2004-01-17",
  "23CS012": "2006-07-19",
  "23CS013": "2006-06-22",
  "23CS014": "2005-09-15",
  "23CS015": "2005-02-16",
  "23CS016": "2006-06-17",
  "23CS017": "2004-07-29",
  "23CS018": "2005-06-22",
  "23CS019": "2006-05-20",
  "23CS020": "2005-02-19",
  "23CS021": "2005-01-27",
  "23CS022": "2006-01-14",
  "23CS023": "2004-08-17",
  "23CS024": "2005-03-12",
  "23CS025": "2006-02-28",
  "23CS026": "2004-11-05",
  "23CS027": "2005-08-19",
  "23CS028": "2006-09-14",
  "23CS029": "2004-12-03",
  "23CS030": "2005-04-25",
  "23CS031": "2006-11-18",
  "23CS032": "2005-07-07",
  "23CS033": "2004-10-22",
  "23CS034": "2006-08-30",
  "23CS035": "2005-12-15",
  "23CS036": "2004-09-09",
  "23CS037": "2006-03-27",
  "23CS038": "2005-06-14",
  "23CS039": "2004-05-18",
  "23CS040": "2006-12-01",
  "23CS041": "2005-10-08",
  "23CS042": "2004-04-16",
  "23CS043": "2006-07-25",
  "23CS044": "2005-11-30",
  "23CS045": "2004-03-21",
  "23CS046": "2006-06-10",
  "23CS047": "2005-01-09",
  "23CS048": "2004-02-28",
  "23CS049": "2006-10-15",
  "23CS050": "2005-09-03"
};

export let studentDobs = loadFromStorage('voting_student_dobs', { ...initialStudentDobs });

// Auto-seed default student DOBs into localStorage if missing
if (isBrowser && !window.localStorage.getItem('voting_student_dobs')) {
  saveToStorage('voting_student_dobs', initialStudentDobs);
}

// Migration: Clean up any default event and club categories/candidates from local storage
if (isBrowser) {
  const defaultEventIds = [
    'ev-cat-symp', 'ev-cat-fest', 'ev-cat-work',
    'ev-q-symp-theme', 'ev-q-symp-domain', 'ev-q-symp-topic',
    'ev-q-fest-theme', 'ev-q-fest-activity',
    'ev-q-work-topic', 'ev-q-work-session'
  ];

  const defaultClubIds = [
    'cat-1', 'cat-2', 'cat-3', 'cult-cat-1', 'cult-cat-2', 'cult-cat-3'
  ];

  const allDefaults = [...defaultEventIds, ...defaultClubIds];
  
  const hasDefaults = categories.some(c => allDefaults.includes(c.id));
  if (hasDefaults) {
    categories = categories.filter(c => !allDefaults.includes(c.id));
    saveToStorage('voting_categories', categories);
    
    candidates = candidates.filter(
      c => !allDefaults.includes(c.categoryId) && 
           !c.id.startsWith('cand-symp-') && 
           !c.id.startsWith('cand-fest-') && 
           !c.id.startsWith('cand-work-') &&
           !c.id.startsWith('cand-')
    );
    saveToStorage('voting_candidates', candidates);
  }
}

// Save to storage immediately so the key appears in DevTools Local Storage
if (isBrowser && !window.localStorage.getItem('voting_valid_students')) {
  saveToStorage('voting_valid_students', validStudents);
}

// Database schema migration: ensure manager has correct email and password
if (managers.length > 0 && (!managers[0].hasOwnProperty('email') || managers[0].password !== initialManagers[0].password)) {
  managers = [...initialManagers];
  saveToStorage('voting_managers', managers);
}

// Reset database functions for testing/visual integrity
export const resetDb = () => {
  election = { ...initialElection };
  eventElection = {
    id: 'election-event',
    title: '2026 Campus Event Decisions',
    status: 'OPEN',
  };
  categories = [...initialCategories];
  candidates = [...initialCandidates];
  votes = [];
  receipts = [];
  managers = [...initialManagers];
  validStudents = [...initialValidStudents];
  
  if (isBrowser) {
    window.localStorage.removeItem('voting_election');
    window.localStorage.removeItem('voting_event_election');
    window.localStorage.removeItem('voting_categories');
    window.localStorage.removeItem('voting_candidates');
    window.localStorage.removeItem('voting_votes');
    window.localStorage.removeItem('voting_receipts');
    window.localStorage.removeItem('voting_managers');
    window.localStorage.removeItem('voting_valid_students');
  }
};

export const setElectionStatus = (status, module = 'club') => {
  if (module === 'event') {
    eventElection.status = status;
    saveToStorage('voting_event_election', eventElection);
  } else {
    election.status = status;
    saveToStorage('voting_election', election);
  }
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
