# Quiz Tech

Jogo de quiz interativo em **Angular**, com suíte **Playwright** (TypeScript) e CI no GitHub Actions.

## Rodar o app

```bash
npm install
npm start
```

Abra [http://localhost:4200](http://localhost:4200).

## Testes E2E (Playwright)

```bash
# sobe o app automaticamente (webServer) e roda a suíte
npm run e2e

# modo interativo
npm run e2e:ui

# relatório HTML do último run
npm run e2e:report
```

### Estrutura

- `e2e/quiz.spec.ts` — cenários E2E
- `e2e/pages/quiz.page.ts` — Page Object
- `playwright.config.ts` — config + webServer
- `.github/workflows/e2e.yml` — CI em push/PR

### Cenários cobertos

1. Caminho feliz (gabarito)
2. Errou tudo (score 0)
3. Jogar novamente (reset de estado)
4. Feedback visual correto (classe `correct`)
5. Feedback visual errado (classe `wrong` + destaque da correta)
6. Progresso (`Pergunta X de 3`)
7. Bloqueio das opções no intervalo entre respostas

## CI

O workflow **E2E Tests** roda em:

- push em `main` / `feature/**`
- pull requests para `main`
