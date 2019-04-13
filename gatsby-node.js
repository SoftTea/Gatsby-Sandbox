const { createFilePath } = require(`gatsby-source-filesystem`)

const path = require(`path`)

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"

    // Update the page.
    createPage(page)
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
    // **Note:** The graphql function call returns a Promise
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
    const { createPage } = actions
    return graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  ).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
    })
  }

  // Due to a dependency issue, we also need to tell Gatsby about a global variable in order for Webpack to know about it in production builds. This won't affect us in development, but later on this could come back and surprise us!

  // this was from an older out of date article before Gatsby 2
  // https://auth0.com/blog/building-a-blog-with-gatsby-react-and-webtask/
  
  // Very unsure why we were setting this in the webpack or exactly what the updated version does?? :P
  
  // exports.modifyWebpackConfig = ({ config, stage }) => {
  //   switch (stage) {
  //     case "build-html":
  //       config.plugin('define', webpack.DefinePlugin, [ { "global.GENTLY": false } ]);
  
  //         break;
  //   }
  
  //   return config;
  // };

  // exports.onCreateWebpackConfig = ({ stage, actions }) => {
  //   switch (stage) {
  //     case `build-html`:
  //     actions.setWebpackConfig({
  //                plugins: [DefinePlugin],
  //              })
  //          }
  //         }