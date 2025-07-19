package com.example.doorcenter.platband;

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
public class PlatbandService implements IPlatbandService {

    private final PlatbandRepository platbandRepository;
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of("jpg", "png", "jpeg", "gif");
    private final Path rootDir = Path.of("uploads");

    private boolean isImageFileAllowed(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    @Override
    public List<Platband> getAllPlatband() {
        return platbandRepository.findAll();
    }

    @Override
    public Platband updatePlatband(Long id, Platband platband, MultipartFile file) throws IOException {
        Optional<Platband> optionalPlatband = platbandRepository.findById(id);

        if (optionalPlatband.isPresent()) {
            Platband existingPlatband = optionalPlatband.get();
            existingPlatband.setWidth(platband.getWidth());
            existingPlatband.setType(platband.getType());
            existingPlatband.setColor(platband.getColor());

            // Handle image file update
            if (file != null && !file.isEmpty()) {
                String fileName = Objects.requireNonNull(file.getOriginalFilename());
                if (!isImageFileAllowed(fileName)) {
                    throw new RuntimeException("Invalid file type. Allowed types are: " + ALLOWED_IMAGE_EXTENSIONS);
                }
                String uniqueFileName = UUID.randomUUID() + "_" + fileName;
                Path targetLocation = this.rootDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                existingPlatband.setImageUrl("/files/serve/" + uniqueFileName);
            }

            // Update variants in place
            existingPlatband.getVariants().clear();
            existingPlatband.getVariants().addAll(platband.getVariants());
            for (PlatbandVariant variant : existingPlatband.getVariants()) {
                variant.setPlatband(existingPlatband);
            }

            return platbandRepository.save(existingPlatband);
        } else {
            throw new RuntimeException("Platband not found with id: " + id);
        }
    }
}
