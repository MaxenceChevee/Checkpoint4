CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  pseudoname VARCHAR(255) NOT NULL,
  mail VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  credits INT DEFAULT 1000,
  last_wheel_spin TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE friend_requests (
  id INT NOT NULL AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  PRIMARY KEY (id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE friends (
  id INT NOT NULL AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);

CREATE TABLE gift_transactions (
  id INT NOT NULL AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  credits_amount INT NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (sender_id, receiver_id, transaction_date),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  sender_id INT NOT NULL,
  type ENUM('friend_request', 'friend_accept', 'gift') NOT NULL,
  status ENUM('unread', 'read') DEFAULT 'unread',
  content VARCHAR(255),
  credits_amount INT,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);


