CREATE DATABASE CareAndShare;
USE CareAndShare;
CREATE TABLE User (
  user_id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255),
  phone_number VARCHAR(255),
  location VARCHAR(255),
  email_address VARCHAR(255),
  avatar VARCHAR(255),
  isManager BOOLEAN
);

CREATE TABLE Branch (
  branch_id VARCHAR(255) PRIMARY KEY,
  branch_name VARCHAR(255),
  branch_description TEXT,
  branch_phone_number VARCHAR(255),
  branch_location VARCHAR(255),
  branch_email VARCHAR(255),
  image_url VARCHAR(255)
);

CREATE TABLE System_admin (
  admin_id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255),
  phone_number VARCHAR(255),
  location VARCHAR(255),
  avatar VARCHAR(255),
  email_address VARCHAR(255)
);

CREATE TABLE Event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255),
  event_description TEXT,
  event_date DATE,
  event_time TIME,
  event_location VARCHAR(255),
  is_private BOOLEAN,
  poster VARCHAR(255),
  branch_id VARCHAR(255),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE Admin_management (
  admin_id VARCHAR(255),
  user_id VARCHAR(255),
  PRIMARY KEY (admin_id,user_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES System_admin(admin_id)
);

CREATE TABLE Announcement (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT,
  branch_id VARCHAR(255),
  title TEXT,
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id) ON DELETE CASCADE
);

CREATE TABLE Branch_Management (
  branch_id VARCHAR(255),
  user_id VARCHAR(255),
  PRIMARY KEY (branch_id, user_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE Email_Notification (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  notification_type VARCHAR(255),
  user_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Membership (
  membership_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  branch_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE RSVP (
  rsvp_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  event_id INT,
  user_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

INSERT INTO `System_admin` (`admin_id`, `first_name`, `last_name`, `password`, `phone_number`, `location`, `avatar`, `email_address`)
VALUES ('a9bc7402-3e9e-4979-adf3-8929efdd6f28', 'Kim', 'Taehuyng', '$2b$10$A4Joq3q50pHw6FDP8hpnq.O1X0hd4c7nz6QDAa7Tt7yjgf39BjZJC', '0923383249', 'Sydney', NULL, 'Kimtaehuyng123@gmail.com');

INSERT INTO `User` (`user_id`, `first_name`, `last_name`, `password`, `phone_number`, `location`, `email_address`, `avatar`, `isManager`)
VALUES
('0b7c55a2-8a5e-4b20-abeb-69ace031e91c', 'Nguyen', 'Trang', '$2b$10$0g03BJkXt6T6JB7v5W7Rkufh3qvWzRwwHQ1IxncoNIu5qNsOVI4gS', '0923383234', 'Adelaide', 'Trangnguyen123@gmail.com', NULL, 0),
('2d8fe798-1e9b-43bd-a96a-0e1c7567c840', 'Nguyen', 'Tram', '$2b$10$aQTzPK75o1Xu/ZmS5ThB6uxu2YKNykKRWq.nE6qnpolrAdbjPHZjK', '0914788832', 'Adelaide', 'Tramnguyen123@gmail.com', NULL, 0),
('380bcd24-b1a1-4df9-b89a-08917d50d81a', 'Knight', 'Ian', '$2b$10$LH7WcuWYgFv6OW.zKZ/8auXgh2dEh9yxlHaqo3nmGtZb83H9UTZ6e', '0914788433', 'Sydney', 'Ianknight123@gmail.com', NULL, 1),
('472f38f9-7081-4c85-8ce4-b430f7274276', 'Nguyen', 'Minh', '$2b$10$MLyrgJSOxCC6sSPfn.RkQOh4t2nbkKkwNeajbHiyNsyEuaYK7gMhO', '0923383234', 'Sydney', 'Minhnguyen456@gmail.com', NULL, 0),
('56308797-0e36-4a70-9637-86b301b39392', 'Gupta', 'Manish', '$2b$10$4eSxQ3Xddog22Io1KztocukQlEJ7rRMTZuMEeteFW2XHtFKphzGiu', '0382032832', 'Adelaide', 'Manishgupta123@gmail.com', NULL, 1),
('ba800282-0fda-4e12-880a-ce2f9f9cbcc3', 'Nguyen', 'Minh', '$2b$10$/OjGKGVU3vOk4vFVZypNz.PqKlPCtMkb6NJkXUmfC./S9T.1difLG', '0767438384', 'Adelaide', 'Minhnguyen123@gmail.com', NULL, 0),
('ea62203b-1de9-4acd-9dc3-0c4358d56934', 'Nguyen', 'Nam', '$2b$10$UyDYchkLS0i0t0JYstpE1u0L3QFRZjkh0yVYq99jn4JJkAAUZQvWW', '0767438323', 'Sydney', 'Namnguyen123@gmail.com', NULL, 0);

INSERT INTO `Branch` (`branch_id`, `branch_name`, `branch_phone_number`, `branch_location`, `branch_email`, `image_url`)
VALUES
('0e8b7f23-ba2a-4b6c-a33b-b60d212e296e', 'adelaide', '0914819322', 'Adelaide', 'Manishgupta123@gmail.com', NULL),
('3da4190c-48f3-4aa3-943a-bb67d487c78b', 'sydney', '0923383232', 'Sydney', 'Ianknight123@gmail.com', NULL);

INSERT INTO `Branch_Management` (`branch_id`, `user_id`)
VALUES
('3da4190c-48f3-4aa3-943a-bb67d487c78b', '380bcd24-b1a1-4df9-b89a-08917d50d81a'),
('0e8b7f23-ba2a-4b6c-a33b-b60d212e296e', '56308797-0e36-4a70-9637-86b301b39392');

INSERT INTO `Event` (`event_id`, `event_name`, `event_description`, `event_date`, `event_time`, `event_location`, `is_private`, `poster`, `branch_id`)
VALUES
(1, 'MUSIC FESTIVAL', 'COME TO SEE BTS', '2024-06-24', '00:00:00', 'ADELAIDE', 0, NULL, '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e'),
(2, 'MUSIC FESTIVAL2', 'COME TO SEE NCT', '2024-06-25', '00:00:00', 'SYDNEY', 1, NULL, '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e'),
(3, 'MUSIC FESTIVAL3', 'COME TO SEE NCT127', '2024-06-27', '00:00:00', 'CANBERRA', 0, NULL, '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e'),
(4, 'MUSIC HERE', 'COME TO SEE TXT', '2024-06-29', '00:00:00', 'CANBERRA', 1, NULL, '3da4190c-48f3-4aa3-943a-bb67d487c78b'),
(5, 'Tech Conference', 'A conference featuring talks on the latest in technology and innovation.', '2024-09-20', '09:00:00', 'Convention Center', 1, NULL, '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e'),
(6, 'Book Fair', 'Local authors and bookstores gather to promote and sell their books.', '2024-09-20', '09:00:00', 'Library', 0, NULL, '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e');

INSERT INTO `Membership` (`membership_id`, `user_id`, `branch_id`)
VALUES
(1, '0b7c55a2-8a5e-4b20-abeb-69ace031e91c', '0e8b7f23-ba2a-4b6c-a33b-b60d212e296e'),
(2, '0b7c55a2-8a5e-4b20-abeb-69ace031e91c', '3da4190c-48f3-4aa3-943a-bb67d487c78b');