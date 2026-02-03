import { useEffect, useState } from "react";
import CommunityHub from "@/models/communityHub";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import showToast from "@/utils/toast";
import { FullScreenLoader } from "@/components/Preloader";
import paths from "@/utils/paths";
import { Info, House, ArrowSquareOut } from "@phosphor-icons/react";
import UserItems from "./Authentication/UserItems";

// Detectar si estamos en modo hub local
const IS_LOCAL_HUB = import.meta.env.DEV;

function useCommunityHubAuthentication() {
  const [originalConnectionKey, setOriginalConnectionKey] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [connectionKey, setConnectionKey] = useState("");
  const [loading, setLoading] = useState(true);

  async function resetChanges() {
    setConnectionKey(originalConnectionKey);
    setHasChanges(false);
  }

  async function onConnectionKeyChange(e) {
    const newConnectionKey = e.target.value;
    setConnectionKey(newConnectionKey);
    setHasChanges(true);
  }

  async function updateConnectionKey() {
    if (connectionKey === originalConnectionKey) return;
    setLoading(true);
    try {
      const response = await CommunityHub.updateSettings({
        hub_api_key: connectionKey,
      });
      if (!response.success)
        return showToast("Failed to save API key", "error");
      setHasChanges(false);
      showToast("API key saved successfully", "success");
      setOriginalConnectionKey(connectionKey);
    } catch (error) {
      console.error(error);
      showToast("Failed to save API key", "error");
    } finally {
      setLoading(false);
    }
  }

  async function disconnectHub() {
    setLoading(true);
    try {
      const response = await CommunityHub.updateSettings({
        hub_api_key: "",
      });
      if (!response.success)
        return showToast("Failed to disconnect from hub", "error");
      setHasChanges(false);
      showToast("Disconnected from CodingSoft Community Hub", "success");
      setOriginalConnectionKey("");
      setConnectionKey("");
    } catch (error) {
      console.error(error);
      showToast("Failed to disconnect from hub", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { connectionKey } = await CommunityHub.getSettings();
        setOriginalConnectionKey(connectionKey || "");
        setConnectionKey(connectionKey || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    connectionKey,
    originalConnectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
    disconnectHub,
  };
}

export default function AuthenticationPanel() {
  const {
    connectionKey,
    originalConnectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
    disconnectHub,
  } = useCommunityHubAuthentication();

  if (loading) return <FullScreenLoader />;

  // Modo Hub Local - Mostrar panel de información local
  if (IS_LOCAL_HUB) {
    return (
      <>
        <ContextualSaveBar
          showing={hasChanges}
          onSave={updateConnectionKey}
          onCancel={resetChanges}
        />
        <div className="w-full flex flex-col gap-y-1 pb-6">
          <div className="flex flex-col gap-y-2 mb-4">
            <p className="text-base font-semibold text-theme-text-primary">
              Community Hub Local
            </p>
            <p className="text-xs text-theme-text-secondary">
              Estás usando el Community Hub local. No se requiere API Key para acceder a los items públicos.
            </p>
          </div>

          {/* Panel informativo Hub Local */}
          <div className="border border-theme-border my-2 flex flex-col gap-y-4 text-theme-text-primary mb-6 bg-theme-settings-input-bg rounded-lg px-4 py-4">
            <div className="flex flex-col gap-y-2">
              <div className="gap-x-2 flex items-center">
                <House size={25} className="text-primary-button" />
                <h1 className="text-lg font-semibold">
                  Panel de Administración Local
                </h1>
              </div>
              <p className="text-sm text-theme-text-secondary">
                Gestiona tus items directamente desde el panel de administración local. 
                Puedes crear, editar y eliminar prompts, comandos y skills.
              </p>
              <div className="flex gap-2 mt-2">
                <a
                  href="http://localhost:5001/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-button text-white rounded-lg text-sm font-medium hover:bg-primary-button/90 transition-colors"
                >
                  <ArrowSquareOut size={16} />
                  Abrir Panel Admin
                </a>
                <a
                  href="http://localhost:5001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-theme-bg-primary border border-theme-border text-theme-text-primary rounded-lg text-sm font-medium hover:bg-theme-bg-secondary transition-colors"
                >
                  <ArrowSquareOut size={16} />
                  Ver Hub Público
                </a>
              </div>
            </div>
          </div>

          {/* API Key Opcional para items privados */}
          <div className="mt-6 mb-8">
            <div className="flex flex-col w-full max-w-[400px]">
              <label className="text-theme-text-primary text-sm font-semibold block mb-2">
                API Key (Opcional)
              </label>
              <input
                type="password"
                value={connectionKey || ""}
                onChange={onConnectionKeyChange}
                className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Solo si necesitas items privados"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-theme-text-secondary text-xs">
                  Solo necesaria si creaste items privados que requieren autenticación.
                </p>
                {!!originalConnectionKey && (
                  <button
                    onClick={disconnectHub}
                    className="border-none text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {!!originalConnectionKey && (
          <UserItems connectionKey={originalConnectionKey} />
        )}
      </>
    );
  }

  // Modo Hub Remoto (CodingSoft oficial)
  return (
    <>
      <ContextualSaveBar
        showing={hasChanges}
        onSave={updateConnectionKey}
        onCancel={resetChanges}
      />
      <div className="w-full flex flex-col gap-y-1 pb-6">
        <div className="flex flex-col gap-y-2 mb-4">
          <p className="text-base font-semibold text-theme-text-primary">
            Your CodingSoft Community Hub Account
          </p>
          <p className="text-xs text-theme-text-secondary">
            Connecting your CodingSoft Community Hub account allows you to access your <b>private</b> CodingSoft Community Hub items as well as upload your own items to the CodingSoft Community Hub.
          </p>
        </div>
        
        {!connectionKey && (
          <div className="border border-theme-border my-2 flex flex-col md:flex-row md:items-center gap-x-2 text-theme-text-primary mb-4 bg-theme-settings-input-bg w-1/2 rounded-lg px-4 py-2">
            <div className="flex flex-col gap-y-2">
              <div className="gap-x-2 flex items-center">
                <Info size={25} />
                <h1 className="text-lg font-semibold">
                  Why connect my CodingSoft Community Hub account?
                </h1>
              </div>
              <p className="text-sm text-theme-text-secondary">
                Connecting your CodingSoft Community Hub account allows you
                to pull in your <b>private</b> items from the CodingSoft
                Community Hub as well as upload your own items to the
                CodingSoft Community Hub.
                <br />
                <br />
                <i>
                  You do not need to connect your CodingSoft Community Hub
                  account to pull in public items from the CodingSoft
                  Community Hub.
                </i>
              </p>
            </div>
          </div>
        )}

        {/* API Key Section */}
        <div className="mt-6 mb-8">
          <div className="flex flex-col w-full max-w-[400px]">
            <label className="text-theme-text-primary text-sm font-semibold block mb-2">
              CodingSoft Hub API Key
            </label>
            <input
              type="password"
              value={connectionKey || ""}
              onChange={onConnectionKeyChange}
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Enter your CodingSoft Hub API key"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-theme-text-secondary text-xs">
                You can get your API key from your{" "}
                <a
                  href={paths.communityHub.profile()}
                  className="underline text-primary-button"
                >
                  CodingSoft Community Hub profile page
                </a>
                .
              </p>
              {!!originalConnectionKey && (
                <button
                  onClick={disconnectHub}
                  className="border-none text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {!!originalConnectionKey && (
        <UserItems connectionKey={originalConnectionKey} />
      )}
    </>
  );
}
