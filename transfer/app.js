//get token
const getToken = localStorage.getItem('token');
//logout function
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
//get user_id
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
//input account active to account source function
async function getData(id) {
    console.log(id)
    const response = await fetch('http://127.0.0.1:5000/account/' + id)
    const data = await response.json();
    for (item of data) {
        if (item.status === 'active') {
            const option = document.createElement('option');
            const account_source = document.getElementById('account_source');
            option.value = `${item.account_id},${item.balance}`;
            option.innerHTML = 'Account ' + item.account_id + ' - Balance IDR ' + item.balance;
            account_source.appendChild(option)
        }
    }
    console.log(data)
}
//get name for nav bar function
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
//call the function
const user_id = getUser();
user_id.then((id) => {
    getData(id)
    getName(id)
})
//submit function
let form = document.getElementById('transfer');
form.addEventListener('submit', e => {
    e.preventDefault();
    const selected = document.getElementById('account_source').value;
    const value = selected.split(",");
    const account_id = parseInt(value[0]);
    const balance = parseInt(value[1]);
    const destination = parseInt(form.elements['destination'].value);
    console.log('destination :', destination);
    const amount = parseInt(form.elements['amount'].value);
    fetch('http://127.0.0.1:5000/account_id/' + destination)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data['status'] === 'closed') {
            alert('Your account destination is closed')
        } else if ((balance - amount) < 50000) {
            alert("Your balance is not sufficient")
        } else {
            window.location.href = `confirmation.html?source=${account_id}&destination=${destination}&amount=${amount}`;
        }
    }).catch((error) => {
        console.error('Error:', error);
        alert("Your account destination is not registered")
    })

})