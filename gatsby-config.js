module.exports = {
    siteMetadata: {
        title: `Amazing Pandas Eating Things`,
      },
    plugins: [
      `gatsby-plugin-netlify-cms`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `src`,
          path: `${__dirname}/src/`,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `blog`,
          path: `${__dirname}/blog`,
        },
      },
      `gatsby-transformer-remark`,
      `gatsby-plugin-emotion`,
      {
        resolve: `gatsby-plugin-typography`,
        options: {
          pathToConfigModule: `src/utils/typography`,
        },
      },
    ],
  }