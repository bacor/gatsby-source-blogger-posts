import fetchPosts from "../src/fetch-posts";
import processContent from "../src/process-content";

import credentials from "../credentials.json";
import samplePosts from "./sample-posts.json";

test("fetch posts", async () => {
  const params = {
    apiKey: credentials.apiKey,
    blogId: credentials.testBlogId,
    maxResults: 11,
  };
  const posts = await fetchPosts(params);
  expect(posts).not.toBeFalsy();
  expect(posts.items.length).toEqual(11);
});

test("parse response", async () => {
  const post = samplePosts.items[0];
  const { images, html } = await processContent(post.content);
  console.log(images, html);
  expect(images.length).toEqual(1);
  expect(
    html.startsWith("Comparative studies can be done in several ways")
  ).toBeTruthy();
});
