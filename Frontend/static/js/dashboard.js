const contAlunos = document.getElementById("contagemAlunos");
const contProfessores = document.getElementById("contagemProfessores");
// const contDisciplinas = document.getElementById("contagemDisciplinas");
const contTurmas = document.getElementById("contagemTurmas");

function atualizarContagens() {
    fetch("/API/GetAlunosCount")
        .then(response => response.json())
        .then(data => {
            contAlunos.textContent = data;
        });
    fetch("/API/GetProfessoresCount")
        .then(response => response.json())
        .then(data => {
            contProfessores.textContent = data.quantidade;
        });
    // fetch("/API/GetDisciplinasCount")
    //     .then(response => response.json())
    //     .then(data => {
    //         contDisciplinas.textContent = data.quantidade;
    //     });
    fetch("/API/GetTurmasCount")
        .then(response => response.json())
        .then(data => {
            contTurmas.textContent = data;
        });
}

window.addEventListener("load", atualizarContagens);