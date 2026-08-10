
// Kendi OpenWeatherMap API anahtarınızı buraya girin
// https://openweathermap.org/api adresinden ücretsiz alabilirsiniz
const apiKey = "";
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
    "Açık": "Güneşli",
    "Kapalı": "Bulutlu"
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
        if (descLower.includes('sis')) {
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
        "test-güneşli": {
            name: "Güneşli (Açık) Test",
            weather: [{ id: 800, icon: "01d", description: "açık" }],
            main: { temp: 28 }
        },
        "test-gunesli": {
            name: "Güneşli (Açık) Test",
            weather: [{ id: 800, icon: "01d", description: "açık" }],
            main: { temp: 28 }
        },
        "test-azbulutlu": {
            name: "Az Bulutlu Test",
            weather: [{ id: 801, icon: "02d", description: "az bulutlu" }],
            main: { temp: 21 }
        },
        "test-bulutlu": {
            name: "Bulutlu (Kapalı) Test",
            weather: [{ id: 804, icon: "04d", description: "kapalı" }],
            main: { temp: 14 }
        },
        "test-yağmurlu": {
            name: "Yağmurlu Test",
            weather: [{ id: 500, icon: "10d", description: "yağmurlu" }],
            main: { temp: 11 }
        },
        "test-yagmurlu": {
            name: "Yağmurlu Test",
            weather: [{ id: 500, icon: "10d", description: "yağmurlu" }],
            main: { temp: 11 }
        },
        "test-fırtına": {
            name: "Gök Gürültülü Test",
            weather: [{ id: 211, icon: "11d", description: "gök gürültülü fırtına" }],
            main: { temp: 18 }
        },
        "test-firtina": {
            name: "Gök Gürültülü Test",
            weather: [{ id: 211, icon: "11d", description: "gök gürültülü fırtına" }],
            main: { temp: 18 }
        },
        "test-kar": {
            name: "Karlı Test",
            weather: [{ id: 600, icon: "13d", description: "karlı" }],
            main: { temp: -2 }
        },
        "test-karlı": {
            name: "Karlı Test",
            weather: [{ id: 600, icon: "13d", description: "karlı" }],
            main: { temp: -2 }
        },
        "test-sis": {
            name: "Sisli Test",
            weather: [{ id: 701, icon: "50d", description: "sisli" }],
            main: { temp: 7 }
        },
        "test-rüzgar": {
            name: "Rüzgarlı (Puslu) Test",
            weather: [{ id: 771, icon: "50d", description: "puslu" }],
            main: { temp: 16 }
        },
        "test-ruzgar": {
            name: "Rüzgarlı (Puslu) Test",
            weather: [{ id: 771, icon: "50d", description: "puslu" }],
            main: { temp: 16 }
        }
    };

    if (mockDataMapping[cityLower]) {
        displayWeather(mockDataMapping[cityLower]);
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}&lang=tr&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Konum bulunamadı");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.log("Hata:", error);
            document.getElementById("temp").innerHTML = "<p>Düzgün Konum Giriniz!</p>";
        });
});

document.getElementById("citySearch").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});
