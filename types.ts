export interface Question {
  english_question: string;
  urdu_question: string;
  kannada_question: string;
  options: {
    english_options: string[];
    urdu_options: string[];
    kannada_options: string[];
  };
  correct_answer_index: number;
  repeated_years: string;
}

export type Language = 'en' | 'ur' | 'kn';

export type PaperType = 'Paper I' | 'Paper II';
export type MediumType = 'Urdu' | 'Kannada' | 'English';

export interface SyllabusTopic {
  id: string;
  paper: PaperType;
  subject: string;
  topic: string;
  content: string;
}