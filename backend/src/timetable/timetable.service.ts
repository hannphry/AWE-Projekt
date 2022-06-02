//HTTP-Requests:
import { HttpModule, HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Station, StationModel } from './timetable';

@Injectable()
export class TimetableService {

    constructor(
        @InjectModel('Station') private readonly stationModel: Model<Station>,
        private httpService: HttpService
        ){
            
        }
}
