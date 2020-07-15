import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { mongooseConfig } from './config/mongoose.config'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [MongooseModule.forRoot(mongooseConfig, { useCreateIndex: true }), UserModule],
  controllers: [AppController]
})
export class AppModule {}
