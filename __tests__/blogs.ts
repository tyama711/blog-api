import mongoose = require("mongoose");
import MongoMemoryServer from "mongodb-memory-server";
import request = require("supertest");
import * as _ from "lodash";
import server from "../src/index";
import Constants from "../src/config/constants";
import BlogModel from "../src/app/model/interfaces/blog-model";
import BlogRepository from "../src/app/repository/blog-repository";

const mongoUrl = new URL(Constants.DB_CONNECTION_STRING);
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  const serverOpts = {
    instance: {
      port: parseInt(mongoUrl.port),
      ip: mongoUrl.hostname,
      dbName: mongoUrl.pathname.slice(1)
    }
  };

  mongoServer = new MongoMemoryServer(serverOpts);
}, 10000);

afterAll(async () => {
  server.close(err => {
    if (err) {
      console.log(err);
    }
  });
  await mongoServer.stop();
});

afterEach(async () => {
  await cleanUpDb();
});

describe("GET /blogs API", () => {
  it("returns a empty array if there are no models.", async () => {
    await request(server)
      .get("/blogs")
      .expect(200)
      .expect({ total: 0, blogs: [] });
  });

  it("can return all blogs in DB.", async () => {
    const SAMPLE_NUM = 15;
    const sampleBlogs = createSampleBlogs(SAMPLE_NUM);
    await registerBlogsToDb(sampleBlogs);
    const fetchedBlogs = await fetchAllBlogsFromApi(SAMPLE_NUM);

    expect(fetchedBlogs).toHaveLength(SAMPLE_NUM);

    for (const sample of sampleBlogs) {
      const matched = fetchedBlogs.find(
        fetched => fetched.userId === sample.userId
      );
      expect(matched).toBeTruthy();
      expect(matched).toEqual(expect.objectContaining(sample));
    }
  });

  it("response array is sorted descendingly by createDate.", async () => {
    const SAMPLE_NUM = 15;
    const sampleBlogs = createSampleBlogs(SAMPLE_NUM);
    const shuffledBlogs = _.shuffle(sampleBlogs);
    await registerBlogsToDb(shuffledBlogs);
    const fetchedBlogs = await fetchAllBlogsFromApi(SAMPLE_NUM);

    expect(
      fetchedBlogs.isSorted(
        (a, b) => b.createDate.getTime() - a.createDate.getTime()
      )
    ).toEqual(true);
  });

  it("returns at most 10 blogs at once.", async () => {
    const SAMPLE_NUM = 15;
    const sampleBlogs = createSampleBlogs(SAMPLE_NUM);
    await registerBlogsToDb(sampleBlogs);
    const response = await request(server)
      .get("/blogs")
      .expect(200);

    expect(response.body.total).toEqual(15);
    expect(response.body.blogs).toHaveLength(10);
  });
});

describe("GET /blogs/:id API", () => {
  const BLOG_ID = "5cab3936bd156615fd501de6";

  beforeEach(async () => {
    await registerBlogsToDb([
      {
        _id: BLOG_ID,
        userId: "testUser10",
        title: "testTitle",
        createDate: new Date(),
        abstract: "This is abstract.",
        content: "This is content."
      } as any
    ]);
  });

  it("returns a model if there is a model with specified id.", async () => {
    const response = await request(server)
      .get(`/blogs/${BLOG_ID}`)
      .expect(200);

    expect(response.body._id).toEqual(BLOG_ID);
  });

  it("returns 404 status code if there is not a model with specified id.", async () => {
    const WRONG_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
    request(server)
      .get(`/blogs/${WRONG_ID}`)
      .expect(404);
  });
});

describe("POST /blogs API", () => {
  it("creates a new blog and returns a id.", async () => {
    const [sampleBlog] = createSampleBlogs(1);

    // createDate is not required by POST /blogs API.
    delete sampleBlog.createDate;

    const response = await request(server)
      .post("/blogs")
      .send(sampleBlog)
      .set("Content-Type", "application/json")
      .expect(200);

    const storedBlog = await mongoose
      .model<BlogModel>("blog")
      .findById(response.body._id);
    expect(storedBlog).toEqual(expect.objectContaining(sampleBlog));
    expect(storedBlog).toHaveProperty("createDate");
  });
});

