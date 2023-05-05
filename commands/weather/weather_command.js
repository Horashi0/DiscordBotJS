const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API_KEY } = require('./config.json');

let temp_celsius;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Retrieves in depth weather information on any location on earth')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('Input city name')
                .setRequired(true)),
    async execute(interaction) {
        var city = interaction.options.getString('city')
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const axios = require('axios')

        function getWeather() {
            return new Promise((resolve, reject) => {
                axios.get(url)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
        getWeather()
            .then(weatherData => {
                temp_celsius = weatherData.main.temp
                temp_celsius_feels_like = weatherData.main.feels_like
                sunrise_time = new Date((
                    weatherData.sys.sunrise) * 1000).toLocaleString('en-UK', { timezone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                sunset_time = new Date((
                    weatherData.sys.sunset) * 1000).toLocaleString('en-UK', { timezone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                clouds = weatherData.weather[0].description
                wind_speed = weatherData.wind.speed
                wind_degrees = weatherData.wind.deg
                place = weatherData.name
                identification = weatherData.id
                timezone = weatherData.timezone
                humidity = weatherData.main.humidity
                Time_id = new Date((
                    weatherData.dt) * 1000).toString()
                console.log(``)
                console.log(`Temperature in ${city}: ${temp_celsius}°C`)
                console.log(`Temperature in ${city} feels like: ${temp_celsius_feels_like}°C`)
                console.log(`Humidity in ${city}: ${humidity} % `)
                console.log(`Wind speed in ${city}: ${wind_speed}m/s`)
                console.log(`Wind direction in ${city}: ${wind_degrees}°`)
                console.log(`General Weather in ${city}: ${clouds}`)
                console.log(`Sun rises in ${city} at ${sunrise_time}`)
                console.log(`Sun sets in ${city} at ${sunset_time}`)
                const messageEmbed = new EmbedBuilder()
                    .setTitle(`Weather in ${city}`)
                    .addFields(
                        { name: 'Temperature: ', value: `${temp_celsius}°C` },
                        { name: 'Feels Like: ', value: `${temp_celsius_feels_like}°C` },
                        { name: 'Humidity: ', value: `${humidity}%` },
                        { name: 'Wind Speed: ', value: `${wind_speed}m/s` },
                        { name: 'Wind Direction: ', value: `${wind_degrees}°` },
                        { name: 'General weather: ', value: `${clouds}` },
                        { name: 'Sunrise time: ', value: `${sunrise_time}` },
                        { name: 'Sunset time: ', value: `${sunset_time}` },
                    )
                    .setTimestamp()
                    .setFooter({ text: "Powered by OpenWeatherMap" });

                interaction.reply({ embeds: [messageEmbed] });
            })
            .catch(error => {
                console.log("Error: " + error.message);
            });
    },
};






