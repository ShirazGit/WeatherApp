var currentLatitude;
var currentLongitude;
var url; //url = "https://api.openweathermap.org/data/2.5/weather?lat="+currentLatitude+"&lon="+currentLongitude+"&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
var days = [];
var temps = [];
var rain = [];


$(document).ready(function(){
    getLocation();
    $("#checkWeather").on('swipeleft', changeToPage2);
    $("#checkWeather").on('swiperight', changeToPage2);

    $("#compareWeather").on('swiperight', changeToPage1);
    $("#compareWeather").on('swipeleft', changeToPage1);

    function changeToPage2(event){
        $.mobile.changePage("#compareWeather");
    }
    function changeToPage1(event){
        $.mobile.changePage("#checkWeather");
    }

});

//Gets the location of the user
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        document.getElementById('lat').innerHTML = 
            "Geolocation not supported by your browser";
    }
}
//finds current user position and uses url to show weather and create the graph
function showPosition(position){
    currentLatitude = position.coords.latitude; 
    currentLongitude = position.coords.longitude;
    //currentLatitude = 40.71; testing coordinates for new york city
    //currentLongitude = -74.01;
    var latStr = `Latitude = ${currentLatitude}`;
    var longStr = `Longitude = ${currentLongitude}`;
    url = "https://api.openweathermap.org/data/2.5/weather?lat="+currentLatitude+"&lon="+currentLongitude+"&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    $('#lat').html(latStr);
    $('#long').html(longStr);
    $.getJSON(url, showWeather);
    url = "https://api.openweathermap.org/data/2.5/forecast?lat="+currentLatitude+"&lon="+currentLongitude+"&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    $.getJSON(url, addToArrays); 
}


//gets the weather ffrom the JSON and binds it to the respective P tags
function showWeather(myJson){
    var city = myJson.name;
    var temperature = myJson.main.temp;
    temperature = Math.round(temperature - 273.15);
    var image = myJson.weather[0].icon;
    var condition = myJson.weather[0].description;
    var pressure = myJson.main.pressure;
    var wind = myJson.wind.speed;
    var humidity = myJson.main.humidity;
    var clouds = myJson.clouds.all;


    $('#city').html(city);
    $('#temp').html(temperature+"&deg; C");
    $('#image').attr('src',`https://openweathermap.org/img/w/${image}.png`);
    $('#sunrise').html(moment.unix(myJson.sys.sunrise).format('HH:mm a'));
    $('#sunset').html(moment.unix(myJson.sys.sunset).format('HH:mm a'));
    $('#pressure').html(pressure);
    $('#wind').html(wind);   
    $('#humidity').html(humidity);
    $('#clouds').html(clouds);
    $('#condition').html(condition);
}

//parses the json and adds the values to their respective arrays of data
function addToArrays(myJson){
    days = [];
    temps = [];
    rain = [];
    for(i in myJson.list){
        days.push (moment.unix(myJson.list[i].dt).format('MM-DD-YYYY HH:mm a'));
        temps.push(Math.round(myJson.list[i].main.temp-273.15));
        try {
            rain.push(myJson.list[i].rain["3h"]);
        } catch (error) {
            rain.push(0);
        }
    }
    
    //chart js variable
    var ctx = document.getElementById('myChart').getContext('2d');// CanvasRenderingContext2D

    var myData = {
        labels: days,
        datasets: [{
            label: "Temperature in Celcius",
            fill: true,
            borderColor: 'rgb(0, 150,255)',
            backgroundColor: 'rgba(0,0,0,0)',
            data: temps,
            type: 'line',
            yAxisID: 'left-y-axis'
        },
        
        {
            label: "Rainfall in Millimeters",
            fill: true,
            borderColor: 'rgb(0, 255,0)',
            backgroundColor: 'rgba(0,255,0, 0.5)',
            data: rain,
            yAxisID: 'right-y-axis'
            
        }]

        
    };

    var chart = new Chart(ctx, {
        type: 'bar', 
        data: myData,
        options: {
            scales: {
                yAxes: [{
                    id: 'left-y-axis',
                    type: 'linear',
                    position: 'left',
                    gridLines: {
                        display:false
                    }   
                }, 
                
                {
                    id: 'right-y-axis',
                    type: 'linear',
                    position: 'right',
                    gridLines: {
                        display:false
                    }   
                }]
            }

        }

    });
}

