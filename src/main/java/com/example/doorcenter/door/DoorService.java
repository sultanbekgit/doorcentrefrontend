package com.example.doorcenter.door;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.doorcenter.exception.DoorNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoorService implements IDoorService {

    private final DoorRepository doorRepository;

    // AWS S3 configuration injected from application properties
    @Value("${aws.s3.access.key}")
    private String awsS3AccessKey;

    @Value("${aws.s3.secret.key}")
    private String awsS3SecretKey;

    private String bucketName= "file-upload-sula";

    // Allowed file extensions for images and videos
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList("jpg", "png", "jpeg", "gif");
    private static final List<String> ALLOWED_VIDEO_EXTENSIONS = Arrays.asList("mp4", "avi", "mov", "mkv");

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

    private boolean isImageFileAllowed(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    private boolean isVideoFileAllowed(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return ALLOWED_VIDEO_EXTENSIONS.contains(extension);
    }

    /**
     * Update door with optional image file upload.
     * If a new image file is provided, it is uploaded to the S3 bucket and its public URL is set.
     */
    @Override
    public Door updateDoor(Long id, Door door, MultipartFile file) throws IOException {
        Optional<Door> optionalDoor = doorRepository.findById(id);

        if (optionalDoor.isPresent()) {
            Door existingDoor = optionalDoor.get();
            existingDoor.setName(door.getName());
            existingDoor.setWithMirror(door.getWithMirror());

            // Only update the image if a new file is provided
            if (file != null && !file.isEmpty()) {
                String fileName = Objects.requireNonNull(file.getOriginalFilename());
                if (!isImageFileAllowed(fileName)) {
                    throw new RuntimeException("Invalid file type. Allowed types are: " + ALLOWED_IMAGE_EXTENSIONS);
                }
                String uniqueFileName = UUID.randomUUID() + "_" + fileName;
                String s3Url = uploadFileToS3(file, uniqueFileName);
                existingDoor.setImageUrl(s3Url);
            }
            // If no new file is provided, leave existingDoor.imageUrl unchanged

            // Update variants in place
            existingDoor.getVariants().clear();
            existingDoor.getVariants().addAll(door.getVariants());
            for (DoorVariant variant : existingDoor.getVariants()) {
                variant.setDoor(existingDoor);
            }

            return doorRepository.save(existingDoor);
        } else {
            throw new RuntimeException("Door not found with id: " + id);
        }
    }

    /**
     * Uploads the provided file to the AWS S3 bucket using the given unique file name.
     * Returns the public URL for the uploaded file.
     */
    private String uploadFileToS3(MultipartFile file, String uniqueFileName) {
        try {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecretKey);

            AmazonS3 amazonS3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(Regions.EU_NORTH_1)
                    .build();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3Client.putObject(new PutObjectRequest(bucketName, uniqueFileName, file.getInputStream(), metadata));

            // Returns the public URL (assuming the bucket policy allows public access)
            return amazonS3Client.getUrl(bucketName, uniqueFileName).toString();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage());
        }
    }
}
