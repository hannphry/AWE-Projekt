import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Stoerung, StoerungModel } from './stoerung';
import { StoerungService } from './stoerung.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller()
export class StoerungController {
  constructor(
    private stoerungService: StoerungService) {}

  @Get('stoerungen')
  getStoerungen() {
    return this.stoerungService.getStoerungen();
  }

  @Post('stoerungen')
  addStation(
    @Body('id') pId: string,
    @Body('type') pType: string,
  ){
    let stoerung: StoerungModel = {
      id: pId,
      type: pType
    };
    //console.log(stoerung);
    return this.stoerungService.addStoerung(stoerung);
  }

  @Get('stoerungen/fillStoerungData')
  fillStoerungData(){
    this.stoerungService.fillStoerungData();
  }

  @Get('stoerungen/getAllStoerungen')
  getAllStoerungen(){
    return this.stoerungService.getAllStoerungen();
  }

}