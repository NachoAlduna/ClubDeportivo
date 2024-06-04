const express = require('express')
const app = express()
const fs = require('fs');


app.use(express.json());


app.listen(3000, () => {
console.log('El servidor está inicializado en el puerto 3000')
})
app.get("/", (req, res) => {
res.sendFile(__dirname + '/index.html')
})

app.get('/deportes', (req, res) => {
  //Lee el json
  fs.readFile('assets/JSON/deportes.json', 'utf8', (err, data) => {
    //Control de errores.
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.status(500).json({ error: 'Error al leer el archivo' });
      return;
    }
    const deportes = JSON.parse(data);
    res.json({ deportes });
  });
});

//Ruta para agregar datos.
app.get('/agregar', (req, res) => {
  const { nombre, precio } = req.query;
  const nuevoDeporte = {
    nombre: nombre,
    precio: precio
  };

  try {
    const data = JSON.parse(fs.readFileSync('assets/JSON/deportes.json', 'utf8'));
    data.push(nuevoDeporte);
    fs.writeFileSync('assets/JSON/deportes.json', JSON.stringify(data));
    res.send('Deporte agregado con éxito');
  } catch (error) {
    console.error('Error al agregar el deporte:', error);
    res.status(500).send('Error interno del servidor');
  }
});
//Ruta para editar el precio
app.get('/editar', (req, res) => {
  const { nombre, precio } = req.query;

  fs.readFile('assets/JSON/deportes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.status(500).json({ error: 'Error al leer el archivo' });
      return;
    }

    try {
      let deportes = JSON.parse(data);
      const index = deportes.findIndex(d => d.nombre === nombre);

      if (index !== -1) {
        deportes[index].precio = precio;
        fs.writeFile('assets/JSON/deportes.json', JSON.stringify(deportes, null, 2), err => {
          if (err) {
            console.error('Error al escribir en el archivo:', err);
            res.status(500).send('Error interno del servidor');
            return;
          }
          res.send('Deporte editado');
        });
      } else {
        res.send('Deporte no encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Hubo un error al editar');
    }
  });
});
//Ruta para eliminar
app.get('/eliminar', (req, res) => {
  const { nombre } = req.query;

  fs.readFile('assets/JSON/deportes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.status(500).json({ error: 'Error al leer el archivo' });
      return;
    }

    try {
      let deportes = JSON.parse(data);
      const index = deportes.findIndex(d => d.nombre === nombre);

      if (index !== -1) {
        deportes.splice(index, 1);
        fs.writeFile('assets/JSON/deportes.json', JSON.stringify(deportes, null, 2), err => {
          if (err) {
            console.error('Error al escribir en el archivo:', err);
            res.status(500).send('Error interno del servidor');
            return;
          }
          res.send('Deporte eliminado');
        });
      } else {
        res.send('Deporte no encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Hubo un error al borrar');
    }
  });
});