//used to switch between locations
function changeLocation(city){
    if(city.id=="TOR"){
        $('#search1').val("Toronto");
        currentLatitude = 43.654;
        currentLongitude = -79.3873;
        
    }
    else if(city.id=="NYC"){
        currentLatitude = 40.71;
        currentLongitude = -74.01;
        

    }
    else if(city.id=="LDN"){
        currentLatitude = 51.5073;
        currentLongitude = -0.1277;   
        

    }
    else if(city.id=="BRAMP"){
        currentLatitude = 43.6858;
        currentLongitude = -79.76;   
        

    }
    else if(city.id=="MISS"){
        currentLatitude = 43.5819863;
        currentLongitude = -79.67922910000001;   
        
    }
    else if(city.id=="ABD"){
        currentLatitude = 24.4748;
        currentLongitude = 54.3706;   
        
    }
    else if(city.id=="MIA"){
        currentLatitude = 25.7743;
        currentLongitude = -80.1937;   
        
    }
    else if(city.id=="TOK"){
        currentLatitude = 35.69;
        currentLongitude = 139.69;   
        
    }
    

    var latStr = `Latitude = ${currentLatitude}`;
    var longStr = `Longitude = ${currentLongitude}`;
    url = "https://api.openweathermap.org/data/2.5/weather?lat="+currentLatitude+"&lon="+currentLongitude+"&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    $('#lat').html(latStr);
    $('#long').html(longStr);
    $.getJSON(url, showWeather);
    url = "https://api.openweathermap.org/data/2.5/forecast?lat="+currentLatitude+"&lon="+currentLongitude+"&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    $.getJSON(url, addToArrays); 
}

