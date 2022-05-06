import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Station, StationModel } from './station';
import { StationService } from './station.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller()
export class StationController {
  constructor(
    private stationService: StationService) {}

  @Get('stations')
  getStations() {
    return this.stationService.getStations();
  }

  @Post('stations')
  addStation(
    @Body('id') pId: string,
    @Body('name') pName: string,
    @Body('shortcut') pShortcut: string,
    @Body('lon') pLon: number,
    @Body('lat') pLat: number,
  ){
    let station: StationModel = {
      id: pId,
      name: pName,
      shortcut: pShortcut,
      lon: pLon,
      lat: pLat
    };
    //console.log(bahnhof);
    return this.stationService.addStation(station);
  }

  @Get('stations/fillStationData')
  fillStationData(){
    this.stationService.fillStationData();
  }

}