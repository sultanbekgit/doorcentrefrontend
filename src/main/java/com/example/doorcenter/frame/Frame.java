package com.example.doorcenter.frame;

import com.example.doorcenter.platband.PlatbandVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
public class Frame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private int width;
    private int thickness;
    private String type;
    private String imageUrl;
    private String color;

    @OneToMany(mappedBy = "frame", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FrameVariant> variants; // List of height-width-price combinations

}
