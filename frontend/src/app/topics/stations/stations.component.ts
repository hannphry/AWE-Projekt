import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Chart } from 'src/app/interfaces/chart';
import { Station } from 'src/app/interfaces/station';
import { StationService } from 'src/app/services/station.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

  /*
    1. Zusammenhang zwischen Anzahl an Stationen pro Bundesland und ÖPNV-Anschlüssen an den Stationen
    2. Preisklassen und Taxi-Ranks und 24/7 Service
    3. Taxi Ranks vs Mietautos Klassierung nach type (z.B. Knotenbahnhof) (vielleicht nach Fotos von Typen suchen, dann Schnee finden und überleitung zu Klimaschutz und Fahrradfahren)
    4. Parkplätze und Fahrradparkplätze (im Zusammenhang mit stationManagement, oder anderen Attributen) 

    5. Behindertengerechte Stationen, lässt sich ein Muster erkennen? Vielleicht Statistiken mit Bundesland vergleichen, Anzahl Personen, die was benötigen vs. was es gibt

    - Übersicht über alle Bahnhöfe mit Preisklassen
    - Dann DropDown und Auswahl einer Preisklasse (Hover über Info i was sind Preisklassen?)

    - Dann für eine Preisklasse Verteilung auf Bundesländer anzeigen
    - Ein Bundesland auswählen

    - Dann in letzter Suchfunktion über alle Bahnhöfe
    - Station auswählen
    - nach StationManagement gehen
    
    - anhand von 4 Klassen Menge an Stationen im Umfeld der ausgewählten Station

    - Infos einer Station anzeigen Eine Station
      - Hier kann ich parken, wieviel % der Stationen kann ich Fahrrad und Auto parken
      - Hier ist 24h Service
      - Hier kriege ich ein Taxi
      - Dies gehört zu dieser Preiskategorie (wieviele sind's insgesamt)

  */

  stations: Station[] = [];

  federalStates: string[] = [
    "Bayern", 
    "Baden-Württemberg", 
    "Berlin", 
    "Brandenburg", 
    "Bremen", 
    "Hamburg", 
    "Hessen", 
    "Mecklenburg-Vorpommern", 
    "Niedersachsen", 
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz", 
    "Saarland", 
    "Sachsen", 
    "Sachsen-Anhalt", 
    "Schleswig-Holstein",
    "Thüringen"
  ]

  priceCategories: number[] = [
     1, 2, 3, 4, 5, 6, 7 
    ];

  stationTypes: string[] = [
    "Knotenbahnhof",
    "Zubringerbahnhof",
    "S-Bahnhof",
    "Metropolbahnhof"
  ];

  stationsByFederalState :[{
    federalState: string,
    stations: Station[]
  }] = [{
    federalState: "",
    stations: []
  }];

  stationManagement: string[] = [
    "Augsburg",
    "Bamberg",
    "Berlin Fernbahnhöfe",
    "Berlin Regional- und S-Bahnhöfe",
    "Bielefeld",
    "Braunschweig / Göttingen",
    "Bremen / Osnabrück",
    "Chemnitz",
    "Cottbus",
    "Darmstadt",
    "Dortmund",
    "Dresden",
    "Duisburg",
    "Düsseldorf",
    "Erfurt",
    "Essen",
    "Frankfurt a. M.",
    "Freiburg",
    "Friedrichshafen",
    "Gießen",
    "Hagen",
    "Halle (Saale)",
    "Hamburg",
    "Hannover",
    "Kaiserslautern",
    "Karlsruhe",
    "Kassel",
    "Koblenz",
    "Köln",
    "Leipzig",
    "Magdeburg",
    "Mainz",
    "Mannheim",
    "München",
    "Münster (Westf)",
    "Nürnberg",
    "Potsdam",
    "Regensburg",
    "Rosenheim",
    "Rostock",
    "Saarbrücken",
    "Schleswig-Holstein",
    "Schwerin",
    "Stuttgart",
    "Ulm",
    "Würzburg"
  ]

  chooseStations: Station[] = [];

  chosenStationManagement: string[] = [];

  comboChart: Chart = {
    title: 'Preisklassen',
    type: ChartType.ComboChart,
    options: {
      title : 'Preisklassen',
      seriesType: 'bars',
      series: {
      },
      colors: [
        '#bfe8d2',
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
    }
      
    },
    columns: ['Preisklasse','Stationen'],//, 'Differenz'],
    values: []
  }

  steppedAreaChart: Chart= {
    title: 'Bundesländern',
    type: ChartType.SteppedAreaChart,
    options: {
      colors: [
        '#a4e2d3',
        '#96cfc1',
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
    columns: ['Bundesland','Anzahl Stationen'],
    values: [
      ['', 0 ],
    ]
  }

  comboChart2: Chart = {
    title: 'Stationsmanagement',
    type: ChartType.ComboChart,
    options: {
      title : 'Stationsmanagement',
      //vAxis: {title: 'Anzahl'},
      //hAxis: {title: 'Bundesländer'},
      seriesType: 'bars',
      series: {
        1: {type: 'line'}
      },
      colors: [
        '#a4dce2',
        '#94c6cb'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
    }
      
    },
    columns: ['Management','Stationen','Wichtige Stationen'],//, 'Differenz'],
    values: [
      ['',0,0]
    ]
  }

  barChart: Chart = {
    title: 'Preisklassen',
    type: ChartType.BarChart,
    options: {
      title : 'Stationsübersicht',
      //vAxis: {title: 'Anzahl'},
      //hAxis: {title: 'Bundesländer'},
      seriesType: 'bars',
      series: {
        //1: {type: 'line'}
      },
      colors: [
        '#8bd7dd',
        '#76bcc1'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        viewWindow: {
        },
        gridlines: {
          color: 'transparent'
      }
      }
    },
    columns: ['Eigenschaft','Gleich','Gegenteil'], //,'Preiskategorie','Parkplatz','ÖPNV-Anschluss','Taxistand','Autovermietung','WLAN'],//, 'Differenz'],
    values: [
      ['',0,0]
    ]
  }

  priceCategoryTitle: string = "Preisklasse";
  federalStateTitle: string = "Bundesland";
  stationTitle: string = "Station";

  figFederalStates: number = 0;
  figStationManagement: number = this.stationManagement.length;
  figAmountStations: number = 0;

  chosenPriceCategory: number = 0;
  chosenFederalState: string = "";
  chosenManagement: string = "";

  constructor(
    private stationService: StationService
  ) { }

  ngOnInit(): void {
    //Erstmal über das subscribe an die Daten vom Service kommen
    this.stationService.getStations().subscribe(data =>{
      this.stations = data; //Unsere Bahnhofsstationen für die Komponente setzen
      
      this.stationsByFederalState.splice(0,1); //Das erste Element für die Bundesländer und Stationen leeren, weil das erste nicht gebraucht wird

      //console.log(this.stations);

      let priceCategoryStations: any[] = [];

      this.priceCategories.forEach(category =>{
        let tmpStations = this.stations.filter(station => station.priceCategory == category);
        
        priceCategoryStations.push([category, tmpStations.length]);
      })

      this.comboChart.values = priceCategoryStations;

      let federalstateStations: any[] = [];
      this.figFederalStates = 0;
      this.federalStates.forEach(state =>{
        let filterStations = this.stations.filter(station=> station.federalState == state)
        federalstateStations.push([state, filterStations.length]);
        if(state == 'Bayern'){
          //Math.round((filterStations.length / this.stations.length)*1000) / 1000
          //this.figFederalStates += Math.round((filterStations.length / this.stations.length));
          //this.figFederalStates += (Math.round((filterStations.length / this.stations.length)*1000) / 1000);
          this.figFederalStates = (Math.round((this.figFederalStates+(Math.round((filterStations.length / this.stations.length)*1000) / 1000)) * 1000)/1000)
        }
        else if(state == 'Nordrhein-Westfalen'){
          this.figFederalStates = (Math.round((this.figFederalStates+(Math.round((filterStations.length / this.stations.length)*1000) / 1000)) * 1000)/1000)

          //Math.round((this.figFederalStates+(Math.round((filterStations.length / this.stations.length)*1000) / 1000)) * 1000)/1000
        }
      });
      this.steppedAreaChart.values = federalstateStations;
      this.steppedAreaChart.columns = ['Bundesland','Anzahl Stationen'];

      let managementStations: any[] = [];
      this.stationManagement.forEach(management =>{
        let filterStations = this.stations.filter(station => station.stationManagement == management);
        if(filterStations.length > 0){
          let importantStationsFromManagement = filterStations.filter(station => station.type == "Knotenbahnhof" || station.type == "Metropolbahnhof");
          managementStations.push([management, filterStations.length, importantStationsFromManagement.length]);
        }
      })
      this.comboChart2.values = managementStations;

      // Parkplätze
      // ÖPNV
      // Taxistand
      // Autovermietung
      // WLAN

      let barChartValues = [];

      let stationsByParkingLot = this.stations.filter(station => station.hasParking == true && station.hasBicycleParking == true);
      barChartValues.push(['Parkplätze',stationsByParkingLot.length, (this.stations.length - stationsByParkingLot.length)]);
      let stationsByPublicTransport = this.stations.filter(station=> station.hasLocalPublicTransport == true);
      barChartValues.push(['ÖPNV',stationsByPublicTransport.length, (this.stations.length - stationsByPublicTransport.length)]);
      let stationsByTaxiRank = this.stations.filter(station => station.hasTaxiRank == true);
      barChartValues.push(['Taxistand',stationsByTaxiRank.length, (this.stations.length - stationsByTaxiRank.length)]);
      let stationsByCarRental = this.stations.filter(station => station.hasCarRental == true);
      barChartValues.push(['Autovermietung',stationsByCarRental.length, (this.stations.length - stationsByCarRental.length)]);
      let stationsByWifi = this.stations.filter(station => station.hasWiFi == true);
      barChartValues.push(['WLAN',stationsByWifi.length, (this.stations.length - stationsByWifi.length)]);

      this.barChart.values = barChartValues;

      this.figAmountStations = this.stations.length;
    });
  }

  selectPriceCategoryFromGraph(input: number | undefined){
    if(input){
      //console.log(input +1);
      this.choosePriceCategory(input +1);
    }
  }

  choosePriceCategory(num: number){
    //console.log(num);

    this.priceCategoryTitle = `Preisklasse ${num}`;

    let federalStateStations: any[] = [];

    let countStationManagement : string[] = [];

    this.figFederalStates = 0;
    this.figAmountStations = 0;
    this.figStationManagement = 0;

    let compValueAmountStationsInPriceCategory : number = (this.stations.filter(station => station.priceCategory == num)).length;

    this.federalStates.forEach(state=>{
      let tmpStations = this.stations.filter(station => station.federalState == state);
      //console.log(tmpStations);
      
      let tmpStationsInCategory = tmpStations.filter(station => station.priceCategory == num);
      
      let length = 0;

      if(tmpStationsInCategory) length = tmpStationsInCategory.length
      
      federalStateStations.push([state, length, tmpStations.length]);

      if(state == 'Bayern'){
        //this.figFederalStates += Math.round((tmpStations.length / tmpStationsInCategory.length));
        this.figFederalStates = Math.round((this.figFederalStates+(Math.round((tmpStationsInCategory.length / compValueAmountStationsInPriceCategory)*1000) / 1000)) * 1000)/1000
      }
      else if(state == 'Nordrhein-Westfalen'){
        // this.figFederalStates += Math.round((tmpStations.length / tmpStationsInCategory.length));
        this.figFederalStates = Math.round((this.figFederalStates+(Math.round((tmpStationsInCategory.length / compValueAmountStationsInPriceCategory)*1000) / 1000)) * 1000)/1000
      }

      tmpStations.forEach(station=>{
        if(station.stationManagement){
          if(countStationManagement.indexOf(station.stationManagement) < 0){
            countStationManagement.push(station.stationManagement);
          }
        }
      });
    })
    //console.log(federalStateStations)

    this.figAmountStations = this.stations.filter(station => station.priceCategory == num).length

    let tmpStationsInCategory = this.stations.filter(station => station.priceCategory == num);

    let barChartValues = [];

    let stationsByParkingLot = tmpStationsInCategory.filter(station => station.hasParking == true && station.hasBicycleParking == true);
    barChartValues.push(['Parkplätze',stationsByParkingLot.length, (tmpStationsInCategory.length - stationsByParkingLot.length)]);
    let stationsByPublicTransport = tmpStationsInCategory.filter(station=> station.hasLocalPublicTransport == true);
    barChartValues.push(['ÖPNV',stationsByPublicTransport.length, (tmpStationsInCategory.length - stationsByPublicTransport.length)]);
    let stationsByTaxiRank = tmpStationsInCategory.filter(station => station.hasTaxiRank == true);
    barChartValues.push(['Taxistand',stationsByTaxiRank.length, (tmpStationsInCategory.length - stationsByTaxiRank.length)]);
    let stationsByCarRental = tmpStationsInCategory.filter(station => station.hasCarRental == true);
    barChartValues.push(['Autovermietung',stationsByCarRental.length, (tmpStationsInCategory.length - stationsByCarRental.length)]);
    let stationsByWifi = tmpStationsInCategory.filter(station => station.hasWiFi == true);
    barChartValues.push(['WLAN',stationsByWifi.length, (tmpStationsInCategory.length - stationsByWifi.length)]);

    this.barChart.values = barChartValues;

    this.steppedAreaChart.values = federalStateStations;
    this.steppedAreaChart.columns = ['Bundesland','Anzahl Stationen', 'Rest'];
    this.figStationManagement = countStationManagement.length;

    this.chosenPriceCategory = num;
  }

  selectFederalStateFromGraph(input: any){
    //console.log(input.row);
    if(input.row){
      //console.log(this.federalStates[input.row])
      this.chooseFederalState(this.federalStates[input.row]);
    }else if(input.row == 0){
      //console.log(0);
      this.chooseFederalState(this.federalStates[0]);
    }
  }


  chooseFederalState(state: string){
    this.federalStateTitle = state;
    let managementStations: any[] = [];
    this.figStationManagement = 0;
    this.figAmountStations = 0;

    this.stationManagement.forEach(management=>{
      let tmpStations = this.stations.filter(station => station.federalState == state);
      let stationsFromManagement = tmpStations.filter(station => station.stationManagement == management);
      
      if(stationsFromManagement.length > 0){
        let importantStationsFromManagement = stationsFromManagement.filter(station => station.type == "Knotenbahnhof" || station.type == "Metropolbahnhof");
        managementStations.push([management, stationsFromManagement.length, importantStationsFromManagement.length]);
        this.chosenStationManagement.push(management);
        
        this.figStationManagement++;
        this.figAmountStations += importantStationsFromManagement.length;
      }

    });
    this.comboChart2.values = managementStations;

    let tmpStationsInFederalState = this.stations.filter(station => station.federalState == state && station.priceCategory == this.chosenPriceCategory);

    this.figAmountStations = tmpStationsInFederalState.length

    this.chosenFederalState = state;

    let barChartValues = [];

    let stationsByParkingLot = tmpStationsInFederalState.filter(station => station.hasParking == true && station.hasBicycleParking == true);
    barChartValues.push(['Parkplätze',stationsByParkingLot.length, (tmpStationsInFederalState.length - stationsByParkingLot.length)]);
    let stationsByPublicTransport = tmpStationsInFederalState.filter(station=> station.hasLocalPublicTransport == true);
    barChartValues.push(['ÖPNV',stationsByPublicTransport.length, (tmpStationsInFederalState.length - stationsByPublicTransport.length)]);
    let stationsByTaxiRank = tmpStationsInFederalState.filter(station => station.hasTaxiRank == true);
    barChartValues.push(['Taxistand',stationsByTaxiRank.length, (tmpStationsInFederalState.length - stationsByTaxiRank.length)]);
    let stationsByCarRental = tmpStationsInFederalState.filter(station => station.hasCarRental == true);
    barChartValues.push(['Autovermietung',stationsByCarRental.length, (tmpStationsInFederalState.length - stationsByCarRental.length)]);
    let stationsByWifi = tmpStationsInFederalState.filter(station => station.hasWiFi == true);
    barChartValues.push(['WLAN',stationsByWifi.length, (tmpStationsInFederalState.length - stationsByWifi.length)]);

    this.barChart.values = barChartValues;

  }

  selectStationManagement(input: any){
    if(input != undefined){
      if(input.row != undefined && this.chosenStationManagement != undefined){
        //console.log(input.row);
        this.filterStations(this.chosenStationManagement[input.row]);
      }
    }
    //this.chosenStationManagement[input.selection[0].row]
  }

  filterStations(management: string){
    //console.log(management);
    this.chooseStations = this.stations.filter(station => station.stationManagement == management && (station.type == "Knotenbahnhof" || station.type == "Metropolbahnhof"));
    //console.log(this.chooseStations)

    let barChartValues = [];

    let stationsByParkingLot = this.chooseStations.filter(station => station.hasParking == true && station.hasBicycleParking == true);
    barChartValues.push(['Parkplätze',stationsByParkingLot.length, (this.chooseStations.length - stationsByParkingLot.length)]);
    let stationsByPublicTransport = this.chooseStations.filter(station=> station.hasLocalPublicTransport == true);
    barChartValues.push(['ÖPNV',stationsByPublicTransport.length, (this.chooseStations.length - stationsByPublicTransport.length)]);
    let stationsByTaxiRank = this.chooseStations.filter(station => station.hasTaxiRank == true);
    barChartValues.push(['Taxistand',stationsByTaxiRank.length, (this.chooseStations.length - stationsByTaxiRank.length)]);
    let stationsByCarRental = this.chooseStations.filter(station => station.hasCarRental == true);
    barChartValues.push(['Autovermietung',stationsByCarRental.length, (this.chooseStations.length - stationsByCarRental.length)]);
    let stationsByWifi = this.chooseStations.filter(station => station.hasWiFi == true);
    barChartValues.push(['WLAN',stationsByWifi.length, (this.chooseStations.length - stationsByWifi.length)]);

    this.barChart.values = barChartValues;
    
    this.figAmountStations = this.chooseStations.length;

    let elem = document.getElementById('stationDropDown');
    if(elem){
      elem.style.boxShadow = '0px 0px 61px -15px #caca03';
    }

    this.chosenManagement = management;
  }

  chooseStation(id: string){
    this.barChart.values = [];
    let tmpStation: Station = this.stations.filter(station => station.id == id)[0];
    this.stationTitle = tmpStation.name;
    //console.log(tmpStation);
    //ca. 65 km
    let filterStations = this.chooseStations;
    
    this.barChart.options.hAxis.viewWindow.max = (Math.round(filterStations.length/10)*10);

    this.barChart.values = [];

    let priceCategory = `Preiskategorie ${tmpStation.priceCategory}`
    let amount = filterStations.filter(station => station.priceCategory == tmpStation.priceCategory).length;
    let negAmount = filterStations.filter(station => station.priceCategory != tmpStation.priceCategory).length;
    this.barChart.values.push([priceCategory, amount, negAmount]);

    if(tmpStation.hasBicycleParking == true && tmpStation.hasParking == true){
      let parkingLot = 'Parkplätze'
      amount = filterStations.filter(station => station.hasBicycleParking == true && station.hasParking == true).length;
      negAmount = filterStations.filter(station => station.hasBicycleParking != true && station.hasParking != true).length;
      this.barChart.values.push([parkingLot, amount, negAmount]);
    }else{
      let parkingLot = 'Keine Parkplätze'
      amount = filterStations.filter(station => station.hasBicycleParking != true && station.hasParking != true).length;
      negAmount = filterStations.filter(station => station.hasBicycleParking == true && station.hasParking == true).length;
      this.barChart.values.push([parkingLot, amount, negAmount]);
    }

    if(tmpStation.hasLocalPublicTransport == true){
      let localPublicTransport = 'ÖPNV';
      amount = filterStations.filter(station => station.hasLocalPublicTransport == true).length;
      negAmount = filterStations.filter(station => station.hasLocalPublicTransport != true).length;
      this.barChart.values.push([localPublicTransport, amount, negAmount]);
    }else{
      let localPublicTransport = 'Kein ÖPNV';
      amount = filterStations.filter(station => station.hasLocalPublicTransport != true).length;
      negAmount = filterStations.filter(station => station.hasLocalPublicTransport == true).length;
      this.barChart.values.push([localPublicTransport, amount, negAmount]);
    }

    if(tmpStation.hasTaxiRank == true){
      let taxiRank = 'Taxistand';
      amount = filterStations.filter(station => station.hasTaxiRank == true).length;
      negAmount = filterStations.filter(station => station.hasTaxiRank != true).length;
      this.barChart.values.push([taxiRank, amount, negAmount]);
    }else{
      let taxiRank = 'Kein Taxistand';
      amount = filterStations.filter(station => station.hasTaxiRank != true).length;
      negAmount = filterStations.filter(station => station.hasTaxiRank == true).length;
      this.barChart.values.push([taxiRank, amount, negAmount]);
    }

    if(tmpStation.hasCarRental == true){
      let carRental = 'Autovermietung';
      amount = filterStations.filter(station => station.hasCarRental == true).length;
      negAmount = filterStations.filter(station => station.hasCarRental != true).length;
      this.barChart.values.push([carRental, amount, negAmount]);
    }else{
      let carRental = 'Keine Vermietung';
      amount = filterStations.filter(station => station.hasCarRental != true).length;
      negAmount = filterStations.filter(station => station.hasCarRental == true).length;
      this.barChart.values.push([carRental, amount, negAmount]);
    }

    if(tmpStation.hasWiFi == true){
      let hasWiFi = 'WLAN';
      amount = filterStations.filter(station => station.hasWiFi == true).length;
      negAmount = filterStations.filter(station => station.hasWiFi != true).length;
      this.barChart.values.push([hasWiFi, amount, negAmount]);
    }else{
      let hasWiFi = 'Kein WLAN';
      amount = filterStations.filter(station => station.hasWiFi != true).length;
      negAmount = filterStations.filter(station => station.hasWiFi == true).length;
      this.barChart.values.push([hasWiFi, amount, negAmount]);
    }
  }

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

  clickOnStationsDropDown(){
    //console.log("click");
    let elem = document.getElementById('stationDropDown');
    if(elem){
      elem.style.boxShadow = '';
    }
  }

}
