//Importación BBDD
const db = require("../models");
const peliculas = db.pelicula;
const Op = db.Sequelize.Op; //Importación de las funciones ORM de Sequelize.

const PeliculaController = {}; //Creación del objeto controlador



//Adquisición del listado de todas las películas
PeliculaController.getAll = (req, res) => {

    peliculas.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ha surgido algún error al intentar acceder a las películas."
        });
      });
  };

//-------------------------------------------------------------------------------------

//Adquisición de las películas por ID
PeliculaController.getById = (req, res) => {
  const id = req.params.id;

  peliculas.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No existe la película con el id ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ha surgido algún error al intentar acceder a la película con el id " + id + "."
      });
    });
};

//-------------------------------------------------------------------------------------

//Obtención de las peliculas por su título
PeliculaController.getByTitulo = (req, res) => {

  let titulo = req.params.titulo;
  
  peliculas.findAll( {where: {titulo: titulo}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha surgido algún error al intentar acceder a las películas."
      });
    });
};

//-------------------------------------------------------------------------------------

//Obtención de las películas por ciudad
PeliculaController.getByCity = (req, res) => {

  let ciudad = req.params.ciudad;
  
  peliculas.findAll( {where: {ciudad: ciudad}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha surgido algún error al intentar acceder a las películas."
      });
    });
};

//-------------------------------------------------------------------------------------

//Obtención de pelicula por relación con la ciudad y la disponibilidad para ser alquilada
PeliculaController.getByCityAndRented = (req, res) => {

  let ciudad = req.params.ciudad;
  let rented = req.params.alquilada
  
  peliculas.findAll( {where: {ciudad: ciudad, alquilada: rented}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha surgido algún error al intentar acceder a las películas."
      });
    });
};

//-------------------------------------------------------------------------------------

//Obtención de película por género
PeliculaController.getByGenre = (req, res) => {

  let genre = req.params.genero;
  
  peliculas.findAll( {where: {genero: genre}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha surgido algún error al intentar acceder a las películas."
      });
    });
};

//-------------------------------------------------------------------------------------

//Adquisición de película por actor principal
PeliculaController.getByMainCharacter = (req, res) => {

  let actor = req.params.actor_principal;
  
  peliculas.findAll( {where: {actor_principal: actor}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha surgido algún error al intentar acceder a las películas."
      });
    });
};

//-------------------------------------------------------------------------------------

//Creación nueva película
PeliculaController.create = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Conceder permisos únicamente al administrador
    
          if (!req.body.titulo) {
            res.status(400).send({
              message: "El contenido no puede estar vacío"
            });
            return;
          }
          
          const nuevaPelicula = {
            titulo: req.body.titulo,
            genero: req.body.genero,
            actor_principal: req.body.actor_principal,
            ciudad: req.body.ciudad,
            alquilada: req.body.alquilada
          };
          
          peliculas.create(nuevaPelicula)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Ha surgido algún error al intentar crear la película."
              });
            });
  }else{
    res.send({
      message: `No tienes permisos para borrar peliculas. Contacta con un administrador.`
    });
  }
};

//-------------------------------------------------------------------------------------

//Actualización de película ya existente
PeliculaController.update = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Actualización permitida únicamente al administrador

          const id = req.params.id;

          peliculas.update(req.body, {
            where: { id: id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "La película ha sido actualizada correctamente."
                });
              } else {
                res.send({
                  message: `No se ha podido actualizar la película con el id ${id}`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Ha surgido algún error al intentar actualizar la película con el id " + id + "."
              });
            });
  }else{
    res.send({
      message: `No tienes permisos para actualizar la información de la película. Contacta con un administrador.`
    });
  }
};

//-------------------------------------------------------------------------------------

//Borrado de película con búsqueda por ID
PeliculaController.delete = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Permiso de borrado único para el administrador

        const id = req.params.id;

        peliculas.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: `La película con id ${id} ha sido eliminada correctamente.`
                    });
                } else {
                    res.send({
                        message: `No se ha podido eliminar la película con id ${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Ha surgido algún error al intentar borrar la película con el id " + id
                });
            });
  }else{
    res.send({
      message: `No tienes permisos para borra la película. Contacta con un administrador.`
    });
  }
};

//-------------------------------------------------------------------------------------

module.exports = PeliculaController;