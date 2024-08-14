document.getElementById('add-rgb-code').addEventListener('click', function() {
    const rgbCodeInput = document.getElementById('rgb-code');
    const rgbCode = rgbCodeInput.value.trim();
    if (rgbCode) {
        const rgbCodesList = document.getElementById('rgb-codes-list');
        const rgbCodeItem = document.createElement('div');
        rgbCodeItem.className = 'rgb-code-item';
        rgbCodeItem.innerHTML = `<span>${rgbCode}</span><button type="button" class="remove-rgb-code">Remove</button>`;
        rgbCodesList.appendChild(rgbCodeItem);
        rgbCodeInput.value = '';
    }
});

document.getElementById('rgb-codes-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-rgb-code')) {
        event.target.parentElement.remove();
    }
});

document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const rgbCodes = Array.from(document.querySelectorAll('.rgb-code-item span')).map(span => span.textContent);
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    rgbCodes.forEach(code => formData.append('rgb_codes', code));
    formData.append('image', imageFile);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const colorCount = result.color_count;
    const columnColorCount = result.column_color_count;

    const colorCountDiv = document.createElement('div');
    colorCountDiv.innerHTML = '<h2>Color Count</h2>';
    for (const [color, count] of Object.entries(colorCount)) {
        const p = document.createElement('p');
        p.textContent = `Color ${color}: ${count}`;
        colorCountDiv.appendChild(p);
    }
    resultsDiv.appendChild(colorCountDiv);

    const columnColorCountDiv = document.createElement('div');
    columnColorCountDiv.innerHTML = '<h2>Column Color Count</h2>';
    columnColorCount.forEach((colCount, index) => {
        const colDiv = document.createElement('div');
        colDiv.innerHTML = `<h3>Column ${index + 1}</h3>`;
        for (const [color, count] of Object.entries(colCount)) {
            const p = document.createElement('p');
            p.textContent = `Color ${color}: ${count}`;
            colDiv.appendChild(p);
        }
        columnColorCountDiv.appendChild(colDiv);
    });
    resultsDiv.appendChild(columnColorCountDiv);
}
