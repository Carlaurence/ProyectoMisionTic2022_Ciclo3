#Metodo_GET
SELECT * FROM Cliente ORDER BY ID ASC;

#Metodo_POST
BEGIN
    INSERT INTO Cliente(id, name, email, age) VALUES(:id, :name, :email, :age);
    :status_code:=201;
END;

#Metodo_PUT
BEGIN
    UPDATE Cliente SET id=:id, name=:name, email=:email, age=:age WHERE id=:id;
    :status_code:=201;
END;

#Metodo_DELETE
BEGIN
    DELETE FROM Cliente WHERE id=:id;
    :status_code:=204;
END;

#Metodo_GET x id
SELECT * FROM Cliente WHERE id=:id