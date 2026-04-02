const itemInput = document.getElementById('item');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');
const totalDisplay = document.getElementById('total');
const clearBtn = document.getElementById('clearBtn');
const container = document.querySelector('.container');

let total = 0;

function updateClearButton() {
    if (list.children.length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
}

function saveToStorage() {
    const items = [];
    let newTotal = 0;
    document.querySelectorAll('#list li').forEach(li => {
        const text = li.querySelector('span').textContent;
        const name = text.split(':')[0].trim();
        const amountValue = Number(text.split(':')[1].replace('บาท', '').trim());
        if (!isNaN(amountValue)) {
            items.push({ name, amount: amountValue });
            newTotal += amountValue;
        }
    });
    total = newTotal;
    totalDisplay.textContent = total;
    localStorage.setItem('expenses', JSON.stringify(items));
    localStorage.setItem('total', total);
    updateClearButton();
}

function createRow(name, price) {
    const li = document.createElement('li');
    let currentName = name;
    let currentPrice = price;

    li.innerHTML = `<span>${currentName}: ${currentPrice} บาท</span>
    <div>
        <button class="editBtn">แก้ไข</button> 
        <button class="deleteBtn">ลบ</button>
    </div>`;
    list.appendChild(li);

    li.querySelector('.deleteBtn').addEventListener('click', function() {
        li.remove();
        saveToStorage();
    });

    li.querySelector('.editBtn').addEventListener('click', function() {
        const newItem = prompt("แก้ไขรายการ:", currentName);
        const newAmount = Number(prompt("แก้ไขจำนวน:", currentPrice));
        if (newItem && !isNaN(newAmount) && newAmount > 0) {
            currentName = newItem;
            currentPrice = newAmount;
            li.querySelector('span').textContent = `${currentName}: ${currentPrice} บาท`;
            saveToStorage();
        }
    });
}

window.onload = function() {
    const savedItems = JSON.parse(localStorage.getItem('expenses')) || [];
    savedItems.forEach(item => createRow(item.name, item.amount));
    saveToStorage();
};

addBtn.addEventListener('click', function() {
    const name = itemInput.value;
    const price = Number(amountInput.value);

    if (name !== "" && price > 0) {
        // หายเบลอเมื่อเพิ่มรายการใหม่
        container.classList.remove('blur-content');
        
        createRow(name, price);
        saveToStorage();
        itemInput.value = "";
        amountInput.value = "";
        itemInput.focus();
    } else {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
});

clearBtn.addEventListener('click', function() {

    container.classList.add('blur-content');

    setTimeout(() => {          
    if (confirm("คุณต้องการลบรายการทั้งหมดใช่หรือไม่?")) {
        list.innerHTML = "";
        saveToStorage();
         container.classList.remove('blur-content');
            
            alert("ล้างข้อมูลเรียบร้อยแล้วครับ");
    } else {
        container.classList.remove('blur-content');
    }
}, 100);

});

amountInput.addEventListener('keypress', (e) => e.key === 'Enter' && addBtn.click());
itemInput.addEventListener('keypress', (e) => e.key === 'Enter' && amountInput.focus());
