import { useState } from "react";
import { X, Copy, Check } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function HubItemModal({ item, type, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeLabel = (type) => {
    const labels = {
      'system-prompt': 'System Prompt',
      'slash-command': 'Slash Command',
      'agent-skill': 'Agent Skill',
      'agent-flow': 'Agent Flow',
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-theme-bg-secondary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-theme-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-theme-text-primary">
              {item.name}
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-primary-button/20 text-primary-button">
              {getTypeLabel(item.itemType || type)}
            </span>
            {item.category && (
              <span className="text-xs px-2 py-1 rounded-full bg-theme-bg-primary text-theme-text-secondary">
                {item.category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-bg-primary rounded-lg transition-colors"
          >
            <X size={24} className="text-theme-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-theme-text-secondary mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-theme-text-primary leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Command (for slash commands) */}
          {item.command && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text-secondary mb-2 uppercase tracking-wide">
                Command
              </h3>
              <div className="flex items-center gap-2 bg-theme-bg-primary rounded-lg p-3">
                <code className="text-primary-button font-mono text-lg">
                  {item.command}
                </code>
                <button
                  onClick={() => handleCopy(item.command)}
                  className="ml-auto p-2 hover:bg-theme-bg-secondary rounded-lg transition-colors"
                  title="Copy command"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-theme-text-secondary" />}
                </button>
              </div>
            </div>
          )}

          {/* Prompt */}
          {item.prompt && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text-secondary mb-2 uppercase tracking-wide">
                Prompt
              </h3>
              <div className="relative">
                <pre className="bg-theme-bg-primary rounded-lg p-4 text-sm text-theme-text-primary font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                  {item.prompt}
                </pre>
                <button
                  onClick={() => handleCopy(item.prompt)}
                  className="absolute top-2 right-2 p-2 bg-theme-bg-secondary hover:bg-theme-bg-primary rounded-lg transition-colors shadow-md"
                  title="Copy prompt"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-theme-text-secondary" />}
                </button>
              </div>
            </div>
          )}

          {/* Config (if exists) */}
          {item.config && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text-secondary mb-2 uppercase tracking-wide">
                Configuration
              </h3>
              <pre className="bg-theme-bg-primary rounded-lg p-4 text-sm text-theme-text-primary font-mono whitespace-pre-wrap">
                {typeof item.config === 'string' ? item.config : JSON.stringify(item.config, null, 2)}
              </pre>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text-secondary mb-2 uppercase tracking-wide">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {(typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-theme-bg-primary text-theme-text-secondary border border-theme-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-theme-border">
            <div className="text-sm text-theme-text-secondary">
              By <span className="text-theme-text-primary font-medium">{item.author}</span>
              {item.ratingCount > 0 && (
                <span className="ml-4">
                  {item.rating > 0 ? '+' : ''}{item.rating} ({item.ratingCount} votes)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${item.visibility === 'private' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {item.visibility}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-theme-border bg-theme-bg-primary/50">
          <div className="text-xs text-theme-text-secondary">
            ID: <code className="text-theme-text-primary">{item.importId || item.id}</code>
          </div>
          <Link
            to={paths.communityHub.importItem(item.importId || `allm-community-id:${item.itemType || type}:${item.id}`)}
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-button hover:bg-primary-button/90 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            Import Item
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
