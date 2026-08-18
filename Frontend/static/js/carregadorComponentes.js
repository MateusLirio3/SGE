function carregarComponentes(componentes) {
    const inicio = Date.now();

    return Promise.all(
        componentes.map(({ url, placeholder }) =>
            fetch(url)
                .then(res => res.text())
                .then(html => {
                    document.querySelector(placeholder).innerHTML = html;
                })
        )
    )
}