//used for drop down in compareWeather
function getCityForecast(value){
    if(value=="TOR"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=43.654&lon=-79.3873&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="NYC"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=40.71&lon=-74.01&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="LDN"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=51.5073&lon=-0.1277&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="BRAMP"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=43.6858&lon=-79.76&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="MISS"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=43.5819863&lon=-79.67922910000001&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="ABD"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=24.4748&lon=54.3706&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="MIA"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=25.7743&lon=-80.1937&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="TOK"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=35.69&lon=139.69&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="VAN"){
        return "https://api.openweathermap.org/data/2.5/forecast?lat=49.2624&lon=-123.1156&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
}

//get the current weather in the city
function getCityWeather(value){
    if(value=="TOR"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=43.654&lon=-79.3873&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="NYC"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=40.71&lon=-74.01&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="LDN"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=51.5073&lon=-0.1277&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="BRAMP"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=43.6858&lon=-79.76&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="MISS"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=43.5819863&lon=-79.67922910000001&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="ABD"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=24.4748&lon=54.3706&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="MIA"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=25.7743&lon=-80.1937&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="TOK"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=35.69&lon=139.69&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
    else if(value=="VAN"){
        return "https://api.openweathermap.org/data/2.5/weather?lat=49.2624&lon=-123.1156&appid=f8b91bb131ede97fc2a11e09d7f2af1f";
    }
}

function compareWeather(){
    var city1;
    var city2;
    var city3;
    var url1;
    var url2;
    var url3;
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];
    days = [];


    city1 = $('#select-compare-1').find(":selected").val();
    city2 = $('#select-compare-2').find(":selected").val();
    city3 = $('#select-compare-3').find(":selected").val();

    function addToArrays1(myJson){
        for(i in myJson.list){
            days.push (moment.unix(myJson.list[i].dt).format('MM-DD-YYYY HH:mm a'));
            temp1.push(Math.round(myJson.list[i].main.temp-273.15));

        }
    }
    function addToArrays2(myJson){
        for(i in myJson.list){
            temp2.push(Math.round(myJson.list[i].main.temp-273.15));
        }
    }
    function addToArrays3(myJson){
        for(i in myJson.list){
            temp3.push(Math.round(myJson.list[i].main.temp-273.15));
        }
    }

    url1 = getCityForecast(city1);
    url2 = getCityForecast(city2);
    url3 = getCityForecast(city3);
 

    
    $.when(
        $.getJSON(url1, addToArrays1),
        $.getJSON(url2, addToArrays2),
        $.getJSON(url3, addToArrays3)).done(function(){

    
        var ctx = document.getElementById('compareChart').getContext('2d');

        var myData = {
            labels: days,
            datasets: [{
                label: city1,
                fill: true,
                borderColor: 'rgb(0, 150,255)',
                backgroundColor: 'rgba(0,0,0,0)',
                data: temp1,
            },       
            {
                label: city2,
                fill: true,
                borderColor: 'rgb(0, 255,0)',
                backgroundColor: 'rgba(0,0,0,0)',
                data: temp2,
            
            },
            {
                label: city3,
                fill: true,
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgba(0,0,0,0)',
                data:temp3,
            }]     
        };

        var compareChart = new Chart(ctx, {
            type: 'line', 
            data: myData,

        });
    })
    url1 = getCityWeather(city1);
    url2 = getCityWeather(city2);
    url3 = getCityWeather(city3);
    $.getJSON(url1,showWeatherCity1);
    $.getJSON(url2,showWeatherCity2);
    $.getJSON(url3,showWeatherCity3);

}

function showWeatherCity1(myJson){
    var cityName = myJson.name;
    var temperature = myJson.main.temp;
    temperature = Math.round(temperature - 273.15);
    var image = myJson.weather[0].icon;
    var condition = myJson.weather[0].description;
    var pressure = myJson.main.pressure;
    var wind = myJson.wind.speed;
    var humidity = myJson.main.humidity;
    var clouds = myJson.clouds.all;

    $('#city1 .cityName').html(cityName);
    $('#city1 .temp').html(temperature+"&deg; C");
    $('#city1 .image').attr('src',`https://openweathermap.org/img/w/${image}.png`);
    $('#city1 .sunrise').html(moment.unix(myJson.sys.sunrise).format('HH:mm a'));
    $('#city1 .sunset').html(moment.unix(myJson.sys.sunset).format('HH:mm a'));
    $('#city1 .pressure').html(pressure);
    $('#city1 .wind').html(wind);   
    $('#city1 .humidity').html(humidity);
    $('#city1 .clouds').html(clouds);
    $('#city1 .condition').html(condition);
}

function showWeatherCity2(myJson){
    var cityName = myJson.name;
    var temperature = myJson.main.temp;
    temperature = Math.round(temperature - 273.15);
    var image = myJson.weather[0].icon;
    var condition = myJson.weather[0].description;
    var pressure = myJson.main.pressure;
    var wind = myJson.wind.speed;
    var humidity = myJson.main.humidity;
    var clouds = myJson.clouds.all;

    $('#city2 .cityName').html(cityName);
    $('#city2 .temp').html(temperature+"&deg; C");
    $('#city2 .image').attr('src',`https://openweathermap.org/img/w/${image}.png`);
    $('#city2 .sunrise').html(moment.unix(myJson.sys.sunrise).format('HH:mm a'));
    $('#city2 .sunset').html(moment.unix(myJson.sys.sunset).format('HH:mm a'));
    $('#city2 .pressure').html(pressure);
    $('#city2 .wind').html(wind);   
    $('#city2 .humidity').html(humidity);
    $('#city2 .clouds').html(clouds);
    $('#city2 .condition').html(condition);
}

function showWeatherCity3(myJson){
    var cityName = myJson.name;
    var temperature = myJson.main.temp;
    temperature = Math.round(temperature - 273.15);
    var image = myJson.weather[0].icon;
    var condition = myJson.weather[0].description;
    var pressure = myJson.main.pressure;
    var wind = myJson.wind.speed;
    var humidity = myJson.main.humidity;
    var clouds = myJson.clouds.all;

    $('#city3 .cityName').html(cityName);
    $('#city3 .temp').html(temperature+"&deg; C");
    $('#city3 .image').attr('src',`https://openweathermap.org/img/w/${image}.png`);
    $('#city3 .sunrise').html(moment.unix(myJson.sys.sunrise).format('HH:mm a'));
    $('#city3 .sunset').html(moment.unix(myJson.sys.sunset).format('HH:mm a'));
    $('#city3 .pressure').html(pressure);
    $('#city3 .wind').html(wind);   
    $('#city3 .humidity').html(humidity);
    $('#city3 .clouds').html(clouds);
    $('#city3 .condition').html(condition);
}