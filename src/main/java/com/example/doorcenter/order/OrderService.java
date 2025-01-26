package com.example.doorcenter.order;


import com.example.doorcenter.frame.Frame;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;

    @Override
    public Orders saveOrder(Orders order) {
        return orderRepository.save(order);
    }

}
