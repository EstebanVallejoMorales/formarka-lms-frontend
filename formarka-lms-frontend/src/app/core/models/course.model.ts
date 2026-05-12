export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'zip' | 'link';
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'file';
  contentUrl?: string; // YouTube URL for videos
  duration?: string;
  isCompleted?: boolean;
  quiz?: Quiz; // Optional quiz data
  resources?: Resource[]; // Downloadable resources
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
  category: string;
  level: 'básico' | 'intermedio' | 'avanzado';
  instructorName?: string;
  modules?: Module[];
}
