import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StationModule } from './station/station.module';
import { TimetableModule } from './timetable/timetable.module';
//import { XMLParser } from 'fast-xml-parser';
import { RouteModule } from './route/route.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { DelayModule } from './delay/delay.module';
//import { Bahnhof } from './bahnhof/bahnhof';

@Module({
  imports: [
    StationModule,
    TimetableModule,
    RouteModule,
    AnnouncementModule,
    DelayModule,
    MongooseModule.forRoot('mongodb+srv://dbUser:EHGvBvd1n3wzZXgQ@cluster0.trkln.mongodb.net/AWE?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}