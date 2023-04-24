'use client';
import { useState } from 'react';

interface ShareModalProps {
  link: string;
}

const ShareModal = ({ link }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <input type="checkbox" id="share-session" className="modal-toggle" />
      <label htmlFor="share-session" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="font-bold text-lg text-center mb-2">
            Share the link with the attendees!
          </h3>
          <div className="flex items-center justify-center">
            <input
              type="text"
              className="input input-bordered input-accent w-full max-w-xs"
              value={link}
              readOnly
            />
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={handleCopyLink}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </label>
      </label>
    </div>
  );
};

export default ShareModal;
