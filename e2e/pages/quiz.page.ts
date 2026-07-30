import { expect, Locator, Page } from '@playwright/test';

export class QuizPage {
  readonly page: Page;
  readonly startBtn: Locator;
  readonly questionTitle: Locator;
  readonly optionButtons: Locator;
  readonly scoreResult: Locator;
  readonly restartBtn: Locator;
  readonly progressLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startBtn = page.getByTestId('start-btn');
    this.questionTitle = page.getByTestId('question-title');
    this.optionButtons = page.getByTestId('option-btn');
    this.scoreResult = page.getByTestId('score-result');
    this.restartBtn = page.getByTestId('restart-btn');
    this.progressLabel = page.getByTestId('progress-label');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async startQuiz(): Promise<void> {
    await this.goto();
    await expect(this.startBtn).toBeVisible();
    await this.startBtn.click();
    await expect(this.questionTitle).toBeVisible();
    await expect(this.optionButtons.first()).toBeEnabled();
  }

  optionByText(answerText: string): Locator {
    return this.optionButtons.filter({ hasText: answerText });
  }

  optionByIndex(index: number): Locator {
    return this.optionButtons.nth(index);
  }

  async waitForAdvance(): Promise<void> {
    // Após o clique, as opções ficam desabilitadas ~900ms e avançam automaticamente
    await expect
      .poll(async () => {
        const scoreVisible = await this.scoreResult.isVisible();
        if (scoreVisible) return 'result';

        const firstOption = this.optionButtons.first();
        if ((await firstOption.count()) === 0) return 'pending';

        return (await firstOption.isEnabled()) ? 'next-question' : 'pending';
      })
      .toMatch(/result|next-question/);
  }

  async answerByText(answerText: string): Promise<void> {
    const option = this.optionByText(answerText);
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();
    await this.waitForAdvance();
  }

  async answerByIndex(index: number): Promise<void> {
    const option = this.optionByIndex(index);
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();
    await this.waitForAdvance();
  }

  async selectOptionWithoutWaiting(answerText: string): Promise<Locator> {
    const option = this.optionByText(answerText);
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();
    return option;
  }

  async selectOptionByIndexWithoutWaiting(index: number): Promise<Locator> {
    const option = this.optionByIndex(index);
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();
    return option;
  }

  async restart(): Promise<void> {
    await expect(this.restartBtn).toBeVisible();
    await this.restartBtn.click();
  }
}
