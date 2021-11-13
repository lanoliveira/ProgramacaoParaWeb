var blocoLogin = document.querySelector('.bloco-login'),
    bloco = document.querySelector('.bloco'),
    blocoI = document.querySelector('.bloco-i'),
    btLogin = document.querySelectorAll('.bt-sign-in'),
    btUpload = document.querySelector('#Sign-up'),
    btSign = document.querySelector('.ul-2-middle'),
    avatarShow = document.querySelector('#avatar'),
    avatar = document.querySelector('#avatar-img'),
    searchIcon = document.querySelector('#search'),
    search = document.querySelector('#show-search'),
    formSearch = document.querySelector('#form-search'),
    searchImput = document.querySelector('#search-imput'),
    ol = document.querySelector('.principal'),
    dialog = document.querySelector('dialog'),
    backDialog = document.getElementById('back'),
    getError = document.getElementById('getError'),
    form = document.querySelector('#form');

request = new XMLHttpRequest();


if (localStorage.token != undefined) {
    signIn();
}

btLogin.forEach(bt => bt.addEventListener('click', function () {
    bloco.className += ' bloco-log';
    blocoI.className += ' none';
    blocoLogin.className = 'bloco-login';
}));

searchIcon.addEventListener('click', function () {
    search.className = 'show-search';
    bloco.className = 'none';
});

function btSubmit() {
    data = { email: form.elements['email'].value, password: form.elements['password'].value };
    //data = { email: "eve.holt@reqres.in", password: "cityslicka" };
    if (form.elements['email'].value.length > 2 && form.elements['password'].value.length > 2) {
        postData(data);
    } else if (form.elements['email'].value.length < 3 && form.elements['password'].value.length < 3) {
        backDialog.className = 'backDialog';
        getError.innerHTML = 'The email and password must contain a minimum of 3 characters';
        dialogShow();
    } else if (form.elements['email'].value.length < 3) {
        backDialog.className = 'backDialog';
        getError.innerHTML = 'The email must contain a minimum of 3 characters';
        dialogShow();
    } else {
        backDialog.className = 'backDialog';
        getError.innerHTML = 'The password must contain a minimum of 3 characters';
        dialogShow();
    }

};

function dialogShow() {
    dialog.setAttribute('style', 'display: flex;');
}

function btCloseDialog() {
    dialog.removeAttribute('style');
    backDialog.removeAttribute('class');
    searchImput.value = '';
}

formSearch.addEventListener('submit', (ev) => {
    ev.preventDefault();
});

searchImput.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        if (searchImput.value.length > 2){
            getBusca();
        } else {
            backDialog.className = 'backDialog';
            getError.innerHTML = 'Please enter 2 or more characters';
            dialogShow();
        }
    }
});



async function getBusca() {
    let json = await axios.get('https://pixabay.com/api/?key=24231893-90c8178f8275c01f0c83fc75b&q=' + searchImput.value + '&image_type=photo' + '/json');

    if (json.data.total != 0) {
        for (var i = 0; i < 8; i++) {
            div = document.createElement('div');
            a = document.createElement('a');
            img = document.createElement('img');
            li = document.createElement('li');

            div.className = 'main-img';
            img.widht = "330";
            img.height = "247";
            img.src = json.data.hits[i].webformatURL;
            a.appendChild(img);
            div.appendChild(a);
            li.appendChild(div);
            ol.insertBefore(li, ol.firstChild);
        }
    } else {
        backDialog.className = 'backDialog';
        getError.innerHTML = 'No data found';
        dialogShow();
    }
};

async function getData() {

    let json = await axios.get('https://reqres.in/api/users?page=1' + '/json');

    for (var i = 0; i < json.data.data.length; i++) {
        if (json.data.data[i].email == data.email) {
            localStorage.setItem('user', JSON.stringify(json.data.data[i]));
        }
    }
    signIn();
};


function postData(data) {

    request.open('POST', 'https://reqres.in/api/login', true);

    request.responseType = 'json';
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 400) {
            backDialog.className = 'backDialog';
            getError.innerHTML = request.response.error;
            dialogShow();
            if (request.response.error === 'user not found') {
                form.elements['email'].value = '';
                form.elements['password'].value = '';
            }
        } else {
            localStorage.setItem('token', request.response.token);
            getData(data);
        }
    };
    request.send(JSON.stringify(data));
};

function signIn() {
    bloco.className = 'none';
    blocoI.className = 'bloco-i';
    blocoI.className = 'none';
    blocoLogin.className = 'none';
    btUpload.innerHTML = 'Upload';
    btSign.style.display = 'none';
    avatarShow.removeAttribute('style');
    avatar.setAttribute('src', JSON.parse(localStorage.getItem('user')).avatar);
    searchIcon.removeAttribute('style');
}