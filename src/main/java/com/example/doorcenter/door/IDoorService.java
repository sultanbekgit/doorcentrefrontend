package com.example.doorcenter.door;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public interface IDoorService {
    Door findDoorById(Long id);

    List<Door> getAllDoors();

    List<Door> getDoorByHeightAndWidth(int height, int width);

    Door updateDoor(Long id, Door door, MultipartFile file) throws IOException; // Add this method


}
