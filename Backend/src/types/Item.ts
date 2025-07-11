// src/types/Item.ts

export interface Item {
    id?: string,
    name: string,
    description: string,
    category: string,
    price: number,
    quantity?: null | number,
    createdAt?: Date,
    updatedAt?: Date
}