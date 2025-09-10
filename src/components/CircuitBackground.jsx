import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CircuitBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredLine, setHoveredLine] = useState(null);
  const [pulsingNodes, setPulsingNodes] = useState(new Set());
  const linesRef = useRef([]);
  const containerRef = useRef(null);

  // Initialize circuit lines
  useEffect(() => {
    const generateLines = () => {
      const lines = [];
      const numLines = 12;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      for (let i = 0; i < numLines; i++) {
        // Create more structured lines that follow geometric patterns
        const startX = (width / numLines) * i + Math.random() * 100;
        const startY = Math.random() * height;
        const endX = startX + 200 + Math.random() * 300;
        const endY = startY + (Math.random() - 0.5) * 200;
        
        // Add some vertical and horizontal lines for circuit-like appearance
        const isVertical = Math.random() > 0.7;
        const isHorizontal = Math.random() > 0.7;
        
        let finalEndX = endX;
        let finalEndY = endY;
        
        if (isVertical) {
          finalEndX = startX;
          finalEndY = startY + (Math.random() > 0.5 ? 200 : -200);
        } else if (isHorizontal) {
          finalEndX = startX + (Math.random() > 0.5 ? 300 : -300);
          finalEndY = startY;
        }
        
        lines.push({
          id: i,
          x1: startX,
          y1: startY,
          x2: finalEndX,
          y2: finalEndY,
          nodes: [
            { x: startX, y: startY, radius: 3 + Math.random() * 2 },
            { x: (startX + finalEndX) / 2, y: (startY + finalEndY) / 2, radius: 4 + Math.random() * 2 },
            { x: finalEndX, y: finalEndY, radius: 3 + Math.random() * 2 }
          ],
          glowIntensity: 0.2 + Math.random() * 0.3,
          pulseSpeed: 3000 + Math.random() * 4000,
          isActive: false
        });
      }
      
      linesRef.current = lines;
    };
    
    generateLines();
    window.addEventListener('resize', generateLines);
    return () => window.removeEventListener('resize', generateLines);
  }, []);

  // Mouse tracking and line interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check line proximity
      let closestLine = null;
      let minDistance = 80; // Increased detection radius
      
      linesRef.current.forEach(line => {
        const dist = distanceToLine(e.clientX, e.clientY, line);
        if (dist < minDistance) {
          minDistance = dist;
          closestLine = line.id;
        }
        
        // Check node proximity for pulsing effect
        line.nodes.forEach((node, idx) => {
          const nodeDist = Math.sqrt(
            Math.pow(e.clientX - node.x, 2) + Math.pow(e.clientY - node.y, 2)
          );
          if (nodeDist < 40) {
            const nodeKey = `${line.id}-${idx}`;
            if (!pulsingNodes.has(nodeKey)) {
              setPulsingNodes(prev => new Set([...prev, nodeKey]));
              
              // Triple pulse effect
              setTimeout(() => {
                setPulsingNodes(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(nodeKey);
                  return newSet;
                });
              }, 1500);
            }
          }
        });
      });
      
      setHoveredLine(closestLine);
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, [pulsingNodes]);

  // Distance calculation helper
  const distanceToLine = (px, py, line) => {
    const A = px - line.x1;
    const B = py - line.y1;
    const C = line.x2 - line.x1;
    const D = line.y2 - line.y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = line.x1;
      yy = line.y1;
    } else if (param > 1) {
      xx = line.x2;
      yy = line.y2;
    } else {
      xx = line.x1 + param * C;
      yy = line.y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Random pulsing animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (linesRef.current.length > 0) {
        const randomLine = linesRef.current[Math.floor(Math.random() * linesRef.current.length)];
        const randomNode = Math.floor(Math.random() * randomLine.nodes.length);
        const nodeKey = `${randomLine.id}-${randomNode}`;
        
        if (!pulsingNodes.has(nodeKey)) {
          setPulsingNodes(prev => new Set([...prev, nodeKey]));
          setTimeout(() => {
            setPulsingNodes(prev => {
              const newSet = new Set(prev);
              newSet.delete(nodeKey);
              return newSet;
            });
          }, 1000);
        }
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [pulsingNodes]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {linesRef.current.map((line) => (
          <g key={line.id}>
            {/* Main line */}
            <motion.line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={hoveredLine === line.id ? "#00E5FF" : "#1C3A52"}
              strokeWidth={hoveredLine === line.id ? "2" : "1"}
              opacity={hoveredLine === line.id ? 0.9 : line.glowIntensity}
              filter={hoveredLine === line.id ? "url(#glow)" : ""}
              animate={{
                opacity: hoveredLine === line.id 
                  ? [0.9, 1, 0.9] 
                  : [line.glowIntensity, line.glowIntensity + 0.2, line.glowIntensity],
              }}
              transition={{
                duration: line.pulseSpeed / 1000,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Circuit nodes */}
            {line.nodes.map((node, idx) => {
              const nodeKey = `${line.id}-${idx}`;
              const isPulsing = pulsingNodes.has(nodeKey);
              
              return (
                <motion.circle
                  key={idx}
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={isPulsing ? "#00E5FF" : hoveredLine === line.id ? "#00A5CC" : "#1C3A52"}
                  opacity={isPulsing ? 1 : hoveredLine === line.id ? 0.9 : 0.4}
                  filter={isPulsing ? "url(#strongGlow)" : hoveredLine === line.id ? "url(#glow)" : ""}
                  animate={isPulsing ? {
                    r: [node.radius, node.radius * 2.5, node.radius * 2, node.radius],
                    opacity: [1, 0.7, 0.9, 1]
                  } : {}}
                  transition={isPulsing ? {
                    duration: 0.4,
                    repeat: 2,
                    ease: "easeOut"
                  } : {}}
                />
              );
            })}
          </g>
        ))}
        
        {/* Additional decorative elements */}
        <motion.circle
          cx={mousePos.x}
          cy={mousePos.y}
          r="2"
          fill="#00E5FF"
          opacity="0.6"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
};

export default CircuitBackground;

