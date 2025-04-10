-- Author: Luis Cabarique - B00882627
-- This file is to define the intial data of the MySQL database, This data will be the default on every instalation

-- Add dummy users with passwords = <first_name>_<lastname>
INSERT IGNORE INTO transect_back.users
	(id, role, first_name, last_name, email, phone, security_question, security_answer, password) 
	VALUES
	(1, "S", "user1", "last1", "user1.last1@email.com", "+1 (123) 456-7891", "What was your first childhood pet's name?", "pet", "d8826a65c01feeedabf8b7b977e37ec8"),
	(2, "S", "user2", "last2", "user2.last2@email.com", "+1 (123) 456-7892", "What is your mother's maiden name?", "maiden", "56650b17e78b16d7380b9116a01ca371"),
	(3, "S", "user3", "last3", "user3.last3@email.com", "+1 (123) 456-7893", "What is your favorite food?", "food", "d518152db3f379e7282c205c1bc35718"),
	(4, "R", "user4", "last4", "user4.last4@email.com", "+1 (123) 456-7894", "What was the first concert you attended?", "concert", "ff1223e7057df6c9f14f990c9ca2dfa1"),
	(5, "R", "user5", "last5", "user5.last5@email.com", "+1 (123) 456-7895", "In what city did your parents meet?", "city", "464342bbaf9117ec230c2f14f0a43b37");