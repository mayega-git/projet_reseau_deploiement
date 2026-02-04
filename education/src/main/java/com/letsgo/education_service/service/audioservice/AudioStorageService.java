package com.letsgo.education_service.service.audioservice;
/* 
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.model.Filters;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class AudioStorageService {

    private final GridFSBucket gridFSBucket;

    public AudioStorageService(GridFSBucket gridFSBucket) {
        this.gridFSBucket = gridFSBucket;
    }

    public String uploadFile(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            GridFSUploadOptions options = new GridFSUploadOptions()
                    .metadata(new org.bson.Document("contentType", file.getContentType()));
            ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), inputStream, options);
            return fileId.toHexString();
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload de l'audio", e);
        }
    }


    public String FormattedAudioDuration(MultipartFile file) {
        try {
            Path tempFile = Files.createTempFile("audio-", ".mp3");
            try (InputStream inputStream = file.getInputStream()) {

                Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING);
            }

            Mp3File mp3file = new Mp3File(tempFile.toFile());
            long durationInSeconds = mp3file.getLengthInSeconds();

            long hours = durationInSeconds / 3600;
            long minutes = (durationInSeconds % 3600) / 60;
            long seconds = durationInSeconds % 60;
            Files.delete(tempFile);
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } catch (IOException | InvalidDataException | UnsupportedTagException e) {
            throw new RuntimeException("Erreur lors du calcul de la durée de l'audio", e);
        }
    }



    public InputStream FileById(String fileId) {
        return gridFSBucket.openDownloadStream(new ObjectId(fileId));
    }


    public String uploadPodcast(MultipartFile podcastFile) {
        return uploadFile(podcastFile);
    }


    public String uploadImage(MultipartFile imageFile) {
        return uploadFile(imageFile);
    }


    public boolean fileExists(String fileId) {
        GridFSFile file = gridFSBucket.find(Filters.eq("_id", new ObjectId(fileId))).first();
        return file != null;
    }


    public void deleteFile(String fileId) {
        if (fileExists(fileId)) {
            gridFSBucket.delete(new ObjectId(fileId));
        } else {
            throw new RuntimeException("Le fichier à supprimer n'existe pas");
        }
    }
}*/
