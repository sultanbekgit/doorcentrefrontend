package com.example.doorcenter.frame;

import com.example.doorcenter.platband.Platband;
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
public class FrameVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private int height;
    private int price;

    @ManyToOne
    @JoinColumn(name = "frame_id", nullable = false)
    @JsonIgnore
    private Frame frame;


}
