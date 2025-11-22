import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Banner extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(banner: Banner) {
    banner.id = randomUUID()
  }

  @beforeSave()
  static stringifyOptions(banner: Banner) {
    banner.options = JSON.stringify(banner.options)
  }

  @column({ isPrimary: true })
  declare id: string

  @column({ serialize: (value) => JSON.parse(value) })
  declare options: Object

  @column({ serializeAs: null })
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
