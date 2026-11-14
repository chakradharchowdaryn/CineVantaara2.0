-- CineVantaara Cinema Platform Database Schema
-- Flyway Migration V1: Normalized relational tables

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    headline VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    experience_years INT DEFAULT 0,
    active_role VARCHAR(64) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(64) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(128) NOT NULL,
    PRIMARY KEY (user_id, skill_name)
);

CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(64) PRIMARY KEY,
    producer_id VARCHAR(64) REFERENCES users(id),
    producer_name VARCHAR(255) NOT NULL,
    producer_company VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    film_category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    required_role VARCHAR(64) NOT NULL,
    min_experience_years INT DEFAULT 0,
    location VARCHAR(255),
    is_remote_allowed BOOLEAN DEFAULT FALSE,
    compensation_type VARCHAR(64),
    compensation_details VARCHAR(255),
    deadline DATE,
    project_duration VARCHAR(128),
    status VARCHAR(32) DEFAULT 'OPEN',
    applicants_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    opportunity_id VARCHAR(64) REFERENCES opportunities(id) ON DELETE CASCADE,
    opportunity_title VARCHAR(255) NOT NULL,
    applicant_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_role VARCHAR(64) NOT NULL,
    applicant_avatar TEXT,
    applicant_experience INT DEFAULT 0,
    pitch_note TEXT NOT NULL,
    showreel_url TEXT,
    status VARCHAR(32) DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration_requests (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) REFERENCES users(id),
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(64) NOT NULL,
    sender_avatar TEXT,
    receiver_id VARCHAR(64) REFERENCES users(id),
    receiver_name VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    role_proposed VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encrypted_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(128) NOT NULL,
    sender_id VARCHAR(64) REFERENCES users(id),
    sender_name VARCHAR(255) NOT NULL,
    recipient_id VARCHAR(64) REFERENCES users(id),
    cipher_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    author_id VARCHAR(64) REFERENCES users(id),
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(64) NOT NULL,
    author_avatar TEXT,
    target_user_id VARCHAR(64) REFERENCES users(id),
    project_title VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_collaboration_review UNIQUE (author_id, target_user_id, project_title)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    admin_id VARCHAR(64) REFERENCES users(id),
    admin_name VARCHAR(255) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target_type VARCHAR(64),
    target_id VARCHAR(64),
    details TEXT,
    ip_address VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_role ON opportunities(required_role);
CREATE INDEX IF NOT EXISTS idx_applications_opp_id ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_convo ON encrypted_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
