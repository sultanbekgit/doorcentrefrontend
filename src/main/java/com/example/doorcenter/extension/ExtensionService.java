package com.example.doorcenter.extension;

import com.example.doorcenter.door.Door;
import com.example.doorcenter.door.DoorVariant;
import com.example.doorcenter.frame.FrameRepository;
import com.example.doorcenter.frame.IFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExtensionService implements IExtensionService {

    private final ExtensionRepository extensionRepository;

    @Override
    public List<Extension> getAllExtension() {
        return extensionRepository.findAll();

    }

    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList("jpg", "png", "jpeg", "gif");
    private boolean isImageFileAllowed(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    private final Path rootDir = Paths.get("uploads");
    @Override

    public Extension updateExtension(Long id, Extension extension, MultipartFile file) throws IOException {
        Optional<Extension> optionalExtension = extensionRepository.findById(id);

        if (optionalExtension.isPresent()) {
            Extension existingExtension = optionalExtension.get();
            existingExtension.setType(extension.getType());

            // Only update the image if a new file was provided
            if (file != null && !file.isEmpty()) {
                String fileName = Objects.requireNonNull(file.getOriginalFilename());
                if (!isImageFileAllowed(fileName)) {
                    throw new RuntimeException("Invalid file type. Allowed types are: " + ALLOWED_IMAGE_EXTENSIONS);
                }
                String uniqueFileName = UUID.randomUUID() + "_" + fileName;
                Path targetLocation = this.rootDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                existingExtension.setImageUrl("/files/serve/" + uniqueFileName);
            }
            // If no new file is provided, do not change existingDoor.imageUrl

            // Update variants in place
            existingExtension.getVariants().clear();
            existingExtension.getVariants().addAll(extension.getVariants());
            for (ExtensionVariant variant : existingExtension.getVariants()) {
                variant.setExtension(existingExtension);
            }

            return extensionRepository.save(existingExtension);
        } else {
            throw new RuntimeException("Door not found with id: " + id);
        }
    }
}
