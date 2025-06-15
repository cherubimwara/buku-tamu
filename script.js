import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    'https://qbziwpwkunkxwjdagdyw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieml3cHdrdW5reHdqZGFnZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODY3MDEsImV4cCI6MjA2NTU2MjcwMX0.ccyOfdqi2rLLy41rAEogirfMbj0gD9ZKaGpW-aHSSwQ'
  );


const TABLE = "buku_tamu";           
const idEl  = document.getElementById("id");
const nama = document.getElementById("nama");
const tanggal = document.getElementById("tanggal");
const desk = document.getElementById("deskripsi");
const list = document.getElementById("hasil");
const modal = document.getElementById("modal-hapus");
const btnOK = document.getElementById("konfirmasi-hapus");

let idHapus = null;

/* ---------------- simpan / update ---------------- */
window.simpanCatatan = async () => {
  const payload = {
    nama: nama.value,
    tanggal: tanggal.value,
    deskripsi: desk.value
  };

  if (idEl.value) {
    await supabase.from(TABLE).update(payload).eq("id", idEl.value);
  } else {
    await supabase.from(TABLE).insert(payload);
  }

  idEl.value = "";
  nama.value = tanggal.value = desk.value = "";
  loadData();
};

/* ---------------- tampil data ---------------- */
function card({id, nama, tanggal, deskripsi}) {
  return `
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg shadow border text-sm text-left">
      <thead class="bg-blue-100 text-blue-700">
        <tr>
          <th class="px-4 py-2">Nama</th>
          <th class="px-4 py-2">Tanggal</th>
          <th class="px-4 py-2">Deskripsi</th>
          <th class="px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t hover:bg-gray-50">
          <td class="px-4 py-2 font-medium text-gray-800">${nama}</td>
          <td class="px-4 py-2 text-gray-600">${tanggal}</td>
          <td class="px-4 py-2 text-gray-700">${deskripsi}</td>
          <td class="px-4 py-2">
            <div class="flex gap-2">
              <button onclick="isiForm(${id})"
                      class="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs">✏️ Edit</button>
              <button onclick="confirmHapus(${id})"
                      class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">🗑️ Hapus</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;

}

async function loadData() {
  const { data, error } = await supabase.from(TABLE).select("*").order("id", { ascending: false });
  list.innerHTML = error
    ? "<p class='text-red-500'>Gagal memuat data</p>"
    : data.length
        ? data.map(card).join("")
        : "<p class='text-gray-500 text-center'>Belum ada Data.</p>";
}
loadData();

/* -------------- isi form untuk edit -------------- */
window.isiForm = async id => {
  const { data } = await supabase.from(TABLE).select("*").eq("id", id).single();
  idEl.value = data.id;
  nama.value = data.nama;
  tanggal.value = data.tanggal;
  desk.value = data.deskripsi;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* -------------- hapus dengan modal -------------- */
window.confirmHapus = id => { idHapus = id; modal.classList.remove("hidden"); };
window.tutupModal   = () => { modal.classList.add("hidden"); idHapus = null; };

btnOK.onclick = async () => {
  if (!idHapus) return;
  await supabase.from(TABLE).delete().eq("id", idHapus);
  tutupModal();
  loadData();
};
