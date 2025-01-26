package com.example.doorcenter.door;

import java.util.List;

public interface IDoorService {
    Door findDoorById(Long id);

    List<Door> getAllDoors();

    List<Door> getDoorByHeightAndWidth(int height, int width);
}
