import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [petOwnerInput, setPetOwnerInput] = useState("");
  const [dogTypeInput, setDogTypeInput] = useState("");
  const [themeInput, setThemeInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: animalInput,
          petOwner: petOwnerInput,
          dogType: dogTypeInput,
          theme: themeInput,
          tone: toneInput,
          length: lengthInput,
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleRefresh = () => {
    setAnimalInput("");
    setDogTypeInput("");
    setLengthInput("");
    setPetOwnerInput("");
    setThemeInput("");
    setToneInput("");
    setResult((prev) => !prev);
  };

  return (
    <div>
      <Head>
        <title>Pet Stories</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Create your Pet Story!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter the name of the protagonist 🐶"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input
            type="text"
            name="petOwner"
            placeholder="Enter a pet owner "
            value={petOwnerInput}
            onChange={(e) => setPetOwnerInput(e.target.value)}
          />
          <input
            type="text"
            name="dogType"
            placeholder="Enter a dog type"
            value={dogTypeInput}
            onChange={(e) => setDogTypeInput(e.target.value)}
          />
          <input
            type="text"
            name="theme"
            placeholder="Enter a theme"
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
          />
          <select
            type="text"
            name="tone"
            value={toneInput}
            onChange={(e) => setToneInput(e.target.value)}
          >
            <option value="" disabled>
              Select the tone
            </option>
            <option value="dark">Dark story</option>
            <option value="light">Light story</option>
            <option value="funny">Funny story</option>
            <option value="epic">Epic story</option>
            <option value="sad">Sad story</option>
            <option value="happy">Happy story</option>
          </select>
          <select
            type="text"
            name="length"
            value={lengthInput}
            onChange={(e) => setLengthInput(e.target.value)}
          >
            <option value="" disabled>
              Select the type of story
            </option>
            <option value="haiku">Haiku</option>
            <option value="poem">Poem</option>
            <option value="short">Short story of 100 words</option>
            <option value="medium">Medium story of 250 words</option>
            <option value="long">Long story of 500 words</option>
          </select>
          <input type="submit" value="Generate story!" />
        </form>
        <div  onClick={handleRefresh} className={styles.refresh}>
          Clean form
        </div>
        <div className="loader"></div>
        {loading && <div className={styles.loader}></div>}
        {!loading && <div className={styles.result}>{result}</div>}
      </main>
    </div>
  );
}
