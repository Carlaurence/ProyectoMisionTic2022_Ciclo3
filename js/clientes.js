var urlRest = 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/client/client';
$(document).ready(function(){
    cargarTablaClientes();
    
});

$('#formulario-cliente').on("click", function(event){
    event.preventDefault();//evitamos que el formulario se nos recargue automaticamente
});

function cargarTablaClientes(){//METODO GET PARA MOSTRAR LA TABLA CON TODOS LOS REGISTROS
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
                    '<td width="36%" align="center">' + myItems[i].name + '</td>' + 
                    '<td width="35%" align="center">' + myItems[i].email + '</td>' + 
                    '<td width="7%" align="center">' + myItems[i].age + '</td>' +
                    
                    '<td  align="center">' + '<button class="btn btn-warning" onclick="detallesCliente(' + myItems[i].id + ')">Editar</button>' + '</td>'+
                '</tr>'
            }
            $('#bodyTablaClientes').html(array);
            
        }
    });
}

function detallesCliente(idCliente){//Consulta GET por ID Y SE AUTORELLENA EL FORMULARIO
    $.ajax({
        url: 'https://g72138072ee9e29-reto1.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/client/client/'+idCliente,
        type: 'GET',
        datatype: 'JSON',
        success: function(response){
            var myItems = response.items[0];
            
            //PONEMOS LA INFORMACION DEL CLIENTE EN EL FORMULARIO 
            //DESAPARECEMOS EL BOTON [CREAR]
            //ADICIONAMOS UN PAR DE BOTONES [BORRAR] [EDITAR]
            //INHABILITAMOS EL JTEXTFIELD [ID]
            
            $('#myid').val(myItems.id);
            $('#name').val(myItems.name);
            $('#email').val(myItems.email);
            $('#age').val(myItems.age);

            //INHABILITAMOS EL JTEXTFIELD [ID]
            //INHABILITAMOS EL JTEXTFIELD [consulta*ID]
            //INHABILITAMOS EL BOTON CONSULTAR * ID
            $('#myid').prop('disabled', true);
            $('#consultaxid').prop('disabled', true);
            $('#btnConsultar').prop('disabled', true);


            //ADICIONAMOS UN TRES BOTONES EN UNA CAJA [BORRAR] [EDITAR] [LIMPIAR]
            var setBotones = '<br>' +  '<div class="col-7" align="center">' + 
            '<input id="btnActualizar" type="submit" onclick="actualizarCliente('+ myItems.id +')" value="Actualizar" class="btn btn-warning">'
            + '&nbsp' +
            '<input id="btnBorrar" type="submit" onclick="borrarCliente('+ myItems.id +')" value="Borrar" class="btn btn-danger">'
            + '&nbsp' +
            '<input id="btnLimpiar" type="submit" onclick="limpiarCamposFormulario(); habilitarBotonesIniciales()" value="Limpiar" class="btn btn-primary">' +
            '</div>';

            //DESPUES DE CREAR LOS NUEVOS BOTONES - LOS PINTAMOS EN PANTALLA
            $('#btnFormularioCliente').html(setBotones); 
        }
    });
}

function detalleConsultaxID(){
    var idCliente = Number(document.getElementById('consultaxid').value);
    
    if(idCliente==""){
        alert("WARNING: Todos los campos son obligatorios");
    }else{
        detallesCliente(idCliente);
    }
}

function actualizarCliente(idCliente){

    if(document.getElementById('myid').value=="" || 
        document.getElementById('name').value=="" || 
            document.getElementById('email').value=="" || 
                document.getElementById('age').value==""){

                    alert("WARNING: Todos los campos son obligatorios");
    }else{

        var datosFormularioCliente = {
            id: idCliente,
            name: $('#name').val(),
            email: $('#email').val(),
            age: $('#age').val()
        };

        var datosFormularioCliente_JSON = JSON.stringify(datosFormularioCliente);//SE CASTEA A JSON

        $.ajax({
            url: urlRest,
            type: 'PUT',
            data: datosFormularioCliente_JSON,
            datatype: 'JSON',
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                cargarTablaClientes();
                limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
            }   
        });
        habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
    }
}

function crearNewCliente(){//METODO PUT PARA CREAR NUEVO CLIENTE

    if(document.getElementById('myid').value=="" || 
        document.getElementById('name').value=="" || 
            document.getElementById('email').value=="" || 
                document.getElementById('age').value==""){

                    alert("WARNING: Todos los campos son obligatorios");
    }else{

        var datosNewCliente = {
            id: $('#myid').val(),
            name: $('#name').val(),
            email: $('#email').val(),
            age: $('#age').val()
        };
        
        var datosNewCliente_JSON = JSON.stringify(datosNewCliente);

        $.ajax({
            url: urlRest,
            type: 'POST',
            datatype: 'JSON',
            data: datosNewCliente_JSON,
            contentType: 'application/json',
            success: function(response){
                console.log(response); //Respuesta o registro en consola
                cargarTablaClientes();//Vuelve a recargar la tabla con todas las cabanas incluyendo el nuevo registro
                limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
            }
        });
    }
}

function borrarCliente(idCliente){//METODO DELETE - SOLO SE REQUIERE EL ID
    var idFormularioCliente = {
        id: idCliente 
    };

    var idFormularioCliente_JSON = JSON.stringify(idFormularioCliente);

    $.ajax({
        url: urlRest,
        type: 'DELETE',
        data: idFormularioCliente_JSON,
        dataType: 'JSON',
        contentType: 'application/json',
        success: function(response){
            console.log(response);
            cargarTablaClientes();
            limpiarCamposFormulario();//LIMPIA TODOS LAS CAJAS DE TEXTO
        }

    });
    habilitarBotonesIniciales();//LOS BOTONES SE HABILITAN DESPUES DE HABER LIMPIADO LOS CAMPOS
}

function habilitarBotonesIniciales(){//SE ENCARGA DE HABILITAR NUEVAMENTE LOS BOTONES INICIALES
    $('#myid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD ID
    $('#consultaxid').prop('disabled', false);//VUELVE Y HABILITA EL JTEXTFIELD CONSULTAR*ID
    $('#btnConsultar').prop('disabled', false);//VUELVE Y HABILITA EL BOTON CONSULTAR
    var btnCrear = '<br>' + '<input id="btnCrearCliente" type="submit" onclick="crearNewCliente()" value="Crear" class="btn btn-primary">';
    $('#btnFormularioCliente').html(btnCrear); //VUELVE Y PINTA EL BOTON CREAR
}

function limpiarCamposFormulario(){
    $('#formulario-cliente')[0].reset();
    $('#formulario-busquedaId')[0].reset();
}