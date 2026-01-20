export type FileMeta = {
  _id?: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  label?: string;
  customName?: string;
};

export type QA = {
  question: string;
  answer: string;
  format?: 'table' | 'written' | 'both';
  table?: {
    headers: string[];
    rows: string[][];
  };
  files: FileMeta[];
};

export type Subtitle = {
  _id?: string;
  parentTitleId: string;
  title: string;
  content?: string;
  price?: string;
  files: FileMeta[];
  questions: QA[];
  faqs?: QA[];
};

export type NavItem = {
  _id?: string;
  name: string;
  slug: string;
  order: number;
  titles?: string[];
};

export type Title = {
  _id?: string;
  navItem: string;
  title: string;
  content?: string;
  order?: number;
};

export type Employee = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  position: string;
  designation?: string;
  department: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  bio?: string;
  dob?: string;
  joinDate?: string;
  manager?: string;
  salary?: string;
  employeeId?: string;
  employmentType?: string;
  workLocation?: string;
  educationLevel?: string;
  degree?: string;
  institution?: string;
  graduationYear?: string;
  isAdvisor?: boolean;
};

export type Enquiry = {
  _id?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  subject: string;
  message: string;
  file?: string;
  date?: string;
  transactionId?: string;
  paymentStatus?: string;
  amount?: number;
  read?: boolean;
};

export type Job = {
  _id?: string;
  title: string;
  description: string;
  type?: string;
  experience?: string;
  urgent?: boolean;
  experienceLevel?: string;
  location?: string;
  responsibilities?: string[];
  qualifications?: string[];
  createdAt?: string;
};
