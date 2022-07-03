import { coerceStringArray } from '@angular/cdk/coercion';
import { formatDate, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { map, ReplaySubject } from 'rxjs';
import { Chart } from 'src/app/interfaces/chart';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  stations :any[] = [];
  track :any[] = [];
  departure: any[] = [];

  departureTableValues: any[] = [];

  searchValue: string = "";
  dateValue: Date = new Date();

  detailsIdLabel: string = "Streckenauswahl"

  searchStations: {
    name: string, 
    lon: number, 
    lat: number, 
    id: number
  }[] = [];

  hasSearched: boolean = false;

  tableRowValues: string[] = ["Uhrzeit","Zug","über Station", "Richtung", "Gleis"];

  constructor( private routeService: RouteService ) { }

  ngOnInit(): void {
    //this.searchForStation("Berlin");
  }

  nextStationsWordTree: Chart= {
    title: 'Naheliegende Stationen',
    type:  "WordTree" as ChartType,
    options: {
      colors: ['black', 'black', 'black'],
          wordtree: {
            format: 'explicit',
            type: 'suffix'
          }
    },
    columns: ['id', 'childLabel', 'parent', 'size'],
    values: [
      [0, 'Life', -1, 1],
      [1, 'Archaea', 0, 1],
      [2, 'Eukarya', 0, 5],
      [3, 'Bacteria', 0, 1]
  ]

  }

  viewLineChart: boolean = false;

  lineChart: Chart= {
    title: 'Zurückgelegte Strecke der Verbindung',
    //subtitle: 'in Km',
    type: ChartType.LineChart,
    options: {
      colors: [
        '#e9f35c',
        '#e1eb54'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: ["StationsReihenfolge", "Gefahrene Kilometer"],
    
    values: []

  }
  viewDepartureTable: boolean = false;
  departureTable: Chart= {
    title: 'Abfahrtsplan der ausgewählten Station',
    type: ChartType.Table,
    options: {
      width: '100%',
      page: 'enable',
      pageSize: 10,
      pagingButtons: 0,
      colors: [
        '#f3e966',
      ],
      vAxis: {
      },
      hAxis: {
      }
    },
    
    columns: ["Uhrzeit","Zug","über Station", "Richtung", "Gleis"],
    values: []

  }

  viewTimelineChart: boolean = false;
  timelineChart: Chart= {
    title: 'Fahrplan der ausgewählten Verbindung',
    type: ChartType.Timeline,
    options: {
      colors: [
        '#fddf70',
        '#f5d768',
        '#f3e966',
        '#ebe15e',
        '#e9f35c',
        '#e1eb54',
        '#dffd52',
        '#d7f54a'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: ["Abfahrt von","Wohin gehts", "Start", "End"],
    
    values: []

  }

  deg2rad(deg:number) {
    return deg * (Math.PI/180)
  }

  calculateDistance(lat1: number,lon1: number,lat2: number,lon2: number){
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }

  

  getWithDetailsId(input: string, name: string){
    //console.log("DetailsId: " + input);
    this.detailsIdLabel = name;
    this.routeService.getDetailsId(input).subscribe(data=>{
      this.track = data;
      //console.log("Data of getWithDetailsId:")
      //console.log(data);

      let stops: any[] = [];
      let depTimes: any[] = [];
      let arrTimes: any[] = [];
      let rows: any[] = [];

      let lat: any[] = [];
      let lon: any[] = [];
      
  
      this.track.forEach( stop =>{
        stops.push( stop.stopName)
        depTimes.push( stop.depTime)
        arrTimes.push( stop.arrTime)
        lat.push( stop.lat)
        lon.push( stop.lon)
      })

      for (let i = 0; i < stops.length - 1; i++){
        
        if ( i == 0){
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        } else if( i  == stops.length - 1 ){
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        } else{
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        };
        
        //[ 'Aachen',  'nach Köln', new Date(2022, 6, 16, 12, 40), new Date(2022, 6, 16, 12, 50) ],
      }

      // Errechene die Gesamte Fahrtdauer
      /*
      let tempHourDep = depTimes[0].substring(0,2)
      let tempMinDep = depTimes[0].substring(3,5)
      let tempHourArr = arrTimes[arrTimes.length-1].substring(0,2)
      let tempMinArr = arrTimes[arrTimes.length-1].substring(3,5)

      let startDate = new Date(2022, 6, 12, tempHourDep, tempMinDep);
      let endDate = new Date(2022, 6, 12, tempHourArr, tempMinArr);
      */
     console.log(rows)
     this.viewTimelineChart = true;
      this.timelineChart.values = rows;

      //console.log( "values:")
      //console.log(this.timelineChart.values)

      let rowslineChart: any[] = [];
      let countKm = 0;
      for (let j = 0; j < (lat.length - 1); j++){
        //console.log( stops[j] + " - " + countKm)
        rowslineChart.push( [ stops[j], countKm ])
        let tempKm = this.calculateDistance(lat[j], lon[j], lat[j+1], lon[j+1]);
        countKm += tempKm;
      }
      //console.log(rowslineChart)
      this.viewLineChart = true;
      this.lineChart.values = rowslineChart;
    })
  }

  searchForStation(input: string){
    //Suche durch Eingabe
    //Suchbegriff an API übergeben
    //ersten 5 Ergebnisse der API anzeigen
    input = this.formatUmlaut(input);
    if(input != ""){
      this.routeService.searchForStation(input).subscribe(data=>{
        if(data[0]){
          this.searchStations = data[0];
          //console.log(this.searchStations);
          this.hasSearched = true;
        }else console.log("empty")
      });
    }
  }

  interactWithSearchStation(input:number, date: Date){
    //Dann hier die API mit der ID anfragen, oder?
    //this.getWithDetailsId(`${input}`);)
    let apiDate = date.toISOString().split('T')[0]
    this.routeService.getArrivalRoutes(`${input}`, apiDate).subscribe(data=>{
      this.stations = data;
      //console.log("Data of interactWithSearchStation")
      //console.log(data)
    });
    this.hasSearched = false;

    
    this.getDepartureBoardWithDetailsId(input, apiDate, `${input}`);
  }

  getDepartureBoardWithDetailsId(input:number, date: string, evaId: string){    
      let detailsId: any[] = [];
      this.routeService.getDepartureRoutes(`${input}`, date).subscribe(data=>{
        this.departure = data;
        
        console.log("Got departure board")
        console.log("input: "+input)
        //console.log(data);

        data.forEach(dep => detailsId.push(dep.detailsId))

        this.fillDepartureTable(detailsId, input) 
    });     
    
  }

  fillDepartureTable(detailsIds:any, evaId: number){
    this.departureTable.values = [];

    this.routeService.getDataWithDetailsIds(detailsIds).subscribe(obj=>{
      let departureCounter = 0;
      let departureTableValues: any[] = [];
      obj.forEach(departure=>{
        //console.log(departure);
        let indexOfStationDeparture = departure.findIndex((dep: any) => dep.stopId == evaId);
        if(departure[indexOfStationDeparture] != undefined){
          let elem = [
            departure[indexOfStationDeparture].depTime,
            this.departure[departureCounter].name,
            departure[indexOfStationDeparture+1].stopName.replace('&#x0028;',' (').replace('&#x0029;',') '),
            departure[departure.length-1].stopName.replace('&#x0028;',' (').replace('&#x0029;',') '),
            this.departure[departureCounter].track
          ]
        
          departureTableValues.push(elem);
        }
        
        departureCounter++;
      })
      this.viewDepartureTable = true;
      this.departureTable.values = departureTableValues;
    })
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

  formatUmlaut(input: string): string{
    input = input.toLowerCase()
    input = input.replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    return input;
  }

}


