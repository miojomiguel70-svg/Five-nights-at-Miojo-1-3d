# Five Nights at Miojo 3D (FNAM 3D)

Um jogo de terror e sobrevivência em 3D inspirado no clássico FNAF, ambientado em uma fábrica de miojo 24h.

## 🎮 Como Jogar

### Modo Sobrevivência (Office)
- **Câmeras:** Passe o mouse/toque na borda inferior para abrir o tablet e monitorar as câmeras.
- **Portas:** Use os botões laterais (DOOR) para fechar as saídas quando os animatronics estiverem próximos.
- **Luzes:** Use o botão (LIGHT) para verificar os corredores laterais.
- **Energia:** Cada ação (luz, porta, tablet) consome energia. Se a energia acabar, as defesas param de funcionar.
- **Objetivo:** Sobreviver até às 6 da manhã.

### Modo Exploração
- **Movimento:** W, A, S, D para andar.
- **Olhar:** Use o mouse para rotacionar a câmera.
- **Sair:** Pressione ESC para voltar ao menu principal.

## 🤖 Animatronics
- **Miojo:** O líder. Ele se move estrategicamente e costuma vir pelo corredor principal.
- **Nissin:** Movimentação aleatória e imprevisível. Fique atento às câmeras de estoque.
- **Lamen:** O mais agressivo. Move-se rápido e ataca com frequência.

## ⚙️ Tecnologias Utilizadas
- **React 18** + **Vite**
- **Three.js** (@react-three/fiber) para renderização 3D.
- **Zustand** para gerenciamento de estado global.
- **Framer Motion** para animações de interface.
- **Tailwind CSS** para design moderno e responsivo.

## 📁 Estrutura do Projeto
- `/src/store`: Estado global (noite, energia, posição dos animatronics).
- `/src/components/game`: Componentes 3D (Escritório, Fábrica, Animatronics).
- `/src/components/ui`: Interface (HUD, Tablet, Menu).
- `/src/hooks`: Lógica de IA e consumo de energia.

---
Desenvolvido como um protótipo avançado para o desafio Five Nights at Miojo 3D.
