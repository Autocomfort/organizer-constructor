$(document).ready(function () {
    $('#embroidery-select').select2({ placeholder: 'Оберіть вишивку', allowClear: true })
      .on('change', calculatePrice);
    $('#badge-select').select2({ placeholder: 'Оберіть шильд', allowClear: true })
      .on('change', calculatePrice);
  });
  
  const form = document.getElementById('config-form');
  const totalPrice = document.getElementById('total-price');
  
  const previewImages = {
    size: document.getElementById('size-img'),
    color: document.getElementById('color-img'),
    thread: document.getElementById('thread-img'),
    kant: document.getElementById('kant-img'),
    lining: document.getElementById('lining-img'),
    embroidery: document.getElementById('embroidery-img'),
    badge: document.getElementById('badge-img')
  };
  
  function getSelectValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : 'none';
  }
  
  function updateImage(field, filename, sizeFolder = '') {
    const image = previewImages[field];
    if (!filename || filename === 'none') {
      image.style.display = 'none';
      image.src = '';
      return;
    }
  
    const path = sizeFolder ? `/images/${field}/${sizeFolder}/${filename}` : `/images/${field}/${filename}`;

fetch(path)
  .then(response => {
    if (response.ok) {
      image.src = path;
      image.style.display = 'block';
    } else {
      image.style.display = 'none'; // приховати, якщо файлу нема
    }
  })
  .catch(() => {
    image.style.display = 'none';
  });

  }
  
  function calculatePrice() {
    const data = new FormData(form);
    const sizeVal = data.get('size');
    const size = parseInt(sizeVal);
    let price = size;
  
    const kant = data.get('kant');
    if (kant && kant !== 'none' && kant !== 'black') price += 50;
  
    const lining = data.get('lining');
    if (lining && lining !== 'none') price += 150;
  
    const embroidery = getSelectValue('embroidery-select');
    if (embroidery !== 'none') price += 550;
  
    const badge = getSelectValue('badge-select');
    if (badge !== 'none') price += 200;
  
    const lid = data.get('lid');
    if (lid === 'magnet') {
      switch (size) {
        case 1000: price += 250; break;
        case 1500: price += 300; break;
        case 2000: price += 350; break;
        case 2500:
        case 3000: price += 400; break;
      }
    }
  
    totalPrice.textContent = price;
  
    updateImage('size', `size_${sizeVal}.png`, sizeVal);
    updateImage('color', `color_${data.get('color')}.png`, sizeVal);
    updateImage('thread', `${data.get('thread')}.png`, sizeVal);
    updateImage('kant', `${kant}.png`, sizeVal);
    updateImage('lining', `${lining}.png`, sizeVal);
    updateImage('embroidery', `${embroidery}.png`);
    updateImage('badge', `${badge}.png`);
  }
  
  form.addEventListener('change', calculatePrice);
  window.addEventListener('load', calculatePrice);
  
  document.getElementById('buy-button').addEventListener('click', function () {
    document.getElementById('order-modal').style.display = 'block';
  });
  
  document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('order-modal').style.display = 'none';
  });
  
  function submitOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    if (!name || !phone) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }
    alert(`Дякуємо, ${name}! Ваше замовлення прийнято.`);
    document.getElementById('order-modal').style.display = 'none';
    form.reset();
    calculatePrice();
  }
  