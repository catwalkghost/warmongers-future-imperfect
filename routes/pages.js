// Other pages
import Cosmic from 'cosmicjs'
import moment from 'moment'
module.exports = (app, config, partials) => {
  app.get('/:slug', (req, res) => {
    const slug = req.params.slug
    if (req.url === '/favicon.ico')
      return res.end()
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET } }, (err, response) => {
      res.locals.cosmic = response
      // Friendly dates
      const posts = response.objects.type.posts
      const friendly_date_posts = posts.map(post => {
        const created_friendly = moment(post.created).format('MMMM Do, YYYY')
        post.created_friendly = created_friendly
        return post
      })
      // Get current page / post
      const objects = response.objects.all
      objects.forEach(page => {
        if (page.slug === slug)
          res.locals.page = page
      })
      if (!res.locals.page) {
        return res.render('404.html', {
          partials
        })  
      }
      res.locals.cosmic.objects.type.posts = friendly_date_posts
      return res.render('page.html', {
        partials
      })
    })
  })
}