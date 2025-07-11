export interface Item {
  id: string;
  name: string;
  description: string;
  category: "Service" | "Product";
  price: number;
  quantity: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateItemDTO {
    name: string;
    description: string;
    category: "Service" | "Product";
    price: number;
    quantity: number | null;
}

export interface UpdateItemDTO {
    name: string;
    description: string;
    category: "Service" | "Product";
    price: number;
    quantity: number | null;
}

export interface ApiResponse {
  status: number;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
    items: Item[];
  };
}
