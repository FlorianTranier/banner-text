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
const HealthChecksController = () => import('#controllers/health_checks_controller')

router.get('/health', [HealthChecksController])
router.get('/health/json', [HealthChecksController])

router.get('/', async ({ response }) => {
  const appRoot = fileURLToPath(app.appRoot)
  const indexHtmlPath = join(appRoot, 'public', 'index.html')
  const html = await readFile(indexHtmlPath, 'utf-8')
  response.header('Content-Type', 'text/html')
  return response.send(html)
})

router.get('/test', async ({ response }) => {
  const appRoot = fileURLToPath(app.appRoot)
  const testHtmlPath = join(appRoot, 'public', 'test.html')
  const html = await readFile(testHtmlPath, 'utf-8')
  response.header('Content-Type', 'text/html')
  return response.send(html)
})

router.get('/docs', async ({ response }) => {
  const appRoot = fileURLToPath(app.appRoot)
  const testHtmlPath = join(appRoot, 'public', 'api-docs.html')
  const html = await readFile(testHtmlPath, 'utf-8')
  response.header('Content-Type', 'text/html')
  return response.send(html)
})

router.get('/api/docs', async ({ response }) => {
  const appRoot = fileURLToPath(app.appRoot)
  const openApiPath = join(appRoot, 'openapi.json')
  const openApiSpec = await readFile(openApiPath, 'utf-8')
  response.header('Content-Type', 'application/json')
  return response.send(openApiSpec)
})

router.get('/banners/persist', [BannersController, 'save'])
router.post('/banners/persist', [BannersController, 'save'])
router.get('/banners/:type', [BannersController, 'create'])
router.post('/banners/:type', [BannersController, 'create'])
router.get('/banners/:type/:id', [BannersController, 'create'])
router.patch('/banners/:id', [BannersController, 'update'])
router.put('/banners/:id', [BannersController, 'update'])
