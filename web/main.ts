import { states } from 'states'

const geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function setAnswer(status: boolean): void {
    let element = document.getElementById('answer');
    element.innerText = status ? "TAK" : "NIE";
    element.style.color = status ? "green" : "red";
}

async function setCurrentState(name: string | undefined): Promise<void> {
    if(name !== undefined) {
        const answer = states.find(state => state.name === name).enabled
        setAnswer(answer);
    }
}

function getState(lon: number, lat: number): Promise<string> {
    return fetch(`api/search?point=${lon},${lat}`)
        .then(response => response.json())
        .then(response => response[0]?.address?.state)
        .catch(error => {
            console.log(error);
        });
}

const stateText = document.getElementById('stateText');
const tooltip = document.getElementById('tooltip');
if (Date.now() >= new Date(2021, 4, 1).getTime()) {
    setAnswer(true);
    stateText.style.display='none';
}
else {
    tooltip.style.display='none';
    let select = document.getElementById('stateSelect') as HTMLSelectElement;
    states.forEach(s=>{
        let element = new Option();
        element.text = s.name;
        element.value = s.name;
        select.options.add(element);
    });
    select.selectedIndex = -1;
    select.onchange = ()=>setCurrentState(select.selectedOptions[0].value);
    navigator.geolocation.getCurrentPosition(async result => {
        let state = await getState(result.coords.longitude, result.coords.latitude);
        select.selectedIndex = states.findIndex(s=>s.name===state);
        setCurrentState(state);
    },
    error => {
        console.log(error);
    },
    geoOptions);
}
