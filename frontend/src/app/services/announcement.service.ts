import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Announcement } from "../interfaces/announcement";
import { environment } from "src/environments/environment";
import { Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService{
    constructor(private httpClient: HttpClient){}

    getAnnouncements(): Observable<Announcement[]>{
        return this.httpClient.get<Announcement[]>(`${environment.apiUrl}/announcements`);

    }
}