describe("PUT /blogs/:id API", () => {
  const BLOG_ID = "5cab3936bd156615fd501de6";

  beforeEach(async () => {
    await registerBlogsToDb([
      {
        _id: BLOG_ID,
        userId: "testUser10",
        title: "testTitle",
        createDate: new Date(),
        abstract: "This is abstract.",
        content: "This is content."
      } as any
    ]);
  });

  it("updates a existing blog.", async () => {
    const [updateBlog] = createSampleBlogs(1);

    const response = await request(server)
      .put(`/blogs/${BLOG_ID}`)
      .send(updateBlog)
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body.ok).toEqual(true);
    const storedBlog = await mongoose
      .model<BlogModel>("blog")
      .findById(BLOG_ID);
    expect(storedBlog).toEqual(expect.objectContaining(updateBlog));
    expect(storedBlog).toHaveProperty("updateDate");
  });

  it("returns 404 status code if there is not a model with specified id.", async () => {
    const WRONG_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
    request(server)
      .put(`/blogs/${WRONG_ID}`)
      .expect(404);
  });
});

describe("DELETE /blogs/:id API", () => {
  const BLOG_ID = "5cab3936bd156615fd501de6";

  beforeEach(async () => {
    await registerBlogsToDb([
      {
        _id: BLOG_ID,
        userId: "testUser10",
        title: "testTitle",
        createDate: new Date(),
        abstract: "This is abstract.",
        content: "This is content."
      } as any
    ]);
  });

  it("deletes a existing blog.", async () => {
    const response = await request(server)
      .delete(`/blogs/${BLOG_ID}`)
      .expect(200);

    expect(response.body.ok).toEqual(true);
    const storedBlogs = await mongoose.model<BlogModel>("blog").find({});
    expect(storedBlogs).toHaveLength(0);
  });

  it("returns 404 status code if there is not a model with specified id.", async () => {
    const WRONG_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
    request(server)
      .delete(`/blogs/${WRONG_ID}`)
      .expect(404);
  });
});

// add isSorted() method to Array.prototype.
declare global {
  interface Array<T> {
    isSorted(compareFn: (a: T, b: T) => number): boolean;
  }
}

Array.prototype.isSorted = function isSorted<T>(
  compareFn: (a: T, b: T) => number
) {
  let sorted = true;
  for (const i of _.range(this.length - 1)) {
    if (compareFn(this[i], this[i + 1]) > 0) {
      sorted = false;
      break;
    }
  }
  return sorted;
};

function createSampleBlogs(num: number) {
  const blogs = [];
  const now = new Date();
  for (const i of _.range(num)) {
    blogs.push({
      userId: `testUser${i}`,
      createDate: new Date(now.getTime() + i),
      title: `testTitle${i}`,
      abstract: `This is abstract${i}.`,
      content: `This is content${i}.`
    } as any);
  }

  return blogs;
}

async function registerBlogsToDb(blogs: BlogModel[]) {
  const blogRepository = new BlogRepository();
  const promises: Promise<BlogModel>[] = [];

  for (const blog of blogs) {
    promises.push(blogRepository.create(blog));
  }

  await Promise.all(promises);
}

async function cleanUpDb() {
  const promises = [];
  for (const modelName of mongoose.modelNames()) {
    promises.push(mongoose.model(modelName).deleteMany({}));
  }
  await Promise.all(promises);
}

async function fetchAllBlogsFromApi(sampleNum: number): Promise<BlogModel[]> {
  let fetchedBlogs: any[] = [];
  for (const i of _.range(Math.floor(sampleNum / 10) + 1)) {
    const response = await request(server)
      .get("/blogs")
      .query({ page: i + 1 })
      .expect(200);

    fetchedBlogs = fetchedBlogs.concat(response.body.blogs);
  }

  fetchedBlogs = fetchedBlogs.map(blog =>
    Object.assign(blog, { createDate: new Date(blog.createDate) })
  );

  return fetchedBlogs as BlogModel[];
}
