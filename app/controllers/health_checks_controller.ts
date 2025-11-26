import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async handle({ request, response, view }: HttpContext) {
    const report = await healthChecks.run()

    if (report.isHealthy) {
      return request.url() === '/health/json'
        ? response.ok(report)
        : view.render('health', { report })
    }

    return response.serviceUnavailable(report)
  }
}
