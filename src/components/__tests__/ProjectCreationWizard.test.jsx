import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCreationWizard from '../ProjectCreationWizard';

// Mock the ImageEditor component
jest.mock('../ImageEditor', () => {
  return function MockImageEditor({ onImagesChange }) {
    return (
      <div data-testid="image-editor">
        <button 
          onClick={() => onImagesChange([{ name: 'test.jpg', preview: 'test.jpg' }])}
          data-testid="add-image"
        >
          Add Image
        </button>
      </div>
    );
  };
});

// Mock the ProjectPreviewModal component
jest.mock('../ProjectPreviewModal', () => {
  return function MockProjectPreviewModal({ isOpen, onClose }) {
    return isOpen ? (
      <div data-testid="project-preview-modal">
        <button onClick={onClose} data-testid="close-preview">Close Preview</button>
      </div>
    ) : null;
  };
});

describe('ProjectCreationWizard', () => {
  const mockOnClose = jest.fn();
  const mockOnProjectCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the wizard with step 1 initially', () => {
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should validate required fields and not proceed to next step if empty', async () => {
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Try to click Next without filling required fields
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    // Should still be on step 1
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('should allow proceeding to step 2 after filling required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'My Test Project');
    await user.type(screen.getByLabelText(/description/i), 'A test description.');

    // Click Next
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should now be on step 2
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  it('should allow proceeding to step 3 after step 2', async () => {
    const user = userEvent.setup();
    
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Fill out step 1
    await user.type(screen.getByLabelText(/title/i), 'My Test Project');
    await user.type(screen.getByLabelText(/description/i), 'A test description.');

    // Go to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });

    // Go to step 3
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    });
  });

  it('should show image editor on step 3', async () => {
    const user = userEvent.setup();
    
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Navigate to step 3
    await user.type(screen.getByLabelText(/title/i), 'My Test Project');
    await user.type(screen.getByLabelText(/description/i), 'A test description.');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByTestId('image-editor')).toBeInTheDocument();
    });
  });

  it('should show preview button when title, description, and images are present', async () => {
    const user = userEvent.setup();
    
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Navigate to step 3
    await user.type(screen.getByLabelText(/title/i), 'My Test Project');
    await user.type(screen.getByLabelText(/description/i), 'A test description.');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByTestId('image-editor')).toBeInTheDocument();
    });

    // Add an image
    fireEvent.click(screen.getByTestId('add-image'));

    // Preview button should be enabled
    const previewButton = screen.getByRole('button', { name: /preview project/i });
    expect(previewButton).not.toBeDisabled();
  });

  it('should open preview modal when preview button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    // Navigate to step 3 and add image
    await user.type(screen.getByLabelText(/title/i), 'My Test Project');
    await user.type(screen.getByLabelText(/description/i), 'A test description.');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByTestId('image-editor')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-image'));

    // Click preview button
    fireEvent.click(screen.getByRole('button', { name: /preview project/i }));

    // Preview modal should be open
    await waitFor(() => {
      expect(screen.getByTestId('project-preview-modal')).toBeInTheDocument();
    });
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close wizard/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ProjectCreationWizard 
        onClose={mockOnClose} 
        onProjectCreated={mockOnProjectCreated} 
      />
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'wizard-title');

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '1');
    expect(progressBar).toHaveAttribute('aria-valuemin', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '3');
  });
});

