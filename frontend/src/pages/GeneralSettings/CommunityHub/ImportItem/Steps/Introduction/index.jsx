import CommunityHubImportItemSteps from "..";
import CTAButton from "@/components/lib/CTAButton";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useState } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";

export default function Introduction({ settings, setSettings, setStep }) {
  const [itemId, setItemId] = useState(settings.itemId);
  
  const handleContinue = () => {
    if (!itemId) return showToast("Please enter an item ID", "error");
    setSettings((prev) => ({ ...prev, itemId }));
    setStep(CommunityHubImportItemSteps.itemId.next());
  };

  const handleBrowseHub = () => {
    window.open(paths.communityHub.website(), '_blank');
  };

  const handlePaste = async () => {
    try {
      const clipboard = await navigator.clipboard.readText();
      if (clipboard.startsWith('allm-community-id:')) {
        setItemId(clipboard);
        showToast("Import ID pasted from clipboard", "success");
      }
    } catch (e) {
      console.error("Failed to read clipboard:", e);
    }
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-2 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold">
            Import an item from the community hub
          </h2>
          <div className="flex flex-col gap-y-[25px] text-theme-text-secondary text-sm">
            <p>
              The community hub is a place where you can find, share, and import
              agent-skills, system prompts, slash commands, and more!
            </p>
            <p>
              These items are created by the CodingSoft team and community, and
              are a great way to get started with CodingSoft as well as extend
              CodingSoft in a way that is customized to your needs.
            </p>
            <p>
              There are both <b>private</b> and <b>public</b> items in the
              community hub. Private items are only visible to you, while public
              items are visible to everyone.
            </p>

            <div className="p-4 bg-yellow-800/30 light:bg-orange-100 light:text-orange-500 light:border-orange-500 rounded-lg border border-yellow-500 text-yellow-500">
              <p className="mb-3">
                <b>Recommended:</b> Browse the Community Hub to find and select items.
              </p>
              <button
                onClick={handleBrowseHub}
                className="flex items-center gap-2 text-yellow-100 light:text-orange-500 font-semibold hover:underline"
              >
                <ArrowSquareOut className="w-4 h-4" />
                Open Community Hub Browser →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 mt-4">
            <div className="w-full flex flex-col gap-y-4">
              <div className="flex flex-col w-full">
                <label className="text-theme-text-primary text-sm font-semibold block mb-3">
                  Community Hub Item Import ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    placeholder="allm-community-id:slash-command:1234567890"
                    className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  />
                  <button
                    onClick={handlePaste}
                    className="px-3 py-2 bg-theme-settings-input-bg border border-theme-settings-input-placeholder rounded-lg text-theme-text-secondary text-sm hover:text-theme-text-primary hover:border-primary-button transition-colors"
                    title="Paste from clipboard"
                  >
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            onClick={handleContinue}
          >
            Continue with import →
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
