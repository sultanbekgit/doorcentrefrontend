package com.example.doorcenter.controller;

import com.example.doorcenter.door.Door;
import com.example.doorcenter.door.DoorService;
import com.example.doorcenter.door.IDoorService;
import com.example.doorcenter.extension.Extension;
import com.example.doorcenter.extension.ExtensionService;
import com.example.doorcenter.extension.IExtensionService;
import com.example.doorcenter.frame.Frame;
import com.example.doorcenter.frame.FrameService;
import com.example.doorcenter.frame.IFrameService;
import com.example.doorcenter.platband.IPlatbandService;
import com.example.doorcenter.platband.Platband;
import com.example.doorcenter.platband.PlatbandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private final IDoorService doorService;
    private final IFrameService frameService;
    private final IPlatbandService platbandService;
    private final IExtensionService extensionService;

    public AdminController(DoorService doorService, FrameService frameService, PlatbandService platbandService,
                           ExtensionService extensionService) {
        this.doorService = doorService;
        this.frameService = frameService;
        this.platbandService = platbandService;
        this.extensionService= extensionService;
    }

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome to the Admin Dashboard!";
    }

    @PutMapping(value = "/update/door/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Door> updateDoor(
            @PathVariable Long id,
            @RequestPart("door") Door door,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Door updatedDoor = doorService.updateDoor(id, door, file);
        return new ResponseEntity<>(updatedDoor, HttpStatus.OK);
    }


    @PutMapping(value = "/update/frame/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Frame> updateFrame(
            @PathVariable Long id,
            @RequestPart("frame") Frame frame,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Frame updatedFrame = frameService.updateFrame(id, frame, file);
        return new ResponseEntity<>(updatedFrame, HttpStatus.OK);
    }

    @PutMapping(value = "/update/platband/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Platband> updatePlatband(
            @PathVariable Long id,
            @RequestPart("platband") Platband platband,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Platband updatedPlatband = platbandService.updatePlatband(id, platband, file);
        return new ResponseEntity<>(updatedPlatband, HttpStatus.OK);
    }



    @PutMapping(value = "/update/extension/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Extension> updateExtension(
            @PathVariable Long id,
            @RequestPart("extension") Extension extension,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Extension updatedExtension = extensionService.updateExtension(id, extension, file);
        return new ResponseEntity<>(updatedExtension, HttpStatus.OK);
    }

}
