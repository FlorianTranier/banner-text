import { BannerService } from '#services/banner_service'
import env from '#start/env'
import { createBannerValidator, updateBannerValidator } from '#validators/banner'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BannersController {
  constructor(private bannerService: BannerService) {}

  /**
   * Show individual record
   */
  async show({ request }: HttpContext) {
    return request.body()
  }

  async create({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createBannerValidator)
    const existingBanner = params.id ? await this.bannerService.get(params.id) : null

    const options = {
      ...existingBanner?.toJSON()?.options,
      ...payload,
    }

    if (params.type === 'image') {
      const buffer = await this.bannerService.createImage({
        text: options.text,
        color: options.color,
        backgroundColor: options.backgroundColor,
        fontSize: options.fontSize,
        fontFamily: options.fontFamily,
        width: options.width,
        height: options.height,
        textAlign: options.textAlign,
        textVerticalAlign: options.textVerticalAlign,
      })
      response.header('Content-Type', 'image/png')
      return response.send(buffer)
    }

    if (params.type === 'html') {
      const html = await this.bannerService.createHTML({
        text: options.text,
        color: options.color,
        backgroundColor: options.backgroundColor,
        fontSize: options.fontSize,
        fontFamily: options.fontFamily,
        width: options.width,
        height: options.height,
        textAlign: options.textAlign,
        textVerticalAlign: options.textVerticalAlign,
      })
      response.header('Content-Type', 'text/html')
      return response.send(html)
    }

    if (params.type === 'text') {
      response.header('Content-Type', 'text/plain')
      return response.send(options.text)
    }

    return response.status(400).json({ error: 'Invalid type' })
  }

  async save({ request, response }: HttpContext) {
    const options = await request.validateUsing(createBannerValidator)
    const banner = await this.bannerService.persist(options || {})

    const metadata = {
      imageUrl: `${env.get('URL')}/banners/image/${banner.id}`,
      htmlUrl: `${env.get('URL')}/banners/html/${banner.id}`,
      textUrl: `${env.get('URL')}/banners/text/${banner.id}`,
      token: banner.token,
    }
    return response.json({ ...banner.toJSON(), ...metadata })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateBannerValidator)
    const { token, ...restPayload } = payload
    const banner = await this.bannerService.update(
      params.id,
      token,
      restPayload,
      request.method() === 'PUT'
    )

    const metadata = {
      imageUrl: `${env.get('URL')}/banners/image/${banner.id}`,
      htmlUrl: `${env.get('URL')}/banners/html/${banner.id}`,
      textUrl: `${env.get('URL')}/banners/text/${banner.id}`,
    }
    return response.json({ ...banner.toJSON(), ...metadata })
  }
}
