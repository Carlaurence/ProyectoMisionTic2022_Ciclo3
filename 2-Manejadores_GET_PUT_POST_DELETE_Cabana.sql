#GETT:
SELECT * FROM Cabana ORDER BY ID ASC;


#POST:
BEGIN
    INSERT INTO Cabana(id, brand, rooms, category_id, name) VALUES(:id, :brand, :rooms, :category_id, :name);
    :status_code:=201;
END;

#PUT
BEGIN
    UPDATE Cabana SET id=:id, brand=:brand, rooms=:rooms, category_id=:category_id, name=:name WHERE id=:id;
    :status_code:=201;
END;

#DELETEE
BEGIN
    DELETE FROM Cabana WHERE id=:id;
    :status_code:=204;
END;

#GETT BYY ID:
SELECT * FROM Cabana WHERE id=:id


