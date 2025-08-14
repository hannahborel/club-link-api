export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Club Link API</h1>
      <p>API is running successfully!</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li>
          <strong>GET /api/test-db</strong> - Get all users
        </li>
        <li>
          <strong>POST /api/test-db</strong> - Create a new user
        </li>
        <li>
          <strong>PUT /api/test-db?id=:id</strong> - Update a user
        </li>
        <li>
          <strong>DELETE /api/test-db?id=:id</strong> - Delete a user
        </li>
      </ul>
      <h2>Database Management:</h2>
      <ul>
        <li>
          <code>npm run db:seed</code> - Populate database with test data
        </li>
        <li>
          <code>npm run db:reset</code> - Clear all data from database
        </li>
        <li>
          <code>npm run db:smoke</code> - Test database connection
        </li>
        <li>
          <code>npm run test:api</code> - Test API CRUD operations
        </li>
      </ul>

      <h2>Test the API:</h2>
      <p>Use the endpoints above to test basic CRUD operations on the users table.</p>
      <p>
        <strong>Note:</strong> Run <code>npm run db:seed</code> first to populate the database with
        test data.
      </p>
    </div>
  );
}
