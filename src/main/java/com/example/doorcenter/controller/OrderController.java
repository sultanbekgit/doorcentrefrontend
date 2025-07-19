package com.example.doorcenter.controller;



import com.example.doorcenter.customer.CustomerService;
import com.example.doorcenter.customer.ICustomerService;

import com.example.doorcenter.order.IOrderService;
import com.example.doorcenter.order.Orders;
import com.example.doorcenter.order.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*")

@RequestMapping("/order")
public class OrderController {

    private final IOrderService orderService;
    private final ICustomerService customerService;

    public OrderController(OrderService orderService, CustomerService customerService) {
        this.orderService = orderService;
        this.customerService=customerService;

    }


    @PostMapping("/add")
    public ResponseEntity<Orders> addOrder(@RequestBody Orders order) {
        // Save the order logic
        Orders savedOrder = orderService.saveOrder(order); // Example service call
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

    }
}