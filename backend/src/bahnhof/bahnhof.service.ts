import { Injectable } from '@nestjs/common';
import { Bahnhof } from './bahnhof';

@Injectable()
export class BahnhofService {

    bahnhoefe: Bahnhof[] = [
        {
            id: "1",
            name: "Test",
            shortcut: "T",
            lon: 1.0,
            lat: 2.0
        },
        {
            id: "2",
            name: "Aachen",
            shortcut: "AA",
            lon: 1.0,
            lat: 2.0
        }
    ];

    getBahnhof(id: string){
        console.log("id: "+id);
        /*let index = this.bahnhoefe.findIndex(obj => obj.id == id);
        if(index > 0) {
            let bahnhof = this.bahnhoefe[index];
            return bahnhof;
        };*/
    }

  getHello(): Bahnhof[] {
    return this.bahnhoefe;
  }
}
