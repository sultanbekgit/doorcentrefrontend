package com.example.doorcenter.door;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@Setter
public class Door implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String name;
    private Boolean withMirror;
    private String imageUrl;



    @OneToMany(mappedBy = "door", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DoorVariant> variants; // List of height-width-price combinations

    public Door() {
    }

    public Door(String name, Boolean withMirror, String imageUrl, List<DoorVariant> variants) {
        this.name = name;
        this.withMirror = withMirror;
        this.imageUrl = imageUrl;
        this.variants=variants;
    }


}