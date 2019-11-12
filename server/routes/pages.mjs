import express from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
  render(res, 'home')
})

function render(res, view) {
  res.pageData.page = view
  res.render(view, res.pageData)
}

export default router
