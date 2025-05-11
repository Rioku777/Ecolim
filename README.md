 Estructura del proyecto

├── index.html # Entrada HTML principal
├── package.json # Configuración del proyecto y scripts
├── vite.config.js # Configuración de Vite
├── tailwind.config.js # Personalización de Tailwind CSS
├── postcss.config.js # Configuración de PostCSS
└── src/
├── main.jsx # Punto de entrada React
├── App.jsx # Componente raíz de la app
├── index.css # Estilos globales con Tailwind
├── contexts/ # Gestión de estado global
│ ├── AuthContext.jsx # Autenticación
│ └── ThemeContext.jsx # Tema claro/oscuro
├── lib/
│ └── utils.js # Funciones auxiliares
└── pages/ # Vistas de la app
├── Dashboard.jsx
├── RegisterAction.jsx
├── RegisterActionPage.jsx
├── Gamification.jsx
├── MapView.jsx
├── Rewards.jsx
├── Ranking.jsx
└── RankingPage.jsx

 Tecnologías utilizadas

- React: Biblioteca de JavaScript para interfaces reactivas.
- Vite : Herramienta de construcción rápida y ligera.
- Tailwind CSS :Framework CSS utilitario para diseño moderno y responsivo.
- Context API (React):Para manejar autenticación y temas globales.
- PostCSS: Para procesamiento del CSS (con soporte de Tailwind).
- JavaScript moderno (ES6+): – Código modular, limpio y eficiente.
