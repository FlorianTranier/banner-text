import Banner from '#models/banner'
import { createCanvas } from 'canvas'

interface BannerOptions {
  id?: number
  text?: string
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
  width?: number
  height?: number
  textAlign?: 'left' | 'center' | 'right'
  textVerticalAlign?: 'top' | 'center' | 'bottom'
}

export class BannerService {
  async createImage(options: BannerOptions) {
    const canvas = createCanvas(options.width || 1000, options.height || 100)
    const ctx = canvas.getContext('2d')
    ctx.font = `${options.fontSize || 30}px ${options.fontFamily || 'Arial'}`

    ctx.fillStyle = options.backgroundColor || 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = options.color || 'black'
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const textMetrics = ctx.measureText(options.text || '')
    const textX =
      options.textAlign === 'left'
        ? 0
        : options.textAlign === 'right'
          ? canvasWidth - textMetrics.width
          : (canvasWidth - textMetrics.width) / 2
    // Approximate vertical centering:
    const textY =
      options.textVerticalAlign === 'top'
        ? 0
        : options.textVerticalAlign === 'bottom'
          ? canvasHeight - Number.parseInt(ctx.font, 10)
          : canvasHeight / 2 + Number.parseInt(ctx.font, 10) / 2
    ctx.fillText(options.text || '', textX, textY)
    return canvas.toBuffer('image/png')
  }

  async createHTML(options: BannerOptions) {
    const html = `
    <div style="width: ${options.width || 1000}px; height: ${options.height || 100}px; background-color: ${options.backgroundColor || 'white'};">
    <div style="font-size: ${options.fontSize || 30}px; font-family: ${options.fontFamily || 'Arial'}; color: ${options.color || 'black'};">
    ${options.text}
    </div>
    </div>
    `
    return html
  }

  async get(id: number) {
    return Banner.findOrFail(id)
  }

  async persist(options: BannerOptions) {
    const banner = new Banner()
    banner.options = options
    banner.token = crypto.getRandomValues(new Uint8Array(32)).join('')
    await banner.save()
    return banner
  }

  async update(id: number, token: string, options: BannerOptions, overwrite: boolean = false) {
    const banner = await Banner.query().where('id', id).where('token', token).firstOrFail()
    banner.options = overwrite ? options : { ...banner.toJSON()?.options, ...options }
    await banner.save()
    return banner
  }
}
