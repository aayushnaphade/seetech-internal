#!/usr/bin/env python3
import http.server
from http.server import BaseHTTPRequestHandler, HTTPServer

port = 8000
print("Running server on port %d" % port)

# Set the correct MIME type for WebAssembly files
http.server.SimpleHTTPRequestHandler.extensions_map['.wasm'] = 'application/wasm'
httpd = HTTPServer(('localhost', port), http.server.SimpleHTTPRequestHandler)

print("Mapping \".wasm\" to \"%s\"" % 
      http.server.SimpleHTTPRequestHandler.extensions_map['.wasm'])
print("Server started at http://localhost:%d" % port)
print("Press Ctrl+C to stop the server")
httpd.serve_forever()
