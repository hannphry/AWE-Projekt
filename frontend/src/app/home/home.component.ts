import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  title: string =  'Home';

  amountLocalPublicTransport: string = ((2957/4197)*100).toPrecision(3);

  constructor() { 
  }

  ngOnInit(): void {
  }

}
