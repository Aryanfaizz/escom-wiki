-- Author: Luis Cabarique - B00882627
-- This file is to define the structure of the MySQL database, it will define how to construct the database on initialization

-- Create or recreate database if exists
CREATE DATABASE IF NOT EXISTS transect_back;

-- Create or recreate users table if exists
CREATE TABLE IF NOT EXISTS transect_back.users (
	id INT NOT NULL AUTO_INCREMENT COMMENT "Unique identifier for the user.", 
	role VARCHAR(1) NOT NULL DEFAULT "S" COMMENT "User\'s role (S = Citizen Scientist, R = Researcher)",
	first_name VARCHAR(50) NOT NULL COMMENT "User\'s first name.",
	last_name VARCHAR(50) NOT NULL COMMENT "User\'s last name.", 
	email VARCHAR(100) NOT NULL COMMENT "User\'s email (used for login).", 
	phone VARCHAR(25) NOT NULL COMMENT "User\'s phone number.", 
	security_question VARCHAR(255) NOT NULL COMMENT "User\'s security question.", 
	security_answer VARCHAR(255) NOT NULL COMMENT "User\'s security question answer.",
	password VARCHAR(255) NOT NULL COMMENT "User\'s hashed password.", 
	created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT "Account creation date.", 
	PRIMARY KEY (id), 
	UNIQUE users_email_unique (email)
) ENGINE = InnoDB COMMENT = "User\'s Information";


-- Create or recreate posts table if exists
CREATE TABLE IF NOT EXISTS transect_back.posts (
	post_id INT NOT NULL AUTO_INCREMENT COMMENT "Unique identifier for the post",
	author_id INT NOT NULL COMMENT "Author's ID", 
	title VARCHAR(516) NOT NULL COMMENT "Post\'s title",
	content LONGTEXT NOT NULL COMMENT "Post\'s content",
	creation_date TIMESTAMP NOT NULL DEFAULT now() COMMENT "Post\'s creation date",
	PRIMARY KEY (post_id),
	KEY verify_author_idx (author_id),
	CONSTRAINT verify_author FOREIGN KEY (author_id) REFERENCES transect_back.users (id)
) ENGINE = InnoDB COMMENT = 'Posts information';