package com.example.doorcenter.frame;

import com.example.doorcenter.platband.Platband;
import com.example.doorcenter.platband.PlatbandRepository;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class FrameService implements  IFrameService {

    private final FrameRepository frameRepository;


    @Override
    public List<Frame> getAllFrame() {
        return frameRepository.findAll();
    }

}
