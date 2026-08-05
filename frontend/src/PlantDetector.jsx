import React, { useState, useEffect } from "react";
import "./PlantDetector.css";

import jsPDF from "jspdf";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


function PlantDetector() {

  const [view, setView] = useState("home"); // "home" | "scan"

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);



  useEffect(() => {

    const oldHistory =
      JSON.parse(localStorage.getItem("plant_history")) || [];

    setHistory(oldHistory);

  }, []);




  const handleFile = (file) => {

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);

  };



  const handleDrop = (e) => {

    e.preventDefault();

    handleFile(e.dataTransfer.files[0]);

  };



  const handleChange = (e) => {

    handleFile(e.target.files[0]);

  };




  const analyzePlant = async () => {

    if (!image) {
      alert("Upload leaf image");
      return;
    }


    setLoading(true);


    const formData = new FormData();
    formData.append("file", image);



    try {

      const res = await fetch(
        "http://localhost:8000/predict",
        {
          method:"POST",
          body:formData
        }
      );


      const data = await res.json();


      setResult(data);


      const updated =
        [data, ...history].slice(0,5);


      setHistory(updated);


      localStorage.setItem(
        "plant_history",
        JSON.stringify(updated)
      );


    } catch(err){

      console.log(err);
      alert("Backend error");

    }


    finally{

      setLoading(false);

    }

  };




  const speak = () => {

    if(!result) return;


    const text =
    `Plant ${result.plant}.
    Disease ${result.disease}.
    ${result.description}`;


    const speech =
      new SpeechSynthesisUtterance(text);


    window.speechSynthesis.speak(speech);

  };




  const downloadPDF = () => {

    if(!result) return;


    const pdf = new jsPDF();


    pdf.text(
      "PlantAI Disease Report",
      20,
      20
    );


    pdf.text(
      `Plant: ${result.plant}`,
      20,
      40
    );


    pdf.text(
      `Disease: ${result.disease}`,
      20,
      55
    );


    pdf.text(
      `Confidence: ${result.confidence}%`,
      20,
      70
    );


    pdf.text(
      `Treatment: ${result.treatment}`,
      20,
      90
    );


    pdf.save("PlantAI_Report.pdf");

  };



  const pieData = result ? [

    {
      name:"Confidence",
      value:result.confidence
    },

    {
      name:"Remaining",
      value:100-result.confidence
    }

  ] : [];



  const barData = result ? [

    {
      name:"AI",
      score:result.confidence
    }

  ] : [];




  return (

    <div className="page">


      <nav>

        <div
          className="logo"
          onClick={() => setView("home")}
          style={{ cursor: "pointer" }}
        >
          🌱 PlantAI
        </div>

        <span>
          AI Agriculture Assistant
        </span>

      </nav>




      {/* ---------------- HOME / MARKETING SCREEN ---------------- */}

      {view === "home" && (

        <div className="home">

          <div className="badge">
            ✦ AI-Powered Plant Diagnostics
          </div>

          <div className="home-art">
            <div className="home-blob"></div>
            <div className="home-leaf">🌿</div>
          </div>

          <h1>
            Know your plant's
            <br/>
            <span>
              health instantly
            </span>
          </h1>

          <p>
            Scan any leaf and get an AI-powered diagnosis
            with treatment advice in seconds.
          </p>

          <button
            className="cta"
            onClick={() => setView("scan")}
          >
            Start Scan Now →
          </button>


          <div className="stats-row">

            <div className="stat-card">
              <h4>98.2%</h4>
              <p>Detection Accuracy</p>
            </div>

            <div className="stat-card">
              <h4>40+</h4>
              <p>Diseases Covered</p>
            </div>

            <div className="stat-card">
              <h4>2k+</h4>
              <p>Leaves Scanned</p>
            </div>

          </div>


          <div className="features-row">

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Scan</h3>
              <p>Get a full diagnosis in under 3 seconds from a single photo.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Treatment Plans</h3>
              <p>Actionable, plant-specific treatment and prevention steps.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Shareable Reports</h3>
              <p>Export a PDF or listen to the diagnosis out loud.</p>
            </div>

          </div>


          {
            history.length > 0 && (

            <div className="home-recent">

              <h3>
                Recent Diagnoses
              </h3>

              {
                history.slice(0,3).map((item,index)=>(

                  <p key={index}>
                    <span>🌿 {item.plant}</span>
                    <span className="pill">{item.disease}</span>
                  </p>

                ))
              }

            </div>

            )
          }

        </div>

      )}




      {/* ---------------- SCAN SCREEN ---------------- */}

      {view === "scan" && (

      <div className="hero">

        <button
          className="back"
          onClick={() => setView("home")}
        >
          ← Back
        </button>

        <h1>
          Plant Disease
          <br/>
          <span>
            Detection Using AI
          </span>
        </h1>



        <p>
          Upload leaf image and get instant diagnosis
        </p>





        <div className="upload-card">


          <label
            className="dropzone"
            onDragOver={(e)=>e.preventDefault()}
            onDrop={handleDrop}
          >


            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
            />


            {
              preview ?

              <img
                src={preview}
                alt="leaf"
              />

              :

              <>

                <div className="upload-icon">
                  📷
                </div>

                <h3>
                  Drag & Drop Leaf Image
                </h3>

                <p>
                  Click to upload
                </p>

              </>

            }


          </label>





          <button onClick={analyzePlant}>

            {
              loading
              ?
              "Analyzing..."
              :
              "Analyze Plant"
            }

          </button>






          {
            result && (

            <div className="result">


              <div className="result-top">

                <div className="result-text">

                  <h2>
                    🌿 {result.disease}
                  </h2>

                  <p>
                    Plant: {result.plant}
                  </p>

                  <h3>
                    Confidence: {result.confidence}%
                  </h3>

                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>

                </div>

                <div className="confidence">

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        <Cell fill="#5b8a63" />
                        <Cell fill="rgba(255,255,255,0.08)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <span className="confidence-value">
                    {result.confidence}%
                  </span>

                </div>

              </div>




              <div className="cards">


                <div className="info-card">
                  <h3>🧬 About</h3>
                  <p>{result.description}</p>
                </div>


                <div className="info-card">
                  <h3>🔍 Symptoms</h3>
                  <p>{result.symptoms}</p>
                </div>


                <div className="info-card">
                  <h3>💊 Treatment</h3>
                  <p>{result.treatment}</p>
                </div>


                <div className="info-card">
                  <h3>🌱 Prevention</h3>
                  <p>{result.prevention}</p>
                </div>


              </div>




              <button onClick={speak}>
                🔊 Listen
              </button>


              <button onClick={downloadPDF}>
                📄 Download Report
              </button>


            </div>

            )

          }





          {
            history.length > 0 && (

            <div className="history">

              <h3>
                🕒 Previous Scans
              </h3>


              {
                history.map((item,index)=>(

                  <p key={index}>
                    🌿 {item.plant} - {item.disease}
                  </p>

                ))
              }


            </div>

            )
          }




        </div>


      </div>

      )}


    </div>

  );

}


export default PlantDetector;