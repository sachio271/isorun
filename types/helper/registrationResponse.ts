export type IRegistrationParticipant = {
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
  registration: boolean;
  uuid: string;
  master_category: {
    id: number;
    name: string;
  }
  createdAt: string;
  updatedAt: string;
}

export type IRegistrationTransaction = {
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
  participants: IRegistrationParticipant[];
}

export type IRecapItem = {
  total: number;
  present: number;
}

export type TRegistrationRecap = Record<string, IRecapItem>;

export type IMeta = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export type IApiRegistrationResponse = {
  data: IRegistrationTransaction[];
  recap: TRegistrationRecap;
  meta: IMeta;
}