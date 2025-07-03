import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: 'TB' }); // Top to Bottom layout

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Start Node' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges: Edge[] = [];

const DagCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = () => {
    const newNode: Node = {
      id: `${nodeId}`,
      data: { label: `Node ${nodeId}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodeId(nodeId + 1);
    setNodes((nds) => [...nds, newNode]);
  };

  const handleAutoLayout = () => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
  };

  const handleDelete = () => {
    if (nodes.length <= 1) {
      alert('Cannot delete Start Node!');
      return;
    }
    setNodes((nds) => nds.slice(0, -1)); // remove last node
    setEdges((eds) => eds.filter((edge) => edge.target !== `${nodeId - 1}`));
    setNodeId(nodeId - 1);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleAddNode} style={{ marginRight: 10 }}>
          Add Node
        </button>
        <button onClick={handleAutoLayout} style={{ marginRight: 10 }}>
          Auto Layout
        </button>
        <button onClick={handleDelete} style={{ marginRight: 10 }}>
          Delete Last Node
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DagCanvas;
