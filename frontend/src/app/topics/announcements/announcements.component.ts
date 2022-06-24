import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Chart } from 'src/app/interfaces/chart';
import { Announcement } from 'src/app/interfaces/announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  announcements: Announcement[] = [];

  types: string[] = [
    "tripMessage",
    "lineInfo",
    "stopInfo",
    "routeInfo",
    "stopBlocking",
    "routeBlocking"
  ]

  affectsTimetable: boolean[] = [
    true,
    false
  ]

  priorities: string[] = [
    "veryHigh",
    "normal",
    "veryLow"
  ]

  comboChart: Chart = {
    title: 'Art der Meldungen',
    type: ChartType.BarChart,
    options: {
      title : 'Art der Meldungen',
      seriesType: 'bars',
      series: {
        2: {type: 'line'}
      },
      colors: [
        //'#aaecdc',
        //'#a7dde8',
        //'#f68ea2',
        '#ee869a'
      ],
      vAxis: {
        gridlines: {
            color: 'light grey'
        },
        //title: 'Meldungsart'
      },
      //hAxis: {title: 'Anzahl der Meldungen'},
      
    },
    columns: ['Meldungsart','Anzahl'],//, 'Differenz'],
    values: []
  }

  public percentAffectTimetable: number = 0;

  public percentConstruction: number = 0;

  constructor(
    private announcementService: AnnouncementService,
  ) { }

    ngOnInit(): void {

    this.announcementService.getAnnouncements().subscribe(data =>{

      this.announcements = data;

      console.log (this.announcements);


      //Art und Anzahl der Meldungen wird ermittelt
      let announcementTypes: any[] = [];

      this.types.forEach(type =>{
        let tmpAnnouncements = this.announcements.filter(announcement => announcement.type == type);

        announcementTypes.push([type, tmpAnnouncements.length]);
      })
      
      this.comboChart.values = announcementTypes;

      //Anteil der Meldungen, die die Abfahrpläne beeinflussen werden ermittelt
      let tmpAffects = this.announcements.filter(announcement => announcement.affectTimetable == true);

      this.percentAffectTimetable = tmpAffects.length / this.announcements.length * 100;

      let tmpConstructions = this.announcements.filter(announcement => announcement.subtitle?.indexOf('Bauarbeiten'));

      this.percentConstruction = tmpConstructions.length / this.announcements.length * 100;

      this.percentConstruction = Math.round(this.percentConstruction)

    });
  }
}

export default AnnouncementsComponent;