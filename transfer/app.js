const getToken = localStorage.getItem('token');

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
        window.location.href = '../login.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })
})

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
    const data = await response.json();
    for (item of data) {
        if (item.status === 'active') {
            const option = document.createElement('option');
            const account_source = document.getElementById('account_source');
            option.value = `${item.account_id},${item.balance}`;
            option.innerHTML = 'Account ' + item.account_id + ' - Balance ' + item.balance;
            account_source.appendChild(option)
        }
    }
    console.log(data)
}

const user_id = getUser();
user_id.then((id) => {
    getData(id)
})

let form = getElementById('transfer');
const selected = document.getElementById('transfer').value;
const value = selected.split(",");
const account_id = number(value[0]);
const balance = number(value[1]);
form.addEventListener('submit', e => {
    e.preventDefault();
    let amount = number(form.elements['amount']);
    fetch('http://127.0.0.1:5000/account_id/' + account_id)
    .then(response => response.json())
    .then(data => {
        if (data['status'] === 'closed') {
            alert('Your Account Destination is closed')
        } else if ((balance - amount) <= 50000) {
            alert("Your balance is not sufficient")
        } else {
            
        }
    })

})