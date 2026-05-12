import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { Course, Lesson, Module } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, SafePipe, RouterModule, QuizComponent],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent implements OnInit {
  course?: Course;
  currentLesson?: Lesson;
  
  constructor(
    public courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.courseService.getCourse(courseId).subscribe(course => {
        if (course) {
          this.course = course;
          // Set the first lesson as default if available
          if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            this.currentLesson = course.modules[0].lessons[0];
          }
        }
      });
    }
  }

  selectLesson(lesson: Lesson): void {
    this.currentLesson = lesson;
  }

  toggleModule(module: Module): void {
    module.isOpen = !module.isOpen;
  }

  markAsCompleted(): void {
    if (this.currentLesson && this.course) {
      this.currentLesson.isCompleted = true;
      this.courseService.completeLesson(this.course.id, this.currentLesson.id);
    }
  }
}
