import com.example.backend_notasDB.model.Estudiante;
import com.example.backend_notasDB.repository.EstudianteRepository;

@service
public class EstudianteService {
    private final EstudianteRepository estudianteRepository;

    public EstudianteService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    //métodos para manejar la lógica de negocio relacionada con Estudiante
    public List<Estudiante> obtenerTodosEstudiantes() {
        return estudianteRepository.findAll();

    }
    //metodo para guardar
    public Estudiante guardarEstudiante(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }
    //metodo para eliminar
    public void eliminarEstudiante(Long id) {
        estudianteRepository.deleteById(id);
    }
    //metodo para actualizar    
    public Estudiante actualizarEstudiante(Long id, Estudiante estudiante) {
        Estudiante estudianteExistente = estudianteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con id: " + id));

        estudianteExistente.setNombre(estudiante.getNombre());
        estudianteExistente.setApellido(estudiante.getApellido());
        estudianteExistente.setEmail(estudiante.getEmail());

        return estudianteRepository.save(estudianteExistente);
    }
}

