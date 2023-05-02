import fetchPosts from "./src/fetch-posts.js";
import processContent from "./src/process-content.js";
import { createRemoteFileNode } from "gatsby-source-filesystem";

export async function sourceNodes(
  { actions, createContentDigest, createNodeId, getCache },
  {
    // Plugin options
    apiKey,
    blogId,
    maxResults = 10,
    downloadImages = false,
    nodeType = "BlogPost",
  } = {}
) {
  const { createNode } = actions;

  const posts = await fetchPosts({ apiKey, blogId, maxResults });

  if (posts === false) {
    console.warn("No blogposts could be retrieved.");
    return;
  } else if (posts.items?.length === 0) {
    console.warn("Zero blogposts were fetched.");
    return;
  } else {
    console.log(`Fetched ${posts.items.length} blog posts`);
  }

  for (let post of posts.items) {
    const { html, images } = await processContent(post.content);
    post.html = html;
    post.imageUrls = images;
    post.rawHtml = `${post.content}`;

    const nodeId = createNodeId(`${nodeType}-${post.id}`);
    delete post.id;
    delete post.content;

    if (downloadImages) {
      const imageNodes = [];
      for (let image of images) {
        try {
          const fileNode = await createRemoteFileNode({
            url: image.src,
            parentNodeId: nodeId,
            createNode,
            createNodeId,
            getCache,
          });
          if (fileNode) {
            imageNodes.push(fileNode.id);
          }
        } catch (e) {}
      }
      post.images = imageNodes;
    }

    createNode({
      ...post,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: nodeType,
        contentDigest: createContentDigest(post.rawHtml),
      },
    });
  }
}
