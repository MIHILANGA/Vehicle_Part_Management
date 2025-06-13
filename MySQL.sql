-- Create the database
CREATE DATABASE IF NOT EXISTS auto_parts_db;
USE auto_parts_db;

-- Create the parts table
CREATE TABLE IF NOT EXISTS parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    partType VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_part_type ON parts(partType);
CREATE INDEX idx_status ON parts(status);
CREATE INDEX idx_brand ON parts(brand);

-- Insert sample data
INSERT INTO parts (name, partType, brand, quantity, price, status) VALUES
('Engine Oil Filter', 'Engine', 'Bosch', 25, 12.99, 'In Stock'),
('Brake Pads Set', 'Brakes', 'Brembo', 8, 45.50, 'Low Stock'),
('Spark Plug', 'Engine', 'NGK', 50, 8.99, 'In Stock'),
('Air Filter', 'Engine', 'K&N', 15, 32.75, 'In Stock'),
('Shock Absorber', 'Suspension', 'Bilstein', 3, 89.99, 'Low Stock'),
('Alternator', 'Electrical', 'Denso', 0, 145.00, 'Out of Stock'),
('Headlight Assembly', 'Body', 'Philips', 12, 125.00, 'In Stock'),
('Timing Belt Kit', 'Engine', 'Gates', 5, 65.25, 'Low Stock'),
('Wiper Blade', 'Body', 'Valeo', 30, 14.99, 'In Stock'),
('Fuel Pump', 'Engine', 'Delphi', 2, 85.60, 'Low Stock');

-- Create a user with privileges (replace 'password' with a strong password)
CREATE USER IF NOT EXISTS 'auto_parts_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON auto_parts_db.* TO 'auto_parts_user'@'localhost';
FLUSH PRIVILEGES;

-- Create a stored procedure to update status based on quantity
DELIMITER //
CREATE PROCEDURE update_part_status()
BEGIN
    UPDATE parts 
    SET status = CASE 
        WHEN quantity > 10 THEN 'In Stock'
        WHEN quantity > 0 THEN 'Low Stock'
        ELSE 'Out of Stock'
    END;
END //
DELIMITER ;

-- Create a trigger to automatically update status when quantity changes
DELIMITER //
CREATE TRIGGER before_part_update
BEFORE UPDATE ON parts
FOR EACH ROW
BEGIN
    IF NEW.quantity != OLD.quantity THEN
        SET NEW.status = CASE 
            WHEN NEW.quantity > 10 THEN 'In Stock'
            WHEN NEW.quantity > 0 THEN 'Low Stock'
            ELSE 'Out of Stock'
        END;
    END IF;
END //
DELIMITER ;