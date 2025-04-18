import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VisitorFormComponent } from './components/visitor-form/visitor-form.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'visitor', component: VisitorFormComponent }, 
  { path: 'visitor/:id', component: VisitorFormComponent } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
