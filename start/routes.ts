/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const BannersController = () => import('#controllers/banners_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/test', async ({ response }) => {
  const appRoot = fileURLToPath(app.appRoot)
  const testHtmlPath = join(appRoot, 'public', 'test.html')
  const html = await readFile(testHtmlPath, 'utf-8')
  response.header('Content-Type', 'text/html')
  return response.send(html)
})

router.get('/banners/persist', [BannersController, 'save'])
router.post('/banners/persist', [BannersController, 'save'])
router.get('/banners/:type', [BannersController, 'create'])
router.post('/banners/:type', [BannersController, 'create'])
router.get('/banners/:type/:id', [BannersController, 'create'])
router.patch('/banners/:id', [BannersController, 'update'])
