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
    "stopBlocking",
    "routeBlocking",
    "stopInfo",
    "routeInfo"
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
    type: ChartType.ColumnChart,
    options: {
      title : 'Art der Meldungen',
      seriesType: 'bars',
      series: {
        3: {type: 'line'}
      },
      colors: [
        '#dba3d1',
        '#ee869a',
        '#8b0000'
      ],
      vAxis: {
        gridlines: {
            color: 'light grey'
        },
        //title: 'Meldungsart'
      },
      //hAxis: {title: 'Anzahl der Meldungen'},
      
    },
    columns: ['Meldungsart','Anzahl','Linie betreffend','hohe Priorität'],//, 'Differenz'],
    values: []
  }

  tableChart: Chart = {
    title: 'Meldungen',
    type: ChartType.Table,
    options: {
      title: 'Art der Meldungen',
      allowHtml : true,
      width: '100%',
      page: 'enable',
      pageSize: 5,
      pagingButtons: 0,
      cssClassNames: {headerRow:'columnTitle'}
    },
    columns: ['Meldungsart','Priorität','Beschreibung'],
    values: [
    ]
  }

  pieChart: Chart = {
    title: 'Dauer der Meldungen',
    type: ChartType.PieChart,
    options: {
      title : 'Dauer der Meldungen in Monaten',
      colors: [
        '#ffb5c5',
        '#ff6347',
        '#ff4500',
        '#ee2c2c',
        '#ff0000',
        '#8b0000'
      ]
    },
    columns: ['Meldungsart','Anzahl'],
    values: [
      
    ]
  }

  barChart: Chart = {
    title: 'Betroffene Linien',
    type: ChartType.BarChart,
    options: {
      title : 'Betroffene Linien',
      seriesType: 'bars',
      series: {
        3: {type: 'line'}
      },
      colors: [
        '#ea6262'
      ],
      vAxis: {
        gridlines: {
            color: 'light grey'
        },
        //title: 'Meldungsart'
      },
      //hAxis: {title: 'Anzahl der Meldungen'},
      
    },
    columns: ['Linie','Anzahl'],
    values: [
      ["Test",2]
    ]
  }

  public percentAffectTimetable: number = 0;

  public percentConstruction: number = 0;

  public percentHighPriority: number = 0;

  public amountOfAnnouncements: number = 0;

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
        //console.log(tmpAnnouncements);
        if(type == "tripMessage"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Durchsagen", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }else if(type == "lineInfo"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Linieninformation", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }else if(type == "stopInfo"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Haltestelleninformation", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }else if(type == "routeInfo"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Streckeninformation", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }else if(type == "stopBlocking"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Haltestellensperrung", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }else if(type == "routeBlocking"){
          let tmpAffected = this.announcements.filter(announcement => announcement.concernedLines != "undefined;" && announcement.type == type);
          let tmpPrio = this.announcements.filter(announcement => announcement.priority == "veryHigh" && announcement.type == type);
          announcementTypes.push(["Streckensperrung", tmpAnnouncements.length, tmpAffected.length, tmpPrio.length]);
        }
      });
    
      this.comboChart.values = announcementTypes;

      //Tabelle der aktuellen Meldungen:
      
      let currentAnnouncements: any[] = [];

      let today = new Date();

      let correctAnnouncement = "";
      let correctPriority = "";
      
      this.announcements.forEach(announcement => {
        if(announcement.from != undefined && announcement.to != undefined){
          let minDate = new Date(announcement.from);
          let maxDate = new Date(announcement.to);
          //console.log(minDate)
          //console.log(today)
          //console.log(maxDate)
          if (today > minDate && today < maxDate){
            if(announcement.type == "tripMessage"){
              correctAnnouncement = "Durchsagen";
            }else if(announcement.type == "lineInfo"){
              correctAnnouncement = "Linieninformation";
            }else if(announcement.type == "stopInfo"){
              correctAnnouncement = "Haltestelleninformation";
            }else if(announcement.type == "routeInfo"){
              correctAnnouncement = "Streckeninformation";
            }else if(announcement.type == "stopBlocking"){
              correctAnnouncement = "Haltestellensperrung";
            }else if(announcement.type == "routeBlocking"){
              correctAnnouncement = "Streckensperrung";
            }

            if(announcement.priority == "veryHigh"){
              correctPriority = "hoch";
            }else if(announcement.priority == "normal"){
              correctPriority = "normal";
            }else if(announcement.priority == "veryLow"){
              correctPriority = "gering";
            }

            currentAnnouncements.push([correctAnnouncement, correctPriority, announcement.content])
            this.tableChart.values = currentAnnouncements;
         }
        }
      });

      //Dauer der Störungen

      let announcementDuration1: any[] = [];
      let announcementDuration2: any[] = [];
      let announcementDuration3: any[] = [];
      let announcementDuration6: any[] = [];
      let announcementDuration12: any[] = [];
      let announcementDuration: any[] = [];
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
      //console.log(times)
      times.forEach(time => {
        if(time <= 1){
          announcementDuration1.push(time);
        }else if(time <= 2){
          announcementDuration2.push(time);
        }else if(time <= 3){
          announcementDuration3.push(time);
        }else if(time <= 6){
          announcementDuration6.push(time);
        }else if(time <= 12){
          announcementDuration12.push(time);
        }else{
          announcementDuration.push(time);
        }
      });

      announcementDurations.push(["< 1", announcementDuration1.length]);
      announcementDurations.push(["1 - 2", announcementDuration2.length]);
      announcementDurations.push(["2 - 3", announcementDuration3.length]);
      announcementDurations.push(["3 - 6", announcementDuration6.length]);
      announcementDurations.push(["6 - 12", announcementDuration12.length]);
      announcementDurations.push(["> 12", announcementDuration.length]);
      //console.log(announcementDurations);

      this.pieChart.values = announcementDurations;

      //Welche Linien sind am meisten betroffen

      let allConcernedLines: any[] = [];
      let graphConcernedLines: any[] = [];

      this.announcements.forEach(announcement => {
        if(announcement.concernedLines != undefined){
          let concernedLines = ((announcement.concernedLines as unknown) as string).split(';');
          concernedLines.forEach(concernedLine => {
            if(concernedLine != "undefined" && concernedLine != ""){
            allConcernedLines.push(concernedLine);
            }
          });
        }
      });

      //console.log(allConcernedLines);

      let counts : any[] = [];
      allConcernedLines.forEach(line => {
        counts[line] = (counts[line] || 0) + 1;
        graphConcernedLines.push([line,counts[line]])
      });
      
      let tmpArray:  any[] = [];

      //console.log(graphConcernedLines);

      graphConcernedLines.forEach(elem => {
          //console.log(elem[0].split(' ')[0]);
          let string = elem[0].split(' ')[0]
          let index = tmpArray.findIndex(item => item[0] == string )
          if(index >= 0 ){
            tmpArray[index][1] += elem[1];
          }else{
            tmpArray.push([string, elem[1]]);
          }
        });
        
        tmpArray.splice(2, 1);
        
        //console.log(tmpArray);

        

      //console.log(counts);
      //console.log(tmpArray);

      //console.log(allConcernedLines);

      this.barChart.values = tmpArray.slice(0, 10);


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

      //Anzahl aller Meldungen
      let tmpAmountOfAnnouncements = currentAnnouncements.length;

      this.amountOfAnnouncements = tmpAmountOfAnnouncements;
    });
  }

  //(mouseenter)="this.clickOnInfo(0)" (mouseleave)="this.resetInfo(0)"

  clickOnInfo(index: number){
    //console.log("Highlight graph" +index);
    let elem = document.getElementById(`graph${index}`);

    if(elem){
      elem.style.boxShadow = '0px 0px 61px -25px #caca03';
    }
  }

  resetInfo(index: number){
    let elem = document.getElementById(`graph${index}`);
    if(elem){
      elem.style.boxShadow = '0px 0px 61px -49px black';
    }
  }
}
