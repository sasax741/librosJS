//definicion de las clases
class Libro{
	constructor (titulo, autor, ISBN){
		this.titulo = titulo;
		this.autor = autor;
		this.ISBN = ISBN;
	}
}

class UI{
	static mostrarLibros(){
		const libros = Datos.traerLibros();
		libros.forEach((libro, i) => UI.agregarLibroLista(libro));

	}
	static agregarLibroLista(libro){
		const lista = document.querySelector('#libro-list');

		const fila = document.createElement('tr');
		fila.innerHTML = `
		<td>${libro.titulo}</td>
		<td>${libro.autor}</td>
		<td>${libro.ISBN}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;
		lista.appendChild(fila);
	}
	static eliminarLibro(el){
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}
	static mostrarAlerta(mensaje, className){
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(mensaje));

		const container = document.querySelector('.container');
		const form = document.querySelector('#libro-form');
		container.insertBefore(div, form);

		setTimeout(() => document.querySelector('.alert').remove(),3000);
	}
	static limpiarLosCampos(){
		document.querySelector('#titulo').value = '';
		document.querySelector('#autor').value = '';
		document.querySelector('#ISBN').value = '';
	}
}
class Datos{
	static traerLibros(){
		let libros;
		if (localStorage.getItem('libros') === null) {
			libros = [];
		}
		else {
			libros = JSON.parse(localStorage.getItem('libros'));
		}
		return libros;
	}
	static agregarLibro(libro){
		const libros = Datos.traerLibros();
		libros.push(libro);
		localStorage.setItem('libros', JSON.stringify(libros));
	}
	static removerLibro(ISBN){
		const libros = Datos.traerLibros();
		console.log(ISBN);
		libros.forEach((libro, i) => {
			if (libro.ISBN === ISBN) {
				libros.splice(i, 1);
			}
		});
		localStorage.setItem('libros', JSON.stringify(libros));

	}
}
//carga de la pagina
document.addEventListener('DOMContentLoaded',UI.mostrarLibros());
//controlar el evento submit
document.querySelector('#libro-form').addEventListener('submit', (e) => {
	e.preventDefault();

	//obtener los valores de los campos
	const titulo = document.querySelector('#titulo').value;
	const autor = document.querySelector('#autor').value;
	const ISBN = document.querySelector('#ISBN').value;
	if (titulo === '' || autor === '' || ISBN === '') {
		UI.mostrarAlerta('¡Por favor ingrese todos los datos!','danger');
	}
	else{
		const libro = new Libro (titulo, autor, ISBN);
		Datos.agregarLibro(libro);
		UI.agregarLibroLista(libro);
		UI.mostrarAlerta('¡Libro agregado a la colección!', 'success');
		UI.limpiarLosCampos();
	}

});
document.querySelector('#libro-list').addEventListener('click', (e) => {
	UI.eliminarLibro(e.target);
	Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
	UI.mostrarAlerta('¡Libro eliminado!', 'warning');
});
