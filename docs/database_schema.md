# Modelo de Dados e Validações 🗄️

Este documento descreve as estruturas de dados utilizadas para representar as leituras no **Libris**, bem como as regras de negócio para higienização e validação dos registros.

---

## 1. Esquema do Livro (`Livro`)

Todos os registros são salvos sob uma lista única de objetos JSON no `LocalStorage` sob a chave `libris_books`. O esquema do objeto está definido em `src/models/book.js` e segue as seguintes propriedades:

| Propriedade | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Sim | Identificador único gerado automaticamente via UUID (v4). |
| `titulo` | `string` | Sim | Título da obra literária (higienizado sem espaços extras nas pontas). |
| `autor` | `string` | Sim | Nome do autor/criador da obra. |
| `tipo_midia` | `string` | Sim | Tipo de mídia da leitura. Deve pertencer ao conjunto de Enums permitidos. |
| `total_paginas` | `number` | Sim | Quantidade de páginas (ou minutos para Audiobook). Deve ser > 0. |
| `status_leitura` | `string` | Sim | Estado atual do progresso. Deve pertencer ao conjunto de Enums. |
| `pagina_atual` | `number` | Sim | Página atual atingida pelo leitor (padrão `0`). |
| `data_inicio` | `string` / `null` | Não | Data em que a leitura foi iniciada (formato ISO `YYYY-MM-DD`). |
| `data_termino` | `string` / `null` | Não | Data em que a leitura foi concluída (formato ISO `YYYY-MM-DD`). |
| `possui_o_livro` | `boolean` | Sim | Flag indicando se o usuário possui a posse física ou digital do item. |
| `formato` | `string` / `null` | Condicional | Se `possui_o_livro` for `true`, deve ser `'Físico'` ou `'Digital'`. Caso contrário, `null`. |
| `e_colecao` | `boolean` | Sim | Flag indicando se o livro faz parte de uma coleção/série. |
| `nome_colecao` | `string` / `null` | Condicional | Se `e_colecao` for `true`, o nome da coleção é obrigatório. Caso contrário, `null`. |
| `volume_colecao` | `string` / `number` | Não | Volume associado na coleção (ex: "Vol. 1", "2"). |

---

## 2. Enums Permitidos

Para manter a consistência de dados na filtragem e gráficos, são validados os seguintes termos:

* **Tipos de Mídia (`TIPOS_MIDIA`)**:
  * `'Livro'`
  * `'HQ'`
  * `'Mangá'`
  * `'Audiobook'`
* **Status de Leitura (`STATUS_LEITURA`)**:
  * `'Não Lido'`
  * `'Lendo'`
  * `'Lido'`
* **Formatos de Posse (`FORMATOS`)**:
  * `'Físico'`
  * `'Digital'`

---

## 3. Regras de Validação (`validarLivro`)

O arquivo `src/models/book.js` exporta a função `validarLivro(livro)`, que é chamada pelo hook `useBooks` antes de persistir adições ou atualizações. As regras aplicadas são:

1. **Campos Vazios**: Título e Autor não podem ser vazios ou apenas espaços em branco.
2. **Total de Páginas**: Deve ser um valor estritamente maior que zero (`> 0`).
3. **Página Atual**: Não pode ser negativa nem superior ao `total_paginas` definido.
4. **Consistência de Conclusão**:
   * Se o `status_leitura` for `'Lido'`, a `pagina_atual` é automaticamente igualada ao `total_paginas` para manter a consistência aritmética das páginas lidas.
5. **Vínculo de Posse**:
   * Se `possui_o_livro` for `true`, o leitor deve selecionar um formato válido (Físico ou Digital).
6. **Vínculo de Coleção**:
   * Se `e_colecao` for `true`, o campo `nome_colecao` torna-se obrigatório.

---

## 4. Exemplo de Registro (JSON)

### Exemplo 1: Livro Físico Concluído pertencente a uma coleção
```json
{
  "id": "e30be908-1110-410a-b333-f66d482bc19a",
  "titulo": "A Sociedade do Anel",
  "autor": "J.R.R. Tolkien",
  "tipo_midia": "Livro",
  "total_paginas": 576,
  "status_leitura": "Lido",
  "pagina_atual": 576,
  "data_inicio": "2026-05-01",
  "data_termino": "2026-06-15",
  "possui_o_livro": true,
  "formato": "Físico",
  "e_colecao": true,
  "nome_colecao": "O Senhor dos Anéis",
  "volume_colecao": "1"
}
```

### Exemplo 2: HQ Digital em Andamento
```json
{
  "id": "7879e65e-2321-4f1b-a912-452f12a3449b",
  "titulo": "Watchmen",
  "autor": "Alan Moore",
  "tipo_midia": "HQ",
  "total_paginas": 416,
  "status_leitura": "Lendo",
  "pagina_atual": 150,
  "data_inicio": "2026-06-18",
  "data_termino": null,
  "possui_o_livro": true,
  "formato": "Digital",
  "e_colecao": false,
  "nome_colecao": null,
  "volume_colecao": null
}
```
