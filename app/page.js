export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>LoclStor</h1>
      <p>Find mobile phones & accessories near you</p>

      <input
        type="text"
        placeholder="Search phone or accessory…"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginTop: "20px"
        }}
      />

      <h3 style={{ marginTop: "30px" }}>Popular searches</h3>
      <ul>
        <li>iPhone 13</li>
        <li>Samsung S23</li>
        <li>Nothing Phone</li>
        <li>AirPods</li>
        <li>Fast Charger</li>
      </ul>
    </main>
  );
}
