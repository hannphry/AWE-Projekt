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

  durations: number[] = [
    0,
    1,
    2,
    3,
    6,
    12,
    24
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

  tableChart: Chart = {
    title: 'Meldungen',
    type: ChartType.Table,
    options: {
      title : 'Art der Meldungen',
    },
    columns: ['Meldungsart','Priorität','Beschreibung'],
    values: [
    ]
  }

  pieChart: Chart = {
    title: 'Dauer der Meldungen',
    type: ChartType.PieChart,
    options: {
      title : 'Dauer der Meldungen',
      colors: [
        //'#aaecdc',
        //'#a7dde8',
        //'#f68ea2',
        '#ee869a'
      ]
    },
    columns: ['Meldungsart','Anzahl'],//, 'Differenz'],
    values: []
  }

  public percentAffectTimetable: number = 0;

  public percentConstruction: number = 0;

  public percentHighPriority: number = 0;

  constructor(
    private announcementService: AnnouncementService,
  ) { }

    ngOnInit(): void {

    this.announcementService.getAnnouncements().subscribe(data =>{

      this.announcements = data;

      //console.log (this.announcements);


      //Art und Anzahl der Meldungen wird ermittelt
      let announcementTypes: any[] = [];

      this.types.forEach(type =>{
        let tmpAnnouncements = this.announcements.filter(announcement => announcement.type == type);

        announcementTypes.push([type, tmpAnnouncements.length]);
      })
      
      this.comboChart.values = announcementTypes;

      //Tabelle der aktuellen Meldungen:
      
      let currentAnnouncements: any[] = [];

      let today = new Date();
      
      this.announcements.forEach(announcement => {
        if(announcement.from != undefined && announcement.to != undefined){
          let minDate = new Date(announcement.from);
          let maxDate = new Date(announcement.to);
          //console.log(minDate)
          //console.log(today)
          //console.log(maxDate)
          if (today > minDate && today < maxDate){
            currentAnnouncements.push([announcement.type, announcement.priority, announcement.content])
            this.tableChart.values = currentAnnouncements;
         }
        }
      });
      

      //Dauer der Störungen

      let announcementDurations: any[] = [];
      let times: number[] = [];

      this.announcements.forEach(announcement => {
        if(announcement.from != undefined && announcement.to != undefined){
          let minDate = new Date(announcement.from);
          let maxDate = new Date(announcement.to);

          let time = maxDate.getTime() - minDate.getTime();
          time = Math.floor(time / 2628000000 );
          times.push(time);
          //console.log(time);          
        }
      });
      console.log(times)
      times.forEach(time => {
        let tmpDuration = this.durations.filter(duration => duration == time);
        let t = time.toString();
        announcementDurations.push([t, tmpDuration.length]);
      });

      console.log(announcementDurations);

      this.pieChart.values = announcementDurations;

      //Anteil der Meldungen, die die Abfahrpläne beeinflussen werden ermittelt
      let tmpAffects = this.announcements.filter(announcement => announcement.affectTimetable == true);

      this.percentAffectTimetable = tmpAffects.length / this.announcements.length * 100;

      //Anteil der Meldungen, die durch Bauarbeiten verursacht wurden

      let tmpConstructions = this.announcements.filter(announcement => announcement.subtitle?.indexOf('Bauarbeiten'));

      this.percentConstruction = tmpConstructions.length / this.announcements.length * 100;

      this.percentConstruction = Math.round(this.percentConstruction);

      //Anteil der Meldungen, die eine sehr hohe Proirät haben

      let tmpHighPriority = this.announcements.filter(announcement => announcement.priority == "veryHigh");

      this.percentHighPriority = tmpHighPriority.length / this.announcements.length * 100;

      this.percentHighPriority = Math.round(this.percentHighPriority)

    });
  }
}
