const BACKEND_URL = "https://weatherapp-ashy-two.vercel.app";
const APP_SECRET = "35a38b885229296a526d6115192daff9fd20e4befc37b946";

const iconMapping = {
    '01d': 'weather_tile_1-removebg-preview.png',
    '02d': 'weather_tile_3-removebg-preview.png',
    '03d': 'weather_tile_2-removebg-preview.png',
    '04d': 'weather_tile_2-removebg-preview.png',
    '09d': 'weather_tile_4-removebg-preview.png',
    '10d': 'weather_tile_4-removebg-preview.png',
    '11d': 'weather_tile_5-removebg-preview.png',
    '13d': 'weather_tile_6-removebg-preview.png',
    '50d': 'weather_tile_8-removebg-preview.png',
};

const descriptionMapping = {
    "Clear": "Sunny",
    "Overcast": "Cloudy"
};

function displayWeather(data) {
    const weatherDiv = document.getElementById("temp");
    const description = data.weather[0].description;
    let formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);

    if (descriptionMapping[formattedDescription]) {
        formattedDescription = descriptionMapping[formattedDescription];
    }

    weatherDiv.innerHTML = `
        <p>${data.name}</p>
        <div class="weather-icons">
            <img id="weatherIcon" src="" alt="Weather Icon" class="responsive-icon">
            <p class="centigrade"><span>${data.main.temp}</span> °C</p>
        </div>
        <p>${formattedDescription}</p>
    `;

    const apiIcon = data.weather[0].icon;

    const mappedIconCode = apiIcon.replace('n', 'd');

    let iconFilename;
    if (mappedIconCode === '50d') {
        const descLower = description.toLowerCase();
        if (descLower.includes('fog')) {
            iconFilename = 'weather_tile_8-removebg-preview.png';
        } else {
            iconFilename = 'weather_tile_7-removebg-preview.png';
        }
    } else {
        iconFilename = iconMapping[mappedIconCode] || 'weather_tile_1-removebg-preview.png';
    }

    document.getElementById('weatherIcon').src = `assets/icons/${iconFilename}?v=3`;
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
    const citySearch = document.querySelector("#citySearch").value.trim();
    const cityLower = citySearch.toLowerCase();

    const mockDataMapping = {
        "test-sunny": {
            name: "Sunny (Clear) Test",
            weather: [{ id: 800, icon: "01d", description: "clear" }],
            main: { temp: 28 }
        },
        "test-partly-cloudy": {
            name: "Partly Cloudy Test",
            weather: [{ id: 801, icon: "02d", description: "partly cloudy" }],
            main: { temp: 21 }
        },
        "test-cloudy": {
            name: "Cloudy (Overcast) Test",
            weather: [{ id: 804, icon: "04d", description: "overcast" }],
            main: { temp: 14 }
        },
        "test-rainy": {
            name: "Rainy Test",
            weather: [{ id: 500, icon: "10d", description: "rainy" }],
            main: { temp: 11 }
        },
        "test-storm": {
            name: "Thunderstorm Test",
            weather: [{ id: 211, icon: "11d", description: "thunderstorm" }],
            main: { temp: 18 }
        },
        "test-snow": {
            name: "Snowy Test",
            weather: [{ id: 600, icon: "13d", description: "snowy" }],
            main: { temp: -2 }
        },
        "test-fog": {
            name: "Foggy Test",
            weather: [{ id: 701, icon: "50d", description: "foggy" }],
            main: { temp: 7 }
        },
        "test-wind": {
            name: "Windy (Hazy) Test",
            weather: [{ id: 771, icon: "50d", description: "hazy" }],
            main: { temp: 16 }
        }
    };

    if (mockDataMapping[cityLower]) {
        displayWeather(mockDataMapping[cityLower]);
        return;
    }

    const apiUrl = `${BACKEND_URL}/api/weather?city=${encodeURIComponent(citySearch)}`;

    fetch(apiUrl, {
        headers: {
            "X-IonFlux-Token": APP_SECRET
        }
    })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || "Location not found");
            }
            return data;
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("temp").innerHTML = `<p>${error.message || "Please enter a valid location!"}</p>`;
        });
});

document.getElementById("citySearch").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});
