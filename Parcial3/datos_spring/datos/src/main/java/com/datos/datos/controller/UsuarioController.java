package com.datos.datos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.datos.datos.model.Usuario;
import com.datos.datos.services.datosServices;

@Controller 
@RequestMapping("/api")
public class UsuarioController {

    private final datosServices datosServices;// Inyección de dependencia
                                                //final -> el valor no puede cambiar
    
    public UsuarioController(datosServices datosServices) {
        this.datosServices = datosServices;
    }
    @GetMapping("/")
    public String index() {
        return "inicio";
    }

    @GetMapping("/saludo")
    public String saludo(Model datosHtml) {//Clase de spring para mandar datos a html
        Usuario usuario = new Usuario("Cristian Mateo","");
        datosHtml.addAttribute("persona", usuario);
        return "saludo";
    }

    @PostMapping("/calcular")
    public String calcularEdad(@RequestParam("fechaNacimiento") String fechaNacimiento, Model model) {
        String edadStr = datosServices.calcularEdadSimple(fechaNacimiento);
        Usuario usuario = new Usuario("Cristian Lisintuña", edadStr);
        model.addAttribute("persona", usuario);
        return "saludo";
    }
}