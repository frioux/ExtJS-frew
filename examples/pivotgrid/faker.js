//script used to generate data.json
(function() {
    function buildData(count) {
        count = count || 1000;
        
        var products = ['Ladder', 'Spanner', 'Chair', 'Hammer'],
            states   = ['CA', 'NY', 'UK', 'AZ', 'TX'],
            cities   = ['San Francisco', 'Palo Alto', 'London', 'Austin'],
            people   = ['Tommy Maintz', 'Abe Elias', 'Ed Spencer', 'Jamie Avins'],
            records  = [],
            i;
        
        for (i = 0; i < count; i++) {
            records.push({
                id      : i + 1,
                product : products[Math.floor(Math.random() * products.length)],
                city    : cities[Math.floor(Math.random() * cities.length)],
                state   : states[Math.floor(Math.random() * states.length)],
                quantity: Math.floor(Math.random() * 10000),
                value   : Math.floor(Math.random() * 50),
                month   : Math.ceil(Math.random() * 12),
                quarter : Math.ceil(Math.random() * 4),
                year    : 2010 - Math.floor(Math.random() * 2),
                person  : people[Math.floor(Math.random() * people.length)]
            });
        }
        
        return records;
    };
});