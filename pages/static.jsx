export default function Static() {
  return (
    <div>
      <h1>Static Test Page</h1>
      <p>This page shows static content without any API calls.</p>
      <div>
        <h2>Sample Prompts:</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>Email Rewrite — Professional</h3>
          <p>Category: Mail</p>
          <p>Rewrite an email politely and concisely.</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>Code Review Assistant</h3>
          <p>Category: Code</p>
          <p>Get comprehensive code review feedback with suggestions for improvement.</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>Data Analysis Summary</h3>
          <p>Category: Data</p>
          <p>Generate comprehensive data analysis summaries with key insights.</p>
        </div>
      </div>
    </div>
  )
}
