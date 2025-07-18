import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full">
      <div className="accordion">
        <ul>
          <li>
            <div>
              <a href="treatmentWater" className="sliderLink">
                <h2>LAYOUS</h2>
                <p></p>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="treatmentPond" className="sliderLink">
                <h2>POWER MRTER</h2>
                <p></p>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="waterIn" className="sliderLink">
                <h2>WATER METER</h2>
                <p></p>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
