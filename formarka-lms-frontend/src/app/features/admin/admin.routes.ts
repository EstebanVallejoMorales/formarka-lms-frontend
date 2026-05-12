import { Routes } from '@angular/router';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminCourseEditComponent } from './admin-course-edit/admin-course-edit.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'courses', component: AdminCoursesComponent },
  { path: 'courses/new', component: AdminCourseEditComponent },
  { path: 'courses/:id/edit', component: AdminCourseEditComponent }
];
