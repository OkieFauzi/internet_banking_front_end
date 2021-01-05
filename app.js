async function getData() {
    const response = await fetch('http://127.0.0.1:5000/account/1')
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
getData();

