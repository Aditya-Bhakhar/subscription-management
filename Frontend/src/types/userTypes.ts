export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "finance";
  profile_picture?: string | null;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "finance";
  profile_picture?: string | null;
}

export interface UpdateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "finance";
  profile_picture?: string | null;
}

export interface ApiResponse {
  status: number;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      totalUsers: number;
      totalPages: number;
    };
    users: User[];
  };
}