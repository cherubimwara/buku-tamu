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
  <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg">
    <h3 class="text-lg font-semibold flex items-center gap-1 text-gray-800">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>${nama}
    </h3>
    <p class="text-xs text-gray-500 mb-1">${tanggal}</p>
    <p class="text-gray-700">${deskripsi}</p>
    <div class="mt-3 flex gap-2">
      <button onclick="isiForm(${id})"
              class="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm">✏️ Edit</button>
      <button onclick="confirmHapus(${id})"
              class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">🗑️ Hapus</button>
    </div>
  </div>`;
}

async function loadData() {
  const { data, error } = await supabase.from(TABLE).select("*").order("id", { ascending: false });
  list.innerHTML = error
    ? "<p class='text-red-500'>Gagal memuat data</p>"
    : data.length
        ? data.map(card).join("")
        : "<p class='text-gray-500 text-center'>Belum ada catatan.</p>";
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
