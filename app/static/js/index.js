const register = document.querySelector(".register");
const login = document.querySelector(".login");


register.addEventListener('click',()=>{
    window.location.replace("{{ url_for('templates', filename='register') }}");
});
login.addEventListener("click",()=>{
    location.href = "login.html";
});
