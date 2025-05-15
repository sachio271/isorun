export interface MasterCategory {
    id: number;
    name: string;
    type: string;
    price: number;
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
  }
  
  export interface Participant {
    id: number;
    fname: string;
    lname: string;
    bibname: string;
    email: string;
    identityId: string;
    birthplace: string;
    birthdate: string; // ISO 8601 DateTime string
    phone: string;
    address: string;
    zipcode: string;
    country: string;
    city: string;
    bloodType: string;
    size: string;
    price: string;
    province: string;
    gender: string;
    condition: string;
    master_categoryId: number;
    transactionsId: string;
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
    master_category: MasterCategory;
  }
  
  export interface Transaction {
    id: string;
    pt: string;
    divisi: string;
    emergencyName: string;
    emergencyPhone: string;
    transferProof: string | null;
    total: number;
    status: number;
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
    participants: Participant[];
    users: User;
  }
  
  export interface User {
    id: number;
    username: string;
    name: string;
    role: string;
    status: number;
    users_refId: string;
    transactionId: string;
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
  }

  export interface EnrichParticipant {
    id: number;
    fname: string;
    lname: string;
    bibname: string;
    email: string;
    identityId: string;
    birthplace: string;
    birthdate: string; // ISO 8601 DateTime string
    phone: string;
    address: string;
    zipcode: string;
    country: string;
    city: string;
    bloodType: string;
    size: string;
    price: string;
    province: string;
    gender: string;
    condition: string;
    master_categoryId: number;
    transactionsId: string;
    pt: string;
    divisi: string;
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
    master_category: MasterCategory;
  }