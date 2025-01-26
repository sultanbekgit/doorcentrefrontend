package com.example.doorcenter.door;
import com.example.doorcenter.order.Orders;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoorVariant implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private int height;
    private int width;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "door_id", nullable = false)
    @JsonIgnore
    private Door door;



}