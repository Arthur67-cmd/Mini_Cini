CREATE TABLE IF NOT EXISTS `movies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `year` INT(4) DEFAULT NULL,
  `genre` VARCHAR(100) DEFAULT NULL,
  `poster_url` TEXT DEFAULT NULL,
  `rating` DECIMAL(3,1) DEFAULT NULL,
  `watched` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert seed data
INSERT INTO `movies` (`title`, `year`, `genre`, `poster_url`, `rating`, `watched`) VALUES
('The Shawshank Redemption', 1994, 'Drama', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 9.3, true),
('The Godfather', 1972, 'Crime', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 9.2, true),
('The Dark Knight', 2008, 'Action', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0, false),
('Pulp Fiction', 1994, 'Crime', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 8.9, false),
('Forrest Gump', 1994, 'Drama', 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 8.8, true),
('Inception', 2010, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 8.8, false),
('The Matrix', 1999, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 8.7, true),
('Goodfellas', 1990, 'Crime', 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', 8.7, false),
('Interstellar', 2014, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 8.6, false),
('The Lord of the Rings: The Return of the King', 2003, 'Fantasy', 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', 8.9, true);