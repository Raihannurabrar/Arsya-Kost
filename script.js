const container = document.getElementById('kamar-container');

const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const tahun = Array.from({ length: 7 }, (_, i) => `Tahun ${i + 1}`);
const tokenList = [
  '86 2588 1543 9', '86 2588 0723 8', '86 2585 9232 7',
  '86 2588 1433 3', '86 2588 1465 5', '86 2586 6172 6', '86 2588 0970 5'
];

// Membuat elemen kamar
for (let i = 1; i <= 7; i++) {
  const kamar = document.createElement('div');
  kamar.className = 'kamar';
  kamar.id = `kamar${i}`;

  const buatInputIuran = (labelList, tipe) => {
    return labelList.map((label, idx) => `
      <div class="iuran-item">
        <label>${label}:</label>
        <input type="number" class="${tipe}-nominal" placeholder="Rp" min="0" disabled />
        <input type="date" class="${tipe}-tanggal" disabled />
        <span class="peringatan" style="color: red; font-size: 12px;"></span>
      </div>`).join('');
  };

  kamar.innerHTML = `
    <h3>Kamar ${i}</h3>
    <div class="grid">
      <div><label>Nama Penghuni:</label><input type="text" disabled /></div>
      <div><label>Tanggal Masuk:</label><input type="date" disabled /></div>
      <div><label>Tanggal Keluar:</label><input type="date" disabled /></div>
      <div><label>Nomor Token Listrik:</label><input type="text" disabled value="${tokenList[i - 1]}" /></div>
    </div>

    <h4>Iuran Bulanan (Rp)</h4>
    <div class="grid">${buatInputIuran(bulan, 'bulanan')}</div>

    <h4>Iuran Tahunan (Rp)</h4>
    <div class="grid">${buatInputIuran(tahun, 'tahunan')}</div>

    <h4>Iuran Sampah Bulanan (Rp)</h4>
    <div class="grid">${buatInputIuran(bulan, 'sampah')}</div>

    <div style="text-align: right;">
      <button class="ubah-btn">Ubah Data</button>
      <button class="simpan-btn" disabled>Simpan Data</button>
      <button class="reset-btn">Reset</button>
    </div>
  `;

  container.appendChild(kamar);
}

// Mengecek keterlambatan
function cekKeterlambatan(kamarDiv) {
  const hariIni = new Date();

  const cekField = (classNama, tipe, isBulanan) => {
    const items = kamarDiv.querySelectorAll(`.${classNama}`);
    items.forEach((el, idx) => {
      const parent = el.parentElement;
      const nominal = parent.querySelector(`.${tipe}-nominal`).value;
      const tanggal = parent.querySelector(`.${tipe}-tanggal`).value;
      const peringatan = parent.querySelector('.peringatan');

      if (nominal && tanggal) {
        const bayar = new Date(tanggal);
        const bulanBayar = bayar.getMonth();
        const tahunBayar = bayar.getFullYear();

        const batas = isBulanan
          ? new Date(tahunBayar, bulanBayar + 1, 1) // Awal bulan berikutnya
          : new Date(tahunBayar + 1, 0, 1); // Awal tahun berikutnya

        if (hariIni > batas) {
          const telatMs = hariIni - batas;
          const telatHari = Math.floor(telatMs / (1000 * 60 * 60 * 24));
          peringatan.textContent = `Telat bayar ${telatHari} hari`;
        } else {
          peringatan.textContent = '';
        }
      } else {
        peringatan.textContent = '';
      }
    });
  };

  cekField('bulanan-tanggal', 'bulanan', true);
  cekField('sampah-tanggal', 'sampah', true);
  cekField('tahunan-tanggal', 'tahunan', false);
}

// Event handler global
container.addEventListener('click', (event) => {
  const target = event.target;
  const kamarDiv = target.closest('.kamar');
  const inputs = kamarDiv.querySelectorAll('input');
  const ubahBtn = kamarDiv.querySelector('.ubah-btn');
  const simpanBtn = kamarDiv.querySelector('.simpan-btn');

  if (target.classList.contains('ubah-btn')) {
    inputs.forEach(input => input.disabled = false);
    ubahBtn.disabled = true;
    simpanBtn.disabled = false;
  }

  if (target.classList.contains('simpan-btn')) {
    const nama = inputs[0].value.trim();
    const tanggalMasuk = inputs[1].value;

    if (!nama || !tanggalMasuk) {
      alert('Nama penghuni dan tanggal masuk harus diisi!');
      return;
    }

    inputs.forEach(input => input.disabled = true);
    simpanBtn.disabled = true;
    ubahBtn.disabled = false;
    alert('Data berhasil disimpan!');
    cekKeterlambatan(kamarDiv);
  }

  if (target.classList.contains('reset-btn')) {
    if (confirm('Apakah Anda yakin ingin mereset semua data kamar ini?')) {
      inputs.forEach(input => {
        input.value = '';
        input.disabled = true;
      });
      kamarDiv.querySelectorAll('.peringatan').forEach(p => p.textContent = '');
      ubahBtn.disabled = false;
      simpanBtn.disabled = true;
      alert('Data telah direset.');
    }
  }
});

// Cek keterlambatan realtime saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.kamar').forEach(cekKeterlambatan);
});
