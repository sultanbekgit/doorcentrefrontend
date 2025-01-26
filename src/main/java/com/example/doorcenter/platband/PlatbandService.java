package com.example.doorcenter.platband;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlatbandService implements IPlatbandService {
    private final PlatbandRepository platbandRepository;

    @Override
    public List<Platband> getAllPlatband() {
        return platbandRepository.findAll();
    }
}
