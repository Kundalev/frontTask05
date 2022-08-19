document.addEventListener("DOMContentLoaded", function () {
    let join = $('#join-chat');
    let exit = $('#exit-chat');
    let messForm = $('#messForm');
    let loginForm = $('#loginForm');
    let reg =$('#reg')
    let nick = document.getElementById('nick')

    let login = function () {
        messForm.removeClass('d-none')
        reg.modal('hide')
        join.addClass('d-none')
        exit.removeClass('d-none')
        nick.innerText= getCookie('name')
        $('#123').addClass('d-none')
    }

    let getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    console.log(getCookie('name'))





    loginForm.submit(function (){
        let name = $('#name').val()
        let color = $('#color').val()
        axios.post('http://localhost:4000/', {
            name: name,
            color: color
        })
            .then(function (response) {
                if (response.data !== 'Имя занято'){
                    console.log(response.data);
                    document.cookie = `token=${response.data.token}`
                    document.cookie = `name=${response.data.name}`
                    document.cookie = `color=${response.data.color}`
                    login()


                }else {
                    alert('Имя занято')
                }


            })
            .catch(function (error) {
                console.log(error);
            });
        return false
    })


    const socket = io.connect("http://localhost:4000/");

    $('#messForm').submit(function (){
        socket.emit('message', {
            name: getCookie('name'),
            message: $('#message').val()
        });
        document.getElementById('message').value = ''
        return false
    })
    socket.on('message1', (socket) => {
        console.log(socket);
    })


})