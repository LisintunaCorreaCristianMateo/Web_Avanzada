package example.backend_notasDB.repository;

import com.example.backend_notasDB.model.Estudiante;

public interface NotaRepository extends JpaRepository<Estudiante, Long> {
}