(function () {
  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

  const stationEl = document.getElementById("weather-station");
  const conditionsEl = document.getElementById("weather-conditions");
  const tempEl = document.getElementById("weather-temp");
  const pressureEl = document.getElementById("weather-pressure");
  const codingEl = document.getElementById("weather-coding");
  const asciiEl = document.getElementById("weather-ascii");

  if (!stationEl || !conditionsEl || !tempEl || !pressureEl || !codingEl) {
    return;
  }

  const STORAGE_PRESSURE = "sjk-weather-last-pressure";

  function setFallback() {
    stationEl.textContent = "STATION: LOCAL DEV SHELL";
    conditionsEl.textContent =
      "CURRENT CONDITIONS: PARTLY CLOUDY WITH CHANCE OF BUGS";
    tempEl.textContent = "TEMP: 27°C  (KERNEL FEELS LIKE 29°C)";
    pressureEl.textContent = "PRESSURE: 1013 hPa   TREND: →";
    codingEl.textContent = "CODING WEATHER: OPTIMAL";
    if (asciiEl) {
      asciiEl.textContent =
        "   .--.\n" +
        ".-(    ).\n" +
        "(___.__)__)\n";
    }
  }

  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    // Developer has not configured a key yet.
    setFallback();
    return;
  }

  function chooseAscii(main) {
    const m = (main || "").toLowerCase();
    if (m.includes("rain") || m.includes("drizzle")) {
      return (
        "     .-.\n" +
        "    (   ).\n" +
        "   (___(__)\n" +
        "   ʻ ʻ ʻ ʻ\n"
      );
    }
    if (m.includes("storm") || m.includes("thunder")) {
      return (
        "     .-.\n" +
        "  .-(   ).\n" +
        " (___.__)__\n" +
        "   ⚡  ⚡\n"
      );
    }
    if (m.includes("cloud")) {
      return (
        "    .--.\n" +
        " .-(    ).\n" +
        "(___.__)__)\n"
      );
    }
    if (m.includes("snow")) {
      return (
        "    .-.\n" +
        "   (   ).\n" +
        "  (___(__)\n" +
        "   *  *  *\n"
      );
    }
    return (
      "    \\   /\n" +
      "     .-.\n" +
      "  ― (   ) ―\n" +
      "     `-'\n"
    );
  }

  function pressureTrend(current) {
    let prev = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_PRESSURE);
      if (raw) prev = parseFloat(raw);
    } catch {
      prev = null;
    }

    try {
      sessionStorage.setItem(STORAGE_PRESSURE, String(current));
    } catch {
      // ignore
    }

    if (prev == null) return "→";
    if (current > prev + 1) return "↗";
    if (current < prev - 1) return "↘";
    return "→";
  }

  function codingWeather(main) {
    const now = new Date();
    const hour = now.getHours();
    const m = (main || "").toLowerCase();

    if (m.includes("thunder") || m.includes("storm")) {
      return "CODING WEATHER: THUNDERSTORM";
    }
    if (m.includes("rain")) {
      return "CODING WEATHER: RAINY";
    }
    if (hour >= 22 || hour < 5) {
      return "CODING WEATHER: LATE-NIGHT THUNDERSTORM";
    }
    if (hour >= 6 && hour < 18) {
      return "CODING WEATHER: OPTIMAL";
    }
    return "CODING WEATHER: CLOUDY BUT PROMISING";
  }

  function updateFromData(data) {
    if (!data || !data.weather || !data.main) {
      setFallback();
      return;
    }

    const name = data.name || "UNKNOWN STATION";
    const country = data.sys && data.sys.country ? data.sys.country : "";
    const main = data.weather[0].main || "";
    const desc = data.weather[0].description || "";
    const tempC = data.main.temp;
    const feelsC = data.main.feels_like;
    const pressure = data.main.pressure;

    stationEl.textContent = `STATION: ${name.toUpperCase()}${country ? " / " + country : ""}`;
    conditionsEl.textContent = `CURRENT CONDITIONS: ${desc.toUpperCase()} WITH CHANCE OF BUGS`;
    tempEl.textContent = `TEMP: ${Math.round(
      tempC
    )}°C  (KERNEL FEELS LIKE ${Math.round(feelsC)}°C)`;

    const trend = pressureTrend(pressure);
    pressureEl.textContent = `PRESSURE: ${pressure} hPa   TREND: ${trend}`;
    codingEl.textContent = codingWeather(main);

    if (asciiEl) {
      asciiEl.textContent = chooseAscii(main);
    }
  }

  function fetchByCoords(lat, lon) {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      encodeURIComponent(lat) +
      "&lon=" +
      encodeURIComponent(lon) +
      "&units=metric&appid=" +
      encodeURIComponent(API_KEY);

    fetch(url)
      .then((res) => res.json())
      .then(updateFromData)
      .catch(setFallback);
  }

  function fetchByCity(city) {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(city) +
      "&units=metric&appid=" +
      encodeURIComponent(API_KEY);
    fetch(url)
      .then((res) => res.json())
      .then(updateFromData)
      .catch(setFallback);
  }

  const defaultCity =
    document.body.getAttribute("data-weather-city") || "Guwahati,IN";

  if ("geolocation" in navigator) {
    const timeoutId = setTimeout(() => {
      fetchByCity(defaultCity);
    }, 3000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        clearTimeout(timeoutId);
        fetchByCity(defaultCity);
      },
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 2500 }
    );
  } else {
    fetchByCity(defaultCity);
  }
})();

