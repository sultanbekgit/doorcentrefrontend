import { Customer } from "./customer";
import { Orders } from "./orders";

export interface OrderCustomerRequest {

    orders: Orders[];
    customer: Customer;


}