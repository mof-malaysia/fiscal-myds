import Prose from "@/components/ui/prose.astro";

const article = `
<p><strong>PUTRAJAYA, 10 Oktober 2026</strong> — Belanjawan 2027 dibentangkan di Dewan Rakyat hari ini, memberi tumpuan kepada kos sara hidup, pendidikan dan pendigitalan perkhidmatan awam.</p>
<h2>Kos sara hidup</h2>
<p>Sumbangan Tunai Rahmah diteruskan, dengan kadar baharu mulai Februari 2027. <a href="#str">Semak kelayakan anda</a>.</p>
<ul><li>Sehingga RM 2,000 setahun</li><li>Bayaran tambahan bagi setiap anak</li><li>Bayaran terus ke akaun bank</li></ul>
<h3>Jadual pelaksanaan</h3>
<ol><li>Pengumuman kadar baharu</li><li>Pembukaan permohonan</li><li>Bayaran fasa pertama</li></ol>
<blockquote><p>"Kerajaan yang baik ialah kerajaan yang mudah ditemui, mudah difahami dan mudah digunakan."</p></blockquote>
<table><thead><tr><th scope="col">Inisiatif</th><th scope="col">Bermula</th></tr></thead>
<tbody><tr><td>Kadar baharu bantuan tunai</td><td>Februari 2027</td></tr><tr><td>e-Invois untuk perniagaan kecil</td><td>Januari 2027</td></tr></tbody></table>
<hr />
<p>Teks penuh ucapan boleh dimuat turun di laman <a href="#penerbitan">Penerbitan</a>.</p>`;

export default {
  title: "Marketing/Prose",
  component: Prose,
  parameters: { layout: "padded" },
};

export const Default = { args: { slots: { default: article } } };
