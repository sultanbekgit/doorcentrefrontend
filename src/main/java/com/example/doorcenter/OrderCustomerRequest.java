package com.example.doorcenter;

import com.example.doorcenter.customer.Customer;
import com.example.doorcenter.order.Orders;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderCustomerRequest {
    private List<Orders> orders;
    private Customer customer;

    public List<Orders> getOrders(){
        return this.orders;
    }
    public void setOrders(List<Orders> orders) {
        this.orders = orders;
    }

    // Getter and setter for customer
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}