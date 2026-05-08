# Testes

Este diretório contém os testes unitários e de integração do sistema OlimpiadaIDB.

## Estrutura

```
test/
├── integration/          # Testes de integração (rotas HTTP)
│   ├── auth.test.js
│   ├── olimpiada.test.js
│   ├── sincronizacao.test.js
│   └── health.test.js
└── unit/                 # Testes unitários (serviços, models)
    ├── totvs.service.test.js
    └── sincronizacao.service.test.js
```

## Executar testes

```bash
# Todos os testes com cobertura
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration
```

## Cobertura

Os relatórios de cobertura são gerados em `coverage/`:
- `coverage/lcov-report/index.html` - Relatório HTML
- `coverage/lcov.info` - Formato LCOV

## Boas práticas

1. **Isolamento**: Cada teste deve ser independente
2. **Mocks**: Use mocks para dependências externas (banco, APIs)
3. **Cleanup**: Limpe dados criados após cada teste
4. **Descritivo**: Use nomes claros nos `describe()` e `it()`
5. **Skip**: Use `.skip` para testes que dependem de ambiente específico

## Testes marcados com .skip

Alguns testes estão marcados com `.skip` porque:
- Requerem banco de dados configurado
- Requerem credenciais TOTVS válidas
- Requerem usuários de teste no sistema

Para habilitar, remova o `.skip` e configure o ambiente adequado.
