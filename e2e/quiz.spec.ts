import { test, expect } from '@playwright/test';
import { QuizPage } from './pages/quiz.page';

test.describe('Quiz Game - E2E', () => {
  test('Caminho Feliz (Gabaritou)', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    await quiz.answerByText('JavaScript');
    await quiz.answerByText('HyperText Markup Language');
    await quiz.answerByText('Google');

    await expect(quiz.scoreResult).toBeVisible();
    await expect(quiz.scoreResult).toContainText('3');
  });

  test('Validação de Erro (Errou tudo)', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    // Índices propositalmente incorretos (correto: 1, 0, 2)
    await quiz.answerByIndex(0);
    await quiz.answerByIndex(1);
    await quiz.answerByIndex(0);

    await expect(quiz.scoreResult).toBeVisible();
    await expect(quiz.scoreResult).toContainText('0');
  });

  test('Validação de Estado (Jogar Novamente)', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    await quiz.answerByIndex(0);
    await quiz.answerByIndex(1);
    await quiz.answerByIndex(0);

    await expect(quiz.scoreResult).toBeVisible();
    await quiz.restart();

    await expect(quiz.startBtn).toBeVisible();
    await expect(quiz.questionTitle).toHaveCount(0);
    await expect(quiz.scoreResult).toHaveCount(0);
  });

  test('Feedback visual: opção correta fica verde', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    const correct = await quiz.selectOptionWithoutWaiting('JavaScript');
    await expect(correct).toHaveClass(/correct/);

    await quiz.waitForAdvance();
  });

  test('Feedback visual: opção errada fica vermelha e destaca a correta', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    const wrong = await quiz.selectOptionByIndexWithoutWaiting(0);
    await expect(wrong).toHaveClass(/wrong/);

    const correct = quiz.optionByText('JavaScript');
    await expect(correct).toHaveClass(/correct/);

    await quiz.waitForAdvance();
  });

  test('Progresso da pergunta atualiza a cada etapa', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    await expect(quiz.progressLabel).toBeVisible();
    await expect(quiz.progressLabel).toHaveText('Pergunta 1 de 3');

    await quiz.answerByText('JavaScript');
    await expect(quiz.progressLabel).toHaveText('Pergunta 2 de 3');

    await quiz.answerByText('HyperText Markup Language');
    await expect(quiz.progressLabel).toHaveText('Pergunta 3 de 3');
  });

  test('Timeout entre respostas: opções bloqueiam até avançar', async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.startQuiz();

    await quiz.selectOptionWithoutWaiting('JavaScript');

    await expect(quiz.optionButtons.first()).toBeDisabled();
    await expect(quiz.optionButtons.nth(1)).toBeDisabled();

    await quiz.waitForAdvance();
    await expect(quiz.progressLabel).toHaveText('Pergunta 2 de 3');
    await expect(quiz.optionButtons.first()).toBeEnabled();
  });
});
