package com.forum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("commentaire")
public class Commentaire implements Persistable<UUID> {

    @Id
    @Column("commentaire_id")
    private UUID commentaireId;

    @Column("contenu")
    @NotBlank(message = "Le contenu du commentaire ne peut pas être vide")
    private String content;

    @Column("auteur_id")
    @NotNull(message = "L'auteur du commentaire est requis")
    private UUID authorId;

    @Column("date_creation")
    private Instant creationDate;

    @Column("date_modification")
    private Instant modificationDate;

    @Column("date_suppression")
    private Instant suppressionDate;

    @Column("post_id")
    private UUID postId;

    @Column("commentaire_parent_id")
    private UUID commentaireParentId; // Lien vers un commentaire parent (s'il existe)

    @Transient
    private List<Commentaire> responses; // Ne sera PAS stocké en base

    @Transient
    @JsonIgnore
    private boolean isNew;

    @Override
    @JsonIgnore
    public UUID getId() {
        return commentaireId;
    }

    @Override
    @JsonIgnore
    public boolean isNew() {
        return isNew || commentaireId == null;
    }

    public void markNew() {
        this.isNew = true;
    }
}
