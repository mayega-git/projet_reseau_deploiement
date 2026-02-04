--- Schema


-- Table requestToken
CREATE TABLE request_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status_request_token VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    accepted_at TIMESTAMP
);

-- Table ApiKey
CREATE TABLE api_key (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash_key VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255) ,
    
    client_id UUID,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    expired_at TIMESTAMP,
    validity_period INTEGER NOT NULL,
    request_token_id UUID NOT NULL,
    CONSTRAINT fk_apikey_requesttoken FOREIGN KEY (request_token_id) REFERENCES     request_token (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table Permission
CREATE TABLE permission (
    id UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
    service_name VARCHAR(255) NOT NULL,
    scope VARCHAR(255) NOT NULL,
    request_limit INTEGER NOT NULL,
    request_token_id UUID NOT NULL,
    CONSTRAINT fk_permission_requesttoken FOREIGN KEY (request_token_id) REFERENCES     request_token (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_apikey_requesttoken ON api_key (request_token_id);

CREATE INDEX idx_apikey_hashkey ON api_key (hash_key);

CREATE INDEX idx_apikey_status ON api_key (status);

CREATE INDEX idx_permission_requesttoken ON permission (request_token_id);

CREATE INDEX idx_permission_servicename ON  permission (service_name);