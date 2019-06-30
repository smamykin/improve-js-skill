fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        const usd = myJson['Valute']['USD'],
            eur = myJson['Valute']['EUR'];
        document.querySelector('.js-currencies').innerHTML = `${usd['Name']}: ${usd['Value'].toFixed(2)}; ${eur['Name']}: ${eur['Value'].toFixed(2)}`;
    })
    .catch(function(reason){
        console.error(reason)
    });
