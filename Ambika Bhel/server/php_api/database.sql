-- Host: localhost (InfinityFree MySQL server will be provided in their cPanel)
-- Database: ambikabhel

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `items` (`id`, `name`, `quantity`, `unit`) VALUES
(1, 'Shev', 0.00, 'kg'),
(2, 'Farsan', 0.00, 'kg'),
(3, 'Imli Water', 0.00, 'liters'),
(4, 'Kachori', 0.00, 'pieces'),
(5, 'Coal', 0.00, 'kg'),
(6, 'Pani Puri', 0.00, 'pieces'),
(7, 'Carry Bag', 0.00, 'pieces'),
(8, 'Container', 0.00, 'pieces');

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(255) NOT NULL,
  `quantityUsed` decimal(10,2) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `mode` varchar(50) DEFAULT 'Cash',
  `date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
