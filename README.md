# Capy's Foods — Cardápio

Site estático de cardápio para a Mostra Cultural.

## Como usar

1. Abra o arquivo `index.html` no navegador.
2. Edite os itens do cardápio no arquivo `data/menu.json`.
   - Campos: `name`, `description`, `price` (número), `category`, `tags` (lista), `emoji` ou `image`.
   - Você pode criar novas categorias apenas informando um `category` diferente.
3. As categorias e a busca funcionam automaticamente.
4. Use o botão 🌗 no topo para alternar entre modo claro/escuro.

## Estrutura

- `index.html` — página principal.
- `assets/css/styles.css` — estilos.
- `assets/js/app.js` — lógica de renderização.
- `data/menu.json` — itens do cardápio.
- `assets/img/logo.svg` — logotipo.

## Dicas

- Para atualizar preços rapidamente, edite apenas o `price` no `data/menu.json`.
- Para imagens próprias, adicione arquivos em `assets/img/` e use o caminho em `image` nos itens.
- Para publicar gratuitamente, você pode arrastar esta pasta para serviços como Netlify Drop ou GitHub Pages.
