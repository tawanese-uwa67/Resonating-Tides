const STATS = ["Durability", "Speed", "Agility", "Resonance Ability", "Energy Control", "Emotional Prowess"];
let ocs = JSON.parse(localStorage.getItem('resonating_tides_ocs')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const statContainer = document.getElementById('stats-inputs');
    if(statContainer) {
        STATS.forEach(s => {
            statContainer.innerHTML += `<div class='stat-row'><label>${s}</label><select class='stat-in' data-s='${s}'><option>A</option><option>B</option><option selected>C</option><option>D</option><option>E</option></select></div>`;
        });
    }
    renderArchive();
    document.body.addEventListener('click', () => document.getElementById('bg-music').play(), {once: true});
});

function navigate(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.getElementById('oc-form').onsubmit = (e) => {
    e.preventDefault();
    const sVals = {};
    document.querySelectorAll('.stat-in').forEach(i => sVals[i.dataset.s] = i.value);
    const oc = {
        id: Date.now(),
        name: document.getElementById('oc-name').value,
        image: document.getElementById('oc-image').value,
        region: document.getElementById('oc-region').value,
        weapon: document.getElementById('oc-weapon').value,
        backstory: document.getElementById('oc-backstory').value,
        stats: sVals,
        labels: []
    };
    ocs.push(oc);
    localStorage.setItem('resonating_tides_ocs', JSON.stringify(ocs));
    renderArchive();
    navigate('archive-page');
};

function renderArchive(filter = 'All') {
    const container = document.getElementById('oc-gallery');
    if(!container) return;
    container.innerHTML = '';
    const list = filter === 'All' ? ocs : ocs.filter(o => o.region === filter);
    list.forEach(o => {
        container.innerHTML += `<div class="oc-card-mini" onclick="viewOC(${o.id})"><img src="${o.image}"><h3>${o.name}</h3><p>${o.region}</p></div>`;
    });
}

function viewOC(id) {
    const o = ocs.find(x => x.id === id);
    document.getElementById('card-img').src = o.image;
    document.getElementById('card-name').innerText = o.name;
    document.getElementById('card-meta').innerText = `${o.region} | ${o.weapon}`;
    document.getElementById('card-story-text').innerText = o.backstory;
    const sd = document.getElementById('card-stats-display');
    sd.innerHTML = '';
    for(let s in o.stats) sd.innerHTML += `<span>${s}: ${o.stats[s]}</span><br>`;
    document.getElementById('profile-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('profile-modal').style.display = 'none'; }

function saveAsImage() {
    html2canvas(document.getElementById('export-area'), { useCORS: true }).then(c => {
        const a = document.createElement('a');
        a.href = c.toDataURL();
        a.download = 'Resonator_Archive.png';
        a.click();
    });
}

function openAdmin() {
    const pw = prompt("Enter Admin Access Code:");
    if(pw === "admin123") alert("Admin access granted.");
}
