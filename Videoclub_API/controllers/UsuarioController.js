const { usuario } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const UsuarioController = {};


//Gestión login de usuarios
UsuarioController.signIn = (req, res) => {

    let correo = req.body.correo;
    let clave = req.body.clave;

    usuario.findOne({
        where: { correo: correo }
    }).then(usuario => {
        if (!usuario) {
            res.status(404).json({ msg: "Usuario con este correo no encontrado" });
        } else {
            if (bcrypt.compareSync(clave, usuario.clave)) { //Después de desincriptar compara la contraseña introducida con la guardada
                let token = jwt.sign({ usuario: usuario }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                res.json({
                    usuario: usuario,
                    token: token
                })
            } else {
                res.status(401).json({ msg: "Contraseña incorrecta" })
            }
        }
    }).catch(err => {
        res.status(500).json(err);
    })
};

//-------------------------------------------------------------------------------------

//Gestión del registro de usuarios
UsuarioController.signUp = (req, res) => { 

    if (req.user.usuario.rol == "administrador") {//Comprobación del log como administrador

          let clave = req.body.clave;

          if (clave.length >= 8) {//Encriptación de la contraseña teniendo esta 8 carácteres como mínimo
            var password = bcrypt.hashSync(req.body.clave, Number.parseInt(authConfig.rounds));   

            usuario.create({
                nombre: req.body.nombre,
                correo: req.body.correo,
                clave: password,
                ciudad: req.body.ciudad,
                rol: req.body.ciudad
            }).then(usuario => {
                let token = jwt.sign({ usuario: usuario }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                res.json({
                    usuario: usuario,
                    token: token
                });
            }).catch(err => {
                res.status(500).json(err);
            });
          }else{
            res.send({
              message: `La contraseña tiene que tener un mínimo de 8 caracteres. ${clave}`
          });
          }
    }else{
      res.send({
        message: `No tienes permisos para registrar usuarios. Contacta con un administrador.`
      });
    }

    

};

//-------------------------------------------------------------------------------------

//Obtención de listado de todos los usuarios



UsuarioController.getAll = (req, res) => {
  
    if (req.user.usuario.rol == "administrador") {//Comprobación del logado como administrador

            usuario.findAll()
              .then(data => {
                res.send(data);
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Ha surgido algún error al intentar acceder a los usuarios."
                });
              });
    }else{
      res.send({
        message: `No tienes permisos para visualizar a todos los usuarios. Contacta con un administrador.`
      });
    }
  };

//-------------------------------------------------------------------------------------

//Obtención de un único usuario mostrado por ID
UsuarioController.getById = (req, res) => {

    const id = req.params.id;

    if (req.user.usuario.rol == "administrador" || req.user.usuario.id == id) {// Vista única para el administrador y el usuario dueñx del perfil

        usuario.findByPk(id)
            .then(data => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `No se puede encontrar el usuario con el id ${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Ha surgido algún error al intentar acceder al usuario con el id " + id
                });
            });
    }else{
      res.send({
        message: `No tienes permisos para acceder al perfil indicado.`
      });
    }
};

//-------------------------------------------------------------------------------------

UsuarioController.update = (req, res) => {

        const id = req.params.id;

        if (req.user.usuario.rol == "administrador" || req.user.usuario.id == id) {// Actualización única para el administrador o usuario dueñx del perfil

              
            
              usuario.update(req.body, {
                where: { id: id }
              })
                .then(num => {
                  if (num == 1) {
                    res.send({
                      message: "El usuario ha sido actualizado correctamente."
                    });
                  } else {
                    res.send({
                      message: `No se ha podido actualizar el usuario con el id ${id}`
                    });
                  }
                })
                .catch(err => {
                  res.status(500).send({
                    message: "Ha surgido algún error al intentar actualizar el usuario con el id " + id + "."
                  });
                });
        }else{
          res.send({
            message: `No tienes permisos para modificar el perfil indicado.`
          });
        }
};

//Borrado a usuario o buscado por ID
UsuarioController.delete = (req, res) => {

    const id = req.params.id;

    if (req.user.usuario.rol == "administrador" || req.user.usuario.id == id) {// Eliminación única permitada a administrador o usuario dueñx del perfil

            usuario.destroy({
                where: { id: id }
            })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: `El usuario con id ${id} ha sido eliminado correctamente.`
                        });
                    } else {
                        res.send({
                            message: `No se ha podido eliminar el usuario con id ${id}.`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Ha surgido algún error al intentar borrar el usuario con el id " + id
                    });
                });
    }else{
      res.send({
        message: `No tienes permisos para borrar el perfil indicado.`
      });
    }
};

//-------------------------------------------------------------------------------------

//Borrado de todos los usuarios
UsuarioController.deleteAll = (req, res) => {

  if (req.user.usuario.rol == "administrador") {// Permiso único de borrado para el administrador

              usuario.destroy({
                where: {},
                truncate: false
              })
                .then(nums => {
                  res.send({ message: `Se han borrado ${nums} usuarios de la base de datos` });
                })
                .catch(err => {
                  res.status(500).send({
                    message:
                      err.message || "Ha surgido algún error al intentar eliminar a los usuarios."
                  });
                });
  }else{
    res.send({
      message: `No tienes permisos para borrar usuarios. Contacta con un administrador.`
    });
  }
};

module.exports = UsuarioController;

