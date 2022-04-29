import { Body } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { BahnhofService } from './bahnhof.service';

@Controller()
export class BahnhofController {
  constructor(private bahnhofService: BahnhofService) {}

  @Get('bahnhoefe')
  getBahnhoefe() {
      
  }

  @Get('bahnhoefe/:id')
  getBahnhof(
      @Param('id') id: string
  ) {
      console.log(id);
      this.bahnhofService.getBahnhof(id);
  }
}