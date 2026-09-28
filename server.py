#!/usr/bin/env python3
"""
WeatherBlend AI - Local Development Server
Lightweight HTTP server with proper MIME types, CORS, and clean static file serving.
Usage: python server.py [port]
"""

import http.server
import socketserver
import sys
import webbrowser
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class WeatherServerHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), WeatherServerHandler) as httpd:
        print("=" * 65)
        print(f" WeatherBlend AI Server Running at: http://localhost:{PORT}")
        print(" Hybrid AI-NWP Meteorological Forecast Blending System")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
