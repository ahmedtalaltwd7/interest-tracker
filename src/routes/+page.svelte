<script>
  import { goto } from '$app/navigation';
</script>

<div class="container">
  <h1>Interest Tracker Application</h1>
  
  <div class="welcome-message">
    <p>Welcome to the Interest Tracker application. This application allows you to:</p>
    <ul>
      <li>Submit data through a form with 5 textboxes</li>
      <li>View all submissions in a table format</li>
      <li>Edit existing entries</li>
      <li>Delete entries</li>
      <li>See calculated sums and differences</li>
    </ul>
  </div>

  <div class="navigation">
    <button on:click={() => goto('/form')} class="nav-button">
      Go to Form Page
    </button>
    <button on:click={() => goto('/display')} class="nav-button">
      Go to Display Page
    </button>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .welcome-message {
    text-align: left;
    margin: 2rem 0;
  }

  .welcome-message ul {
    text-align: left;
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .navigation {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }

  .nav-button {
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
  }

  .nav-button:hover {
    background-color: #0056b3;
  }
</style>
