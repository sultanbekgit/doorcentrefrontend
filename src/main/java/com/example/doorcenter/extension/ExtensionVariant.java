package com.example.doorcenter.extension;

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
public class ExtensionVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private int height;
    private int price;
    private int width;

    @ManyToOne
    @JoinColumn(name = "extension_id", nullable = false)
    @JsonIgnore
    private Extension extension;


}
