import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OurAPIsComponent } from './our-apis/our-apis.component';
import { OurDataComponent } from './our-data/our-data.component';
import { AnnouncementsComponent } from './topics/announcements/announcements.component';
import { DelaysComponent } from './topics/delays/delays.component';
import { RoutesComponent } from './topics/routes/routes.component';
import { StationsComponent } from './topics/stations/stations.component';
import { WikiComponent } from './wiki/wiki.component';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'stations', component: StationsComponent},
  {path: 'routes', component: RoutesComponent},
  {path: 'delays', component: DelaysComponent},
  {path: 'announcements', component: AnnouncementsComponent},
  {path: 'ourdata', component: OurDataComponent},
  {path: 'ourapis', component: OurAPIsComponent},
  {path: 'wiki', component: WikiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
