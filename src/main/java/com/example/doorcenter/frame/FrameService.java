package com.example.doorcenter.frame;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FrameService implements IFrameService {

    private final FrameRepository frameRepository;
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of("jpg", "png", "jpeg", "gif");
    private final Path rootDir = Path.of("uploads");

    @Override
    public List<Frame> getAllFrame() {
        return frameRepository.findAll();
    }

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(rootDir)) {
                Files.createDirectories(rootDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder", e);
        }
    }

    private boolean isImageFileAllowed(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    @Override
    public Frame updateFrame(Long id, Frame frame, MultipartFile file) throws IOException {
        Optional<Frame> optionalFrame = frameRepository.findById(id);

        if (optionalFrame.isPresent()) {
            Frame existingFrame = optionalFrame.get();
            existingFrame.setWidth(frame.getWidth());
            existingFrame.setThickness(frame.getThickness());
            existingFrame.setType(frame.getType());
            existingFrame.setColor(frame.getColor());

            // Handle image file update
            if (file != null && !file.isEmpty()) {
                String fileName = Objects.requireNonNull(file.getOriginalFilename());
                if (!isImageFileAllowed(fileName)) {
                    throw new RuntimeException("Invalid file type. Allowed types are: " + ALLOWED_IMAGE_EXTENSIONS);
                }
                String uniqueFileName = UUID.randomUUID() + "_" + fileName;
                Path targetLocation = this.rootDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                existingFrame.setImageUrl("/files/serve/" + uniqueFileName);
            }

            // Update variants in place
            existingFrame.getVariants().clear();
            existingFrame.getVariants().addAll(frame.getVariants());
            for (FrameVariant variant : existingFrame.getVariants()) {
                variant.setFrame(existingFrame);
            }

            return frameRepository.save(existingFrame);
        } else {
            throw new RuntimeException("Frame not found with id: " + id);
        }
    }
}
