import { Orders } from "./orders";

export interface Customer {
  id?: number;          // Primary key
  phoneNumber: string;
  city: string;
}