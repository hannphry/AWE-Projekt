import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DelayController } from "./delay.controller";
import { DelayService } from "./delay.service";

@Module({
    imports: [HttpModule],
    controllers: [DelayController],
    providers: [DelayService]
})
export class DelayModule{
    constructor(){}
}