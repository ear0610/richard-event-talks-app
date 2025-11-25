document.addEventListener('DOMContentLoaded', () => {
    const scheduleElement = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleElement.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        talksToRender.forEach((talk, index) => {
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const time = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
            currentTime.setHours(currentTime.getHours() + 1);
            const endTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

            talkElement.innerHTML = `
                <div class="details">
                    <span>${time} - ${endTime}</span>
                    <span class="category">${talk.category.join(', ')}</span>
                </div>
                <h2>${talk.title}</h2>
                <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
                <p>${talk.description}</p>
            `;
            scheduleElement.appendChild(talkElement);

            if (index === 2) { // Add lunch break after the 3rd talk
                const breakElement = document.createElement('div');
                breakElement.classList.add('break');
                const breakTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
                currentTime.setHours(currentTime.getHours() + 1);
                const breakEndTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
                breakElement.innerHTML = `<h3>Lunch Break</h3><p>${breakTime} - ${breakEndTime}</p>`;
                scheduleElement.appendChild(breakElement);
            } else if (index < talksToRender.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + 10); // 10 minute transition
            }
        });
    }
});
