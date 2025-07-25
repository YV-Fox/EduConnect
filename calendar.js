document.addEventListener("DOMContentLoaded", () => {
    const currentMonthYearSpan = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const daysGrid = document.getElementById('calendar-days-grid');

    const date = new Date(); // Objeto Date para la fecha actual del sistema
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function renderCalendar() {
        daysGrid.innerHTML = ''; // Limpiar días anteriores

        // Actualizar el mes y el año en la cabecera
        currentMonthYearSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Obtener el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
        // Ajustamos para que la semana empiece en Lunes (0 si es Lunes, 6 si es Domingo)
        let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        firstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // 0=Lunes, 6=Domingo

        // Obtener el número total de días en el mes actual
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Obtener el número total de días en el mes anterior para rellenar los espacios
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Rellenar los días vacíos del inicio (días del mes anterior)
        for (let i = firstDayOfMonth; i > 0; i--) {
            const daySpan = document.createElement('span');
            daySpan.classList.add('empty');
            // Opcional: mostrar los días del mes anterior, pero suelen ser opacos o invisibles
            daySpan.textContent = daysInPrevMonth - i + 1;
            daysGrid.appendChild(daySpan);
        }

        // Rellenar los días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            const daySpan = document.createElement('span');
            daySpan.textContent = i;
            daySpan.classList.add('current-month');

            // Resaltar el día actual del sistema
            if (i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
                daySpan.classList.add('today');
            }

            daysGrid.appendChild(daySpan);
        }

        // Rellenar los días vacíos del final (días del mes siguiente)
        // Calcula cuántos días se han añadido (días del mes anterior + días del mes actual)
        const totalDaysRendered = firstDayOfMonth + daysInMonth;
        // Calcula cuántos días faltan para completar una cuadrícula de 7xN (múltiplo de 7)
        const remainingDays = (7 - (totalDaysRendered % 7)) % 7;
        
        for (let i = 1; i <= remainingDays; i++) {
            const daySpan = document.createElement('span');
            daySpan.classList.add('empty');
            // Opcional: mostrar los días del mes siguiente
            daySpan.textContent = i;
            daysGrid.appendChild(daySpan);
        }
    }

    // Navegación del calendario
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Renderizar el calendario al cargar la página
    renderCalendar();
});