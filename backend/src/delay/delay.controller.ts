import { Controller, Get, Param, Body } from "@nestjs/common";

import { DelayService } from "./delay.service";

@Controller('delays')
export class DelayController{
    constructor(
        private delayService: DelayService
    ){}
    
    // GET /location/{name}
    @Get('searchForStation/:input')
    searchForStation(
        @Param('input') input: string
    ){
        return this.delayService.searchForStation(input);
    }
        
    @Get('getDelays/:input')
    getDelays(
        @Param('input') input: string
    ){
        //console.log(input.split(","));
        return this.delayService.getDelaysOfStations(input.split(","));
    }
}