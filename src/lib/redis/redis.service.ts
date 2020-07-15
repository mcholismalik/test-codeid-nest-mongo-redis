import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import * as redis from 'redis'
import * as config from 'config'
import { RedisConfig } from './redis.interface'
import { promisify } from 'util'
type RedisClient = redis.RedisClient

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: RedisClient
  private redisConfig: RedisConfig = config.get('redis')
  private redisLogger: Logger = new Logger('Redis')

  onModuleInit(): void {
    this.init()
  }

  init(): void {
    this.redisClient = redis.createClient({
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      password: this.redisConfig.password
    })
    this.redisClient.on('connect', () => {
      this.redisLogger.log(`Redis connected on ${this.redisConfig.host}:${this.redisConfig.port}`)
    })

    // this.flushAll().then(() => this.redisLogger.log(`Redis flushAll successfully`))
  }

  async get(key) {
    const get = promisify(this.redisClient.get).bind(this.redisClient)
    return await get(key)
  }

  async set(key, value) {
    const set = promisify(this.redisClient.set).bind(this.redisClient)
    return await set(key, value, 'EX', this.redisConfig.expire)
  }

  async del(key) {
    const del = promisify(this.redisClient.del).bind(this.redisClient)
    return await del(key)
  }

  async flushAll() {
    const flushAll = promisify(this.redisClient.flushall).bind(this.redisClient)
    return await flushAll()
  }
}
