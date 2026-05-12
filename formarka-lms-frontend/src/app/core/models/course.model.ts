export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  contentUrl?: string; // YouTube URL for videos
  duration?: string;
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isOpen?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  modules: Module[];
}
