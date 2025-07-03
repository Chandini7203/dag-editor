// src/components/Toolbar.tsx
import React from 'react';

interface ToolbarProps {
  onAddNode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode }) => {
  return (
    <div style={{ padding: '10px', background: '#eee' }}>
      <button onClick={onAddNode}>Add Node</button>
    </div>
  );
};

export default Toolbar;
