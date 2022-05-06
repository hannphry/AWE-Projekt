import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StationModule } from './bahnhof/station.module';
//import { Bahnhof } from './bahnhof/bahnhof';

@Module({
  imports: [
    StationModule, 
    MongooseModule.forRoot('mongodb+srv://dbUser:EHGvBvd1n3wzZXgQ@cluster0.trkln.mongodb.net/AWE?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
