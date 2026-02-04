package com.forum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Table("discussion_group")
@AllArgsConstructor
@Getter
@Setter
public class DiscussionGroup implements Persistable<UUID> {

   // La clé utilisée pour créer le forum et interagir avec lui

    @Id
    @Column("group_id")
    private UUID groupId;

    @Column("creator_name")
    private String creatorName; // Le nom du créateur du groupe de discussion

    @Column("creator_id")
    private UUID creatorId; // L'ID du créateur du groupe de discussion

    @Column("name")
    private String name;

    @Column("type")
    private GroupType type;

    @Column("description")
    private String description;

    @Column("members")
    private List<UUID> members;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

    @Column("deleted_at")
    private Instant deletedAt;

    private ForumStatus status;

    @Transient
    @JsonIgnore
    private boolean isNew;

    // 🔹 Constructeur par défaut
    public DiscussionGroup() {
        this.groupId = UUID.randomUUID();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.type = GroupType.FORUM;
    }

    @Override
    @JsonIgnore
    public UUID getId() {
        return groupId;
    }

    @Override
    @JsonIgnore
    public boolean isNew() {
        return isNew || groupId == null;
    }

    public void markNew() {
        this.isNew = true;
    }
}
