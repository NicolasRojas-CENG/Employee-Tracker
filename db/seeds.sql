INSERT INTO department (name) VALUES ("Human Resource"),
("Financial"),
("Administrative"),
("Marketing"),
("Sales"),
("Purchase");

INSERT INTO role (title, salary, department_id) VALUES ("Representative", 45746, 1),
("Analyst", 50316, 4),
("Coordinator", 52014, 3),
("Agent", 48347, 2),
("Specialist", 46000, 6),
("Consultant", 39174, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Maximilianus", "Danielsen", 1, null),
("Yavuz", "Lundgren", 4, null),
("Alwin", "Hilton", 4, 3),
("Rajendra", "Falco", 6, null),
("Romeo", "Tanaka", 2, null),
("Cecílio", "Giménez", 3, null),
("Abenner", "Biermann", 5, null),
("Milorad", "Quincey", 2, 5);