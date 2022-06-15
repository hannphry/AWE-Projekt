import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StationSchema } from './timetable';
import { TimetableController } from './timtable.controller';
import { TimetableService } from './timetable.service';
import { MongooseModule } from '@nestjs/mongoose';

//import XMLParser from 'fast-xml-parser/src/fxp';

//import { XMLParser } from 'fast-xml-parser';

//const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{name: 'Station', schema: StationSchema}])],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {
    constructor(
      private httpService: HttpService
      ){
        //this.test();
    }

    //test(){
      //return "test";
      /*
      this.httpService.get('https://api.deutschebahn.com/timetables/v1/plan/8000001/220601/12', {headers: {
        Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
        Accept: 'application/json'
      }}).subscribe(obj=>{
        let testData = obj.data;
        
      })*/
    //}
}