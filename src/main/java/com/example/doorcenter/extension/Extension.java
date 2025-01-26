package com.example.doorcenter.extension;

import com.example.doorcenter.frame.FrameVariant;
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
public class Extension {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String type;
    private String imageUrl;

    @OneToMany(mappedBy = "extension", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExtensionVariant> variants; // List of height-width-price combinations

}
