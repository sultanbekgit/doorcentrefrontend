package com.example.doorcenter.order;


import com.example.doorcenter.customer.Customer;
import com.example.doorcenter.frame.Frame;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String name;
    private Long price;
    private Long quantity;

    private String customerId;

    @Override
    public String toString() {
        return "Наименование: " + name +
                ", Цена: " + price +
                ", Количество: " + quantity;
    }
}
