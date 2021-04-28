interface State {
    name: string;
    enabled: boolean;
}

const states: State[] = [
    {
        name: 'dolnośląskie',
        enabled: false
    },
    {
        name: 'kujawsko-pomorskie',
        enabled: true
    },
    {
        name: 'lubelskie',
        enabled: true
    },
    {
        name: 'lubuskie',
        enabled: true
    },
    {
        name: 'łódzkie',
        enabled: false
    },
    {
        name: 'małopolskie',
        enabled: true
    },
    {
        name: 'mazowieckie',
        enabled: true
    },
    {
        name: 'opolskie',
        enabled: false
    },
    {
        name: 'podkarpackie',
        enabled: true
    },
    {
        name: 'podlaskie',
        enabled: true
    },
    {
        name: 'pomorskie',
        enabled: true
    },
    {
        name: 'śląskie',
        enabled: false
    },
    {
        name: 'świętokrzyskie',
        enabled: true
    },
    {
        name: 'warmińsko-mazurskie',
        enabled: true
    },
    {
        name: 'wielkopolskie',
        enabled: false
    },
    {
        name: 'zachodniopomorskie',
        enabled: true
    }
]

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

function setCurrentState(state: string): void {
    if(state !== undefined) {
        setAnswer(states.find(s => s.name === state).enabled);
    }
}

function getState(lon: number, lat: number): Promise<string> {
    return fetch(`api/search?point=${lon},${lat}`)
        .then(response => response.json())
        .then(response => {
            if (response.length > 0) {
                return response[0].address.state;
            }
            else return undefined;
        })
        .catch(error => {
            console.log(error);
            return undefined;
        });
}

if (Date.now() >= new Date(2021, 4, 1).getTime()) {
    setAnswer(true);
    document.getElementById('selectState').style.display='none';
}
else {
    document.getElementById('tooltip').style.display='none';
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
