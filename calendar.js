document.addEventListener("DOMContentLoaded", () => {
    const currentMonthYearSpan = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const daysGrid = document.getElementById('calendar-days-grid');

    const date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function renderCalendar() {
        daysGrid.innerHTML = '';

        currentMonthYearSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        firstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        for (let i = firstDayOfMonth; i > 0; i--) {
            const daySpan = document.createElement('span');
            daySpan.classList.add('empty');
            daySpan.textContent = daysInPrevMonth - i + 1;
            daysGrid.appendChild(daySpan);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const daySpan = document.createElement('span');
            daySpan.textContent = i;
            daySpan.classList.add('current-month');

            if (i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
                daySpan.classList.add('today');
            }

            daysGrid.appendChild(daySpan);
        }

        const totalDaysRendered = firstDayOfMonth + daysInMonth;
        const remainingDays = (7 - (totalDaysRendered % 7)) % 7;
        
        for (let i = 1; i <= remainingDays; i++) {
            const daySpan = document.createElement('span');
            daySpan.classList.add('empty');
            daySpan.textContent = i;
            daysGrid.appendChild(daySpan);
        }
    }

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

    renderCalendar();
});
