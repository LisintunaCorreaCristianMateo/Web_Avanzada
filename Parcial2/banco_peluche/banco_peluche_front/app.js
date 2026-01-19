const API_URL ="http://localhost:3000/api/clientes";
//Calculo de un cliente

async function calcularCliente(){
    const saldoAnterior=document.getElementById("saldoAnterior").value;
    const montoCompras=document.getElementById("montoCompras").value;
    const pagoRealizado=document.getElementById("pagoRealizado").value;

    //campos vacios
    if(!saldoAnterior || !montoCompras|| !pagoRealizado){
        alert('Llenar todos los campos');
        return;
    }
    //axios
    try{
        const response=await axios.post(`${API_URL}/calcular`,{
            saldoAnterior,
            montoCompras,
            pagoRealizado
        });
        const r=response.data.data;// pirmer data del axios del frontend
                                // segundo data del backend 
        const tabla =document.querySelector('#resultadoTabla tbody');
        // si la tabla no tiene datos
        if(tabla.children.length===1 && tabla.children.length===1){
            tabla.inertHTML="";
    }

    const fila = document.createElement('tr');
    fila.innerHTML=`
    <td>${Number(saldoAnterior).toFixed(2)}</td>
    <td>${Number(montoCompras).toFixed(2)}</td>
    <td>${Number(pagoRealizado).toFixed(2)}</td>

    
    <td>${Number(r.saldoBase).toFixed(2)}</td>
    <td>${Number(r.pagoMinimoBase).toFixed(2)}</td>
    <td>${r.esMoroso ? 'Si' : 'No'}</td>

    <td>${Number(r.interes).toFixed(2)}</td>
    <td>${Number(r.multa).toFixed(2)}</td>
    <td>${Number(r.saldoActual).toFixed(2)}</td>
    <td>${Number(r.pagoMinimo).toFixed(2)}</td>
    <td>${Number(r.pagoNoIntereses).toFixed(2)}</td>
    `;
    tabla.appendChild(fila);
    
    
    }

    catch(error){
        alert('Error al hacer el calcular, revisa backend');
    }


}