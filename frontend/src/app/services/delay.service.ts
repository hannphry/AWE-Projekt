import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Delay } from "../interfaces/delay";
import { zip } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DelayService{
    constructor(private httpClient: HttpClient){}

    // GET /location/{name}
    searchForStation(input: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/searchForStation/${input}`);
    }

    getDelays(input: number[]){
        //console.log(input);
        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/getDelays/${input}`);
    }

    getTimeTables(hours: string[], evaNo: string){
        let tmpDate = new Date();
        //console.log(tmpDate);
        let month = tmpDate.getMonth()+1
        let tmpMonth = ""
        if(month < 10) {
            tmpMonth = '0'+month
        }
        let day = tmpDate.getDate()
        let tmpDay = ""
        if(day < 10){
            tmpDay = '0'+day
        }
        let tmpYear = tmpDate.getFullYear().toString().substring(2,4)
        let date = `${tmpYear}${tmpMonth}${tmpDay}`
        //console.log(evaNo, date, hours);
        /*
        let hoursInBlocks: any[] = [];
        for(let i = 0; i < hours.length / 4; i++){
            hoursInBlocks.push([hours.splice(i * 4, (i+1)*4)])
        }*/
        //console.log(hoursInBlocks);
        /*
        return zip(
            hoursInBlocks.flatMap(
              (hours) => {
                this.sleep(2000);
                return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/getTimeTables/${evaNo}/${date}/${hours}`);
              }
            ),
            (...results: any[]) => {
                return results //.map(result => result.data);
              }
          )
          */
          

        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/getTimeTables/${evaNo}/${date}/${hours}`);

    }

    sleep(milliseconds: number) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }

}