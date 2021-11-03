const { pedido } = require('../models/index');
const { pelicula } = require('../models/index');
const { usuario } = require('../models/index');

var peliculaModel  = require('../models').pelicula; //Mostramos los datos de las peliculas adjuntando el modelo pelicula en una variable.

var usuarioModel  = require('../models').usuario; //Mostramos los datos de los usuarios adjuntando el modelo usuario en una variable.

const PedidoController = {};


//Recibimos listado de todos los pedidos
PedidoController.getAll = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Damos permiso de borrado únicamente al administrador
  
          pedido.findAll({include: [{ model:peliculaModel}, {model:usuarioModel}]})
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Ha surgido algún error al intentar acceder a los pedidos."
              });
            });
  }else{
    res.send({
      message: `No tienes permisos para ver todos los pedidos. Contacta con un administrador.`
    });
  }
};

//-------------------------------------------------------------------------------------

//Creación nuevo pedido
//Comprobación de que la pelicula y la ciudad del usuario es la misma, posteriormente una comprobación del estado (alquilada o no) de la película.
PedidoController.create = (req, res) => {

  if (req.user.usuario.rol == "administrador" || req.user.usuario.id == req.body.usuarioId) {// Damos permiso de borrado únicamente al administrador

                //Comprobación del estado del Body
                if (!req.body) {
                  res.status(400).send({
                    message: "El contenido no puede estar vacío."
                  });
                  return;
                }

                //Comprobación de que la pelicula esté en la misma ciudad que el usuario

                //Búsqueda de la ciudad en relación con la película
                var ciudadUsuarioBuscado = "a";

                usuario.findByPk(req.body.usuarioId)
                  .then(data => {
                    if (data) {
                      ciudadUsuarioBuscado = data.ciudad;
                      usuarioBuscado = data;
                    } else {
                      res.status(404).send({
                        message: `No se puede encontrar la película con el id ${id}.`
                      });
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Ha surgido algún error al intentar acceder a la Usuario con el id " + id
                    });
                  });

              //Búsqueda ciudad de usuario
                var peliculaBuscada = "q";
                var ciudadPeliculaBuscada = "b";
                pelicula.findByPk(req.body.peliculaId)
                  .then(data => {
                    
                    //Comprobación de que haya relación entre película y ciudad y que la película no esté alquilada
                    if (data) {
                      peliculaBuscada = data;
                      ciudadPeliculaBuscada = data.ciudad;
                    }
                    if (ciudadPeliculaBuscada == ciudadUsuarioBuscado && data.alquilada == false) {
                        const nuevoPedido = {
                          peliculaId: req.body.peliculaId,
                          usuarioId: req.body.usuarioId,
                          fecha_alquiler: req.body.fecha_alquiler,
                          fecha_devolucion: req.body.fecha_devolucion
                        };
                        pedido.create(nuevoPedido)
                          .then(data => {
                            res.send(data);
                            peliculaBuscada.alquilada = true;
                            console.log(peliculaBuscada.alquilada);
                            pelicula.update( {alquilada: true},{ where: { id: peliculaBuscada.id }})
                              .then(num => {
                                if (num == 1) {
                                  // res.send({
                                  //   message: ""
                                  // });
                                } else {
                                  // res.send({
                                  //   message: ``
                                  // });
                                }
                              })
                              .catch(err => {
                                res.status(500).send({
                                  message: "Ha surgido algún error al intentar crear el pedido."
                                });
                              });
                          })
                          .catch(err => {
                            res.status(500).send({
                              message:
                                err.message || "Ha surgido algún error al intentar crear un pedido."
                            });
                          });
                    } else {
                      if (ciudadPeliculaBuscada != ciudadUsuarioBuscado) {
                        res.status(404).send({
                          message: `El usuario y la película no se encuentran en la misma ciudad.`
                        });
                      }else{
                        res.status(404).send({
                          message: `La película ya está alquilada.`
                        });
                      }
                      
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Ha surgido algún error al intentar acceder al usuario con el id " + req.body.usuarioId
                    });
                  });
  }else{
    res.send({
      message: `No tienes permisos para crear el pedido.`
    });
  }
};

//-------------------------------------------------------------------------------------

//Borrado de pedido
PedidoController.delete = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Permiso de borrado únicamente al administrador

        const id = req.params.id;

        let idPelicula = 0;
      
        //Búsqueda del pedido que queremos eliminar y extraemos la pelicula guardada en el pedido
        pedido.findByPk(id)
              .then(data => {
                  if (data) {
                      idPelicula = data.peliculaId
                      res.send(data);
                  } else {
                      res.status(404).send({
                          message: `No se puede encontrar el pedido con el id ${id}.`
                      });
                  }
              })
              .catch(err => {
                  res.status(500).send({
                      message: "Ha surgido algún error al intentar acceder al pedido con el id " + id
                  });
              });

        //Eliminación del pedido
        pedido.destroy({ where: { id: id }})
            .then(num => {
                if (num == 1) {
                        pelicula.update( {alquilada: false},{ where: { id: idPelicula }}) //Actualización de película para poder volverla a activar
                        .then(num => {
                          if (num == 1) {
                            // res.send({
                            //   message: ""
                            // });
                          } else {
                            // res.send({
                            //   message: ``
                            // });
                          }
                        })
                        .catch(err => {
                          res.status(500).send({
                            message: "Ha surgido algún error al intentar crear el pedido."
                          });
                        });
                    res.send({
                      message: `El pedido con id ${id} ha sido eliminada correctamente.`
                  });
                } else {
                    res.send({
                        message: `No se ha podido eliminar el pedido con id ${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Ha surgido algún error al intentar borrar el pedido con el id " + id
                });
            });
  }else{
    res.send({
      message: `No tienes permisos para borrar el pedido. Contacta con un administrador.`
    });
  }
};

module.exports = PedidoController;