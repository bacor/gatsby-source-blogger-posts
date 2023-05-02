import { blogger } from "@googleapis/blogger";

async function fetchPosts({
  apiKey,
  blogId,
  startDate,
  maxResults = 100,
  fetchBodies = true,
  pageToken,
} = {}) {
  const service = blogger({
    version: "v3",
    auth: apiKey,
  });
  const params = {
    blogId,
    maxResults,
    startDate,
    fetchBodies,
    pageToken,
  };
  try {
    const response = await service.posts.list(params);
    if (response.status !== 200) {
      console.warn("The blogposts could not be retrieved.");
      return false;
    } else {
      return response.data;
    }
  } catch (error) {
    console.warn(`An error occured while fetching blogposts: ${error.message}`);
  }
}

export default fetchPosts;
