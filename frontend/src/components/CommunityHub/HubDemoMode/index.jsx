import { useEffect } from "react";
import { setHubDemoMode } from "@/hooks/useCommunityHubAuth";

export default function HubDemoMode({ enabled = true }) {
  useEffect(() => {
    setHubDemoMode(enabled);
    return () => setHubDemoMode(false);
  }, [enabled]);

  return null;
}
