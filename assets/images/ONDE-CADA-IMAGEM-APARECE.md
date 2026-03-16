# Onde cada imagem aparece no site Divulgação

Use os **nomes exatos** abaixo na pasta `assets/images/`. No GitHub os nomes são sensíveis a maiúsculas/minúsculas.

**Implementação:** Se um arquivo não existir, o site exibe automaticamente `placeholder.svg`. Foi configurado:
- **&lt;base href&gt;** em cada página para as rotas relativas funcionarem no GitHub Pages (https://smeagle951.github.io/Divulgacao/).
- **main.js** usa URL absoluta para o placeholder quando a imagem falha, para garantir que ele carregue em qualquer subpasta.
- Para as imagens reais aparecerem, adicione os 18 arquivos listados abaixo na pasta `assets/images/` e faça push para o repositório.

---

## 1. Navegação e páginas gerais

| Nome do arquivo   | Onde aparece |
|-------------------|--------------|
| **FortSmart.png** | Logo no topo (navbar) em todas as páginas — e no cabeçalho da página `relatorio.html`. |

---

## 2. Página inicial (index.html)

### Seção "Sobre o FortSmart" (#sobre)
| Nome do arquivo   | Onde aparece |
|-------------------|--------------|
| **Divulgacao.png** | Imagem principal da seção "Sobre" — showcase do app FortSmart. |

### Seção "Como Funciona" (#como-funciona)
| Nome do arquivo    | Onde aparece |
|--------------------|--------------|
| **Informacoes.png**| Banner informativo (bloco grande) entre os cards e o fluxo "Do campo à decisão". |

### Seção "Como Usar" (#como-usar) — Módulos

| Nome do arquivo        | Onde aparece |
|------------------------|--------------|
| **Modulo Talhões.png** | Módulo 1 — "Criar Talhão": primeira imagem da galeria (mobile). |
| **Talhoes.jpeg**       | Módulo 1 — "Criar Talhão": segunda imagem da galeria (talhões no mapa). |
| **Monitoramento 1.jpeg** | Módulo 2 — "Monitoramento Técnico": imagem 1 da galeria. |
| **Monitoramento 2.jpeg** | Módulo 2 — "Monitoramento Técnico": imagem 2. |
| **Monitoramento 3.jpeg** | Módulo 2 — "Monitoramento Técnico": imagem 3. |
| **Monitoramento 4.jpeg** | Módulo 2 — "Monitoramento Técnico": imagem 4. |
| **Monitoramento 5.jpeg** | Módulo 2 — "Monitoramento Técnico": imagem 5. |
| **Visita Tecnica 1.jpeg** | Módulo 3 — "Registro de Aplicações": primeira imagem da galeria. |
| **Visita Tecnica 2.jpeg** | Módulo 3 — "Registro de Aplicações": segunda imagem. |
| **Visita Tecnica 3.jpeg** | Módulo 4 — "Visita Técnica + Relatório Web": primeira imagem (Web Dashboard). |
| **Visita Tecnica 4.jpeg** | Módulo 4 — "Visita Técnica + Relatório Web": segunda imagem. |

### Seção "Evolução" / Diferenciais (#diferenciais)

| Nome do arquivo            | Onde aparece |
|----------------------------|--------------|
| **Evolucao Fenológica.png** | Bloco "Evolução Fenológica" — primeira imagem. |
| **Evolucao Fenologica 2.jpeg** | Bloco "Evolução Fenológica" — segunda imagem. |
| **Painel Colheita.png**    | Bloco "Painel de Colheita" (Inovação). |

### Seção "Ecossistema" (#ecossistema)

| Nome do arquivo           | Onde aparece |
|---------------------------|--------------|
| **Evolucao Fenologica.jpeg** | Card "Mobile + Web" — exemplo de relatório técnico (ao lado do botão "Ver Exemplo de Relatório Técnico"). |

---

## 3. Página github_version.html

As mesmas imagens acima aparecem nas mesmas seções. A única diferença é que **Visita Tecnica 4.jpeg** é usada também em outro bloco (exemplo de relatório) nessa página.

---

## 4. Resumo rápido (lista para colar na pasta)

```
FortSmart.png
Divulgacao.png
Informacoes.png
Modulo Talhões.png
Talhoes.jpeg
Monitoramento 1.jpeg
Monitoramento 2.jpeg
Monitoramento 3.jpeg
Monitoramento 4.jpeg
Monitoramento 5.jpeg
Visita Tecnica 1.jpeg
Visita Tecnica 2.jpeg
Visita Tecnica 3.jpeg
Visita Tecnica 4.jpeg
Evolucao Fenológica.png
Evolucao Fenologica 2.jpeg
Evolucao Fenologica.jpeg
Painel Colheita.png
```

**Total: 18 arquivos.** Coloque cada um em `assets/images/` com o nome exato (incluindo espaços e acentos).
