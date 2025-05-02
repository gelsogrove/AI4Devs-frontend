import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

// Import our custom DnD components
import {
  CandidateCard,
  DroppableColumn,
  useDragSensors
} from './dnd';

// Import CSS file for custom styling
import './PositionKanban.css';

interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  applicationId: number;
  currentStage?: string;
  stageId?: number;
  name?: string;
}

interface InterviewStage {
  id: number;
  name: string;
}

interface Position {
  id: number;
  title: string;
  description: string;
}

interface ApiError {
  message: string;
  timestamp: number;
}

const PositionKanban: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [positionTitle, setPositionTitle] = useState('');
  const [interviewStages, setInterviewStages] = useState<InterviewStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  
  // API call in progress state
  const [updatingCandidate, setUpdatingCandidate] = useState(false);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  
  // Screen size tracking for responsive layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Use our custom hook for drag sensors
  const sensors = useDragSensors(5);

  // Track window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch interview flow (title and stages)
  useEffect(() => {
    const fetchInterviewFlow = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`http://localhost:3010/position/${id}/interviewFlow`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch interview flow: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Handle different possible data structures
        let flowData;
        
        // Double nested structure: data.interviewFlow.interviewFlow
        if (data.interviewFlow && data.interviewFlow.interviewFlow) {
          setPositionTitle(data.interviewFlow.positionName || '');
          flowData = data.interviewFlow.interviewFlow;
        } 
        // Single nested structure: data.interviewFlow
        else if (data.interviewFlow) {
          flowData = data.interviewFlow;
          setPositionTitle(flowData.description || '');
        } 
        // Direct structure: data is the interviewFlow
        else {
          flowData = data;
          setPositionTitle(flowData.description || '');
        }
        
        // Extract the interview stages
        const steps = flowData.interviewSteps || [];
        
        if (!Array.isArray(steps) || steps.length === 0) {
          throw new Error('No interview stages found for this position');
        }
        
        setInterviewStages(steps.map((step: any) => ({ 
          id: step.id, 
          name: step.name 
        })));
      } catch (err: any) {
        console.error('Error fetching interview flow:', err);
        setError(err.message || 'Unknown error occurred while fetching interview flow');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterviewFlow();
  }, [id]);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!id) return;
      
      setCandidatesLoading(true);
      setCandidatesError(null);
      
      try {
        const res = await fetch(`http://localhost:3010/position/${id}/candidates`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch candidates: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid candidates data format');
        }
        
        setCandidates(data);
      } catch (err: any) {
        console.error('Error fetching candidates:', err);
        setCandidatesError(err.message || 'Unknown error occurred while fetching candidates');
      } finally {
        setCandidatesLoading(false);
      }
    };
    
    fetchCandidates();
  }, [id]);

  // Group candidates by stage
  const candidatesByStage = React.useMemo(() => {
    return interviewStages.reduce((acc, stage) => {
      // Check all possible candidate stage properties
      const stageCandidate = candidates.filter(c => {
        return (
          c.currentInterviewStep === stage.name || 
          c.currentStage === stage.name || 
          c.stageId === stage.id
        );
      });
      
      acc[stage.name] = stageCandidate;
      return acc;
    }, {} as Record<string, Candidate[]>);
  }, [interviewStages, candidates]);

  // Handler for drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  // Handler for drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setTargetColumnId(over.id.toString());
    }
  };

  // Show a toast notification
  const showNotification = (message: string, variant: 'success' | 'danger' = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Handler for drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    // Find the candidate
    const candidateId = parseInt(active.id.toString());
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) {
      console.error('Candidate not found');
      return;
    }
    
    // Find the target stage
    const targetStage = interviewStages.find(s => s.name === targetColumnId);
    
    if (!targetStage) {
      console.error('Target stage not found');
      return;
    }
    
    // If candidate is already in this stage, don't do anything
    if (candidate.currentInterviewStep === targetStage.name) {
      return;
    }

    // Save original candidates state for rollback in case of API failure
    const originalCandidates = [...candidates];
    
    // Update candidate in local state (optimistic update)
    const updatedCandidates = candidates.map(c => {
      if (c.id === candidateId) {
        return { ...c, currentInterviewStep: targetStage.name };
      }
      return c;
    });
    
    setCandidates(updatedCandidates);
    
    // Prepare data for API update
    const updateData = {
      applicationId: candidate.applicationId,
      currentInterviewStep: targetStage.id
    };
    
    console.log('Updating candidate stage:', updateData);
    
    // Set updating state
    setUpdatingCandidate(true);

    try {
      const response = await fetch(`http://localhost:3010/candidates/${candidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update candidate stage: ${response.status}`);
      }

      // Success!
      const responseData = await response.json();
      console.log('Update successful:', responseData);
      
      // Show success notification
      showNotification(`Moved ${candidate.fullName || 'Candidate'} to ${targetStage.name}`, 'success');
    } catch (error: any) {
      console.error('Error updating candidate stage:', error);
      
      // Revert the change in UI
      setCandidates(originalCandidates);
      
      // Show error notification
      showNotification(`Failed to update: ${error.message}`, 'danger');
      
      // Add to API errors list
      setApiErrors(prev => [
        ...prev, 
        { 
          message: error.message || 'Failed to update candidate stage',
          timestamp: Date.now()
        }
      ].slice(-5)); // Keep only the last 5 errors
    } finally {
      setUpdatingCandidate(false);
    }
    
    // Reset target column
    setTargetColumnId(null);
  };

  // Handler for drag cancel
  const handleDragCancel = () => {
    setActiveId(null);
    setTargetColumnId(null);
  };

  // Check if data is ready to be displayed
  const isDataReady = !loading && !error && interviewStages.length > 0;
  const areCandidatesReady = !candidatesLoading && !candidatesError;

  // Get the active candidate for drag overlay
  const getActiveCandidate = () => {
    if (!activeId) return null;
    const candidateId = parseInt(activeId);
    return candidates.find(c => c.id === candidateId);
  };

  // Function to get candidate ID 
  const getCandidateId = (candidate: Candidate) => candidate.id.toString();

  // Render function for candidates
  const renderCandidate = (candidate: Candidate) => (
    <CandidateCard key={candidate.id} candidate={candidate} />
  );

  // Clean up API errors that are more than 1 minute old
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setApiErrors(prev => prev.filter(error => now - error.timestamp < 60000));
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="kanban-container py-4">
      {/* Toast notifications */}
      <ToastContainer position={isMobile ? "top-center" : "top-end"} className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide 
          bg={toastVariant}
          className="kanban-toast"
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? '' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3">
            ← Back
          </Button>
          <h2 className="mb-0 position-title">{positionTitle || 'Position Details'}</h2>
        </div>
      </div>
      
      {/* Display API errors if any */}
      {apiErrors.length > 0 && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>Failed API Requests</Alert.Heading>
          <ul className="mb-0">
            {apiErrors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      {loading && (
        <div className="text-center p-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading position details...</p>
        </div>
      )}
      
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Error Loading Position</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      
      {isDataReady && (
        <>
          {candidatesLoading && (
            <div className="text-center p-3">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Loading candidates...</span>
            </div>
          )}
          
          {candidatesError && (
            <Alert variant="warning">
              <p className="mb-0">{candidatesError}</p>
            </Alert>
          )}
          
          {areCandidatesReady && (
            interviewStages.length > 0 ? (
              <div className={`kanban-board ${updatingCandidate ? 'position-relative' : ''}`}>
                {updatingCandidate && (
                  <div 
                    className="position-absolute w-100 h-100 kanban-overlay" 
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.5)', 
                      zIndex: 10, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  {isMobile ? (
                    // Mobile layout - stacked columns at full width
                    <div className="kanban-columns-mobile">
                      {interviewStages.map(stage => (
                        <div key={stage.id} className="mb-4 kanban-column-mobile">
                          <DroppableColumn
                            id={stage.name}
                            title={stage.name}
                            items={candidatesByStage[stage.name] || []}
                            getItemId={getCandidateId}
                            renderItem={renderCandidate}
                            emptyStateMessage="Drop candidates here"
                            className="h-100"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Desktop layout - columns in a row
                    <Row className="g-4 kanban-columns">
                      {interviewStages.map(stage => (
                        <Col key={stage.id} xs={12} md={6} lg={4} xl={3} className="mb-3 kanban-column">
                          <DroppableColumn
                            id={stage.name}
                            title={stage.name}
                            items={candidatesByStage[stage.name] || []}
                            getItemId={getCandidateId}
                            renderItem={renderCandidate}
                            emptyStateMessage="Drop candidates here"
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                  
                  <DragOverlay>
                    {activeId && getActiveCandidate() && (
                      <Card className="shadow kanban-drag-overlay">
                        <Card.Body>
                          <Card.Title>{getActiveCandidate()?.fullName || 'Unknown'}</Card.Title>
                          <Card.Text>
                            <strong>Score:</strong> {getActiveCandidate()?.averageScore || 'N/A'}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </DragOverlay>
                </DndContext>
              </div>
            ) : (
              <Alert variant="info">
                <Alert.Heading>No Interview Stages</Alert.Heading>
                <p>This position doesn't have any interview stages defined yet.</p>
              </Alert>
            )
          )}
        </>
      )}
    </Container>
  );
};

export default PositionKanban; 