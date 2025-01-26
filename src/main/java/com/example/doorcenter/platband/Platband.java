package com.example.doorcenter.platband;

import com.example.doorcenter.door.DoorVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@Setter
public class Platband {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private int width;

    private String type;

    private String imageUrl;
    private String color;



    public Platband() {
    }
    @OneToMany(mappedBy = "platband", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlatbandVariant> variants; // List of height-width-price combinations

    public Platband(int width, String type, String imageUrl, String color, List<PlatbandVariant> variants) {
        this.width = width;
        this.type = type;
        this.imageUrl=imageUrl;
        this.color=color;
        this.variants = variants;
    }




}
