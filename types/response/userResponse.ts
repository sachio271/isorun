export interface UserData {
    ektp: string;
    type: string;
    name: string;
    birthPlace: string;
    birthDate: string; // ISO 8601 date string
    address: string;
    subDistrict: string;
    district: string;
    city: string;
    phone: string;
    email: string;
    gender: string;
    weight: number | string;
    height: number | string;
    bloodType: string;
    religion: string;
    status: string;
    company: string;
    kabag: boolean;
}

export interface FamilyRef {
  id: number;
  users_refKtp: string;
  name: string;
  EKTP: string;
  type: string;
  relation: string;
  birthplace: string;
  birthdate: string;
  address: string;
  subdistrict: string;
  district: string;
  city: string;
  phone: string;
  email: string;
}

export interface UsersRef {
  EKTP: string;
  type: string;
  name: string;
  birthplace: string;
  birthdate: string;
  address: string;
  subdistrict: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  gender: string;
  weight: number;
  height: number;
  bloodType: string;
  religion: string;
  struct: string;
  family_ref: FamilyRef[];
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  status: number;
  users_refId: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  users_ref: UsersRef;
}

  