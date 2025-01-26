package com.example.doorcenter.door;


import com.example.doorcenter.exception.DoorNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class DoorService implements IDoorService {
    private final DoorRepository doorRepository;

    public Door findDoorById(Long id) {
        return doorRepository.findDoorById(id)
                .orElseThrow(() -> new DoorNotFoundException("Door by id " + id + " was not found"));
    }

    public List<Door> getAllDoors() {
        return doorRepository.findAll();
    }

    @Override
    public List<Door> getDoorByHeightAndWidth(int height, int width) {
        try {
            return doorRepository.findDoorsByHeightAndWidth(height, width);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Height and width must be valid integers", e);
        }
    }

}
