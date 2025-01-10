document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            // Sélectionner le contenu de sous-menu correspondant
            const submenu = this.querySelector(".submenu-content");

            // Basculer l'affichage (dérouler/masquer)
            if (submenu.style.display === "block") {
                submenu.style.display = "none";
            } else {
                // Masquer les autres sous-menus
                document.querySelectorAll(".submenu-content").forEach(sub => {
                    sub.style.display = "none";
                });

                submenu.style.display = "block";
            }
        });
    });
});

// Sélection de l'élément du curseur personnalisé
const cursor = document.querySelector('.custom-cursor');

// Mettre à jour la position du curseur personnalisé
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Changer l'apparence lors d'un clic
document.addEventListener('mousedown', () => {
    cursor.style.backgroundColor = 'noir';
});

document.addEventListener('mouseup', () => {
    cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
});



      