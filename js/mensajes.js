var urlRest = 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/message/message';
$(document).ready(function(){
    cargarTablaMensajes();
    
});

$('#formulario-mensaje').on("click", function(event){
    event.preventDefault();//evitamos que el formulario se nos recargue automaticamente
});

function cargarTablaMensajes(){//METODO GET PARA MOSTRAR LA TABLA CON TODOS LOS REGISTROS
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
                    '<td width="78%">' + myItems[i].messagetext + '</td>' + 
                    
                    '<td  align="center">' + '<button class="btn btn-warning" onclick="detallesMensaje(' + myItems[i].id + ')">Editar</button>' + '</td>'+
                '</tr>'
            }
            $('#bodyTablaMensajes').html(array);
        }
    });
}

function detallesMensaje(idMensaje){//Consulta GET por ID Y SE AUTORELLENA EL FORMULARIO
    $.ajax({
        url: 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/message/message/'+idMensaje,
        type: 'GET',
        datatype: 'JSON',
        success: function(response){
            var myItems = response.items[0];
            
            //PONEMOS LA INFORMACION DEL CLIENTE EN EL FORMULARIO 
            //DESAPARECEMOS EL BOTON [CREAR]
            //ADICIONAMOS UN PAR DE BOTONES [BORRAR] [EDITAR]
            //INHABILITAMOS EL JTEXTFIELD [ID]
            
            $('#myid').val(myItems.id);
            $('#messagetext').val(myItems.messagetext);

            //INHABILITAMOS EL JTEXTFIELD [ID]
            //INHABILITAMOS EL JTEXTFIELD [consulta*ID]
            //INHABILITAMOS EL BOTON CONSULTAR * ID
            $('#myid').prop('disabled', true);
            $('#consultaxid').prop('disabled', true);
            $('#btnConsultar').prop('disabled', true);


            //ADICIONAMOS UN TRES BOTONES EN UNA CAJA [BORRAR] [EDITAR] [LIMPIAR]
            var setBotones = '<br>' +  '<div class="col-7" align="center">' + 
            '<input id="btnActualizar" type="submit" onclick="actualizarMensaje('+ myItems.id +')" value="Actualizar" class="btn btn-warning">'
            + '&nbsp' +
            '<input id="btnBorrar" type="submit" onclick="borrarMensaje('+ myItems.id +')" value="Borrar" class="btn btn-danger">'
            + '&nbsp' +
            '<input id="btnLimpiar" type="submit" onclick="limpiarCamposFormulario() ; habilitarBotonesIniciales()" value="Limpiar" class="btn btn-primary">' +
            '</div>';

            //DESPUES DE CREAR LOS NUEVOS BOTONES - LOS PINTAMOS EN PANTALLA
            $('#btnFormularioMensaje').html(setBotones);
        }
    });
}

function detalleConsultaxID(){
    var idMensaje = Number(document.getElementById('consultaxid').value);
    
    if(idMensaje==""){
        alert("WARNING: Todos los campos son obligatorios");
    }else{
        detallesMensaje(idMensaje);
    }
}

function actualizarMensaje(idMensaje){//FUNCION PUT - ACTUALIZAR REGISTRO EXISTENTE

    if(document.getElementById('myid').value=="" || 
        document.getElementById('messagetext').value==""){
            alert("WARNING: Todos los campos son obligatorios");
    }else{
        var datosFormularioMensaje = {
            id: idMensaje,
            messagetext: $('#messagetext').val()
        };

        var datosFormularioMensaje_JSON = JSON.stringify(datosFormularioMensaje);//SE CASTEA A JSON

        $.ajax({
            url: urlRest,
            type: 'PUT',
            data: datosFormularioMensaje_JSON,
            datatype: 'JSON',
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                cargarTablaMensajes();
                limpiarCamposFormulario(); //LIMPIA TODOS LAS CAJAS DE TEXTO
            }   
        });
        habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
    }
}

function crearNewMensaje(){//METODO POST PARA CREAR NUEVO CLIENTE

    if(document.getElementById('myid').value=="" || 
        document.getElementById('messagetext').value==""){
            alert("WARNING: Todos los campos son obligatorios");
    }else{
        var datosNewMensaje = {
            id: $('#myid').val(),
            messagetext: $('#messagetext').val()
        };
        
        var datosNewMensaje_JSON = JSON.stringify(datosNewMensaje);

        $.ajax({
            url: urlRest,
            type: 'POST',
            datatype: 'JSON',
            data: datosNewMensaje_JSON,
            contentType: 'application/json',
            success: function(response){
                console.log(response); //Respuesta o registro en consola
                cargarTablaMensajes();//Vuelve a recargar la tabla con todas las cabanas incluyendo el nuevo registro
                limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
            }
        });
    }
}

function borrarMensaje(idMensaje){//METODO DELETE - SOLO SE REQUIERE EL ID
    var idFormularioMensaje = {
        id: idMensaje 
    };

    var idFormularioMensaje_JSON = JSON.stringify(idFormularioMensaje);

    $.ajax({
        url: urlRest,
        type: 'DELETE',
        data: idFormularioMensaje_JSON,
        dataType: 'JSON',
        contentType: 'application/json',
        success: function(response){
            console.log(response);
            cargarTablaMensajes();
            limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
        }
    });
    habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
}

function habilitarBotonesIniciales(){//SE ENCARGA DE HABILITAR NUEVAMENTE LOS BOTONES INICIALES
    $('#myid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD ID
    $('#consultaxid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD CONSULTAR*ID
    $('#btnConsultar').prop('disabled', false);//VUELVE Y HABILITA EL BOTON CONSULTAR
    var btnCrear = '<br>' + '<input id="btnCrearMensaje" type="submit" onclick="crearNewMensaje()" value="Crear" class="btn btn-primary">';
    $('#btnFormularioMensaje').html(btnCrear); //VUELVE Y PINTA EL BOTON CREAR
}

function limpiarCamposFormulario(){
    $('#formulario-mensaje')[0].reset();
    $('#formulario-busquedaId')[0].reset();
}