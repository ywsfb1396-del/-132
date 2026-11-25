
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter country name: ", async (country) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(country)}&count=1`
    );

    if (!response.ok) {
      throw new Error("API is unavailable");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Country not found!");
    }

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather API is unavailable");
    }

    const weatherData = await weatherResponse.json();

    console.log("Temperature:", weatherData.current.temperature_2m, "°C");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    rl.close();
  }
});
