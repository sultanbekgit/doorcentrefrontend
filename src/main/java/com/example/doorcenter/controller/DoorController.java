package com.example.doorcenter.controller;

import com.example.doorcenter.door.DimensionsRequest;
import com.example.doorcenter.door.Door;
import com.example.doorcenter.door.DoorService;
import com.example.doorcenter.door.IDoorService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/door")
@CrossOrigin(origins = "*")
public class DoorController {
    private final IDoorService doorService;

    public DoorController(DoorService doorService) {
        this.doorService = doorService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Door>> getAllDoors() {
        List<Door> doors = doorService.getAllDoors();
        return new ResponseEntity<>(doors, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Door> findDoorById(@PathVariable("id") Long id) {
        Door door = doorService.findDoorById(id);
        return new ResponseEntity<>(door, HttpStatus.OK);
    }
    @PostMapping("/find-by-dimensions")
    public ResponseEntity<List<Door>> getDoorsByHeightAndWidth(@RequestBody DimensionsRequest request) {
        List<Door> doors = doorService.getDoorByHeightAndWidth(request.getHeight(), request.getWidth());
        return new ResponseEntity<>(doors, HttpStatus.OK);
    }
}