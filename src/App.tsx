import "./App.css";

function App() {
  const nama = "Linda";
  const tahun = new Date().getFullYear();
  return (
    <>
      {/* Fragment: dua elemen bersebelahan tanpa membungkus dengan div tambahan */}
      <section className="salam">
        <h1>Halo, {nama}! Ini rabu pagi</h1>
        <p>
          Tahun {tahun}, 1 + 1 = {1 + 1}
        </p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <p style={{ color: "crimson" }}>Teks merah memakai style berupa objek.</p>
      </section>
      <footer className="kaki">Minggu 17 Senin: JSX pertama</footer>
    </>
  );
}

export default App;
