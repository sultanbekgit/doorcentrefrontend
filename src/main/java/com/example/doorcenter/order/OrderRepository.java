package com.example.doorcenter.order;

import com.example.doorcenter.frame.Frame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Orders, Long> {

}
