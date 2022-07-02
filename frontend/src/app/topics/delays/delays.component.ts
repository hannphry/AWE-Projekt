import { Component, OnInit } from '@angular/core';
import { DelayService } from 'src/app/services/delay.service';
import { Delay } from 'src/app/interfaces/delay';
import { Chart } from 'src/app/interfaces/chart';
import { ChartType } from 'angular-google-charts';
import { ReplaySubject, Subject } from 'rxjs';

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

  delaysPerStation: Delay[] = [];

  //CHARTS:

  columnChart: Chart = {
    title: 'Test',
    type: ChartType.ColumnChart,
    columns: ['Bahnhof', 'Meldungen'],
    values: [
      ['Berlin', 400]
    ],
    options: {}
  }

  constructor(
    private delayService: DelayService
  ) { }



  ngOnInit(): void {
  }


  searchForStation(input: string){
    //console.log(input);
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
      if(this.selectedStations.length < 3){
        this.selectedStations.push(station);
      }else if(this.selectedStations.length == 3){
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

      this.delayService.getDelays(ids).subscribe(obj =>{
        
        const parser = new DOMParser();
        const xml = parser.parseFromString(obj[0], 'text/xml');

        let name: string = ""+xml.children[0].attributes.getNamedItem('station')?.value
        let amountDelays: number = xml.children[0].childElementCount
        //console.log(xml.children[0].children[3]);

        //id : xml.children[0].children[3].children[0].getAttribute('id')
        //priority = xml.children[0].children[3].children[0].getAttribute('pr')
        //category = xml.children[0].children[3].children[0].getAttribute('cat')
        //from = xml.children[0].children[3].children[0].getAttribute('from')
        //to = xml.children[0].children[3].children[0].getAttribute('to')
        let elems = xml.children[0].getElementsByTagName('s');
        for(let i = 2; i < 1; i++){
          let childElem = elems[0].children
          console.log(childElem)
          for(let j = 0; j < childElem.length; j++){
            if(childElem[j].tagName == "m"){
              let delayMessage : {id: string,category: string,priority: string,from: string,to: string} = {
                id : `${childElem[j].getAttribute('id')}`,
                priority : `${childElem[j].getAttribute('pr')}`,
                category : `${childElem[j].getAttribute('cat')}`,
                from : `${childElem[j].getAttribute('from')}`,
                to : `${childElem[j].getAttribute('to')}`
              }
              console.log(childElem[j]);
              console.log(delayMessage);
            }
            //
          }
        }

        //xml.children[0].childNodes
      });
    }
  }
}
