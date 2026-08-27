carregarComponentes([
    {
        url: '/frontend/Components/navbar.html',
        placeholder: '#navbar-container'
    },
    // {
    //     url: '/frontend/Components/sidebar.html',
    //     placeholder: '#sidebar-container'
    // }
]);

await fetch('/get-token')

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}