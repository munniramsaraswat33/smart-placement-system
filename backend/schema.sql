-- Smart Placement & Career Management System
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS `placement_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `placement_db`;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `college_name` VARCHAR(200) DEFAULT 'National Institute of Technology',
    `branch` VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    `semester` INT DEFAULT 7,
    `cgpa` FLOAT DEFAULT 8.65,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(20) DEFAULT '+91 98765 43210',
    `graduation_year` INT DEFAULT 2025,
    `bio` TEXT,
    `resume_url` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `category` VARCHAR(100) DEFAULT 'Programming',
    `is_technical` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Student Skills Mapping Table
CREATE TABLE IF NOT EXISTS `student_skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `skill_id` INT NOT NULL,
    `proficiency` VARCHAR(50) DEFAULT 'Intermediate',
    `score` FLOAT DEFAULT 75.0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_student_skill_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_student_skill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `tech_stack` VARCHAR(255) NOT NULL,
    `github_url` VARCHAR(255),
    `live_url` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_project_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Certifications Table
CREATE TABLE IF NOT EXISTS `certifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `issuing_organization` VARCHAR(150) NOT NULL,
    `issue_date` VARCHAR(50),
    `credential_id` VARCHAR(100),
    `credential_url` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_certification_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Placement Opportunities Table
CREATE TABLE IF NOT EXISTS `opportunities` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(150) NOT NULL,
    `job_role` VARCHAR(150) NOT NULL,
    `job_description` TEXT NOT NULL,
    `required_skills` TEXT NOT NULL,
    `min_cgpa` FLOAT DEFAULT 7.0,
    `eligible_branches` VARCHAR(255) DEFAULT 'Computer Science & Engineering, Information Technology',
    `graduation_year` INT DEFAULT 2025,
    `package_lpa` FLOAT NOT NULL,
    `location` VARCHAR(150) DEFAULT 'Bangalore / Hybrid',
    `application_deadline` VARCHAR(50) NOT NULL,
    `job_type` VARCHAR(50) DEFAULT 'Full-Time',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Internships Table
CREATE TABLE IF NOT EXISTS `internships` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(150) NOT NULL,
    `job_role` VARCHAR(150) NOT NULL,
    `job_description` TEXT NOT NULL,
    `stipend` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(50) DEFAULT '6 Months',
    `required_skills` TEXT NOT NULL,
    `min_cgpa` FLOAT DEFAULT 6.5,
    `eligible_branches` VARCHAR(255) DEFAULT 'All Engineering Branches',
    `work_mode` VARCHAR(50) DEFAULT 'Hybrid',
    `location` VARCHAR(150) DEFAULT 'Bangalore',
    `application_deadline` VARCHAR(50) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Applications Table
CREATE TABLE IF NOT EXISTS `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `opportunity_id` INT NULL,
    `internship_id` INT NULL,
    `company_name` VARCHAR(150) NOT NULL,
    `role_title` VARCHAR(150) NOT NULL,
    `opportunity_type` VARCHAR(50) DEFAULT 'placement',
    `status` VARCHAR(50) DEFAULT 'Applied',
    `applied_date` VARCHAR(50),
    `interview_date` VARCHAR(100),
    `notes` TEXT,
    `salary_or_stipend` VARCHAR(100),
    `location` VARCHAR(150),
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_application_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_application_opportunity` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_application_internship` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Saved Opportunities Table
CREATE TABLE IF NOT EXISTS `saved_opportunities` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `opportunity_id` INT NULL,
    `internship_id` INT NULL,
    `item_type` VARCHAR(50) DEFAULT 'placement',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_saved_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_opp` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_intern` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Assessments Table
CREATE TABLE IF NOT EXISTS `assessments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) DEFAULT 'Programming',
    `description` TEXT NOT NULL,
    `duration_minutes` INT DEFAULT 20,
    `total_questions` INT DEFAULT 5,
    `pass_percentage` FLOAT DEFAULT 60.0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Assessment Questions Table
CREATE TABLE IF NOT EXISTS `assessment_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `assessment_id` INT NOT NULL,
    `question_text` TEXT NOT NULL,
    `option_a` VARCHAR(255) NOT NULL,
    `option_b` VARCHAR(255) NOT NULL,
    `option_c` VARCHAR(255) NOT NULL,
    `option_d` VARCHAR(255) NOT NULL,
    `correct_option` VARCHAR(5) NOT NULL,
    `explanation` TEXT,
    CONSTRAINT `fk_question_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Assessment Results Table
CREATE TABLE IF NOT EXISTS `assessment_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `assessment_id` INT NOT NULL,
    `score` INT NOT NULL,
    `total_score` INT NOT NULL,
    `percentage` FLOAT NOT NULL,
    `passed` BOOLEAN DEFAULT TRUE,
    `attempted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_result_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_result_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `notification_type` VARCHAR(50) DEFAULT 'general',
    `is_read` BOOLEAN DEFAULT FALSE,
    `link` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
