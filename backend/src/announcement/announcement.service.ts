//HTTP-Requests:
import { HttpModule, HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Announcement, AnnouncementModel } from './announcement';

@Injectable()
export class AnnouncementService {

    constructor(
        @InjectModel('Announcement') private readonly announcementModel: Model<Announcement>,
        private httpService: HttpService
        ){}

    /*stoerungen: Stoerung[] = [
        {
            id: "1",
            type: "Bla"
        },
        {
            id: "2",
            type: "Bli"
        }
    ];*/
    async getAnnouncements(): Promise<Announcement[]>{
        const announcements = await this.announcementModel.find();
        //console.log(stoerungen.length);
        return announcements as Announcement[];
    }

    addAnnouncement(pAnnouncement: AnnouncementModel){
        //console.log(pStoerung);
        const newAnnouncement = new this.announcementModel(pAnnouncement);
        console.log(newAnnouncement);
        const result = newAnnouncement.save();
        return { id: pAnnouncement.id };
    }

    fillAnnouncementData(){
        console.log("Here in fillAnnouncementData");
        this.httpService.get('http://openservice-test.vrr.de/static03/XML_ADDINFO_REQUEST', {params: {
            outputFormat: 'JSON',
            fitlerPublicationStatus: 'current'
        }}).subscribe((obj) =>{
            if(obj != undefined){
                let data = obj.data.additionalInformation.travelInformations.travelInformation;
                //console.log(data);
                let counter = 0;
                if(data != undefined){
                    data.forEach(elem => {
                        //console.log(elem)
                        if(elem){
                            console.log(counter);
                            try{
                                let id = elem.infoID;
                                
                                let announcement = this.announcementModel.findOne({id: id});
                                if(announcement != undefined){
                                    let type = elem.type;
                                    let priority = elem.priority;
                                    let affectTimetable = elem.affectTimetable;
                                    let from = `${elem.publicationDuration.itdDateTime_From.itdDate.year}-${elem.publicationDuration.itdDateTime_From.itdDate.month}-${elem.publicationDuration.itdDateTime_From.itdDate.day} ${elem.publicationDuration.itdDateTime_From.itdTime.hour}:${elem.publicationDuration.itdDateTime_From.itdTime.minute}:${elem.publicationDuration.itdDateTime_From.itdTime.second}`;
                                    let to = `${elem.publicationDuration.itdDateTime_To.itdDate.year}-${elem.publicationDuration.itdDateTime_To.itdDate.month}-${elem.publicationDuration.itdDateTime_To.itdDate.day} ${elem.publicationDuration.itdDateTime_To.itdTime.hour}:${elem.publicationDuration.itdDateTime_To.itdTime.minute}:${elem.publicationDuration.itdDateTime_To.itdTime.second}`
                                    let infoLinkUrl = elem.infoLink.infoLinkURL;
                                    let infoLinkText = elem.infoLink.infoLinkText;
                                    let content  =  elem.infoLink.content;
                                    let subtitle = elem.infoLink.subtitle;
                                    let subject = elem.infoLink.subject;
                                    let concernedLines  = "";
                                    elem.concernedLines.forEach(obj=> concernedLines += `${obj.name};`);
                                    
                                    var newAnnouncement = new this.announcementModel({
                                        id: id,
                                        type: type,
                                        priority: priority,
                                        affectTimetable: affectTimetable,
                                        from: from,
                                        to: to,
                                        infoLinkUrl: infoLinkUrl,
                                        infoLinkText : infoLinkText,
                                        content: content,
                                        subtitle: subtitle,
                                        subject: subject,
                                        concernedLines : concernedLines
                                    });
                                    console.log(newAnnouncement);
                                    newAnnouncement.save();
                                    console.log(`Save ${id}`);
                                }else{
                                    console.log("Stoerung already in DB")
                                }
                                    //console.log(`Saving stoerung ${newStoerung.id}`);
                            }catch{
                                console.log(`Skipping announcement ${counter}`);
                            }
                            counter++;
                            //console.log(elem.evaNumbers)
                        }
        
                    });
                }else{
                    console.log("That is undefined")
                }
            }
        });
    }

    getAllAnnouncements(): any{
        let promise = new Promise(resolve=>{
            this.httpService.get('http://openservice-test.vrr.de/static03/XML_ADDINFO_REQUEST?outputFormat=JSON&fitlerPublicationStatus=current'
            ).subscribe(data=>{
                resolve(data);
            });
        });
        return promise;
    }
}
