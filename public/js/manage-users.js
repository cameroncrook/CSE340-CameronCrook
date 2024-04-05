const options = document.querySelectorAll('.account');

options.forEach(accountElement => {
    const div = accountElement.querySelector('.account-data__options');
    const id = div.getAttribute('data-id');

    div.querySelector('button').addEventListener('click', async function () {
        document.querySelector('.accounts').removeChild(accountElement);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ account_id: id}) 
        };

        const response = await fetch('/account/delete', requestOptions);
    })

    div.querySelector('select').addEventListener('change', async function () {
        const type = div.querySelector('select').value;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ account_id: id, type: type}) 
        };

        const response = await fetch('/account/change-type', requestOptions);
    })
})