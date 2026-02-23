
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import { Artifact } from '../types';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    onClick: () => void;
}

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    const isStreaming = artifact.status === 'streaming';

    return (
        <div 
            className={`artifact-card ${isFocused ? 'focused' : ''} ${isStreaming ? 'generating' : ''}`}
            onClick={onClick}
        >
            <div className="artifact-card-inner" style={{ height: '100%', position: 'relative' }}>
                {isStreaming && (
                    <div className="generating-overlay" style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'rgba(0,0,0,0.8)', 
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '20px'
                    }}>
                        <pre ref={codeRef} style={{ 
                            color: '#10b981', 
                            fontSize: '11px', 
                            overflow: 'hidden',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}>
                            {artifact.html}
                        </pre>
                    </div>
                )}
                <iframe 
                    srcDoc={artifact.html} 
                    title={artifact.id} 
                    sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
            </div>
        </div>
    );
});

export default ArtifactCard;
