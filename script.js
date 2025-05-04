const suratForm = document.getElementById("suratForm");
const tabelSurat = document.getElementById("tabelSurat");
const searchInput = document.getElementById("searchInput");

let daftarSurat = JSON.parse(localStorage.getItem("daftarSurat")) || [];

function renderTabel(filter = "") {
  tabelSurat.innerHTML = "";
  daftarSurat.forEach((surat, index) => {
    const match = surat.pengirim.toLowerCase().includes(filter) || surat.isi.toLowerCase().includes(filter);
    if (filter && !match) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${surat.tanggal}</td>
      <td>${surat.nomor}</td>
      <td>${surat.pengirim}</td>
      <td>${surat.isi}</td>
      <td>
        <button onclick="editSurat(${index})">Edit</button>
        <button onclick="hapusSurat(${index})">Hapus</button>
      </td>
    `;
    tabelSurat.appendChild(tr);
  });
}

suratForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const tanggal = document.getElementById("tanggal").value;
  const nomor = document.getElementById("nomor").value;
  const pengirim = document.getElementById("pengirim").value;
  const isi = document.getElementById("isi").value;

  const suratBaru = { tanggal, nomor, pengirim, isi };
  daftarSurat.push(suratBaru);
  localStorage.setItem("daftarSurat", JSON.stringify(daftarSurat));
  renderTabel(searchInput.value.toLowerCase());
  suratForm.reset();
});

function hapusSurat(index) {
  const yakin = confirm("Apakah Anda yakin ingin menghapus surat ini?");
  if (yakin) {
    daftarSurat.splice(index, 1);
    localStorage.setItem("daftarSurat", JSON.stringify(daftarSurat));
    renderTabel(searchInput.value.toLowerCase());
  }
}

function editSurat(index) {
  const surat = daftarSurat[index];
  document.getElementById("tanggal").value = surat.tanggal;
  document.getElementById("nomor").value = surat.nomor;
  document.getElementById("pengirim").value = surat.pengirim;
  document.getElementById("isi").value = surat.isi;
  daftarSurat.splice(index, 1);
  renderTabel(searchInput.value.toLowerCase());
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  renderTabel(keyword);
});

function exportExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [
    ["No", "Tanggal", "Nomor", "Pengirim", "Isi"]
  ];
  daftarSurat.forEach((s, i) => {
    ws_data.push([i + 1, s.tanggal, s.nomor, s.pengirim, s.isi]);
  });
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "RekapSurat");
  XLSX.writeFile(wb, "rekap-surat.xlsx");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

renderTabel();
