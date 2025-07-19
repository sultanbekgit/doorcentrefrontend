package com.example.doorcenter.controller;


import com.example.doorcenter.customer.Customer;
import com.example.doorcenter.customer.CustomerService;
import com.example.doorcenter.customer.ICustomerService;
import com.example.doorcenter.order.IOrderService;
import com.example.doorcenter.order.OrderService;
import com.example.doorcenter.order.Orders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final ICustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    @PostMapping("/add")
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer); // Return the saved customer with id
    }
}
