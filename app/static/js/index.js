const register = document.querySelector(".register");
const login = document.querySelector(".login");


register.addEventListener('click',()=>{
    location.href = "{{ url_for('templates', filename='register') }}";
});
login.addEventListener("click",()=>{
    location.href = "login.html";
});
