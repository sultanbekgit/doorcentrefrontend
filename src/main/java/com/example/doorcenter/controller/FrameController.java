package com.example.doorcenter.controller;


import com.example.doorcenter.frame.Frame;
import com.example.doorcenter.frame.IFrameService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/frame")
public class FrameController {

    private final IFrameService frameService;



    public FrameController(IFrameService frameService) {
        this.frameService = frameService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Frame>> getAllFrames() {
        List<Frame> frames = frameService.getAllFrame();
        return new ResponseEntity<>(frames, HttpStatus.OK);
    }
}
