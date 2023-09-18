# Otp_nodejs
tạo các mysql và thêm kiểu dữ liệu:
THÊM DỮ LIỆU VÀO MY SQL:
CREATE TABLE otp (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emai VARCHAR(255),
  otp VARCHAR(255),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(time)
);



CREATE EVENT delete_otp_event
ON SCHEDULE EVERY 1 MINUTE 
DO 
BEGIN
DELETE FROM otp WHERE time < NOW() - INTERVAL 60 SECOND;
END

SET GLOBAL event_scheduler = ON;
SHOW VARIABLES LIKE ‘event_scheduler’;

DROP EVENT [IF EXISTS] event_name;
