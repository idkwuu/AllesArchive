serverSelection.value = localStorage.getItem("server");
serverSelection.onchange = () => {
    localStorage.setItem("server", serverSelection.value);
    location.reload();
};