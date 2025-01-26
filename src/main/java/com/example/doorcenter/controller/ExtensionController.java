package com.example.doorcenter.controller;


import com.example.doorcenter.extension.Extension;
import com.example.doorcenter.extension.IExtensionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/extension")
public class ExtensionController {

    private final IExtensionService extensionService;



    public ExtensionController(IExtensionService extensionService) {
        this.extensionService = extensionService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Extension>> getAllExtension() {
        List<Extension> extensions = extensionService.getAllExtension();
        return new ResponseEntity<>(extensions, HttpStatus.OK);
    }
}
