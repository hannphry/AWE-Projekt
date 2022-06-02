import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Station, StationModel } from './timetable';
import { TimetableService } from './timetable.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller()
export class TimetableController {
  constructor(
    private timetableService: TimetableService) {}
}