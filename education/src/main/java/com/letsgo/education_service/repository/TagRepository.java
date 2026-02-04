package com.letsgo.education_service.repository;

import com.letsgo.education_service.models.Tag_entity;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
//import org.springframework.data.cassandra.repository.CassandraRepository;
//import org.springframework.data.cassandra.repository.ReactiveCassandraRepository;
//import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends R2dbcRepository<Tag_entity, UUID> {


}
