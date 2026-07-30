import { Question } from '../models/question.model';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Qual linguagem é executada nativamente no navegador?',
    options: ['Python', 'JavaScript', 'C#', 'Ruby'],
    correctIndex: 1,
  },
  {
    id: 2,
    text: 'O que significa a sigla HTML?',
    options: [
      'HyperText Markup Language',
      'HighText Machine Language',
      'HyperTool Multi Language',
      'Home Tool Markup Language',
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    text: 'Qual empresa desenvolve o framework Angular?',
    options: ['Facebook', 'Microsoft', 'Google', 'Amazon'],
    correctIndex: 2,
  },
];
