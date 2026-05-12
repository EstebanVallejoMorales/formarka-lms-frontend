import { Routes } from '@angular/router';
import { CoursePlayerComponent } from './features/learning/course-player/course-player.component';

export const routes: Routes = [
  { path: 'learning/:courseId', component: CoursePlayerComponent },
  { path: '', redirectTo: 'learning/1', pathMatch: 'full' }
];
