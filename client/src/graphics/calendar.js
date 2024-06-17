document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.querySelector('.calendar');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    calendar.innerHTML = `
        <div class="calendar-header">
            ${monthNames[currentMonth]} ${currentYear}
        </div>
        <div class="calendar-days">
            ${generateCalendarDays(daysInMonth, firstDayIndex)}
        </div>
    `;
});

function generateCalendarDays(daysInMonth, firstDayIndex) {
    let days = '';

    for (let i = 1; i <= firstDayIndex; i++) {
        days += `<div class="calendar-day"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const today = new Date().getDate();
        const className = (i === today) ? 'calendar-day today' : 'calendar-day';
        days += `<div class="${className}">${i}</div>`;
    }

    return days;
}