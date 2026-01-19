package com.datos.datos.services;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class datosServices {

	/**
	 * Cálculo sencillo de edad devolviendo años, meses y días en formato legible.
	 * Formato esperado de entrada: "yyyy-MM-dd".
	 * @param fecha String en formato ISO (yyyy-	MM-dd)
	 * @return String "X años, Y meses, Z días" o "0 años, 0 meses, 0 días" en error
	 */
	public String calcularEdadSimple(String fecha){
		if (fecha == null || fecha.length() < 10) {
			return "0 años, 0 meses, 0 días";
		}
		try {
			int year = Integer.parseInt(fecha.substring(0,4));
			int month = Integer.parseInt(fecha.substring(5,7));
			int day = Integer.parseInt(fecha.substring(8,10));

			LocalDate nacimiento = LocalDate.of(year, month, day);
			LocalDate hoy = LocalDate.now();

			if (nacimiento.isAfter(hoy)) {
				return "0 años, 0 meses, 0 días";
			}

			int years = hoy.getYear() - nacimiento.getYear();
			int months = hoy.getMonthValue() - nacimiento.getMonthValue();
			int days = hoy.getDayOfMonth() - nacimiento.getDayOfMonth();

			if (days < 0) {
				LocalDate prev = hoy.minusMonths(1);
				int daysInPrev = prev.lengthOfMonth();
				days += daysInPrev;
				months -= 1;
			}

			if (months < 0) {
				months += 12;
				years -= 1;
			}

			return years + " años, " + months + " meses, " + days + " días";
		} catch (NumberFormatException | java.time.DateTimeException | IndexOutOfBoundsException e) {
			return "0 años, 0 meses, 0 días";
		}
	}

}
