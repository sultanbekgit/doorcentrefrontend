package com.example.doorcenter.extension;

import com.example.doorcenter.door.Door;
import com.example.doorcenter.frame.Frame;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IExtensionService {

    List<Extension> getAllExtension();

    Extension updateExtension(Long id, Extension extension, MultipartFile file) throws IOException; // Add this method
}
