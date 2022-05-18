import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AnnouncementsComponent } from './topics/announcements/announcements.component';
import { DelaysComponent } from './topics/delays/delays.component';
import { RoutesComponent } from './topics/routes/routes.component';
import { StationsComponent } from './topics/stations/stations.component';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'stations', component: StationsComponent},
  {path: 'routes', component: RoutesComponent},
  {path: 'delays', component: DelaysComponent},
  {path: 'announcements', component: AnnouncementsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
