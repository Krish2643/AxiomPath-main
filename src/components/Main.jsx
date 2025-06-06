import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import "./Main.css";
import logo from '../assets/logo.jpg';

const Main = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [recentPrompt, setRecentPrompt] = useState("");

  const [qnans, setQnans] = useState([
    {
      question: "",
      answer: "",
    }
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const cleanAsterisks = (text) => {
    // if (!text) return text;
    // return text.replace(/\*+/g, '');
    if (!text) return text;
    
    // Remove all asterisks (both single * and double ** for markdown)
    let cleanedText = text.replace(/\*+/g, '');
    
    // Remove hash symbols (#) - for headers
    cleanedText = cleanedText.replace(/#+ /g, '');
    cleanedText = cleanedText.replace(/#+/g, '');
    
    // Remove horizontal rules (---)
    cleanedText = cleanedText.replace(/---+/g, '');
    
    return cleanedText;
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Please enter a prompt...");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(" https://axiom-chatbot-344958789989.us-central1.run.app/chat", {
        message: input,
      });
      // console.log("Response from server:", response.data?.reply);
      let answer = response.data?.reply;
      
      // Clean asterisks from the answer

      console.log("un cleaned Response:", answer);
      answer = cleanAsterisks(answer);
      console.log("Cleaned Response:", answer);


      setResult(answer);
      setRecentPrompt(input);
      setQnans((prev) => [...prev, { question: input, answer: answer }]);
      setInput("");
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if( e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="main">
      <div className="nav">
        <img className="logo" src= {logo} alt="logo" />
        <img src={assets.user} className="user" alt="User" />
      </div>

      <div className="main-container">
        {!uploadedImage && (
          <div className="greet">
            <p className="color-text">Demo for Axiom Path</p>
          </div>
        )}

        <div className="result">
          <div className="result-title">
            <div className="result-des">
              <div className="result-extra">
                <img src={assets.user} alt="User" />
              </div>
              
              {qnans?.map((item, index) => (
                <div key={index} className="qa-card">
                 {item?.question && <p><strong></strong> {item.question}</p>}
                 {item?.answer && <p><strong></strong> {item.answer}</p>}
                </div>
              ))}

              {uploadedImage && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={uploadedImage}
                    alt="Uploaded Preview"
                    style={{ width: "800px", height: "400px" }}
                  />
                </div>
              )}

              {isLoading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <pre className="result-answer" style={{ whiteSpace: "pre-wrap" }}>
                 
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e)=> setInput(e.target.value)}
              onKeyDown={(e)=> handleInputChange(e)}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
            />
            <div>
              <label htmlFor="image">
                <img
                  src={assets.gallery_icon}
                  alt="Upload"
                  style={{
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                    marginTop: "5px",
                  }}
                />
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <img
                src={assets.send_icon}
                alt="Send"
                onClick={handleSubmit}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="bottom-info">
            <p>This may display inaccurate info, including about people, so double-check its responses.</p>
          </div>
        </div>

        {/* Q&A History Section */}
        {/* <div className="history">
          <h3>Previous Questions</h3>
          {qnans.slice(1).reverse().map((item, index) => (
            <div key={index} className="qa-card">
              <p><strong>Q:</strong> {item.question}</p>
              <p><strong>A:</strong> {item.answer}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Main;