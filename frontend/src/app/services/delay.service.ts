import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Delay } from "../interfaces/delay";

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
        console.log(tmpDate);
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
        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/getTimeTables/${evaNo}/${date}/${hours}`);
    }

}