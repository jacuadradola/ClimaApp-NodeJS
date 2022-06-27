require('dotenv').config();

require('colors');

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');

const main = async () => {

    const busquedas = new Busquedas();
    
    let opt;

    do {

        opt = await  inquirerMenu();
        
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ')
                
                //Buscar los lugares
                const lugares = await busquedas.ciudad( termino );
                
                //Seleccionar el lugar
                const idSeleccionado = await listarLugares( lugares );
                if ( idSeleccionado === 0 ) continue;
                
                const { nombre, lat, lng } = lugares.find( l => l.id == idSeleccionado)
                
                //Guardar en DB
                busquedas.agregarHistorial( nombre );

                // Clima
                const { desc, min, max, temp }  = await busquedas.climaLugar(lat, lng);

                //Mostrar resultados

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', nombre.green);
                console.log('Lat: ', lat);
                console.log('Lng: ', lng);
                console.log('Temperatura: ', temp +'°'.green);
                console.log('Mínima: ', min);
                console.log('Máxima: ', max);
                console.log('Descripción del clima: ', desc.green);

            break;
        
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })
            break;
        }

        if( opt !== 0 ) await pausa() ;
        
    } while (opt !== 0);
}
main();