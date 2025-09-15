export type IParticipant = {
  id: number;
  fname: string;
  lname: string;
  bibname: string;
  email: string;
  identityId: string;
  birthplace: string;
  birthdate: string;
  gender: string;
  phone: string;
  address: string;
  zipcode: string;
  country: string;
  province: string;
  city: string;
  bloodType: string;
  size: string;
  price: number;
  condition: string;
  master_categoryId: number;
  transactionsId: string;
  racePack: boolean;
  registrationDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ITransaction = {
  id: string;
  pt: string;
  divisi: string;
  emergencyName: string;
  emergencyPhone: string;
  transferProof: string | null;
  total: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  participants: IParticipant[];
}

export type IRecapItem = {
  total: number;
  claimed: number;
}

export type TRecap = Record<string, IRecapItem>;

export type IMeta = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export type IApiResponse = {
  data: ITransaction[];
  recap: TRecap;
  meta: IMeta;
}