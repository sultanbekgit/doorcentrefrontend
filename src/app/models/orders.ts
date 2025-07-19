import { Customer } from "./customer";

export interface Orders {
    id?: number;          // Primary key
    name: string;        // Order name
    price: number;       // Price of the order
    quantity: number;    // Quantity of the item
    customerId?: number;  // Foreign key linking to the customer
    
  }