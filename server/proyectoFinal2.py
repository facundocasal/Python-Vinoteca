import mysql.connector
from flask import Flask , request , jsonify
from flask_cors import CORS

class User : 
    def __init__(self ,host , user , password , database) :
            try:
                # conectamos sql
                self.conn = mysql.connector.connect(
                    host = host, 
                    user = user,
                    password = password 
                )
                self.cursor = self.conn.cursor(dictionary=True)
            except Exception as error :
                print(error)
                return
                # intentamos usar la base si no esta creada pero si no esta creada la creamos  
            try:
                self.cursor.execute(f"USE {database}")
            except mysql.connector.Error as error:
                if error.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                    self.cursor.execute(f"CREATE DATABASE {database}")
                    self.conn.database = database
                else : 
                    raise error

            # creamos la tabla usuarios 
            self.cursor.execute(""" CREATE TABLE IF NOT EXISTS Usuarios (
                                    id INT NOT NULL AUTO_INCREMENT, 
                                    name VARCHAR(100) NOT NULL,
                                    lastName VARCHAR(100) NOT NULL,
                                    email VARCHAR(150) NOT NULL ,
                                    password VARCHAR(150) NOT NULL,
                                    PRIMARY KEY (id)
                                    )
                                """)
            print("Conexión establecida")
            self.conn.commit()

    # crear ususario
    def createUser(self , name , lastName , email, password) : 
        self.cursor.execute(f"SELECT * FROM usuarios WHERE email = '{email}'")
        usuarioExistente = self.cursor.fetchone()
        if usuarioExistente: 
            return "Email ya utilizado"
        self.cursor.execute(f"INSERT INTO usuarios (name , lastName , email , password) VALUES ('{name}','{lastName}','{email}','{password}')")
        self.conn.commit()
        return True

    # login de usuario
    def login(self , email , password) : 
        self.cursor.execute(f'SELECT * FROM usuarios WHERE email = "{email}"')
        usuario = self.cursor.fetchone()
        if usuario:
            if usuario["password"] == password:
                return usuario["id"]
            else: 
                return False
        else: 
            return False
    
    # consulatamos el usuario por su id y retornamos el usuario con todos sus atributos
    def infoUser(self , id):
        self.cursor.execute(f'SELECT * FROM usuarios WHERE id = {id}')
        usuario = self.cursor.fetchone()
        if usuario : 
            return usuario
        else:
            return False
    
    # modificamos el usuario 
    def updateUser (self , id ,  name, lastName , email, password  ):
        self.cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
        usuario = self.cursor.fetchone()
        if name == "" : 
            name = usuario["name"]
        if lastName == "" :
            lastName = usuario["lastName"]
        if email == "" : 
            email = usuario["email"]
        if password == "" :
            password = usuario["password"]

        if usuario:
            self.cursor.execute('UPDATE usuarios SET name = %s , lastName = %s , email = %s , password = %s WHERE id = %s ',(name, lastName, email, password, id))
            self.conn.commit()
            return True
        else :
            return False
    
    # eliminar usuario 
    def deleteUser (self, id ) :
        self.cursor.execute(f"SELECT * FROM usuarios WHERE id = {id}")
        usuario = self.cursor.fetchone()
        if usuario :
            self.cursor.execute(f"DELETE FROM usuarios WHERE id = {id}")
            self.conn.commit()
            # aca se podria devolve True y que el mensaje sea devuelto por la ruta 
            return True
        else: 
            # aca se podria devolve False y que el mensaje sea devuelto por la ruta 
            return False

    def __del__(self) : 
        if self.conn: 
            self.conn.close()


Lista_usuarios = User("localhost", "root", "", "vinoTeca")

app = Flask(__name__)
CORS(app)

# home 
@app.route("/" , methods=["GET"])
def home ():
    return "<h1>Holaa</h1>" 

# Create user 
@app.route("/createUser", methods=["POST"])
def createUser () :
    try: 
        datos_json = request.get_json()
        name = datos_json.get('name')
        lastName = datos_json.get('lastName')
        email = datos_json.get('email')
        password = datos_json.get('password')
        usuario = Lista_usuarios.createUser(name , lastName , email , password)
        if usuario == "Email ya utilizado" :
            return jsonify({"response" : usuario}) , 200
        else :
            return jsonify({"response" :"Usuario Creado con exito "}) , 200
    except Exception as error: 
        print(error)
        return jsonify({"response" : "error al crear usuario"}) , 400

@app.route("/login" , methods=["POST"])
def loginUser ():
    try:
        datos_json = request.get_json()
        email = datos_json.get('email')
        password = datos_json.get('password')
        idUser = Lista_usuarios.login(email , password)
        if idUser : 
            return jsonify({"id": idUser}) , 200
        else :
            return jsonify({"response" : "Credenciales incorrectas"}) , 400
    except: 
        return jsonify({"response" :"Error en login"}) , 505


# Delete user 
@app.route("/deleteUser/<id>", methods=["DELETE"])
def deleteUser (id) :
    try:
        respond = Lista_usuarios.deleteUser(id)
        if respond :
            return jsonify({"response" : f"Registro con id : {id} eliminado exitosamente."}) , 200
        else: 
            return jsonify({"response" : f"No se ha podido eliminar el registro con el id: {id} "}) , 505
    except:
        return jsonify({"response" : "error al intentar borrar usuario"})

# get user 
@app.route("/getUser/<id>", methods=["GET"])
def getUser (id): 
    try: 
        user = Lista_usuarios.infoUser(id)
        if user : 
            return jsonify(user) , 200
        else :
            return jsonify({"response" : "Usuario no encontrado"}) , 404
    except : 
        jsonify({"response" : "error al buscar usuario "})

# update user 
@app.route("/updateUser/<id>", methods=["PUT"])
def updateUser (id): 
    try:
        datos_json = request.get_json()
        name = datos_json.get('name')
        lastName = datos_json.get('lastName')
        email = datos_json.get('email')
        password = datos_json.get('password')
        user = Lista_usuarios.updateUser(id, name , lastName , email , password)
        if user : 
            return jsonify({"response" :"usuario modificado"}) , 200
        else :
            return jsonify({"response" : f"usuario con id : {id}, no pudo ser modificado "}) , 505
    except: 
        jsonify({"response" :"error al modificar usuario id: {id}"})

if __name__ == "__main__":
    app.run(debug=True)