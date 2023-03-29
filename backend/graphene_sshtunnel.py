import graphene
from sshtunnel import SSHTunnelForwarder

# Set up the SSH tunnel
server = SSHTunnelForwarder(
    "remote_server.com",
    ssh_username="user",
    ssh_password="pass",
    remote_bind_address=("localhost", 8080)
)

# Start the tunnel
server.start()

# Get the local port number
local_port = server.local_bind_port

# Create a Graphene client
schema = graphene.Schema(query=Query)
client = Client(schema=schema, middlewares=[HttpMiddleware()])

# Execute a GraphQL query
result = client.execute(
    """
    {
        someQuery {
            someField
        }
    }
    """,
    url=f"http://localhost:{local_port}/graphql"
)

# Print the result
print(result)

# Stop the tunnel
server.stop()