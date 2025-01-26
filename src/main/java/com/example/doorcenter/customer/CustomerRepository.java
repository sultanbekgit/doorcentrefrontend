package com.example.doorcenter.customer;

import com.example.doorcenter.door.Door;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository  extends JpaRepository<Customer, Long> {

    Customer findCustomerByPhoneNumber(String phoneNumber);
}
