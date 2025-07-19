package com.example.doorcenter.controller;


import com.example.doorcenter.door.Door;
import com.example.doorcenter.platband.IPlatbandService;
import com.example.doorcenter.platband.Platband;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")

@RequestMapping("/platband")
public class PlatbandController {

    private final IPlatbandService platbandService;


    public PlatbandController(IPlatbandService platbandService) {
        this.platbandService = platbandService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Platband>> getAllPlatbands() {
        List<Platband> platbands = platbandService.getAllPlatband();
        return new ResponseEntity<>(platbands, HttpStatus.OK);
    }
}
