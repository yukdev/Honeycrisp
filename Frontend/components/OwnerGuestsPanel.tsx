import React from 'react';

import { Guest } from '@/lib/types';

interface OwnerGuestsPanelProps {
  guests: Guest[];
}

const OwnerGuestsPanel = ({ guests }: OwnerGuestsPanelProps) => {
  return <div className="flex justify-center my-2">OwnerGuestsPanel</div>;
};

export default OwnerGuestsPanel;
