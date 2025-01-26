package com.example.doorcenter.customer;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService implements ICustomerService {

    private final CustomerRepository customerRepository;


    @Override
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
}
