package com.example.doorcenter.extension;

import com.example.doorcenter.frame.FrameRepository;
import com.example.doorcenter.frame.IFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExtensionService implements IExtensionService {

    private final ExtensionRepository extensionRepository;

    @Override
    public List<Extension> getAllExtension() {
        return extensionRepository.findAll();

    }
}
