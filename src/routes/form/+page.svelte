<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let textbox1 = '';
  let textbox2 = '';
  let textbox3 = 0;
  let textbox4 = 0;
  let textbox5 = '';
  let errorMessage = '';
  let isSubmitting = false;

  const handleSubmit = async () => {
    if (!browser) return; // Don't run on server
    
    errorMessage = '';
    isSubmitting = true;
    
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          textbox1,
          textbox2,
          textbox3: Number(textbox3),
          textbox4: Number(textbox4),
          textbox5
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        textbox1 = '';
        textbox2 = '';
        textbox3 = 0;
        textbox4 = 0;
        textbox5 = '';
        
        // Redirect to the display page
        goto('/display');
      } else {
        errorMessage = result.error || 'Error saving interest. Please try again.';
      }
    } catch (error) {
      console.error('Error saving interest:', error);
      errorMessage = 'Network error. Please try again.';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="form-container">
  <h1>Interest Form</h1>
  
  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="textbox1">Textbox 1:</label>
      <input
        id="textbox1"
        type="text"
        bind:value={textbox1}
        required
      />
    </div>

    <div class="form-group">
      <label for="textbox2">Textbox 2:</label>
      <input
        id="textbox2"
        type="text"
        bind:value={textbox2}
        required
      />
    </div>

    <div class="form-group">
      <label for="textbox3">Textbox 3 (Number):</label>
      <input
        id="textbox3"
        type="number"
        bind:value={textbox3}
        required
      />
    </div>

    <div class="form-group">
      <label for="textbox4">Textbox 4 (Number):</label>
      <input
        id="textbox4"
        type="number"
        bind:value={textbox4}
        required
      />
    </div>

    <div class="form-group">
      <label for="textbox5">Textbox 5:</label>
      <input
        id="textbox5"
        type="text"
        bind:value={textbox5}
        required
      />
    </div>

    <div class="form-actions">
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      <button type="button" on:click={() => goto('/display')}>View Data</button>
    </div>
  </form>
</div>

<style>
  .form-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  input:disabled {
    background-color: #e9ecef;
  }

  .form-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
</style>