// Mock data for Conquer Fitness Studio

export const mockMembers = [
  {
    id: "M001",
    name: "Rajesh Kumar",
    age: 28,
    contact: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    photo: "https://randomuser.me/api/portraits/men/31.jpg",
    plan: "Premium (12 Months)",
    joinDate: "2024-01-15",
    dueDate: "2025-01-15",
    fees: 15000,
    paymentStatus: "paid",
    lastPayment: "2024-01-15",
    attendance: []
  },
  {
    id: "M002",
    name: "Priya Sharma",
    age: 25,
    contact: "+91 98765 43211",
    email: "priya.sharma@example.com",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    plan: "Basic (3 Months)",
    joinDate: "2024-10-01",
    dueDate: "2025-01-01",
    fees: 4500,
    paymentStatus: "overdue",
    lastPayment: "2024-10-01",
    attendance: []
  },
  {
    id: "M003",
    name: "Amit Patel",
    age: 32,
    contact: "+91 98765 43212",
    email: "amit.patel@example.com",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    plan: "Standard (6 Months)",
    joinDate: "2024-08-20",
    dueDate: "2025-02-20",
    fees: 9000,
    paymentStatus: "paid",
    lastPayment: "2024-08-20",
    attendance: []
  },
  {
    id: "M004",
    name: "Sneha Reddy",
    age: 29,
    contact: "+91 98765 43213",
    email: "sneha.reddy@example.com",
    photo: "https://randomuser.me/api/portraits/women/48.jpg",
    plan: "Premium (12 Months)",
    joinDate: "2024-03-10",
    dueDate: "2025-03-10",
    fees: 15000,
    paymentStatus: "paid",
    lastPayment: "2024-03-10",
    attendance: []
  },
  {
    id: "M005",
    name: "Vikram Singh",
    age: 35,
    contact: "+91 98765 43214",
    email: "vikram.singh@example.com",
    photo: "https://randomuser.me/api/portraits/men/50.jpg",
    plan: "Basic (3 Months)",
    joinDate: "2024-11-05",
    dueDate: "2025-02-05",
    fees: 4500,
    paymentStatus: "paid",
    lastPayment: "2024-11-05",
    attendance: []
  },
  {
    id: "M006",
    name: "Ananya Gupta",
    age: 26,
    contact: "+91 98765 43215",
    email: "ananya.gupta@example.com",
    photo: "https://randomuser.me/api/portraits/women/42.jpg",
    plan: "Standard (6 Months)",
    joinDate: "2024-06-15",
    dueDate: "2024-12-15",
    fees: 9000,
    paymentStatus: "overdue",
    lastPayment: "2024-06-15",
    attendance: []
  },
  {
    id: "M007",
    name: "Karthik Menon",
    age: 30,
    contact: "+91 98765 43216",
    email: "karthik.menon@example.com",
    photo: "https://randomuser.me/api/portraits/men/34.jpg",
    plan: "Premium (12 Months)",
    joinDate: "2024-02-01",
    dueDate: "2025-02-01",
    fees: 15000,
    paymentStatus: "paid",
    lastPayment: "2024-02-01",
    attendance: []
  },
  {
    id: "M008",
    name: "Deepika Nair",
    age: 27,
    contact: "+91 98765 43217",
    email: "deepika.nair@example.com",
    photo: "https://randomuser.me/api/portraits/women/47.jpg",
    plan: "Basic (3 Months)",
    joinDate: "2024-11-20",
    dueDate: "2025-02-20",
    fees: 4500,
    paymentStatus: "paid",
    lastPayment: "2024-11-20",
    attendance: []
  }
];


export const planOptions = [
  { name: "Basic (3 Months)", price: 4500, duration: 3 },
  { name: "Standard (6 Months)", price: 9000, duration: 6 },
  { name: "Premium (12 Months)", price: 15000, duration: 12 }
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('gymMembers')) {
    localStorage.setItem('gymMembers', JSON.stringify(mockMembers));
  }
  if (!localStorage.getItem('attendanceRecords')) {
    localStorage.setItem('attendanceRecords', JSON.stringify({}));
  }
};

// Helper functions for localStorage operations
export const getMembers = () => {
  const data = localStorage.getItem('gymMembers');
  return data ? JSON.parse(data) : mockMembers;
};

export const setMembers = (members) => {
  localStorage.setItem('gymMembers', JSON.stringify(members));
};

export const addMember = (member) => {
  const members = getMembers();
  const newMember = {
    ...member,
    id: String(members.length + 1).padStart(3, '0'),
    attendance: []
  };
  members.push(newMember);
  setMembers(members);
  return newMember;
};


export const updateMemberPayment = (memberId, status) => {
  const members = getMembers();
  const updatedMembers = members.map(m => 
    m.id === memberId ? { ...m, paymentStatus: status, lastPayment: new Date().toISOString().split('T')[0] } : m
  );
  setMembers(updatedMembers);
};

export const getAttendanceRecords = () => {
  const data = localStorage.getItem('attendanceRecords');
  return data ? JSON.parse(data) : {};
};

export const saveAttendance = (date, attendanceData) => {
  const records = getAttendanceRecords();
  records[date] = attendanceData;
  localStorage.setItem('attendanceRecords', JSON.stringify(records));
};
