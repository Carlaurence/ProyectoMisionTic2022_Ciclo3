#Metodo_GET
SELECT * FROM Mensaje ORDER BY ID ASC;

#Metodo_POST
BEGIN
    INSERT INTO Mensaje(id, messagetext) VALUES(:id, :messagetext);
    :status_code:=201;
END;

#Metodo_PUT
BEGIN
    UPDATE Mensaje SET id=:id, messagetext=:messagetext WHERE id=:id;
    :status_code:=201;
END;

#Metodo_DELETE
BEGIN
    DELETE FROM Mensaje WHERE id=:id;
    :status_code:=204;
END

#Metodo_Get x id
SELECT * FROM Mensaje WHERE id=:id
