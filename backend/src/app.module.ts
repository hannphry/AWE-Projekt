import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BahnhofController } from './bahnhof/bahnhof.controller';
import { BahnhofService } from './bahnhof/bahnhof.service';

@Module({
  imports: [],
  controllers: [AppController, BahnhofController],
  providers: [AppService, BahnhofService],
})
export class AppModule {}
