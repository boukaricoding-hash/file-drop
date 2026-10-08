import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { check, Update } from "@tauri-apps/plugin-updater";
import "./App.css";

function App() {
  const [version, setVersion] = useState("");
  const [message, setMessage] = useState("");
  const [update, setUpdate] = useState<Update | null>(null);
  const [busy, setBusy] = useState(false);

  async function checkForUpdate() {
    setBusy(true);
    setMessage("Recherche de mise à jour...");
    try {
      const found = await check();
      if (found) {
        setUpdate(found);
        setMessage(`Nouvelle version disponible : ${found.version}`);
      } else {
        setUpdate(null);
        setMessage("Vous avez la dernière version.");
      }
    } catch (e) {
      setMessage("Impossible de vérifier les mises à jour : " + String(e));
    }
    setBusy(false);
  }

  async function installUpdate() {
    if (!update) return;
    setBusy(true);
    setMessage("Téléchargement et installation...");
    try {
      await update.downloadAndInstall();
      setMessage("Mise à jour installée. L'application va se fermer.");
    } catch (e) {
      setMessage("Échec de la mise à jour : " + String(e));
      setBusy(false);
    }
  }

  useEffect(() => {
    getVersion().then(setVersion);
    checkForUpdate();
  }, []);

  return (
    <main className="container">
      <h1>File Drop</h1>
      <p>Version {version}</p>
      <p>{message}</p>
      {update ? (
        <button onClick={installUpdate} disabled={busy}>
          Installer la mise à jour
        </button>
      ) : (
        <button onClick={checkForUpdate} disabled={busy}>
          Vérifier les mises à jour
        </button>
      )}
    </main>
  );
}

export default App;