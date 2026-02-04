package com.example.user_interactive_service.models;

import com.example.user_interactive_service.enums.EntityType;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;



@Table("entity_stats")
@Schema(description="Classe representant les reactions liés au contenu c")
public class EntityStats implements Persistable<UUID> {

    @Id
    private UUID entityId;

    @Column("entity_type")
    private EntityType entityType;

    @Column("total_likes")
    private int totalLikes = 0;

    @Column("total_dislikes")
    private int totalDislikes = 0;

    @Column("liked_users")
    private List<UUID> likedUsers = new ArrayList<>();

    @Column("disliked_users")
    private List<UUID> dislikedUsers = new ArrayList<>();

    @Transient
    private boolean isNew = false;

    @Override
    public UUID getId() {
        return entityId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    public void markNew() {
        this.isNew = true;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }

    public int getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(int totalLikes) {
        this.totalLikes = totalLikes;
    }

    public int getTotalDislikes() {
        return totalDislikes;
    }

    public void setTotalDislikes(int totalDislikes) {
        this.totalDislikes = totalDislikes;
    }

    public List<UUID> getLikedUsers() {
        return likedUsers;
    }

    public void setLikedUsers(List<UUID> likedUsers) {
        this.likedUsers = likedUsers != null ? likedUsers : new ArrayList<>();
    }
    
    public void setDislikedUsers(List<UUID> dislikedUsers) {
        this.dislikedUsers = dislikedUsers != null ? dislikedUsers : new ArrayList<>();
    }

    public List<UUID> getDislikedUsers() {
        return dislikedUsers;
    }
}
