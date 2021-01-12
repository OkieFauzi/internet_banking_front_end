const getToken = localStorage.getItem('token');

async function getUser() {
    const response = await fetch('http://127.0.0.1:5000/login/all')
    const data = await response.json()
    for (item of data) {
        if (item.token == getToken) {
            console.log({user_id : item.user_id, token : item.token});  
            return item.user_id;
        }
    }
}

async function getData(id) {
    console.log(id)
    const response = await fetch('http://127.0.0.1:5000/account/' + id)
    const data = await response.json()
    const tbody = document.querySelector('tbody')
    for (item of data) {
        const tr = document.createElement('tr');
        const account_id = document.createElement('td');
        const balance = document.createElement('td');
        const status = document.createElement('td');
        const history = document.createElement('td');

        account_id.id = `account${item.account_id}`;
        account_id.innerHTML = `${item.account_id}`;
        balance.innerHTML = `${item.balance}`;
        status.innerHTML = `${item.status}`;
        history.innerHTML = `<a href="history.html?account_id=${item.account_id}">history</a>`;
        history.id = `history_account${item.account_id}`;

        tr.append(account_id, balance, status, history);
        tbody.appendChild(tr)
    }
    console.log(data)
}

async function getName(id) {
    const response = await fetch('http://127.0.0.1:5000/user/all')
    const data = await response.json()
    const name = document.getElementById('user_name');
    for (item of data) {
        if (id == item.user_id) {
            name.innerHTML = item.first_name + " " + item.last_name;
        }
    }
}

const user_id = getUser();
user_id.then((id) => {
    getData(id)
    getName(id)
})

let logout = document.getElementById('logout');
logout.addEventListener("click", function(e) {
    e.preventDefault();

    const data = {token : getToken}

    fetch('http://127.0.0.1:5000/logout', {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log({status : data["status"], token : data["token"]})
        localStorage.removeItem('token')
        window.location.href = 'login.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })

})

