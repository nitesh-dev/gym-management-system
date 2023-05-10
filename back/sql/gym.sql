
CREATE TABLE IF NOT EXISTS admin(
  account_id CHAR(36) NOT NULL ,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  contact VARCHAR(15),
  dob DOUBLE,
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
  specialization ENUM('Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Crossfit') NOT NULL,
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
  dob DOUBLE NOT NULL,
  membership ENUM('free','bronze', 'gold', 'silver') NOT NULL DEFAULT 'free',
  PRIMARY KEY (account_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE IF NOT EXISTS training_session (
  session_id CHAR(36) NOT NULL,
  trainer_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  start_time DOUBLE NOT NULL,
  end_time DOUBLE NOT NULL,
  PRIMARY KEY (session_id),
  FOREIGN KEY (trainer_id) REFERENCES trainer (account_id),
  FOREIGN KEY (member_id) REFERENCES member (account_id)
);


