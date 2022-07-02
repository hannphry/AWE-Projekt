import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @Input()
  title = 'frontend';
  pRoute: string = '';
  routes = [
    {path: 'stations', title: "Bahnhöfe"},
    {path: 'routes', title: "Strecken"},
    {path: 'delays', title: "Verzögerungen"},
    {path: 'announcements', title: "Meldungen"}
  ]
  
  exRoutes = [
    {url: 'https://github.com/hannphry/AWE-Projekt/wiki/APIs#01-fahrplan', title: 'Unsere APIs'},
    {url: 'https://github.com/hannphry/AWE-Projekt/wiki', title: 'GitHub Wiki'}
  ]
  isSidenavDisplayed: boolean = false;

  constructor(
    public sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.exRoutes.forEach(url=> this.sanitizer.bypassSecurityTrustResourceUrl(url.url))
  }

  displaySidenav(){
    let topics = document.getElementById("topics");
    if(topics){
      if(this.isSidenavDisplayed == false){
        topics.style.position = 'relative';
        topics.style.height = '100%';
        this.isSidenavDisplayed = true;

      }else{
        topics.style.position = 'absolute';
        topics.style.height = '';
        this.isSidenavDisplayed = false;
      }
    }
  }

}
//https://github.com/hannphry/AWE-Projekt/wiki/APIs#01-fahrplan