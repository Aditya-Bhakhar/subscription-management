export interface Customer {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    address: string | null;
    registered_at?: Date;
    updated_at?: Date;
  }
  
  export interface CreateCustomerDTO {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    address: string | null;
  }
  
  export interface UpdateCustomerDTO {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    address: string | null;
  }
  
  export interface ApiResponse {
    status: number;
    message: string;
    data: {
      pagination: {
        page: number;
        limit: number;
        totalCustomers: number;
        totalPages: number;
      };
      customers: Customer[];
    };
  }