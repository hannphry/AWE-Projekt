import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Announcement, AnnouncementModel } from './announcement';
import { AnnouncementService } from './announcement.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller()
export class AnnouncementController {
  constructor(
    private announcementService: AnnouncementService) {}

  @Get('announcements')
  getStoerungen() {
    return this.announcementService.getAnnouncements();
  }

  @Post('announcements')
  addStation(
    @Body('id') pId: string,
    @Body('type') pType: string,
  ){
    let stoerung: AnnouncementModel = {
      id: pId,
      type: pType
    };
    //console.log(stoerung);
    return this.announcementService.addAnnouncement(stoerung);
  }

  @Get('announcements/fillAnnouncementData')
  fillAnnouncementData(){
    this.announcementService.fillAnnouncementData();
  }

  @Get('announcements/getAllAnnouncements')
  getAllAnnouncements(){
    return this.announcementService.getAllAnnouncements();
  }

}