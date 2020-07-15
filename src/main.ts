import * as config from 'config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ResponseInterceptor } from './lib/response/response.interceptor'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const serverConfig = config.get('server')

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.enableCors()

  // swagger
  const options = new DocumentBuilder()
    .setTitle('API Doc test-codeid-nest-mongo-redis')
    .setDescription('Authored by cholis@code.id')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Token' }, 'access-token')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('', app, document)

  const port = process.env.PORT || serverConfig.port
  await app.listen(port)

  logger.log(`Application listening on port ${port}`)
}
bootstrap()
