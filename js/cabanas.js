var urlRest = 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/cabin/cabin';
$(document).ready(function(){
    cargarTablaCabanas();
    
});

$('#formulario-cabana').on("click", function(event){
    event.preventDefault();//evitamos que el formulario se nos recargue automaticamente
});

function cargarTablaCabanas(){//METODO GET PARA MOSTRAR LA TABLA CON TODOS LOS REGISTROS
    $.ajax({
        url: urlRest,
        type: 'GET',
        datatype: 'JSON',
        success: function(response){
            var myItems = response.items;
            var array = '';
            for(i=0; i<myItems.length; i++){//Este Ciclo FOR llena la tabla en la pagina web
                //Cada vuelta del ciclo FOR pinta una fila <tr> table row
                array += '<tr>'+
                    '<td width="7%" align="center">' + myItems[i].id + '</td>' + 
                    '<td width="20%" align="center">' + myItems[i].brand + '</td>' + 
                    '<td width="11%" align="center">' + myItems[i].rooms + '</td>' + 
                    '<td width="12%" align="center">' + myItems[i].category_id + '</td>' +
                    '<td width="35%" align="center">' + myItems[i].name + '</td>' +
                    
                    '<td  align="center">' + '<button class="btn btn-warning" onclick="detallesCabana(' + myItems[i].id + ')">Editar</button>' + '</td>'+
                '</tr>'
            }
            $('#bodyTablaCabanas').html(array);
        }
    });
}

function detallesCabana(idCabana){//Consulta GET por ID
    $.ajax({
        url: 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/cabin/cabin/'+idCabana,
        type: 'GET',
        datatype: 'JSON',
        success: function(response){
            var myItems = response.items[0];
            
            //PONEMOS LA INFORMACION DE LA CABANA EN EL FORMULARIO 
            //DESAPARECEMOS EL BOTON [CREAR]
            //ADICIONAMOS UN PAR DE BOTONES [BORRAR] [EDITAR]
            //INHABILITAMOS EL JTEXTFIELD [ID]
            
            $('#myid').val(myItems.id);
            $('#brand').val(myItems.brand);
            $('#rooms').val(myItems.rooms);
            $('#category_id').val(myItems.category_id);
            $('#name').val(myItems.name);

            //INHABILITAMOS EL JTEXTFIELD [ID]
            //INHABILITAMOS EL JTEXTFIELD [consulta*ID]
            //INHABILITAMOS EL BOTON CONSULTAR * ID
            $('#myid').prop('disabled', true);
            $('#consultaxid').prop('disabled', true);
            $('#btnConsultar').prop('disabled', true);


            //ADICIONAMOS UN TRES BOTONES EN UNA CAJA [BORRAR] [EDITAR] [LIMPIAR]
            var setBotones = '<br>' +  '<div class="col-7" align="center">' + 
            '<input id="btnActualizar" type="submit" onclick="actualizarCabana('+ myItems.id +')" value="Actualizar" class="btn btn-warning">'
            + '&nbsp' +
            '<input id="btnBorrar" type="submit" onclick="borrarCabana('+ myItems.id +')" value="Borrar" class="btn btn-danger">'
            + '&nbsp' +
            '<input id="btnLimpiar" type="submit" onclick="limpiarCamposFormulario() ; habilitarBotonesIniciales()" value="Limpiar" class="btn btn-primary">' +
            '</div>';
            //var btnEditar = '<input id="btnActualizar" type="submit" onclick="actualizarCabana()" value="Actualizar" class="btn btn-warning">'; 
            //var btnBorrar = '<input id="btnBorrar" type="submit" onclick="borrarCabana()" value="Borrar" class="btn btn-danger">'; 

            //DESPUES DE CREAR LOS NUEVOS BOTONES - LOS PINTAMOS EN PANTALLA
            $('#btnFormularioCabana').html(setBotones);
        }
    });


}

function detalleConsultaxID(){
    var idCabana = Number(document.getElementById('consultaxid').value);
    
    if(idCabana==""){
        alert("WARNING: Todos los campos son obligatorios");
    }else{
        detallesCabana(idCabana);
    }
    
}

function actualizarCabana(idCabana){ //METODO PUT PARA CREAR NUEVA CABANA

    if(document.getElementById('myid').value=="" || 
        document.getElementById('brand').value=="" || 
            document.getElementById('rooms').value=="" || 
                document.getElementById('category_id').value=="" || 
                    document.getElementById('name').value==""){

                        alert("WARNING: Todos los campos son obligatorios");
    }else{

        var datosFormularioCabana = {
            id: idCabana,
            brand: $('#brand').val(),
            rooms: $('#rooms').val(),
            category_id: $('#category_id').val(),
            name: $('#name').val()
        };

        var datosFormularioCabana_JSON = JSON.stringify(datosFormularioCabana);//SE CASTEA A JSON

        $.ajax({
            url: urlRest,
            type: 'PUT',
            data: datosFormularioCabana_JSON,
            datatype: 'JSON',
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                cargarTablaCabanas();
                limpiarCamposFormulario(); //LIMPIA TODOS LAS CAJAS DE TEXTO
            }   
        });
        habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
    }
}

function crearNewCabana(){//METODO POST PARA CREAR NUEVA CABANA
    
    if(document.getElementById('myid').value=="" || 
        document.getElementById('brand').value=="" || 
            document.getElementById('rooms').value=="" || 
                document.getElementById('category_id').value=="" || 
                    document.getElementById('name').value==""){

                        alert("WARNING: Todos los campos son obligatorios");
    }else{

        var datosNewCabana = {
            id: $('#myid').val(),
            brand: $('#brand').val(),
            rooms: $('#rooms').val(),
            category_id: $('#category_id').val(),
            name: $('#name').val()
        };

        var datosNewCabana_JSON = JSON.stringify(datosNewCabana);

        $.ajax({
            url: urlRest,
            type: 'POST',
            datatype: 'JSON',
            data: datosNewCabana_JSON,
            contentType: 'application/json',
            success: function(response){
                console.log(response); //Respuesta o registro en consola
                cargarTablaCabanas();//Vuelve a recargar la tabla con todas las cabanas incluyendo el nuevo registro
                limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
            }
        });
    }
}

function borrarCabana(idCabana){//METODO DELETE - SOLO SE REQUIERE EL ID
    var idFormularioCabana = {
        id: idCabana 
    };

    var idFormularioCabana_JSON = JSON.stringify(idFormularioCabana);

    $.ajax({
        url: urlRest,
        type: 'DELETE',
        data: idFormularioCabana_JSON,
        dataType: 'JSON',
        contentType: 'application/json',
        success: function(response){
            console.log(response);
            cargarTablaCabanas();
            limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
        }
    });
    habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
}

function habilitarBotonesIniciales(){//SE ENCARGA DE HABILITAR NUEVAMENTE LOS BOTONES INICIALES
    $('#myid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD ID
    $('#consultaxid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD CONSULTAR*ID
    $('#btnConsultar').prop('disabled', false);//VUELVE Y HABILITA EL BOTON CONSULTAR
    var btnCrear = '<br>' + '<input id="btnCrearCabana" type="submit" onclick="crearNewCabana()" value="Crear" class="btn btn-primary">';
    $('#btnFormularioCabana').html(btnCrear); //VUELVE Y PINTA EL BOTON CREAR
}

function limpiarCamposFormulario(){
    $('#formulario-cabana')[0].reset();
    $('#formulario-busquedaId')[0].reset();
}