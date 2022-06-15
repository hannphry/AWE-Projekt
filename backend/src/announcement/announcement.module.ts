import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AnnouncementSchema } from './announcement';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: 'Announcement', schema: AnnouncementSchema}])],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {
    constructor(private httpService: HttpService){
    }
}