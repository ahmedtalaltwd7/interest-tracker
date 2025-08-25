<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  interface Interest {
    id: number;
    textbox1: string;
    textbox2: string;
    textbox3: number;
    textbox4: number;
    textbox5: string;
    created_at?: string;
  }

  let interests: Interest[] = [];
  let sumTextbox3 = 0;
  let sumTextbox4 = 0;
  let difference = 0;
  let editingId: number | null = null;
  let editData = {
    textbox1: '',
    textbox2: '',
    textbox3: 0,
    textbox4: 0,
    textbox5: ''
  };
  let loading = false;
  let errorMessage = '';

  // Load data on component mount
  onMount(() => {
    if (browser) {
      loadData();
    }
  });

  async function loadData() {
    loading = true;
    errorMessage = '';
    
    try {
      const response = await fetch('/api/interests');
      const result = await response.json();
      
      if (result.success) {
        interests = result.data.interests;
        sumTextbox3 = result.data.summary.sumTextbox3;
        sumTextbox4 = result.data.summary.sumTextbox4;
        difference = result.data.summary.difference;
      } else {
        errorMessage = result.error || 'Error loading data';
      }
    } catch (error) {
      console.error('Error loading data:', error);
      errorMessage = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function handleDelete(id: number) {
    if (!browser) return;
    
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/interests/${id}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Refresh data
          loadData();
        } else {
          alert(result.error || 'Error deleting entry');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Network error. Please try again.');
      }
    }
  }

  function startEdit(interest: Interest) {
    editingId = interest.id;
    editData = {
      textbox1: interest.textbox1,
      textbox2: interest.textbox2,
      textbox3: interest.textbox3,
      textbox4: interest.textbox4,
      textbox5: interest.textbox5
    };
  }

  function cancelEdit() {
    editingId = null;
  }

  async function saveEdit() {
    if (!browser || editingId === null) return;
    
    try {
      const response = await fetch(`/api/interests/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        editingId = null;
        // Refresh data
        loadData();
      } else {
        alert(result.error || 'Error saving changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Network error. Please try again.');
    }
  }

  function formatNumber(value: number): string {
    return value.toFixed(2);
  }
</script>

<div class="display-container">
  <h1>Interest Data</h1>
  
  {#if loading}
    <div class="loading">Loading data...</div>
  {:else if errorMessage}
    <div class="error-message">
      {errorMessage}
      <button on:click={loadData}>Retry</button>
    </div>
  {:else}
    <!-- Summary section -->
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-item">
        <span>Sum of Textbox 3:</span>
        <span class="value">{formatNumber(sumTextbox3)}</span>
      </div>
      <div class="summary-item">
        <span>Sum of Textbox 4:</span>
        <span class="value">{formatNumber(sumTextbox4)}</span>
      </div>
      <div class="summary-item">
        <span>Textbox 3 - Textbox 4:</span>
        <span class="value">{formatNumber(difference)}</span>
      </div>
    </div>

    <!-- Table section -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Textbox 1</th>
            <th>Textbox 2</th>
            <th>Textbox 3</th>
            <th>Textbox 4</th>
            <th>Textbox 5</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each interests as interest (interest.id)}
            {#if editingId === interest.id}
              <!-- Edit row -->
              <tr class="edit-row">
                <td><input type="text" bind:value={editData.textbox1} /></td>
                <td><input type="text" bind:value={editData.textbox2} /></td>
                <td><input type="number" bind:value={editData.textbox3} /></td>
                <td><input type="number" bind:value={editData.textbox4} /></td>
                <td><input type="text" bind:value={editData.textbox5} /></td>
                <td>
                  <button class="save-btn" on:click={saveEdit}>Save</button>
                  <button class="cancel-btn" on:click={cancelEdit}>Cancel</button>
                </td>
              </tr>
            {:else}
              <!-- Display row -->
              <tr>
                <td>{interest.textbox1}</td>
                <td>{interest.textbox2}</td>
                <td>{formatNumber(interest.textbox3)}</td>
                <td>{formatNumber(interest.textbox4)}</td>
                <td>{interest.textbox5}</td>
                <td>
                  <button class="edit-btn" on:click={() => startEdit(interest)}>Edit</button>
                  <button class="delete-btn" on:click={() => handleDelete(interest.id)}>Delete</button>
                </td>
              </tr>
            {/if}
          {:else}
            <tr>
              <td colspan="6">No data available</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <div class="actions">
    <button on:click={() => goto('/form')}>Add New Entry</button>
  </div>
</div>

<style>
  .display-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .loading, .error-message {
    text-align: center;
    padding: 2rem;
    margin: 1rem 0;
  }

  .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  .error-message button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .summary {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .summary h2 {
    margin-top: 0;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .summary-item .value {
    font-weight: bold;
  }

  .table-container {
    overflow-x: auto;
    margin-bottom: 2rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }

  th {
    background-color: #e9ecef;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f8f9fa;
  }

  .edit-row input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .edit-btn {
    background-color: #17a2b8;
    color: white;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
  }

  .save-btn {
    background-color: #28a745;
    color: white;
  }

  .cancel-btn {
    background-color: #6c757d;
    color: white;
  }

  .actions {
    text-align: center;
  }

  .actions button {
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  button:hover {
    opacity: 0.8;
  }
</style>