import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeRemoveEmptyParagraph from "rehype-remove-empty-paragraph";
import { visit, SKIP } from "unist-util-visit";

function rehypeExtractImages() {
  return (tree, file) => {
    const images = [];
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName == "img") {
        // Extract properties
        const { src, alt } = node.properties;
        images.push({ src, alt });
        // Remove image from tree
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
    file.data.images = images;
  };
}

function rehypeRemoveTables() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName == "table") {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

async function processContent(content) {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeExtractImages)
    .use(rehypeSanitize)
    .use(rehypeRemoveTables)
    .use(rehypeRemoveEmptyParagraph)
    .use(rehypeStringify)
    .process(content);
  const images = file.data?.images;
  const html = file.value;
  return { images, html };
}

export default processContent;
