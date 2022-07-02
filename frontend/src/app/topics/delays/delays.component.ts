import { Component, OnInit } from '@angular/core';
import { DelayService } from 'src/app/services/delay.service';
import { Delay } from 'src/app/interfaces/delay';
import { Chart } from 'src/app/interfaces/chart';
import { ChartType } from 'angular-google-charts';
import { delay, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-delays',
  templateUrl: './delays.component.html',
  styleUrls: ['./delays.component.scss']
})
export class DelaysComponent implements OnInit {

  searchValue: string = ""

  searchStations: {
    name: string,
    id: number
  }[] = [];

  hasSearched: boolean = false;

  selectedStations: {
    name: string,
    id: number
  }[] = [];

  differrenceDelays: number = 0;

  delaysPerStation: Delay[] = [];

  //CHARTS:
  viewColumnChart: boolean = false;
  columnChart: Chart = {
    title: 'Test',
    type: ChartType.ColumnChart,
    columns: ['Bahnhof', 'Meldungen', 'Echte Menge'],
    values: [
    ],
    options: {
      colors: [
        '#badcf7',
        '#a6c8e3'
      ]
    }
  }

  constructor(
    private delayService: DelayService
  ) { }



  ngOnInit(): void {
  }


  searchForStation(input: string){
    //console.log(input);
    input = this.formatUmlaut(input)
    //console.log(input)
    if(input != ""){
      this.delayService.searchForStation(input).subscribe(
        data=>{
        if(data[0]){
          this.searchStations = data[0];
          //console.log(this.searchStations);
          this.hasSearched = true;
        }else console.log("empty")
      },
      (error) => console.log("Error")
      );
    }
  }

  selectStation(station: {name: string, id: number}){
    if( this.isStationSelected(station.id) == true){
      let findIndex = this.selectedStations.findIndex(stat => stat.id == station.id);
      //console.log(findIndex);
      if(findIndex >= 0){
       this.selectedStations.splice(findIndex, 1);
      }
    }else{
      if(this.selectedStations.length < 4){
        this.selectedStations.push(station);
      }else if(this.selectedStations.length == 4){
        this.selectedStations.shift();
        this.selectedStations.push(station);
      }
      //console.log(station);
    }
    
  }

  isStationSelected(id: number): boolean{
    //findIndex
    let findIndex = this.selectedStations.findIndex(station => station.id == id);
    if(findIndex >= 0){
      return true
    }
    else{
      return false
    }
  }

  isStationSelectedButNotInSearchStations(id: number): boolean{
    let searchIndex = this.searchStations.findIndex(station=> station.id == id)
    if(searchIndex < 0 && this.isStationSelected(id) == true){
      return true;
    }else{
      return false;
    }
  }

  compareStations(stations: {name: string, id: number}[]){
    //console.log(stations);
    if(stations.length > 0){
      this.hasSearched = false;
      let values: any[] = [];
      var subject = new ReplaySubject(1);
      this.delaysPerStation = [];
      
      let ids: number[] = [];
      stations.forEach(station => ids.push(station.id))

      this.delayService.getDelays(ids).subscribe(
        obj =>{
        
        //let delaysPerStation: any[] = [];

        const parser = new DOMParser();

        for(let objCounter = 0; objCounter < obj.length; objCounter++){
          const xml = parser.parseFromString(obj[objCounter], 'text/xml');
  
          let name: string = ""+xml.children[0].attributes.getNamedItem('station')?.value
          let amountDelays: number = xml.children[0].childElementCount
          //console.log(xml.children[0].children[1]);
          
          let delayMessages : {id: string,category: string,priority: string,from: string,to: string}[] = []
  
          let elems = xml.children[0].children;
          for(let i = 0; i < elems.length; i++){
            let childElem = elems[i].children
            //console.log(childElem)
            for(let j = 0; j < childElem.length; j++){
              if(childElem[j].tagName == "m" && `${childElem[j].getAttribute('id')}` != ""){
                let delayMessage : {id: string,category: string,priority: string,from: string,to: string} = {
                  id : `${childElem[j].getAttribute('id')}`,
                  priority : `${childElem[j].getAttribute('pr')}`,
                  category : `${childElem[j].getAttribute('cat')}`,
                  from : `${childElem[j].getAttribute('from')}`,
                  to : `${childElem[j].getAttribute('to')}`
                }
                //console.log(childElem[j]);
                //console.log(delayMessage);
                delayMessages.push(delayMessage);
              }
              //
            }
          }
  
          let delay: Delay = {
            name: name,
            amount: amountDelays,
            delays: delayMessages
          }
  
          //console.log(delay);

          this.delaysPerStation.push(delay);
        }

        //console.log(this.delaysPerStation);

        //xml.children[0].childNodes

        let columnChartValues : any[] = []

        this.delaysPerStation.forEach(station =>{
          columnChartValues.push([station.name, station.amount, station.delays.length])
          let ratio = station.delays.length / station.amount;
          if(this.differrenceDelays == 0){
            this.differrenceDelays = Number((Math.round(ratio * 100) / 100).toFixed(2));
          }else{
            this.differrenceDelays = Number((Math.round((this.differrenceDelays + ratio) * 100) / 100).toFixed(2))/2;
          }

          /*
          let tmpStations5Min = station.delays.filter(delays =>{
            //Month:
            (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0) &&
            //Day:
            (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) == 0) &&
            //Hour:
            (Number(delays.to.substring(6,8)) - Number(delays.from.substring(6,8)) == 0) &&
            //Minute:
            (Number(delays.to.substring(8,10)) - Number(delays.from.substring(8,10)) <= 50)
          })*/

          //Wieviele sind unter 24h, 7t, 1M, 6M, Rest min? Kennzahl: Durchschnittsdauer? Immer aktualisieren
          
          let oneDayDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            &&(Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0)
            //Day:
            && (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) == 0)
          );
          
          console.log("One Day")
          console.log(oneDayDelays)

          let weekDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0)
            //Day:
            && (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) <= 7)
          );
          console.log("One Week")
          console.log(weekDelays)

          let monthDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 1)
          );

          console.log("One Month")
          console.log(monthDelays)

          let sixMonthDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) <= 6)
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) > 1)
          );

          console.log("Six Months")
          console.log(sixMonthDelays)

          let elseDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) != 0)
            //Month:
            || (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) > 6)
          );
          console.log("Everything else")
          console.log(elseDelays);

            //Geringste Verzögerung der drei Stationen oben in DropDown
            //Längste Verzögerung der drei Stationen oben in DropDown
        })

        //console.log(columnChartValues);
        this.viewColumnChart = true; 
        this.columnChart.values = columnChartValues;

        console.log(this.delaysPerStation);

      });
    }
  }

  //(mouseenter)="this.clickOnInfo(0)" (mouseleave)="this.resetInfo(0)"

  clickOnInfo(index: number){
    console.log("Highlight graph" +index);
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
