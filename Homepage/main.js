document.addEventListener("DOMContentLoaded", () => {
    
    let ALL_COURSES_DATA = {};
    
    async function loadCourseData() {
        try {
            const response = await fetch('courses.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            ALL_COURSES_DATA = await response.json();
        } catch (error) {
            console.error("Error al cargar los datos de los cursos:", error);
        }
    }

    const loadComponent = (selector, url, callback) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url).then(response => response.ok ? response.text() : Promise.reject('Component not found')).then(data => {
                element.innerHTML = data;
                if (callback) callback();
            }).catch(error => console.error(`Error loading component ${url}:`, error));
        }
    };

    const setupUser = () => {
        const storedUsername = localStorage.getItem('loggedInUsername') || "Invitado";
        document.querySelectorAll('#username').forEach(el => el.textContent = storedUsername);
        const displayUsernameSpan = document.getElementById('displayUsername');
        if(displayUsernameSpan) displayUsernameSpan.textContent = storedUsername;
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('loggedInUsername');
                localStorage.removeItem('enrolledCourses');
                window.location.href = '/index.html';
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

    const initCalendar = () => {
        const calendarGrid = document.getElementById('calendar-days-grid');
        if (!calendarGrid) return;
        const monthDisplay = document.getElementById('monthDisplay');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        let date = new Date();
        const renderCalendar = () => {
            date.setDate(1);
            const firstDayIndex = (date.getDay() + 6) % 7;
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
            const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
            const nextDays = 7 - lastDayIndex - 1;
            monthDisplay.textContent = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            let days = "";
            for (let x = firstDayIndex; x > 0; x--) { days += `<span class="empty">${prevLastDay - x + 1}</span>`; }
            for (let i = 1; i <= lastDay; i++) { const isToday = i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear(); days += `<span class="${isToday ? 'today' : ''}">${i}</span>`; }
            for (let j = 1; j <= nextDays; j++) { days += `<span class="empty">${j}</span>`; }
            calendarGrid.innerHTML = days;
        };
        prevMonthBtn.addEventListener('click', () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });
        renderCalendar();
    };

    const initEnrollment = () => {
        document.querySelectorAll('.enroll-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const courseCard = e.target.closest('.course-card');
                const course = { id: courseCard.dataset.courseId, name: courseCard.dataset.courseName, prof: courseCard.dataset.courseProf };
                let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
                if (!enrolledCourses.some(c => c.id === course.id)) {
                    enrolledCourses.push(course);
                    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
                }
                alert(`Inscripción en "${course.name}" confirmada.`);
                window.location.href = 'mis_cursos.html';
            });
        });
    };

    const renderEnrolledCourses = () => {
        if (!document.body.matches('#page-mis-cursos')) return;
        const container = document.getElementById('enrolled-courses-list');
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        if (enrolledCourses.length === 0) {
            container.innerHTML = '<p style="text-align: center; font-size: 1.1rem;">Aún no te has inscrito en ningún curso. ¡Explora nuestro <a href="catalogo.html" style="color: var(--blue-accent);">catálogo</a>!</p>';
            return;
        }
        container.className = 'enrolled-course-grid';
        let html = '';
        enrolledCourses.forEach(course => {
            const randomProgress = Math.floor(Math.random() * 81) + 10;
            html += `
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
        });
        container.innerHTML = html;
    };

   const renderCatalogCourses = () => {
    if (!document.body.matches('#page-catalogo')) return;

    const container = document.getElementById('catalog-course-grid');
    if (!container) return;

    let html = '';
    for (const courseId in ALL_COURSES_DATA) {
        const course = ALL_COURSES_DATA[courseId];
        html += `
            <article class="course-card" data-course-id="${courseId}" data-course-name="${course.name}" data-course-prof="${course.prof}">
                <img src="${course.image}" alt="Banner del curso ${course.name}" class="course-card-image">
                <div class="course-card-content">
                    <h3>${course.name}</h3>
                    <p class="course-card-details">Profesor: ${course.prof}</p>
                    <button class="full-width-btn enroll-btn">Inscribirse</button>
                </div>
            </article>
        `;
    }
    container.innerHTML = html;
};
    const renderCourseDetail = () => {
        if (!document.body.matches('#page-curso-detalle')) return;
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        const course = ALL_COURSES_DATA[courseId];
        if (!course) {
            document.getElementById('course-title-placeholder').textContent = "Curso no encontrado.";
            return;
        }
        document.getElementById('course-title-placeholder').textContent = course.name;
        document.getElementById('course-prof-placeholder').textContent = `Impartido por ${course.prof}`;
        const contentContainer = document.getElementById('course-content-container');
        let contentHtml = '';
        const icons = { video: '🎥', pdf: '📄', link: '🔗' };
        course.content.forEach(item => {
            contentHtml += `<article class="material-card"><h3>${icons[item.type] || '📌'} ${item.title}</h3></article>`;
        });
        contentContainer.innerHTML = contentHtml;
    };
    
    const initProjectSubmission = () => {
        const form = document.getElementById('project-submission-form');
        if (!form) return;
        const fileInput = document.getElementById('file-input');
        const submitBtn = document.getElementById('submit-project-btn');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('submission-status');
            if (fileInput.files.length === 0) {
                alert("Por favor, selecciona un archivo para entregar.");
                return;
            }
            statusDiv.textContent = '✅ ¡Proyecto entregado con éxito! Recibirás una notificación cuando sea calificado.';
            statusDiv.className = 'submission-feedback success';
            form.reset();
            submitBtn.disabled = true;
        });
    };
    
    const initCustomFileInput = () => {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;
        const fileNameDisplay = document.getElementById('file-name-display');
        const submitBtn = document.getElementById('submit-project-btn');
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
                submitBtn.disabled = false;
            } else {
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';
                submitBtn.disabled = true;
            }
        });
    };

    const initProgressCircles = () => {
        document.querySelectorAll('.progress-circle').forEach(circle => {
            const progress = circle.dataset.progress;
            const degree = (progress / 100) * 360;
            circle.style.background = `conic-gradient(var(--blue-accent) ${degree}deg, rgba(255, 255, 255, 0.1) 0deg)`;
        });
    };

    async function main() {
        await loadCourseData();
        
        loadComponent('#nav', '_nav.html', () => {
            loadComponent('#lat', '_lat.html', () => {
                setupUser();
                setActiveLink();
                initCalendar();
                renderCatalogCourses();
                initEnrollment();
                renderEnrolledCourses();
                renderCourseDetail();
                initProjectSubmission();
                initProgressCircles();
                initCustomFileInput();
            });
        });
    }

    main();
});