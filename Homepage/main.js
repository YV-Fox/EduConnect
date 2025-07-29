document.addEventListener("DOMContentLoaded", () => {
    
    let ALL_COURSES_DATA = {};

    // --- DATOS SIMULADOS CON TEMÁTICA DE COMPUTACIÓN ---
    const SIMULATED_GRADES = [
        { course: "Bases de Datos I", name: "Laboratorio 1", grade: 18 },
        { course: "Algoritmos y Estructuras de Datos", name: "Taller de Complejidad", grade: 16 },
        { course: "Sistemas Operativos", name: "Quiz de Procesos", grade: 19 },
    ];

    const SIMULATED_ASSIGNMENTS = [
        ...SIMULATED_GRADES,
        { course: "Algoritmos y Estructuras de Datos", name: "Actividad Práctica: Implementar una Pila", grade: "Pendiente" },
        { course: "Redes de Computadoras", name: "Entrega: Guía de Subnetting", grade: "Pendiente" },
    ];
    
    // --- CARGA DE DATOS Y COMPONENTES ---
    async function loadPrerequisites() {
        try {
            // Cargar datos de los cursos
            const response = await fetch('courses.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            ALL_COURSES_DATA = await response.json();

            // Función para cargar componentes HTML (como _nav y _lat)
            const loadComponent = (selector, url) => {
                return fetch(url)
                    .then(response => response.ok ? response.text() : Promise.reject(`Component not found: ${url}`))
                    .then(data => {
                        const element = document.querySelector(selector);
                        if (element) element.innerHTML = data;
                    });
            };
            
            // Esperar a que se carguen ambos componentes antes de continuar
            await Promise.all([
                loadComponent('#nav', '_nav.html'),
                loadComponent('#lat', '_lat.html')
            ]);

        } catch (error) {
            console.error("Error loading prerequisites:", error);
            // Si algo falla (ej: no se encuentra un archivo), se detiene la inicialización.
            document.body.innerHTML = `<p style="color:white; text-align:center; margin-top: 5rem;">Error al cargar la página. Por favor, revisa la consola.</p>`;
        }
    }

    // --- CONFIGURACIÓN DEL USUARIO Y NAVEGACIÓN ---
    const setupUser = () => {
        const storedUsername = localStorage.getItem('loggedInUsername') || "Invitado";
        document.querySelectorAll('#username, #displayUsername').forEach(el => {
            if (el) el.textContent = storedUsername;
        });
        
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('loggedInUsername');
                localStorage.removeItem('enrolledCourses');
                localStorage.removeItem('quickNotes');
                
                window.location.href = '../index.html'; 
            });
        }
    };
    
    const setActiveLink = () => {
        const links = document.querySelectorAll('#lat-links-container .lat-link');
        const currentPage = window.location.pathname.split('/').pop();
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active-lat-link');
            }
        });
    };

    // --- RENDERIZADO DINÁMICO ---
    const renderEnrolledCourses = (targetSelector, limit = 0) => {
        const container = document.querySelector(targetSelector);
        if(!container) return;

        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        if (enrolledCourses.length === 0) {
            container.innerHTML = '<p style="text-align: center; font-size: 1.1rem;">Aún no te has inscrito en ningún curso. ¡Explora nuestro <a href="catalogo.html" style="color: var(--blue-accent);">catálogo</a>!</p>';
            return;
        }
        
        container.className = 'enrolled-course-grid';
        let coursesToRender = limit > 0 ? enrolledCourses.slice(0, limit) : enrolledCourses;

        container.innerHTML = coursesToRender.map(course => {
            const randomProgress = Math.floor(Math.random() * 81) + 10;
            return `
                <article class="enrolled-card">
                    <div class="enrolled-card-content">
                        <h3>${course.name}</h3>
                        <p>Profesor: ${course.prof}</p>
                        <div class="progress-info">
                            <span>PROGRESO: ${randomProgress}%</span>
                            <div class="progress-bar-container" style="margin-top: 0.5rem;">
                                <div class="progress-bar" style="width: ${randomProgress}%;"></div>
                            </div>
                        </div>
                        <a href="curso_detalle.html?courseId=${course.id}" class="full-width-btn">Acceder al Curso</a>
                    </div>
                </article>
            `;
        }).join('');
    };

    const renderCatalogCourses = () => {
        const container = document.getElementById('catalog-course-grid');
        if (!container) return;

        container.innerHTML = Object.keys(ALL_COURSES_DATA).map(courseId => {
            const course = ALL_COURSES_DATA[courseId];
            return `
                <article class="course-card" data-course-id="${courseId}" data-course-name="${course.name}" data-course-prof="${course.prof}">
                    <img src="${course.image}" alt="Banner del curso ${course.name}" class="course-card-image">
                    <div class="course-card-content">
                        <h3>${course.name}</h3>
                        <p class="course-card-details">Profesor: ${course.prof}</p>
                        <button class="full-width-btn enroll-btn">Inscribirse</button>
                    </div>
                </article>
            `;
        }).join('');
        initEnrollment();
    };

    const renderCourseDetail = () => {
        const container = document.getElementById('course-content-container');
        if (!container) return;

        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        const course = ALL_COURSES_DATA[courseId];

        if (!course) {
            document.getElementById('course-title-placeholder').textContent = "Curso no encontrado.";
            return;
        }

        document.getElementById('course-title-placeholder').textContent = course.name;
        document.getElementById('course-prof-placeholder').textContent = `Impartido por ${course.prof}`;
        
        const icons = { video: '🎥', pdf: '📄', concepto: '💡', lectura: '📖', actividad: '📝' };
        container.innerHTML = course.content.map(item => `
            <article class="material-card" data-type='${item.type}' data-title='${item.title}' data-body='${item.body || ''}' data-url='${item.url || ''}'>
                <h3>${icons[item.type] || '📌'} ${item.title}</h3>
            </article>
        `).join('');
        
        initContentModal();
    };

    const renderAssignments = () => {
        const container = document.getElementById('assignments-list-full');
        if(!container) return;
        container.innerHTML = SIMULATED_ASSIGNMENTS.map(item => `
             <li>
                <span><strong>${item.course}:</strong> ${item.name}</span>
                <span class="assignment-status ${item.grade === 'Pendiente' ? 'status-pending' : 'status-graded'}">
                    ${item.grade === 'Pendiente' ? 'Pendiente' : `${item.grade} / 20`}
                </span>
            </li>
        `).join('');
    };

    const renderRecentGrades = () => {
        const container = document.getElementById('recent-grades-list');
        if(!container) return;
        container.innerHTML = SIMULATED_GRADES.slice(0, 3).map(item => `
             <li class="assignment-item">
                <span><strong>${item.course}:</strong> ${item.name}</span>
                <span class="assignment-status status-graded">${item.grade} / 20</span>
            </li>
        `).join('');
    };

    // --- INICIALIZACIÓN DE FUNCIONALIDADES ---
    const initEnrollment = () => {
        document.querySelectorAll('.enroll-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const courseCard = e.target.closest('.course-card');
                const course = {
                    id: courseCard.dataset.courseId,
                    name: courseCard.dataset.courseName,
                    prof: courseCard.dataset.courseProf
                };
                let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
                if (!enrolledCourses.some(c => c.id === course.id)) {
                    enrolledCourses.push(course);
                    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
                    alert(`Inscripción en "${course.name}" confirmada.`);
                    window.location.href = 'mis_cursos.html';
                } else {
                    alert(`Ya estás inscrito en "${course.name}".`);
                }
            });
        });
    };

    const initContentModal = () => {
        const modal = document.getElementById('content-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeModalBtn = document.querySelector('.close-modal-btn');
        
        if(!modal) return;

        document.querySelectorAll('.material-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                const title = card.dataset.title;
                const body = card.dataset.body;
                const url = card.dataset.url;

                modalTitle.textContent = title;
                
                let contentHtml = '';
                switch(type) {
                    case 'video':
                        contentHtml = `<iframe src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                        break;
                    case 'pdf':
                        contentHtml = `<p>El material <strong>"${title}"</strong> está disponible como PDF.</p><a href="#" class="full-width-btn" style="margin-top: 1rem;">Descargar PDF (Simulación)</a>`;
                        break;
                    case 'concepto':
                    case 'lectura':
                    case 'actividad':
                         contentHtml = `<p>${body}</p>`;
                         break;
                    default:
                         contentHtml = `<p>Contenido no disponible.</p>`;
                }
                modalBody.innerHTML = contentHtml;
                modal.style.display = 'block';
            });
        });

        closeModalBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    };

    const initQuickNotes = () => {
        const textarea = document.getElementById('quick-notes-textarea');
        const saveBtn = document.getElementById('save-notes-btn');
        if(!textarea || !saveBtn) return;

        textarea.value = localStorage.getItem('quickNotes') || '';

        saveBtn.addEventListener('click', () => {
            localStorage.setItem('quickNotes', textarea.value);
            alert('¡Notas guardadas!');
        });
    };

    const initProgressCircle = () => {
        const circle = document.querySelector('.progress-circle');
        if(!circle) return;
        
        const average = SIMULATED_GRADES.reduce((acc, item) => acc + item.grade, 0) / SIMULATED_GRADES.length;
        const percentage = (average / 20) * 100;
        
        circle.dataset.progress = percentage;
        circle.textContent = average.toFixed(1);

        const degree = (percentage / 100) * 360;
        circle.style.background = `conic-gradient(var(--blue-accent) ${degree}deg, rgba(255, 255, 255, 0.1) 0deg)`;
    };

    // --- PUNTO DE ENTRADA PRINCIPAL ---
    async function initializeApp() {
        await loadPrerequisites();
        
        setupUser();
        setActiveLink();
        
        const pageId = document.body.id;

        if (pageId === 'page-catalogo') {
            renderCatalogCourses();
        }

        if (pageId.startsWith('page-mis-cursos')) {
             renderEnrolledCourses('#enrolled-courses-list');
        }
        
        if (document.getElementById('dashboard-enrolled-courses')) {
            renderEnrolledCourses('#dashboard-enrolled-courses', 2);
            renderRecentGrades();
            initQuickNotes();
        }

        if (pageId === 'page-curso-detalle') {
            renderCourseDetail();
        }

        if (document.getElementById('assignments-list-full')) {
            renderAssignments();
            initProgressCircle();
        }
    }

    initializeApp();
});