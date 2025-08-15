// Função para alternar o tema
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    
    // Salvar preferência no localStorage
    const isDark = body.classList.contains('dark');
    localStorage.setItem('darkTheme', isDark);
}

// Carregar preferência de tema
function loadTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
    }
}

// Menu hamburguer
function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tema
    loadTheme();
    
    // Toggle de tema
    const themeButton = document.getElementById('themeToggle');
    themeButton.addEventListener('click', toggleTheme);
    
    // Menu hamburguer
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link (mobile)
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
});
