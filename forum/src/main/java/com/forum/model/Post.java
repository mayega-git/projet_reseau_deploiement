package com.forum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("post")
public class Post implements Persistable<UUID> {

    @Id
    @Column("post_id")
    private UUID postId;

    @Column("auteur_id")
    @NotNull(message = "L'auteur du post est requis")
    private UUID authorId;

    @Column("groupe_id")
    @NotNull(message = "Le groupe auquel appartient le post est requis")
    private UUID groupId;

    @Column("post_titre")
    @NotBlank(message = "Le titre du post ne peut pas être vide")
    private String title;

    @Column("post_contenu")
    @NotBlank(message = "Le contenu du post ne peut pas être vide")
    private String content;

    @Column("date_creation")
    private Instant creationDate;

    @Column("date_modification")
    private Instant modificationDate; // Date de la dernière modification

    @Column("date_supression")
    private Instant suppressionDate;

    @Column("categorie_ids")
    @NotNull(message = "Les IDs des catégories ne peuvent pas être nuls")
    private List<UUID> categoriesIds;

    @Column("post_likes")
    private List<UUID> postLikes; // Liste des IDs des utilisateurs qui ont liké ce post

    @Column("post_dislikes")
    private List<UUID> postDislikes; // Liste des IDs des utilisateurs qui ont disliké ce post

    @Column("number_of_likes")
    private Integer numberOfLikes;

    @Column("number_of_dislikes")
    private Integer numberOfDislikes;

    @Transient
    private long commentCount; // Nombre de commentaires associés à ce post

    @Transient
    @JsonIgnore
    private boolean isNew;

    @Override
    @JsonIgnore
    public UUID getId() {
        return postId;
    }

    @Override
    @JsonIgnore
    public boolean isNew() {
        return isNew || postId == null;
    }

    public void markNew() {
        this.isNew = true;
    }
}
