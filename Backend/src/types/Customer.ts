// src/types/Customer.ts

export interface Customer {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  address: string;
  registered_at?: Date;
  updated_at?: Date;
}
