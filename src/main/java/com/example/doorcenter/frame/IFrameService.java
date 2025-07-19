package com.example.doorcenter.frame;


import com.example.doorcenter.extension.Extension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IFrameService {

    List<Frame> getAllFrame();


    public Frame updateFrame(Long id, Frame frame, MultipartFile file) throws IOException;
}
