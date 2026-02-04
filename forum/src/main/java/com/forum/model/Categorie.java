package com.forum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("categorie")
public class Categorie implements Persistable<UUID> {

    @Id
    @Column("categorie_id")
    private UUID categorieId;

    @Column("categorie_nom")
    private String categorieName;

    @Column("groupe_id")
    private UUID groupeId; // ID du groupe auquel est associé cette catégorie

    @Column("date_suppression")
    private Instant dateSuppression; // Date de suppression de la catégorie

    @Column("posts_ids")
    private List<UUID> postsIds; // Liste des IDs des posts associés à cette catégorie

    @Transient
    @JsonIgnore
    private boolean isNew;

    @Override
    @JsonIgnore
    public UUID getId() {
        return categorieId;
    }

    @Override
    @JsonIgnore
    public boolean isNew() {
        return isNew || categorieId == null;
    }

    public void markNew() {
        this.isNew = true;
    }
}
