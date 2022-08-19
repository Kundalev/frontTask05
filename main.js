document.addEventListener("DOMContentLoaded", function () {
    let join = $('#join-chat');
    let exit = $('#exit-chat');
    let messForm = $('#messForm');
    let loginForm = $('#loginForm');
    let reg = $('#reg')
    let nick = document.getElementById('nick')

    let login = function () {
        messForm.removeClass('d-none')
        reg.modal('hide')
        join.addClass('d-none')
        exit.removeClass('d-none')
        nick.innerText = getCookie('name')
        $('#123').addClass('d-none')
    }
    let logOut = function () {
        messForm.addClass('d-none')
        join.removeClass('d-none')
        exit.addClass('d-none')
        $('#123').removeClass('d-none')
    }

    let getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    let deleteCookie = function (name) {
        document.cookie = `${name}=;max-age=-1`;
    }

    console.log(getCookie('name'))


    exit.click(function () {
        deleteCookie('token')
        console.log(getCookie('token'))
        logOut()
    })

    loginForm.submit(function () {
        let name = $('#name').val()
        let color = $('#color').val()
        axios.post('http://localhost:3001/', {
            name: name,
            color: color
        })
            .then(function (response) {
                if (response.data !== 'Имя занято') {
                    console.log(response.data);
                    document.cookie = `token=${response.data.token}`
                    document.cookie = `name=${response.data.name}`
                    document.cookie = `color=${response.data.color}`
                    login()


                } else {
                    alert('Имя занято')
                }


            })
            .catch(function (error) {
                console.log(error);
            });
        return false
    })


    const socket = io.connect("http://localhost:3001/");

    $('#messForm').submit(function () {
        if ($('#message').val().length > 200) {
            alert('Ограничение 200 символов')
            return false
        } else {
            socket.emit('message', {
                name: getCookie('name'),
                message: $('#message').val(),
                color: getCookie('color')
            });
            document.getElementById('message').value = ''
            return false
        }

    })
    socket.on('res', (data) => {
        console.log(data);
        let parent = $('#all_mess')

        if (data.name === getCookie('name')) {
            $(`<div class=\'alert alert-${data.color} col-6 ml-auto\'>\n` +
                '                        <p class="d-flex justify-content-between align-items-center">\n' +
                `                        <span>${data.name}</span>\n` +
                '                            <span class="d-none text-right badge badge-dark">Admin</span>\n' +
                '                        </p>\n' +
                '                         \n' +
                '                        <img class="d-none" style="width: 100px; height: 100px; object-fit: cover;" class="" src="https://yt4.ggpht.com/e2vhsw7wa0sO-QSqS3BzRhj-LkmSllra0-AjIi8kpM0PX3A9kfvsXJX8IWUhiEfFCaQXfmfPEoM=s32-c-k-c0x00ffffff-no-rj" alt="">\n' +
                '                        <p class="mt-2">\n' +
                `                            ${data.message}` +
                '                        </p>\n' +
                '                        \n' +
                '                    </div>').appendTo(parent)
        } else {
            $(`<div class=\'alert alert-${data.color} col-6\'>\n` +
                '                        <p class="d-flex justify-content-between align-items-center">\n' +
                `                            <span>${data.name}</span>\n` +
                '                            <span class="d-none text-right badge badge-dark"></span>\n' +
                '                        </p>\n' +
                '                        <img style="width: 100px; height: 100px; object-fit: cover;" class="d-none" src="" alt="">\n' +
                `                        <p>${data.message}</p>\n` +
                '                    </div>').appendTo(parent)
        }


    })
    socket.on('online', (data) => {
        $('#users-online').text(data)
    })


})