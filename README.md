# `gatsby-source-blogger-posts`

A Gatsby source plugin that fetches blogposts from Blogger. 

## Basic usage

````js
// In your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-source-blogger-posts',
    options: {
      apiKey: "YOUR-API-KEY",
      blogId: "BLOG-ID"
      maxResults: 10, // Maximum number of blogposts
      downloadImages: false, // Whether images are downloaded or not
      nodeType: "BlogPost" // name of node 
    }
  }
  //...
]
````

Then you can query blogposts as

```graphql
query MyQuery {
  allBlogPost {
    nodes {
      html # Clean html with tables/images removed
      images 
      imageUrls {
        src # source to external images
      }
      rawHtml # original html
      title
      updated
      # and more...
    }
  }
}
```

## License

[MIT License](/LICENSE), Copyright (c) 2023 [Bas Cornelissen](https://github.com/bacor)