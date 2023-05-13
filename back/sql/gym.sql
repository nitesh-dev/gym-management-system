
CREATE TABLE IF NOT EXISTS admin(
  account_id CHAR(36) NOT NULL ,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  contact VARCHAR(15),
  dob DOUBLE,
  gender ENUM('male', 'female') NOT NULL ,
  PRIMARY KEY (account_id)
);
CREATE TABLE IF NOT EXISTS branch (
  branch_id CHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  address VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  PRIMARY KEY (branch_id)
);

CREATE TABLE IF NOT EXISTS manager (
  account_id CHAR(50) NOT NULL,
  branch_id CHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  address VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  dob DOUBLE NOT NULL,
     gender ENUM('male', 'female') NOT NULL ,
  PRIMARY KEY (account_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE IF NOT EXISTS trainer (
  account_id CHAR(36) NOT NULL,
  branch_id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  address VARCHAR(100) NOT NULL,
  dob DOUBLE NOT NULL,
  start_time DOUBLE NOT NULL,
  end_time DOUBLE NOT NULL,
  specialization ENUM('Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Crossfit') NOT NULL,
  gender ENUM('male', 'female') NOT NULL ,
  PRIMARY KEY (account_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE IF NOT EXISTS staff (
  account_id CHAR(36) NOT NULL,
  branch_id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  address VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  dob DOUBLE NOT NULL,
  work ENUM('security', 'cleaner') NOT NULL,
     gender ENUM('male', 'female') NOT NULL ,
  PRIMARY KEY (account_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE IF NOT EXISTS member (
  account_id CHAR(36) NOT NULL,
  branch_id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  address VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  dob DOUBLE NOT NULL ,
  is_approved BOOL NOT NULL,
   gender ENUM('male', 'female') NOT NULL ,
  PRIMARY KEY (account_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);



CREATE TABLE IF NOT EXISTS membership (
  membership_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  type ENUM('bronze', 'gold', 'silver') NOT NULL ,
  price DECIMAL(10, 2) NOT NULL,
  start_time DOUBLE NOT NULL,
  end_time DOUBLE NOT NULL,
  PRIMARY KEY (membership_id),
  FOREIGN KEY (member_id) REFERENCES member (account_id)
);

