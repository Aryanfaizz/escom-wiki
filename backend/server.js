//Author: Luis Cabarique - B00882627

//Import libraries
import express, { json } from 'express';
import crypto from 'node:crypto';
import cors from 'cors';

//Import environment variables
import env from "./config/env.js";

//Import database configuration file
import db from './config/config.js';

//Initialize Application
const app = express();
app.use(cors());
app.use(json());

//Function to send query to database, using promise
function db_query(query, params) {
	return new Promise((resolve, reject) => {
		db.query(query, params, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
}

//Test connection
app.get(env.BACKEND_URL + "/test", async (request, response) => {
	try {
		const result = await db_query("SELECT now() as 'query' FROM dual;", []);
		response.send({
			Message: "Database test complete, checking query time",
			query: result[0].query
		});
	} catch (error) {
		console.log("/test failed: " + error);
		response.status(500).send({ error: "Error on query." });
	}
});

// Login
app.post(env.BACKEND_URL + "/login", async (request, response) => {
	const { email, password } = request.body;
	const hashedPassword = crypto.hash("md5", password);
	let result;

	try {
		result = await db_query("SELECT id, role, first_name, last_name, password FROM transect_back.users WHERE email = ?", [email]);
	} catch (error) {
		console.warn("/login failed:", error);
		return response.status(400).send({ error: "Error on query." });
	}

	if (!result[0]) return response.status(401).send({ error: "No account." });
	if (result.length > 1) return response.status(401).send({ error: "No account." });

	if (hashedPassword === result[0].password) {
		return response.status(200).send({
			token: {
				userId: result[0].id,
				userRole: result[0].role,
				firstName: result[0].first_name,
				lastName: result[0].last_name
			}
		});
	}

	response.status(401).send({ error: "Invalid password." });
});

// Signup
app.post(env.BACKEND_URL + "/signup", async (request, response) => {
	const {
		role, firstname, lastname, email,
		phonenumber, password, securityquestion, securityanswer
	} = request.body;

	const hashedPassword = crypto.hash("md5", password);

	try {
		const existing = await db_query("SELECT email FROM transect_back.users WHERE email = ?", [email]);
		if (existing[0]) return response.status(409).send({ error: "Email already exists." });
		await db_query(
			"INSERT INTO transect_back.users (role, first_name, last_name, email, phone, password, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[role, firstname, lastname, email, phonenumber, hashedPassword, securityquestion, securityanswer]
		);
		response.status(201).send({ created: "YES" });
	} catch (error) {
		console.warn("/signup failed:", error);
		response.status(400).send({ error: "Invalid data" });
	}
});

// Reset by phone
app.post(env.BACKEND_URL + "/reset", async (request, response) => {
	let { email, newpass: password, phone } = request.body;
	const phoneNum = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
	if (!phoneNum) return response.status(400).send({ error: "Incorrect Phone Number Format." });
	phone = `+1 (${phoneNum[1]}) ${phoneNum[2]}-${phoneNum[3]}`;

	try {
		const result = await db_query("SELECT phone FROM transect_back.users WHERE email = ?", [email]);
		if (!result[0]) return response.status(401).send({ error: "No account." });
		if (phone === result[0].phone) return response.status(200).send({ token: "YES" });
		response.status(401).send({ error: "Invalid phone number." });
	} catch (error) {
		console.warn("/reset failed:", error);
		response.status(400).send({ error: "Error on query." });
	}
});

// Reset by security answer
app.post(env.BACKEND_URL + "/security", async (request, response) => {
	const { email, newpass: password, security_answer } = request.body;

	try {
		const result = await db_query("SELECT security_answer FROM transect_back.users WHERE email = ?", [email]);
		if (!result[0]) return response.status(401).send({ error: "No account." });

		if (security_answer === result[0].security_answer) {
			const hashedPassword = crypto.hash("md5", password);
			await db_query("UPDATE transect_back.users SET password = ? WHERE email = ?", [hashedPassword, email]);
			return response.status(200).send({ token: "YES" });
		}

		response.status(401).send({ error: "Invalid security answer." });
	} catch (error) {
		console.warn("/security update failed:", error);
		response.status(400).send({ error: "Error on query." });
	}
});

// Get post by ID
app.post(env.BACKEND_URL + "/get_post_id", async (request, response) => {
	const postId = request.body.postid;

	try {
		const result = await db_query(
			"SELECT post_id, title, creation_date, first_name, last_name, content FROM transect_back.posts p JOIN transect_back.users u ON u.id = p.author_id WHERE post_id = ?",
			[postId]
		);

		response.status(200).send({
			postId: result[0].post_id,
			title: result[0].title,
			creationDate: result[0].creation_date,
			firstName: result[0].first_name,
			lastName: result[0].last_name,
			content: result[0].content
		});
	} catch (error) {
		console.warn("/get_post_id failed:", error);
		response.status(400).send({ error: "Error on query." });
	}
});

// Get total post count
app.post(env.BACKEND_URL + "/get_number_posts", async (request, response) => {
	try {
		const result = await db_query("SELECT count(*) as total FROM transect_back.posts", []);
		response.status(200).send({ amount: result[0].total });
	} catch (error) {
		console.warn("/get_number_posts failed:", error);
		response.status(400).send({ error: "Error on query." });
	}
});

// Get N posts
app.post(env.BACKEND_URL + "/get_posts", async (request, response) => {
	const numPost = parseInt(request.body.num_post);
	const numIgnore = parseInt(request.body.num_ignore);

	try {
		const result = await db_query(
			"SELECT post_id, title, creation_date, first_name, last_name, content FROM transect_back.posts p JOIN transect_back.users u ON u.id = p.author_id ORDER BY creation_date DESC LIMIT ?,?",
			[numIgnore, numPost]
		);

		const posts = result.map(post => ({
			postId: post.post_id,
			title: post.title,
			creationDate: post.creation_date,
			firstName: post.first_name,
			lastName: post.last_name,
			content: post.content
		}));

		response.status(200).send({ posts, amount: posts.length });
	} catch (error) {
		console.warn("/get_posts failed:", error);
		response.status(400).send({ error: "Error on query." });
	}
});

// Create Post
app.post(env.BACKEND_URL + "/create_post", async (request, response) => {
	const { authorid, title, content } = request.body;
	const sanitized = content.replaceAll("\"", "\\\"");

	try {
		await db_query(
			"INSERT INTO transect_back.posts (author_id, title, content) VALUES (?, ?, ?)",
			[authorid, title, sanitized]
		);
		response.status(201).send({ posted: "YES" });
	} catch (error) {
		console.warn("/create_post failed:", error);
		response.status(400).send({ error: "Invalid data" });
	}
});

// 📌 NEW: Get all reports
app.get(env.BACKEND_URL + "/get_all_reports", async (req, res) => {
	try {
		const result = await db_query(
			`SELECT post_id, title, first_name, last_name 
			 FROM transect_back.posts p 
			 JOIN transect_back.users u ON u.id = p.author_id 
			 ORDER BY creation_date DESC;`,
			[]
		);
		res.status(200).json({ reports: result });
	} catch (error) {
		console.error("/get_all_reports failed: ", error);
		res.status(500).json({ error: "Failed to retrieve reports." });
	}
});

// 📌 NEW: Delete a report
app.delete(env.BACKEND_URL + "/delete_report/:id", async (req, res) => {
	const postId = req.params.id;
	try {
		await db_query("DELETE FROM transect_back.posts WHERE post_id = ?", [postId]);
		res.status(200).json({ deleted: true });
	} catch (error) {
		console.error("/delete_report failed: ", error);
		res.status(500).json({ error: "Failed to delete report." });
	}
});

// Start server
app.listen(env.BACKEND_PORT, () => {
	console.log(`Server is running on port ${env.BACKEND_PORT}`);
});
