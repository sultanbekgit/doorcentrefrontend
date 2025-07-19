package com.example.doorcenter.platband;


import com.example.doorcenter.frame.Frame;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPlatbandService {

    List<Platband> getAllPlatband();

    public Platband updatePlatband(Long id, Platband platband, MultipartFile file) throws IOException;

}
