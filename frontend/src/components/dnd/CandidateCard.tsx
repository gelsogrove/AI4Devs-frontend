import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { Envelope, GripVertical, Telephone } from 'react-bootstrap-icons';
import DraggableItem from './DraggableItem';

interface Candidate {
  id: number;
  fullName?: string;
  name?: string;
  averageScore?: number;
  email?: string;
  phoneNumber?: string;
  [key: string]: any; // For other possible properties
}

interface CandidateCardProps {
  candidate: Candidate;
  className?: string;
}

/**
 * Draggable candidate card for Kanban board
 */
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, className = '' }) => {
  const displayName = candidate.fullName || candidate.name || 'Unknown';
  
  // Determine score color based on value
  const getScoreBadgeVariant = (score?: number) => {
    if (score === undefined || score === null) return 'secondary';
    if (score >= 4) return 'success';
    if (score >= 3) return 'info';
    if (score >= 2) return 'warning';
    return 'danger';
  };
  
  return (
    <DraggableItem id={candidate.id.toString()} className={className}>
      <Card className="shadow-sm h-100 candidate-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="text-truncate mb-0" title={displayName}>
              {displayName}
            </Card.Title>
            
            {candidate.averageScore !== undefined && (
              <Badge 
                bg={getScoreBadgeVariant(candidate.averageScore)}
                className="ms-2 rounded-pill"
                title="Average score"
              >
                {candidate.averageScore || 'N/A'}
              </Badge>
            )}
          </div>
          
          {candidate.email && (
            <Card.Text className="text-truncate small text-muted mb-1" title={candidate.email}>
              <Envelope className="me-1" size={16} />
              {candidate.email}
            </Card.Text>
          )}
          
          {candidate.phoneNumber && (
            <Card.Text className="small text-muted mb-1" title={candidate.phoneNumber}>
              <Telephone className="me-1" size={16} />
              {candidate.phoneNumber}
            </Card.Text>
          )}
          
          <Card.Text className="small text-end mt-2 text-muted">
            <GripVertical className="me-1" size={16} />
            Drag to move
          </Card.Text>
        </Card.Body>
      </Card>
    </DraggableItem>
  );
};

export default CandidateCard; 