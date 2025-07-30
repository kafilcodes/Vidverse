'use client';

import React from 'react';
import useElementSelection from '../hooks/useElementSelection';

const ElementSelector = () => {
  // The hook handles all the logic, we just need to call it
  useElementSelection();

  // This component doesn't render anything visible
  // All the visual feedback is handled by the hook
  return null;
};

export default ElementSelector;
