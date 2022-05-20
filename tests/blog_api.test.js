const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./helper_test");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blogs");

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
}, 100000);

test("all blogs are returned", async () => {
	const response = await api.get("/api/blogs");
	console.log(response);

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
	const response = await api.get("/api/blogs");

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain("Go To Statement Considered Harmful");
});

afterAll(() => {
	mongoose.connection.close();
});
