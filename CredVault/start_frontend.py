# Simple HTTP server to serve the CredVault frontend
# Run this script to start the frontend on localhost:3000

import http.server
import socketserver
import os
import webbrowser
import threading
import time

def start_server():
    PORT = 3000
    DIRECTORY = os.path.dirname(os.path.abspath(__file__))
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    # Change to the CredVault directory
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("CredVault frontend is now available at the above URL")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()

if __name__ == "__main__":
    # Start the server in a separate thread so we can open the browser
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait a moment for the server to start
    time.sleep(1)
    
    # Open the browser
    webbrowser.open("http://localhost:3000")
    
    try:
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down server...")
        exit(0)