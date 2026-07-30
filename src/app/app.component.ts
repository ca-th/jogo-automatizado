import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { QUIZ_QUESTIONS } from './data/questions';
import { GameScreen, Question } from './models/question.model';

@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly questions: Question[] = QUIZ_QUESTIONS;

  screen: GameScreen = 'start';
  currentIndex = 0;
  score = 0;
  selectedOption: number | null = null;
  answerLocked = false;

  get currentQuestion(): Question {
    return this.questions[this.currentIndex];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get progressLabel(): string {
    return `Pergunta ${this.currentIndex + 1} de ${this.totalQuestions}`;
  }

  get resultMessage(): string {
    if (this.score === this.totalQuestions) {
      return 'Perfeito! Você mandou muito bem.';
    }

    if (this.score >= Math.ceil(this.totalQuestions / 2)) {
      return 'Bom desempenho — que tal tentar a nota máxima?';
    }

    return 'Continue praticando e tente novamente.';
  }

  startGame(): void {
    this.resetState();
    this.screen = 'quiz';
  }

  selectOption(optionIndex: number): void {
    if (this.answerLocked) {
      return;
    }

    this.answerLocked = true;
    this.selectedOption = optionIndex;

    if (optionIndex === this.currentQuestion.correctIndex) {
      this.score += 1;
    }

    setTimeout(() => this.goToNext(), 900);
  }

  optionClass(optionIndex: number): Record<string, boolean> {
    if (this.selectedOption === null) {
      return {};
    }

    const isCorrect = optionIndex === this.currentQuestion.correctIndex;
    const isSelected = optionIndex === this.selectedOption;

    return {
      correct: isCorrect,
      wrong: isSelected && !isCorrect,
      dimmed: !isCorrect && !isSelected,
    };
  }

  restartGame(): void {
    this.resetState();
    this.screen = 'start';
  }

  private goToNext(): void {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.currentIndex += 1;
      this.selectedOption = null;
      this.answerLocked = false;
      return;
    }

    this.screen = 'result';
  }

  private resetState(): void {
    this.currentIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.answerLocked = false;
  }
}
